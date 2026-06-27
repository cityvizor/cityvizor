FROM node:14 AS build
WORKDIR /user/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM build AS dev
RUN npm install -g @angular/cli

# Expose the webpack port for automatic hot reloading.
# https://stackoverflow.com/a/44196594/5127149
EXPOSE 49153
CMD ./entrypoint.sh


FROM nginx:1.17.8-alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/*
COPY ./nginx /etc/nginx/conf.d/
COPY --from=build /user/src/app/dist ./
