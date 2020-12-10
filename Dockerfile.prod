FROM node:12.18-alpine as builder

WORKDIR /usr/app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --prod=true

COPY . .

RUN yarn build

##########################
FROM nginx:1.19

EXPOSE 80

COPY --from=builder /usr/app/build /usr/share/nginx/html