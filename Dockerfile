FROM node:12

WORKDIR /user/src/app

USER node

## Install and build steps separated and orderer by assumed change frequency to leverage Docker build caching

# Install server dependencies
COPY --chown=node server/package.json server/package.json
RUN cd server && npm install

# Install client dependencies
COPY --chown=node client/package.json client/package.json
RUN cd client && npm install

# Copy main package definition file
COPY --chown=node:node package.json package.json

# Copy server source code and build it
COPY --chown=node:node ./server ./server
RUN cd server && npm run build

# Copy client source code and build it
COPY --chown=node:node ./client ./client
RUN cd client && npm run build

ENV NODE_ENV="production"

CMD ["npm", "start"]
