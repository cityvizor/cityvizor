FROM node:12 as dev
WORKDIR /user/src/app

# Install server dependencies
COPY package.json package-lock.json ./
RUN npm install

FROM dev as prod
# Copy server source code and build it
COPY . .
RUN npm run build

CMD ["npm","start"]
