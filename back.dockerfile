FROM node:lts-alpine

WORKDIR /app
COPY ./back .
RUN npm ci

EXPOSE 8081
CMD [ "node", "index.js" ]
