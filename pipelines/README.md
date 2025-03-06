## Configuring Jenkins Server
To run the pipeline we need jenkins server lets configure ur jenkins server

Pre-Requisite:
- Host Machine with docker installed on it
```
docker run -p 8080:8080 -p 50000:50000 -v /tmp/jenkins:/var/jenkins_home jenkins/custom-jenkins:latest 

docker run --name jenkins -p 8080:8080 -p 50000:50000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $(which docker):$(which docker) \
-v /tmp/jenkins:/var/jenkins_home \
jenkins/jenkins

docker ps -a

docker container ls

```

install "Docker Pipeline" plugin
