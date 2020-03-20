FROM node:12 as install

WORKDIR /user/src/app

COPY package.json ./
RUN yarn install

FROM node:12 as build

WORKDIR /user/src/app

COPY --from=install /user/src/app/node_modules /user/src/app/node_modules
COPY . .

ARG VUE_APP_API_BASE_URL='https://cityvizor-api.cesko.digital/citysearch'
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL

ARG VUE_APP_CONTENT_API_BASE_URL='https://cityvizor-api.cesko.digital'
ENV VUE_APP_CONTENT_API_BASE_URL=$VUE_APP_CONTENT_API_BASE_URL

RUN yarn build

FROM nginx:1.17.8-alpine
WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*

COPY ./nginx /etc/nginx/conf.d/

COPY --from=build /user/src/app/dist ./
