FROM node:lts-alpine3.16
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD [ "node", "index.js" ]
