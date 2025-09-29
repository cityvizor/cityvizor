FROM node:22 AS build
WORKDIR /user/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM build AS dev
RUN npm install -g @angular/cli@18.2.21

EXPOSE 4200
CMD ./entrypoint.sh

FROM nginx:1.29.1-alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/*
COPY ./nginx /etc/nginx/conf.d/
COPY --from=build /user/src/app/dist ./
COPY ./entrypoint.sh .
