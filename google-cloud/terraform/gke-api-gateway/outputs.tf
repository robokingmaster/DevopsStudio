
// Return the external IPs for all GKE node instances
output "gke_node_external_ips" {
    value = [for x in data.google_compute_instance.nodes : "${x.network_interface[0].access_config[0].nat_ip}/32"]
}

output "gke_host_endpoint" {
    value = local.cluster_name
}

output "gke_cluster_path" {
    value = local.cluster_path
}

output "gke_token" {
    value = local.access_token
    sensitive = true
}

output "gke_cacert" {
    value = local.cluster_ca_certificate
    sensitive = true
}

output "gke_network_name" {
    value = local.network_name
}