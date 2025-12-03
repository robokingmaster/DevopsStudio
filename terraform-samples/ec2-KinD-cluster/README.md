
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
