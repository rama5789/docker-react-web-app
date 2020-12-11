FROM node:12.18-alpine

WORKDIR /app

COPY package.json .
RUN yarn install --prod=true

COPY . .

CMD ["yarn", "start"]