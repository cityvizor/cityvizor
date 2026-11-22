FROM node:26-trixie AS install

WORKDIR /user/src/app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM install AS dev
CMD ["npm", "run", "serve"]

FROM install AS build
RUN npm run build

FROM nginx:1.30.7-alpine AS prod
WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*

COPY ./nginx /etc/nginx/conf.d/

COPY --from=build /user/src/app/node_modules /user/src/app/node_modules
COPY --from=build /user/src/app/dist ./
