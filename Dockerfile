FROM node:12

WORKDIR /user/src/app/

USER node

# Install client dependencies (make separate layer from source code changes)
COPY --chown=node client/package.json client/package.json
RUN cd client && npm install

# Install server dependencies (make separate layer from source code changes)
COPY --chown=node server/package.json server/package.json
RUN cd server && npm install

# Copy source code and build it
COPY --chown=node:node . .
RUN npm run build

ENV NODE_ENV="production"

CMD ["npm", "start"]
