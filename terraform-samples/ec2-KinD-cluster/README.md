
### Create EC2 Instance And Configure KinD Cluster

Update terraform.tfvars file and run below command
```
terraform init

terraform plan

terraform apply --auto-approve
```

Get basic cluster information via below commands after SSH to ec2 instance

```
kubectl cluster-info --context kind-kind

kubectl get nodes

sudo docker ps

kubectl get pods -A
```

### Accesing deployments outside via EC2 host network
Port range 32000 - 32010 are exposed to EC2 host network and can be used for deployment in which 32000 is reserved for kubernetes dashboard

Kubernetes Dashboard can be access via https://<resource_prefix>-kind-dashboard.<domain_name>
Token to login for dashboard can be found on ec2 instance
```
cat /home/ubuntu/configs/admin-user-token
```

### Deploy Sample Votina App
- Clone the voting app repository:
  ```bash
  cd ~
  git clone https://github.com/dockersamples/example-voting-app.git
  cd example-voting-app/
  ```

- Apply Kubernetes YAML specifications for the voting app:
  ```bash
  kubectl apply -f k8s-specifications/

  ubuntu$ kubectl apply -f k8s-specifications/
    deployment.apps/db created
    service/db created
    deployment.apps/redis created
    service/redis created
    deployment.apps/result created
    service/result created
    deployment.apps/vote created
    service/vote created
    deployment.apps/worker created
  ubuntu$  
  ```

- List all Kubernetes resources:
  ```bash
  kubectl get all

  ubuntu$ kubectl get all
    NAME                          READY   STATUS    RESTARTS   AGE
    pod/db-74574d66dd-5tgzj       1/1     Running   0          60s
    pod/redis-6c5fb9c4b7-zx2j6    1/1     Running   0          60s
    pod/result-5f99548f7c-gkpqf   1/1     Running   0          60s
    pod/vote-5d74dcd7c7-fqcrb     1/1     Running   0          60s
    pod/worker-6f5f6cdd56-4mnpk   1/1     Running   0          60s

    NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    service/db           ClusterIP   10.96.175.48    <none>        5432/TCP         60s
    service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          14m
    service/redis        ClusterIP   10.96.165.15    <none>        6379/TCP         60s
    service/result       NodePort    10.96.131.162   <none>        8081:31001/TCP   60s
    service/vote         NodePort    10.96.72.84     <none>        8080:31000/TCP   60s

    NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/db       1/1     1            1           60s
    deployment.apps/redis    1/1     1            1           60s
    deployment.apps/result   1/1     1            1           60s
    deployment.apps/vote     1/1     1            1           60s
    deployment.apps/worker   1/1     1            1           60s

    NAME                                DESIRED   CURRENT   READY   AGE
    replicaset.apps/db-74574d66dd       1         1         1       60s
    replicaset.apps/redis-6c5fb9c4b7    1         1         1       60s
    replicaset.apps/result-5f99548f7c   1         1         1       60s
    replicaset.apps/vote-5d74dcd7c7     1         1         1       60s
    replicaset.apps/worker-6f5f6cdd56   1         1         1       60s
  ubuntu$  
  ```

- Expose Node ports for accessing the voting and result apps:
  ```bash
  kubectl patch svc vote -p '{"spec": {"type": "NodePort", "ports": [{"port": 8080, "targetPort": 80, "nodePort": 32001}]}}'
  kubectl patch svc result -p '{"spec": {"type": "NodePort", "ports": [{"port": 8081, "targetPort": 80, "nodePort": 32002}]}}'
  ```

- Access Voting App And Result:
```
curl -iv http://localhost:32001

curl -iv http://localhost:32002
```

