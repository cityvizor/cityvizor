FROM node:12 as build

WORKDIR /user/src/app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build



FROM nginx:1.17.8-alpine

WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*

COPY ./nginx /etc/nginx/conf.d/

COPY --from=build /user/src/app/dist ./
