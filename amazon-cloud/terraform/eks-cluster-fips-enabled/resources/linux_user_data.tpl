%{ if enable_bootstrap_user_data ~}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="BOUNDARY"

--BOUNDARY
Content-Type: application/node.eks.aws

---
apiVersion: node.eks.aws/v1alpha1
kind: NodeConfig
spec:
  cluster:
    name: ${cluster_name}
    apiServerEndpoint: ${cluster_endpoint}
    certificateAuthority: ${cluster_auth_base64}
    cidr: ${cluster_service_cidr}

--BOUNDARY--
Content-Type: text/x-shellscript;

#!/bin/bash
sudo sysctl net.ipv4.conf.all.forwarding=1
sudo systemctl disable nm-cloud-setup.timer
sudo systemctl disable nm-cloud-setup.service
sudo reboot
--BOUNDARY--
%{ endif ~}