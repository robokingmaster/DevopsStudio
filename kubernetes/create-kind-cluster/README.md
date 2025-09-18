## Pre-Requisites

- Provision and Connecte To Ubuntu virtual machine
- Install required packages as
  ```bash
  chmod +x install_docker.sh
  chmod +x install_kind.sh
  chmod +x install_kubectl.sh
  chmod +x install_helm.sh

  ./install_docker.sh
  ./install_kind.sh
  ./install_kubectl.sh
  ./install_helm.sh
  ```

## 1. Creating and Managing Kubernetes Cluster with Kind

- Create a 3-node Kubernetes cluster using Kind:
  ```bash
  kind create cluster --config=config.yml

  ubuntu$ kind create cluster --config=config.yml
    Creating cluster "kind" ...
    ✓ Ensuring node image (kindest/node:v1.33.0) 🖼
    ✓ Preparing nodes 📦 📦 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
    ✓ Joining worker nodes 🚜
    Set kubectl context to "kind-kind"
    You can now use your cluster with:

    kubectl cluster-info --context kind-kind

    Have a nice day! 👋
  ubuntu$
  ```

- Check cluster information:
  ```bash
  kubectl cluster-info --context kind-kind
  kubectl get nodes
  kind get clusters

  ubuntu$ kubectl cluster-info --context kind-kind
    Kubernetes control plane is running at https://127.0.0.1:36321
    CoreDNS is running at https://127.0.0.1:36321/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
  ubuntu$ kubectl get nodes
    NAME                 STATUS   ROLES           AGE     VERSION
    kind-control-plane   Ready    control-plane   7m7s    v1.33.0
    kind-worker          Ready    <none>          6m55s   v1.33.0
    kind-worker2         Ready    <none>          6m56s   v1.33.0
  ubuntu$   kind get clusters
    kind
  ubuntu$
  ```

---

## 2. Managing Docker and Kubernetes Pods

- Check Docker containers running:
  ```bash
  docker ps

  ubuntu$ docker ps
    CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS         PORTS                       NAMES
    a0c3cfb63b7c   kindest/node:v1.33.0   "/usr/local/bin/entr…"   10 minutes ago   Up 9 minutes                               kind-worker
    19d70a7867d2   kindest/node:v1.33.0   "/usr/local/bin/entr…"   10 minutes ago   Up 9 minutes                               kind-worker2
    314c70d760ba   kindest/node:v1.33.0   "/usr/local/bin/entr…"   10 minutes ago   Up 9 minutes   127.0.0.1:36321->6443/tcp   kind-control-plane
  ubuntu$  
  ```

- List all Kubernetes pods in all namespaces:
  ```bash
  kubectl get pods -A

  ubuntu$ kubectl get pods -A
    NAMESPACE            NAME                                         READY   STATUS    RESTARTS   AGE
    kube-system          coredns-674b8bbfcf-hsfsc                     1/1     Running   0          10m
    kube-system          coredns-674b8bbfcf-nj8v4                     1/1     Running   0          10m
    kube-system          etcd-kind-control-plane                      1/1     Running   0          10m
    kube-system          kindnet-6277s                                1/1     Running   0          10m
    kube-system          kindnet-bfhmm                                1/1     Running   0          10m
    kube-system          kindnet-jgpn6                                1/1     Running   0          10m
    kube-system          kube-apiserver-kind-control-plane            1/1     Running   0          10m
    kube-system          kube-controller-manager-kind-control-plane   1/1     Running   0          10m
    kube-system          kube-proxy-89tjc                             1/1     Running   0          10m
    kube-system          kube-proxy-drvb9                             1/1     Running   0          10m
    kube-system          kube-proxy-jkt6p                             1/1     Running   0          10m
    kube-system          kube-scheduler-kind-control-plane            1/1     Running   0          10m
    local-path-storage   local-path-provisioner-7dc846544d-24shz      1/1     Running   0          10m
  ubuntu$  
  ```

---

## 3. Cloning and Running the Example Voting App

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

- Forward local ports for accessing the voting and result apps:
  ```bash
  kubectl port-forward service/vote 5000:5000 --address=0.0.0.0 &
  kubectl port-forward service/result 5001:5001 --address=0.0.0.0 &
  ```

---

## 4. Managing Files in Example Voting App

- Navigate and view files:
  ```bash
  cd ..
  cd seed-data/
  ls
  cat Dockerfile
  cat generate-votes.sh
  ```

---

## 5. Deleting Kubernetes Cluster

- Delete the Kind cluster:
  ```bash
  kind delete cluster --name=kind
  ```

---

## 6. Installing Kubernetes Dashboard

- Deploy Kubernetes dashboard:
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
  ```

- Create a token for dashboard access:
  ```bash
  kubectl -n kubernetes-dashboard create token admin-user
  ```

---
