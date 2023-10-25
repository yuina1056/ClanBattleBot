FROM node:18.18.0

WORKDIR /app
COPY ./package.json /app

RUN npm install && npm install nodemon -g
