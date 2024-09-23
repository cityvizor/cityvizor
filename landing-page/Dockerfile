FROM node:18 AS install

WORKDIR /user/src/app

COPY package.json .
RUN yarn install --all
COPY . .

FROM install AS dev
CMD yarn serve

FROM install AS build
RUN yarn build

FROM nginx:1.17.8-alpine AS prod
WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*

COPY ./nginx /etc/nginx/conf.d/

COPY --from=build /user/src/app/node_modules /user/src/app/node_modules
COPY --from=build /user/src/app/dist ./
