# Stage 1: Build React frontend
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Node.js backend
FROM node:18 AS backend
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy built frontend into backend's public folder
COPY --from=frontend-build /frontend/build ./public
# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]


# docker build -t portfolio-view:latest .

