FROM node:10.16

WORKDIR /home/node/app

RUN chown node .

COPY --chown=node . .

USER node

RUN npm install 

RUN npm run build

ENV NODE_ENV="production"

CMD ["npm", "start"]