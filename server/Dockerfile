FROM node:12.18-alpine

WORKDIR /app

COPY package.json .
RUN yarn install --prod=true

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]