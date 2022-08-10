FROM node:18 as production

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY .eslintrc.js ./
COPY src ./src/

RUN yarn install --frozen-lockfile --only=production && \
    yarn build

CMD ["yarn", "start:prod"]
