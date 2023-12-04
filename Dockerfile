# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR ./app
COPY . .
RUN yarn install --production
RUN echo 'we are running some # of cool things'
RUN pwd
CMD ["node", "browser.js"]
EXPOSE 9000