# Terraform resources For GKE
These terraform resources to create on GKE Cluster and an VM instance. 

Make sure you have Google Cloud SDK, kubectl, helm, terraform installed. You can also use use docker image from robokingmaster/devops-agent:latest

### Creating GKE Cluster
Modify values in variables.tf files as per your need and run below command.

Example: 

Assume deployment ID is "20101" then Below resources would have been created

- VPC Network         => example-gke-20101-network
- Subnet              => us-central1-20101-gke-subnet, gke20101-cc6778-static-ip-vmdb
- Cluster Name        => gke20101-cc6778 
- Static Global IP    => gke20101-cc6778-static-ip-lb, gke20101-cc6778-static-ip-vmdb
- VM Instance         => example-pgdb-20101
- Firewall Rule       => corp-access-20101-firewall-rule

```
root@860a6e96415c:/# terraform init

root@860a6e96415c:/# terraform plan

root@860a6e96415c:/# terraform apply --auto-approve
```
After completion of above command our cluster would have been ready!!

### Deploy Gateway API With SSL Termination For GKE
##### Option #1: Using Terraform
use terraform resource under folder gke-api-gateway and modify the variables.tf file as per your cluster and then run terraform. This will deploy api gateway to the cluster and also create firewall rules. Make sure certificated are available.

##### Option #2 Manual
Make sure Gateway API enabled for your cluster. Follow prerequisites from https://cloud.google.com/kubernetes-engine/docs/how-to/deploying-gateways

Make sure gatway api calss has been configured in cluster
```
cloudshell:$ kubectl get gatewayclass
NAME                               CONTROLLER                  ACCEPTED   AGE
gke-l7-global-external-managed     networking.gke.io/gateway   True       26h
gke-l7-gxlb                        networking.gke.io/gateway   True       26h
gke-l7-regional-external-managed   networking.gke.io/gateway   True       26h
gke-l7-rilb                        networking.gke.io/gateway   True       26h
cloudshell:$ 
```

Make Sure DNS Authorized SSL Certificate Created with valid domain name (wildcard certificate)
```
cloudshell:$ gcloud certificate-manager certificates list
NAME: gcpexample-ssl-cert
SUBJECT_ALTERNATIVE_NAMES: *.example.com
example.com
DESCRIPTION: 
SCOPE: 
EXPIRE_TIME: 2025-04-22 07:53:25 +00:00
CREATE_TIME: 2023-05-04 14:05:21 +00:00
UPDATE_TIME: 2023-05-05 13:45:04 +00:00

NAME: gcpexample-ssl-cert
SUBJECT_ALTERNATIVE_NAMES: example.com
*.example.com
DESCRIPTION: SSL Certificate DNS Authorized
SCOPE: 
EXPIRE_TIME: 2025-04-22 07:13:28 +00:00
CREATE_TIME: 2025-01-22 07:13:27 +00:00
UPDATE_TIME: 2025-01-22 07:13:27 +00:00
```

Create Certificate Map for wild card TLS Termination
```
gcloud certificate-manager maps create gcpexample-ssl-cert-map

gcloud certificate-manager maps entries create example-map-entry-wildcard \
    --map="gcpexample-ssl-cert-map" \
    --certificates="gcpexample-ssl-cert" \
    --hostname="*.example.com"
	
gcloud certificate-manager maps entries create example-map-entry-domian \
    --map="gcpexample-ssl-cert-map" \
    --certificates="gcpexample-ssl-cert" \
    --hostname="example.com"	
```

Deploy Gateway API

Replace Replace gateway name "external-http", domain name "example.com" Static IP address name "gke20101-cc6778-static-ip-lb" as per your deployments in file ../gke-api-gateway/resources/create-gateway.yaml.

```
kubectl create -f ../gke-api-gateway/resources/create-gateway.yaml

kubectl describe gateways external-http -n gateway-api

```

### Create Firewall Rules
Create firewall rule to allow database incoming request from GKE clusters.
```
kubectl get nodes -o wide|awk '{print $7}'|tail -n+2|sed -e 's/$/\/32/'|paste -sd, -
```

Create firewall rule to allow database to accept connection from GKE Cluster. In case cluster node IP gets change this also need to be updated or recreated.

Update firewall rule "name gke20101-cc6778-access-db", network name "example-gke-20101-network" and source-ranges as per above command output.
```
gcloud compute firewall-rules create gke20101-cc6778-access-db \
	--description="Allow Database subnet to accept connection from GKE public IP Address" \
    --direction=INGRESS \
    --priority=1000 \
    --network=example-gke-20101-network \
    --action=ALLOW \
    --rules=tcp:5432 \
    --source-ranges=xxx.xxx.xxx.xxx/32,xxx.xxx.xxx.xxx/32
```

### Sample Deployment
Lets deploy 3 sample application on our cluster to verify the deployments.

Replace gateway name "external-http" and domain name "example.com" as per your actual deployment details in file ../gke-api-gateway/resources/create-http-route.yaml.

Replace armor policy name "redapp-armor-policy" in file ../gke-api-gateway/resources/attach-armor-policy.yaml

- colorapp-red.yaml -> Deploy color app application
- create-http-routes-path.yaml or create-http-routes-host.yaml -> Deploy HTTPRoutes for color application
- attach-armor-policy.yaml -> Apply Cloud armor policy to protect public access of application

```
kubectl create -f https://raw.githubusercontent.com/robokingmaster/DevopsStudio/refs/heads/main/kubernetes/colorapp/colorapp-red.yaml

kubectl create -f ../gke-api-gateway/resources/create-http-routes-path.yaml

kubectl create -f ../gke-api-gateway/resources/attach-armor-policy.yaml

```

Verify Deployed And HTTP Route And Attach Armor Policy and check if its in SYNC
```
kubectl get httproutes -n red-app
kubectl describe httproutes redapp-route-external -n red-app

kubectl get gcpbackendpolicy -n red-app
kubectl describe gcpbackendpolicy redapp-armor-policy -n red-app
```

Make sure DNS record set is set for the Loadbalancer IP address.
Replace zone name "example.com" as per actual and <GATEWAY_LB_IP> with actual Gateway Load Balancer IP.
```
gcloud dns record-sets create redapp.example.com \
    --rrdatas=<GATEWAY_LB_IP> \
    --ttl=30 \
    --type=A \
    --zone=example.com

gcloud dns record-sets list --zone="example.com"    
```

Test Application access once httproutes are in SYNC
```
curl -I https://redapp.example.com
```

