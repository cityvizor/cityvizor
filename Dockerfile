FROM node:10.16

WORKDIR /home/node/app

USER node

COPY . .

RUN npm install

ENV NODE_ENV="production"

CMD ["npm", "start"]
