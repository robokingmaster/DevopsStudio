output "region" {
  value       = var.gcp_region
  description = "GCloud Region"
}

output "project_id" {
  value       = var.gcp_project_id
  description = "GCloud Project ID"
}

output "kubernetes_cluster_name" {
  value       = module.gke.cluster_id
  description = "GKE Cluster Name"
}

output "kubernetes_cluster_dns" {
  value       = module.gke.endpoint_dns
  description = "GKE Cluster DNS"
}

output "kubernetes_gateway_ip" {
  value       = google_compute_global_address.lb_static_ip.address
  description = "GKE Load Balancer Static IP Address"
}

output "kubernetes_gateway_ip_name" {
  value       = google_compute_global_address.lb_static_ip.name
  description = "GKE Load Balancer Static IP Name"
}

output "vm_pgdb_ip" {
  value       = google_compute_address.vmdb_static_ip.address
  description = "VM Database Static IP Address Of VM Which Is Hosting Database"
}

output "vm_pgdb_ip_name" {
  value       = google_compute_address.vmdb_static_ip.name
  description = "VM Database Static IP Address Of VM Which Is Hosting Database"
}

output "vm_pgdb_host_name" {
  value       = local.vmdb_dns_name
  description = "VM Database DNS Host Name"
}