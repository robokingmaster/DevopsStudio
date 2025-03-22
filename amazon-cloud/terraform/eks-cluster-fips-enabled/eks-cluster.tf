module "eks" {  
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.33.0"

  cluster_name    = local.cluster_name
  cluster_version = var.eks_cluster_version

  cluster_endpoint_public_access    = true
  cluster_endpoint_private_access   = true  
  
  enable_cluster_creator_admin_permissions = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_group_defaults = {
    instance_types  = ["t2.2xlarge"]
    key_name        = "exampleadmin-aws-key"
    disk_size       = 100
    use_name_prefix = false

  #// For RHEL###
    ami_type        = "CUSTOM"
    ami_id          = "ami-xxxxxxxx"    
    enable_bootstrap_user_data = true

  # // For Amazon Linux 
    # ami_type        = "AL2_x86_64"
    # ami_id          = "ami-xxxxxxxx"     

    iam_role_additional_policies = {
      "ssm_managed_instance_policy" = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",      
      "autoscaling_policy" = "arn:aws:iam::aws:policy/AutoScalingFullAccess",
      "eks_cni_policy" = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
      "ebs_csi_policy" = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
    }
  }

  eks_managed_node_groups = {
    group1 = {
      name = "eks-${var.deployment_id}-nodegroup-1"
      
      launch_template_name = "eks-${var.deployment_id}-lt-group1"
      launch_template_use_name_prefix = false

      min_size     = 1
      max_size     = 2
      desired_size = 1
    }
  }

  tags = {
    Name            = local.cluster_name
    Owner           = var.tag_resource_owner
    OwnerEmailID    = var.tag_resource_owneremail
  }

  # Allow Jenkins User 
  access_entries = {
    # One access entry with a policy associated
    cluster_admin = {
      principal_arn     = "arn:aws:iam::${var.aws_account_number}:user/example_IAMUser"

      policy_associations = {
        cluster = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }
}
