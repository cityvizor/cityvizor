FROM node:16 AS build
WORKDIR /user/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM build AS dev
RUN npm install -g @angular/cli@14.2.12

EXPOSE 4200
CMD ./entrypoint.sh

FROM nginx:1.17.8-alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/*
COPY ./nginx /etc/nginx/conf.d/
COPY --from=build /user/src/app/dist ./
COPY ./entrypoint.sh .
