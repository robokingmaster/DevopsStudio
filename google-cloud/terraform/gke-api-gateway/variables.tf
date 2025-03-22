variable "gcp_region" {
  description = "GCP region"
  type        = string  
}

# Cluster Information
variable "gke_cluster_name" {
  description = "GKE Cluster Version"
  type        = string  
}

# GCP Account Information
variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string  
}

# GCP Domain Information
variable "gcp_managed_domain" {
  description = "GCP Managed Domain Name"
  type        = string  
}

# GCP SSL Certificate Information
variable "gcp_tls_cert_map_name" {
  description = "Existing TLS Certificate Map Name"
  type        = string  
}

# Deployment Information
variable "deployment_id" {
  description = "Deployment Unique ID"
  type        = string  
}
