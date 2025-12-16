FROM node:22-alpine

RUN mkdir -p /opt/app/usermanager

COPY . /opt/app/usermanager

WORKDIR /opt/app/usermanager

RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]
