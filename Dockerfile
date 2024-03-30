FROM node:12-alpine

WORKDIR /app

RUN apk add postgresql
RUN apk add bash

COPY . /app
RUN npm install

ENTRYPOINT ["sh", "-c", "./scripts/db-setup && npm start"]
