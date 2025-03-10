## Creating Custom AMI for EKS Worker Node

### Requirement:
- VPC
- Private Subnet With NAT enabled and use same for subnet_id for make command
- Source AMI

### ⚙️ Prepare CloudShell For Executing Packer Job
Create Cloudshell VPC Environment In Private Subnate which has NAT so that it can get internet access.

#### Create Role For Packer
Create role name as "EC2Role" with following policies
- AmazonS3FullAccess
- EC2InstanceProfileForImageBuilderECRContainerBuilds
- EC2Role_Policy (Create policy as per EC2Role_Policy.json file)


#### For RHEL
```
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install packer
packer plugins install github.com/hashicorp/amazon
git clone https://github.com/aws-samples/amazon-eks-ami-rhel.git && cd amazon-eks-ami-rhel
```

#### For Amazon Linux
```
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install packer
packer plugins install github.com/hashicorp/amazon
git clone https://github.com/awslabs/amazon-eks-ami.git && cd amazon-eks-ami
```

### Locate hardening scripts and packages
Identify the AWS S3 bcket which has all the hardening packages for the required cluster version using URL https://us-west-2.console.aws.amazon.com/s3/buckets/amazon-eks?region=us-west-2&bucketType=general&tab=objects

Identify path and check if you have access to the path using command

```
aws s3 ls amazon-eks/1.32.1/2025-02-11/bin/linux/amd64/
```

Above command is for EKS version 1.32.1 and hardening script folder name is 2025-02-11. Once you got the access you can update additional required settings in ./templates/al2/template.json file. 
For example i want to add some more tags into resources

--Add Below Tags in ./templates/al2/template.json tag run_tags
"Owner": "{{user `tagowner`}}",
"OwnerEmailID": "{{user `tagowneremail`}}"

### Building the AMI
Now execute make command to trigger the hardening scripts. Note below private subnet ID should be provided. 
#### For RHEL
 We are building image for RHEL 9.5 replace below parameter as per actuals
 - source_ami_filter_name
 - source_ami_id
 - source_ami_owners

```
make k8s=1.32.1 \
kubernetes_version=1.32.1 \
kubernetes_build_date=2025-02-11 \
source_ami_filter_name=RHEL-9.5_HVM-20250128-x86_64* \
source_ami_id=ami-xxxxxx \
source_ami_owners=679593333241 \
ami_regions=us-east-2 \
aws_region=us-east-2 \
iam_instance_profile=EC2Role \
vpc_id=vpc-xxxxxx \
subnet_id=subnet-xxxxxx \
security_group_id=sg-xxxxxx \
enable_fips=true \
pause_container_image=602401143452.dkr.ecr-fips.us-east-2.amazonaws.com/eks/pause:3.5 \
tagowner=myuser \
tagowneremail=xyz.corp@gmail.com
```

#### For Amazon Linux
```
make k8s=1.32.1 \
kubernetes_version=1.32.1 \
kubernetes_build_date=2025-02-11 \
ami_regions=us-east-2 \
aws_region=us-east-2 \
iam_instance_profile=EC2Role \
vpc_id=vpc-xxxxxxxx \
subnet_id=subnet-xxxxxxxx \
security_group_id=sg-xxxxxxxxx \
enable_fips=true \
tagowner=myuser \
tagowneremail=xyz.corp@gmail.com
```

After completion of this step new AMI should be found under owned AMIs section.
