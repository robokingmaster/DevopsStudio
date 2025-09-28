# Backend Dockerfile
FROM node:22

## This disables SSL verification and is insecure. Use only for testing.
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0   

COPY .npmrc /root/.npmrc

WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --verbose
COPY . .
EXPOSE 5000
CMD ["npm", "start"]