## Deploying Sample Color App in Kubernetes
This is an sample web application written using python and flask. 
It display an webpage with APP_COLOR name and host name where the application is running.

Here is a screenshot of the application:

<p align="center">
  <img src="../../../resources/images/Screenshot-colorapp.png" width="400" alt="screenshot"/>
</p>


There are multiple ways to deploy this application in your kubernetes.

### Deploy using menifeast
Update create-ingress.yaml file for desired suffix to the url default: http://localhost:8080/blue
Update create-deployment.yaml ENV parameter APP_COLOR: blue to change to desired color of the application web page. 

```
kubectl create -f ../colorapp

kubectl delete -f ../colorapp
```

### Deploy using helm chart and terraform
For advance deployment using Helm chart of terraform below documentations can be refered.

Follow [View Documentation](https://github.com/robokingmaster/chart-shelf/blob/main/colorapp/README.md)

### Post Deployment Configuration (Optional)

#### Using EKS ALB to access app with DNS and TLS

Create ingress resource as below and modify ACM SSL ARN as per your environment

```
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blueapp-ingress
  namespace: blue-app
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /health
    alb.ingress.kubernetes.io/group.name: frontend
    alb.ingress.kubernetes.io/certificate-arn: <ACM-SSL Certificate ARN>
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS": 443}]'
spec:
  ingressClassName: alb
  rules:
    - host: blueapp.example.com
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: service-blue
              port:
                number: 80
```

#### Using GKE Gateway to access app with DNS

Create ingress resource as below and modify ip and app name per your environment

```
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blueapp-ingress
  namespace: blue-app
  annotations: 
    kubernetes.io/ingress.class: gce 
    kubernetes.io/ingress.allow-http: "true"
    kubernetes.io/ingress.global-static-ip-name: "examplelabs-webapps-ip"
spec:  
  rules:
  - host: "blueapp.example.com"
    http:
      paths:
      - pathType: ImplementationSpecific
        path: "/*"
        backend:
          service:
            name: service-blue
            port:
              number: 80
```