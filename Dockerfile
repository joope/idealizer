FROM node:10

WORKDIR /app

COPY ./empty-example ./

RUN npm install

EXPOSE 8080
CMD [ "node", "main.js" ]