FROM node:4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH "$PATH:/usr/src/app/node_modules/.bin/"

COPY package.json .
RUN npm install && npm cache clean --force

COPY . /usr/src/app
