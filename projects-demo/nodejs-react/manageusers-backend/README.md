## Manage User Backend

### Create .env file for environemnt veriables
Create .env file with below content. Replace X with actual values
```
DATABASE_HOST=localhost               ## When App Running on host 
# DATABASE_HOST=host.docker.internal  ## When App Running on Docker Compose 
DATABASE_PORT=5432
POSTGRES_USER=xxxx
POSTGRES_PASSWORD=xxxx
POSTGRES_DBNAME=xxxx

APP_ENV=devlopment
APP_LOG_LEVEL=debug   
APP_PORT=5000
APP_JWT_SECRET=xxxxxxxxxxxxxxxxxx
APP_DEFAULT_USER=xxxx
APP_DEFAULT_PWD=xxxx
```

### Install required node modules
Run below command to install required node packages
```
npm -i install
```

### Run backend application
To start backend application in debug mode run below command
```
npm run dev
```

To start backend application in non debug mode run below command
```
npm start
```

### Multimedia contents
All the profile picture will be stored in uploads directory

### Default Admin Credentials
Default admin credentials wil be same as defined in .env file as APP_DEFAULT_USER and APP_DEFAULT_PASSWORD.

## Running on kubernetes
To run this project on Kubernetes, make sure postgres database provisioned. 
Than run database sql file present in resources/database-schema/database-schema.sql folder of the application.

### Run via helm chart