var settings = {

  INPUT_FILE: IS_BROWSER ? './data/samples.csv' : './data/full-game',

  ITERATIONS: 2000, // set to 600 to slow down
  MINX:  0,
  MAXX:  52483,
  MINY: -33960,
  MAXY:  33965,
  WIDTH: 33965 + 33960,
  HEIGHT: 52483 - 0,

  // @todo: Check coords on website!
  GOAL_XMIN: 20494,
  GOAL_XMAX: 31994,
  GOAL_Y: 33965,
  GOAL_Z: 4440,
  BALL_SIZE: 1000,

  GRAVITY: 9.81 * 1e3,

  TYPES: {
    BALL: "BALL",
    TEAM1: "TEAM1",
    TEAM2: "TEAM2",
    NEUTRAL: "NEUTRAL"
  },

  TIMES: {
    FIRST: { START: 10753295594424116, END: 12557295594424116 },
    SECOND: { START: 13086639146403495, END: 14879639146403495 }
  },

  MAPPING: {
    BALL: [4,8,10,12],
    TEAM1: [13,14,97,98,47,16,49,88,19,52,53,54,23,24,57,58,59,28],
    TEAM2: [61,62,99,100,63,64,65,66,67,68,69,38,71,40,73,74,75,44],
    NEUTRAL: [105,106]
  },

  COLORS: {
    BALL: "#FFF",
    TEAM1: "#F00",
    TEAM2: "#00F",
    NEUTRAL: "#F0F"
  },

  PLAYERS: {
    "Nick Gertje": [13, 14, 97, 98],
    "Dennis Dotterweich": [47, 16],
    "Niklas Waelzlein": [49, 88],
    "Wili Sommer": [19, 52],
    "Philipp Harlass": [53, 54],
    "Roman Hartleb": [23, 24],
    "Erik Engelhardt": [57, 58],
    "Sandro Schneider": [59, 28],
    "Leon Krapf": [61, 62, 99, 100],
    "Kevin Baer": [63, 64],
    "Luca Ziegler": [65, 66],
    "Ben Mueller": [67, 68],
    "Vale Reitstetter": [69, 38],
    "Christopher Lee": [71, 40],
    "Leon Heinze": [73, 74],
    "Leo Langhans": [75, 44]
  },

  SPEED: {
    "0":  "standing",
    "1":  "trot",
    "11": "low",
    "14": "medium",
    "17": "high",
    "24": "sprint"
  },

  SPEED_COLOR: {
    "0":  "green",
    "1":  "blue",
    "11": "purple",
    "14": "red",
    "17": "orange",
    "24": "yellow"
  },

  HEATMAPS: [
    { x: 8,  y: 13 },
    { x: 16, y: 25 },
    { x: 32, y: 50 },
    { x: 64, y: 100 }
  ],

  TIME_WINDOWS: [
    1, // 1 minute
    5, // 5 minutes
    20, // 20 minutes
    999 // full game
  ]
};

for (var all in settings){
  GLOBAL[all] = settings[all];
}