FROM node:12 as install

WORKDIR /user/src/app

COPY package.json .
RUN yarn install --all
COPY . .

ARG VUE_APP_API_BASE_URL='/api/v2/service/citysearch'
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL
ARG VUE_APP_API_PUBLIC_BASE_URL='/api/public/'
ENV VUE_APP_API_PUBLIC_BASE_URL=$VUE_APP_API_PUBLIC_BASE_URL

FROM install as dev
CMD yarn serve

FROM install as build
RUN yarn build

FROM nginx:1.17.8-alpine as prod
WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*

COPY ./nginx /etc/nginx/conf.d/

COPY --from=build /user/src/app/node_modules /user/src/app/node_modules
COPY --from=build /user/src/app/dist ./
