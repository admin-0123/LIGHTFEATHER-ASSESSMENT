FROM node:alpine
EXPOSE 8080
WORKDIR /
COPY package.json .
RUN npm install
COPY *.js .
ENTRYPOINT ["node", "index.js"]
