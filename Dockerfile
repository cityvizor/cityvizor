FROM node:12

WORKDIR /user/src/app

## Install and build steps separated and orderer by assumed change frequency to leverage Docker build caching

# Install server dependencies
COPY --chown=node server/package.json server/package-lock.json server/
RUN cd server && npm ci

# Install client dependencies
COPY --chown=node client/package.json client/package-lock.json client/
RUN cd client && npm ci

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
