## Deploying ALB Controller

Make sure eksctl utility installed on your environment. Please refer https://eksctl.io/installation/ installation guide.

### Create AWS role and EKS Service account
Example: Lets create below resources

AWS Role name: AmazonEKSLoadBalancerControllerRole
EKS Service Account Name: aws-load-balancer-controller
Policy Name: AWSLoadBalancerControllerIAMPolicy

```
aws eks update-kubeconfig --region us-east-2 --name <cluster-name> 

eksctl create iamserviceaccount \
  --cluster=<cluster-name> \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name=AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::<AWS Account Number>:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve
```

verify the AWS role and EKS service account created properly.

### Deploy ALB Controller on EKS
Using helm chart we can deploy ALB controller to EKS cluster

```
helm repo add eks https://aws.github.io/eks-charts

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=<cluster-name> \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

helm uninstall aws-load-balancer-controller -n kube-system   
```

After helm installation check the pods of ALB controllers and check. There should not be any error to make it working correctly if there is authentication issue than manually recreate the AWS Role.

### Testing ALB

```
kubectl create -f ./red-app.yaml

kubectl get ingress --all-namespaces
NAMESPACE   NAME              CLASS   HOSTS                         ADDRESS                                                          PORTS   AGE
red-app     redapp-ingress    alb     redapp.example.com            k8s-frontend-xxxxxxxxxx.xxxxxxxxxx.us-east-2.elb.amazonaws.com   80      17h
```
If we get the address that mean ALB is working fine. We can use same ALB address for multiple application by using same annotation as frontend. More annotations can be referred from https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/

```
alb.ingress.kubernetes.io/group.name: frontend
alb.ingress.kubernetes.io/inbound-cidrs: "xxx.xxx.xxx.xxx/24", "xxx.xxx.xxx.xxx/24"     ---Allow Incoming requests only from These CIRDS
```

### Cleanup
```
eksctl delete iamserviceaccount \
  --cluster=<cluster-name> \
  --namespace=kube-system \
  --name=aws-load-balancer-controller

helm uninstall aws-load-balancer-controller -n kube-system  
```