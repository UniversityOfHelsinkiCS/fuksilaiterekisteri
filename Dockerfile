FROM registry.access.redhat.com/ubi8/nodejs-10

ENV TZ="Europe/Helsinki"

WORKDIR /opt/app-root/src

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG SENTRY_IDENTIFIER
ENV SENTRY_IDENTIFIER=$SENTRY_IDENTIFIER

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

ARG GITHUB_SHA
ENV GITHUB_SHA=$GITHUB_SHA

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# Setup
COPY package* ./
RUN npm ci -f --omit-dev --ignore-scripts
COPY . .

RUN npm run build

EXPOSE 8000

# CMD ["npm", "run", "start:dev"]
CMD ["npm", "run", "start:prod"]
