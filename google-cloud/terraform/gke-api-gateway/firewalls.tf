
// GKE node instance group details
data "google_compute_instance_group" "node_instance_groups" {
    for_each = toset(data.google_container_cluster.gke_cluster_data.node_pool[0].instance_group_urls)
    self_link = replace(each.key, "instanceGroupManagers", "instanceGroups")
}

// GKE node compute instance details
data "google_compute_instance" "nodes" {
    for_each = toset(flatten([for x in data.google_compute_instance_group.node_instance_groups : x.instances[*]]))
    self_link = each.key
}

// Firewall to allow GKE to Database Access
resource "google_compute_firewall" "dbfwrules" {
  project     = var.gcp_project_id
  name        = "${local.cluster_name}-access-db"
  network     = local.network_name
  description = "Allow Database subnet to accept connection from GKE public IP Address"

  allow {
    protocol  = "tcp"
    ports     = ["5432"]
  }

  source_ranges = [for x in data.google_compute_instance.nodes : "${x.network_interface[0].access_config[0].nat_ip}/32"] 
}
