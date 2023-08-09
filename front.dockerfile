FROM node:16-alpine as build

ARG VUE_APP_BACK_HOST
ENV VUE_APP_BACK_HOST=$VUE_APP_BACK_HOST

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY ./front .
RUN npm ci
RUN npx vue-cli-service build

FROM nginx:alpine

COPY --from=build /app/dist /app
COPY ./.docker/default.conf /etc/nginx/conf.d/default.conf
