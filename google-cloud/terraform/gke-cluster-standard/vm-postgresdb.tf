provider "google-beta" {  
  project = var.gcp_project_id
  region  = var.gcp_region
}

locals {
  vmdb_name      = "example-pgdb-${var.deployment_id}"
  vmdb_dns_name  = "exampledb${var.deployment_id}pg16.${var.gcp_managed_domain}."
}

# Create a VM in a custom VPC network and subnet
resource "google_compute_address" "vmdb_static_ip" {
  name      = "${local.gke_cluster_name}-static-ip-vmdb"  
  region    = var.gcp_region
}

## Creating VM From example Preconfigured Postgres 16 Image
resource "google_compute_instance_from_machine_image" "tpl" {
  provider              = google-beta
  name                  = local.vmdb_name  
  zone                  = local.available_zones[0]  
  source_machine_image  = "projects/${var.gcp_project_id}/global/machineImages/vm-image-examplepg16db-v1"

  network_interface {
    network    = module.gke-network.network_name
    subnetwork = google_compute_subnetwork.vmsubnet.name
    access_config {
      nat_ip = google_compute_address.vmdb_static_ip.address
    }
  }
}

# to register web-server's ip address in DNS
resource "google_dns_record_set" "default" {
  name         = local.vmdb_dns_name
  managed_zone = var.gcp_managed_zone
  type         = "A"
  ttl          = 300
  rrdatas = [
    google_compute_instance_from_machine_image.tpl.network_interface[0].access_config[0].nat_ip
  ]
}

#################################################################################################
## Creating Fresh Ubuntu VM
# resource "google_compute_disk" "vmdisk" {
#   name = "vmdb-${var.deployment_id}-data"
#   type = "pd-standard"
#   zone = local.available_zones[0]
#   size = "150"
# }

# resource "google_compute_instance" "examplecustomvmforpgdb" {
#   name         = local.vmdb_name
#   tags         = ["allow-ssh"]
#   zone         = local.available_zones[0]
#   machine_type = "e2-highmem-2"
  
#   boot_disk {
#     initialize_params {
#       image = "projects/debian-cloud/global/images/debian-12-bookworm-v20250113"
#     }
#   }

#   attached_disk {
#     source      = google_compute_disk.vmdisk.id
#     device_name = google_compute_disk.vmdisk.name
#   }

#   network_interface {
#     network    = google_compute_network.vpcnetwork.name
#     subnetwork = google_compute_subnetwork.vmsubnet.name
#     access_config {
#       nat_ip = google_compute_address.vmdb_static_ip.address
#     }
#   }
# }

# to register web-server's ip address in DNS
# resource "google_dns_record_set" "default" {
#   name         = local.vmdb_dns_name
#   managed_zone = var.gcp_managed_zone
#   type         = "A"
#   ttl          = 300
#   rrdatas = [
#     google_compute_instance.examplecustomvmforpgdb.network_interface[0].access_config[0].nat_ip
#   ]
# }