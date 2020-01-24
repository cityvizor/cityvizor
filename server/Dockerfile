FROM node:12

WORKDIR /user/src/app

# Install server dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy server source code and build it
COPY . .
RUN npm run build

CMD ["npm","start"]
