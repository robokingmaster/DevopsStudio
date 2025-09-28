# portfolio-view
Displaying Portfolio Performance Live

## Runing Aplication with docker run command
```
docker run -p 5000:5000 \
  -e DATABASE_HOST=localhost \
  -e DATABASE_PORT=5432 \
  -e POSTGRES_USER=xxxx \
  -e POSTGRES_PASSWORD=xxxx \
  -e POSTGRES_DBNAME=xxxx \
  -e APP_ENV=development \
  -e APP_LOG_LEVEL=debug \
  -e APP_PORT=5000 \
  -e APP_JWT_SECRET=xxxxxxxxxxxxxxxxxx \
  -e APP_DEFAULT_USER=xxxx \
  -e APP_DEFAULT_PWD=xxxx \
  -v "$(pwd)/backend:/app" \
  -v "$(pwd)/backend/uploads:/usr/src/app/uploads" \
  portfolio-view:latest
```




## Running application with docker compose
### Building Docker Image
docker-compose up --build

### Cleaning Up Docker Intermediate Containers
docker-compose down --remove-orphans

### Run the container and attach
docker-compose run ubuntu-tools

### Attach to container
docker exec -it ubuntu-tools-container bash

