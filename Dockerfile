FROM node:10.16

WORKDIR /home/node/app

COPY . .

RUN chown -R node:node .

USER node
RUN npm install

RUN npm run build

ENV NODE_ENV="production"

CMD ["npm", "start"]
