FROM node:8

RUN mkdir -p /usr/src/app
WORKDIR /usr/
ENV PATH "$PATH:/usr/node_modules/.bin/"

COPY npm-shrinkwrap.json .
RUN npm install && npm cache clean --force

COPY . .

RUN ng build --prod
