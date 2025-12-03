variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

# Networking Informations
variable "vpc_name" {
  description = "Existing VPC Name"
  type        = string
}

variable "sg_name" {
  description = "Existing Security Group Name"
  type        = string
}

variable "alb_name" {
  description = "Existing ALB Name"
  type        = string
}

variable "key_pair_name" {
  description = "SSH Key pair attached with the instance"
  type        = string  
}

variable "hosted_zoneid" {
  description = "Hosted Zone ID"
  type        = string  
}

# Mandatory Tags For Resources For Tagging
variable "tag_ownershortid" {
  description = "Instance Owner Short ID"
  type        = string
}

variable "tag_ownername" {
  description = "Instance Owner Name"
  type        = string    
}

variable "tag_owneremail" {
  description = "Instance Owner Email Address"
  type        = string
}

variable "tag_teamname" {
  description = "Instance Owner Team Name"
  type        = string
}

variable "tag_teamemail" {
  description = "Instance Owner Team Email"
  type        = string
}

variable "tag_department" {
  description = "Instance Owner Department Name"
  type        = string
}

variable "tag_costcenter" {
  description = "Instance Owner Cost Center"
  type        = string
}

variable "tag_managername" {
  description = "Instance Owner Manager Name"
  type        = string
}

variable "tag_labowner" {
  description = "Instance Lab Owner"
  type        = string
}

# Domian Name Information
variable "domain_name" {
  description = "Domain Name"
  type        = string
}

# Deployment Information
variable "resource_prefix" {
  description = "Resource Name Prefix"
  type        = string
}

variable "ec2_source_ami" {
  description = "EC2 Source AMI"
  type        = string
}
