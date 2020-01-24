FROM node:12 as build

WORKDIR /user/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build



FROM nginx:1.17.8-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /user/src/app/dist ./