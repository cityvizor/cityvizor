FROM strapi/base as install

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
RUN yarn add pg

FROM strapi/base
COPY --from=install /node_modules /node_modules

COPY . .

ENV NODE_ENV production

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
