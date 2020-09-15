FROM node:12 as install
WORKDIR /user/src/app

# Force recreation when package.json changes
COPY ./package.json ./package.json
RUN yarn install
COPY . .
ARG VUE_APP_API_BASE_URL='/api/v2/service/citysearch'
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL

FROM install as dev
ARG VUE_APP_CONTENT_API_BASE_URL='localhost:1337'
ENV VUE_APP_CONTENT_API_BASE_URL=$VUE_APP_CONTENT_API_BASE_URL
WORKDIR /user/src/app
CMD yarn run serve

FROM install as build
ARG VUE_APP_CONTENT_API_BASE_URL='.'
ENV VUE_APP_CONTENT_API_BASE_URL=$VUE_APP_CONTENT_API_BASE_URL
WORKDIR /user/src/app
RUN yarn build

FROM nginx:1.17.8-alpine as prod
WORKDIR /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/*
COPY ./nginx /etc/nginx/conf.d/
COPY --from=build /user/src/app/dist ./
