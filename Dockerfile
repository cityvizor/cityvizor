FROM node:12

WORKDIR /user/src/app/

COPY --chown=node:node . .

USER node

RUN npm install

RUN npm run build

ENV NODE_ENV="production"

CMD ["npm", "start"]
