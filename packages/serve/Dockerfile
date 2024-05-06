FROM node:18.20-alpine
WORKDIR /app/
COPY package.json .npmrc /app/
RUN npm i
COPY ./ /app/
CMD npm run start
EXPOSE 3000