# AWS Informations
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "resource_prefix" {
  description = "Resource Prefix"
  type        = string
}

# Domian Name Information
variable "domain_name" {
  description = "Domain Name"
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
