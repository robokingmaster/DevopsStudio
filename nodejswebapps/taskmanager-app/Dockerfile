FROM node:22-alpine

RUN mkdir -p /opt/app/taskmanager-app

COPY . /opt/app/taskmanager-app

WORKDIR /opt/app/taskmanager-app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]

# docker build --tag eis-inventory-api:v6.0 .
# docker run -it eis-inventory-api:v6.0 /bin/bash