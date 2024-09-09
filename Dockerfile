FROM node:16.15.0 as builder

WORKDIR /app
COPY package.json package-lock.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn run build

FROM nginx:1.23.3-alpine as production

ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]