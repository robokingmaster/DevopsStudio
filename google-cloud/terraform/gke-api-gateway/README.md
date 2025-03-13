### Terraform Resource To Deploy API Gateway For GKE

## Note: While destroying make sure to delete gateway api by own
Command to delete gateway api
```
kubectl describe gateways gke20101-cc6778-gateway -n gateway-api

kubectl delete gateways gke20101-cc6778-gateway -n gateway-api
```