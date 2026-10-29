FROM node:24-alpine
ENV TZ="Europe/Helsinki"
RUN apk add --no-cache tzdata

# Setup
WORKDIR /usr/src/app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]