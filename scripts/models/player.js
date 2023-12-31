GLOBAL.Player = Klass({

  init: function(name){
    this.sensors = [];
    this.possessionTime = 0;
    this.possessions = [];
    this.hitCount = 0;
    this.active = false;
    this.name = name;

    this.counter = 0;

    var isTeam1 = MAPPING.TEAM1.indexOf(PLAYERS[name][0]) > -1;
    this.team = isTeam1 ? TYPES.TEAM1 : TYPES.TEAM2;

    this.running = new Running(this);

    this.initHeatmaps();

    this.initBrowser();
    this.position = { x: 0, y: 0, z: 0 };
  },

  initHeatmaps: function(){
    var resolution;

    this.heatmaps = [];

    for (var all in HEATMAPS){
      resolution = HEATMAPS[all];
      this.heatmaps.push(
        new Heatmap(this, resolution.x, resolution.y)
      );
    }
  },

  initBrowser: function(){

    if (!IS_BROWSER) { return; }

    this.$li = document.createElement("li");
    $(this.team).appendChild(this.$li);

    this.$name = this.addSpan("name");
    this.$time = this.addSpan("time");
    this.$hits = this.addSpan("hits");

    this.$name.innerText = this.name.split(" ")[1];
    this.$time.innerText = "000";

    this.$canvas = document.createElement("canvas");
    this.$canvas.width = 100;
    this.$canvas.height = 20;

    this.context = this.$canvas.getContext('2d');

    this.$speed = this.addSpan("speed");
    this.$li.appendChild(this.$canvas);
  },

  addSpan: function(klass){
    var $span = document.createElement("span");
    $span.className = klass;
    this.$li.appendChild($span);
    return $span;
  },

  addSensor: function(leg){
    this.sensors.push(leg);
  },

  render: function(time){
    this.calculatePosession(time);
    this.calcualteSpeed(time);

    this.heatmaps.forEach(function(heatmap){
      heatmap.render(time);
    });
  },

  calcualteSpeed: function(time){

    var diff,
      x = 0,
      y = 0,
      position,
      distance,
      speed,
      type,
      color;

    this.sensors.forEach(function(sensor){
      x += sensor.position.x;
      y += sensor.position.y;
    });

    x /= this.sensors.length;
    y /= this.sensors.length;

    position = { x: x, y: y, z: 0 };

    // distance should be computed
    distance = computeDistance(position, this.position);
    //position is updated
    this.position = position;

    if (!this.timeStamp){
      this.timeStamp = time;
      return;
    }

    // speed , distance and type should be computed
    diff = time - this.timeStamp;
    speed = computeSpeed(distance, diff);
    switch (true) {
      case speed < 1:
        type = 0;
        break;
      case speed >= 1 && speed < 11:
        type = 1;
        break;
      case speed >= 11 && speed < 14:
        type = 11;
        break;
      case speed >= 14 && speed < 17:
        type = 14;
        break;
      case speed >= 17 && speed < 24:
        type = 17;
        break;
      default:
        type = 24;
        break;
    }
    // type is a string representing the running intensities, i.e. "standing", "trot", "low speed run"...
    this.running.update(time, type, distance);

    if (IS_BROWSER){
      this.renderSpeedInBrowser(speed, type);
    } else {

      write("running", [
        this.timeStamp,
        time,
        this.name,
        type,
        ~~distance,
        ~~speed
      ]);
    }

    this.timeStamp = time;
    this.speed = (speed + this.speed||0) / 2;
  },

  renderSpeedInBrowser: function(speed, type){

    if (!this.startTime){
      this.startTime = GAME.time;
      return;
    }

    var color = SPEED_COLOR[type],
      x = 100 - 100 * (TIMES.SECOND.END - GAME.time) / (TIMES.SECOND.END - this.startTime);

    this.context.beginPath();
    this.context.moveTo(x+1, 20-this.speed);

    this.context.strokeStyle = color;

    this.$speed.style.color = color;

    this.context.lineTo(this.lastX || -1, 20-this.speed);
    this.context.stroke();

    this.lastX = x;

    this.$speed.innerText = Math.round(this.speed) + "km/h";
  },


  possessionTimeframe: function(timeframe){
    var total = 0,
      min = GAME.time - timeframe,
      possession,
      diff,
      start,
      end,
      i;

    // Calculate possession time for each team
    for (i = 0; i < this.possessions.length; i++){
      possession = this.possessions[i];
      start = possession.start;
      end = possession.end || GAME.time;

      if (start > min){
        diff = end - start;
        total += diff;
      }
    }

    return total;
  },

  calculatePosession: function(time){

    if (this.active){
      this.possessionTime += time - this.time;
      this.time = time;
    }

    if (IS_BROWSER){
      this.renderPosessionInBrowser();
    } else {
      this.renderPosessionInNode(time);
    }
  },

  renderPosessionInBrowser: function(){

    this.$time.innerText = Math.round(this.possessionTime / 1e12) + "s";
    this.$hits.innerText = this.hitCount + "x";

    this.$li.className = this.active ? "active" : "";
  },

  renderPosessionInNode: function(time){
    write("player_ball_possession", [
      time,
      this.name,
      this.possessionTime,
      this.hitCount
    ]);
  },

  select: function(active, time){

    if (active){

      if (!this.active){
        this.possession = { start: time };
        this.possessions.push(this.possession);

        this.time = time;
        this.hitCount++;
      }

    } else {
      this.possession.end = time;
      this.possessionTime += time - this.time;
    }

    this.active = active;

  }
});