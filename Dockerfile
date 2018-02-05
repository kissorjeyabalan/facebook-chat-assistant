FROM node:carbon
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /data/app
VOLUME /data/app
WORKDIR /app
RUN npm run build
CMD ["node", "build/src/server.js"]