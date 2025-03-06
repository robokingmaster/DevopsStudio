## Configuring Jenkins Server
To run the pipeline we need jenkins server lets configure ur jenkins server

Pre-Requisite:
- Host Machine with docker installed on it
```
docker run -p 8080:8080 -p 50000:50000 -v /tmp/jenkins:/var/jenkins_home jenkins/jenkins:lts-jdk11

docker ps -a

docker container ls

```