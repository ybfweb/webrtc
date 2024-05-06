FROM node:18.20-alpine as builder
WORKDIR /app/
#COPY package.json package-lock.json .npmrc /app/
COPY package.json .npmrc /app/
RUN npm i
COPY ./ /app/
RUN npm run build

FROM nginx:1.25.5
WORKDIR /app
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80