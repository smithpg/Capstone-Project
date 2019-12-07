FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "client-build" ]
EXPOSE 80
CMD [ "npm", "start" ]

