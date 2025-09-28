# Frontend Dockerfile
FROM node:22 as build

## This disables SSL verification and is insecure. Use only for testing.
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0   

COPY .npmrc /root/.npmrc

WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --verbose
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]