FROM node:20 AS dev
USER root
WORKDIR /home/node/app
ENTRYPOINT [ "./entrypoint.sh" ]

ENV npm_config_userconfig=
ENV npm_config_cache=
ENV npm_config_init_module=
ENV HOME=/home/node/app
# Prepare mountpoints with correct user
RUN mkdir -p /home/node/data
RUN chown -R node:node /home/node/
# Rest of the application is set up under node user in /home/node

FROM dev AS prod

USER node
# Copy server source code and build it
COPY --chown=node:node . .
COPY ./entrypoint.sh /home/node/app/entrypoint.sh
RUN npm install
RUN npm run build
