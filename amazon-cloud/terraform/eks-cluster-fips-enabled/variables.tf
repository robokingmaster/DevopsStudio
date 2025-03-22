variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

# Cluster Information
variable "eks_cluster_version" {
  description = "EKS Cluster Version"
  type        = string
}

# AWS Account Information
variable "aws_account_number" {
  description = "AWS Account Number"
  type        = string
}

# Mandatory Tags For Resources
variable "tag_resource_owner" {
  description = "Tag Owner"
  type        = string
}

variable "tag_resource_costcenter" {
  description = "Tag CostCenterCode"
  type        = string
}

variable "tag_resource_department" {
  description = "Tag Department"
  type        = string
}

variable "tag_resource_manager" {
  description = "Tag Manager"
  type        = string
}

variable "tag_resource_owneremail" {
  description = "Tag OwnerEmailID"
  type        = string
}

# Deployment Information
variable "deployment_id" {
  description = "Deployment Unique ID"
  type        = string
}