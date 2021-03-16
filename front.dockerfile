FROM node:lts-alpine as build

RUN apk add --no-cache python make g++

WORKDIR /app
COPY ./front .
RUN npm ci
RUN npx vue-cli-service build

FROM nginx:alpine

COPY --from=build /app/dist /app
COPY ./.docker/default.conf /etc/nginx/conf.d/default.conf
