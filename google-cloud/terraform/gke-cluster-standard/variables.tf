variable "gcp_region" {
  description = "GCP region"
  type        = string  
}

# Cluster Information
variable "gke_cluster_version" {
  description = "GKE Cluster Version"
  type        = string  
}

# GCP Account Information
variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string  
}

# GCP Domain Information
variable "gcp_managed_zone" {
  description = "GCP Managed DNS Zone Name"
  type        = string  
}

# GCP Domain Information
variable "gcp_managed_domain" {
  description = "GCP Managed Domian Name"
  type        = string  
}

# Deployment Information
variable "deployment_id" {
  description = "Deployment Unique ID"
  type        = string
  default     = "20101"
}
