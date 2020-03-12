FROM strapi/base

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
RUN yarn add pg

COPY . .

RUN yarn build

EXPOSE 1337

ENV NODE_ENV production

CMD ["yarn", "start"]
