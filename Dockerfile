FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY . .

RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app

RUN apk update && \
  apk add curl bash

EXPOSE 80

CMD [ "yarn", "start" ]
