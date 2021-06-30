FROM node:10

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG SENTRY_IDENTIFIER
ENV SENTRY_IDENTIFIER=$SENTRY_IDENTIFIER

ARG GITHUB_SHA
ENV GITHUB_SHA=$GITHUB_SHA

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

RUN echo "Docker build with ${NODE_ENV}"

# Setup
WORKDIR /usr/src/app
COPY . .

RUN npm ci

RUN npm run build

# Install Sentry
RUN curl -sL https://sentry.io/get-cli/ | bash

RUN SENTRY_RELEASE=$(sentry-cli releases propose-version) && \
    echo "${SENTRY_RELEASE}" > /SENTRY_RELEASE && \
    SENTRY_RELEASE="${SENTRY_RELEASE}" npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]