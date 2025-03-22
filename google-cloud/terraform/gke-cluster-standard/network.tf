provider "google" {  
  project = var.gcp_project_id
  region  = var.gcp_region
}

data "google_compute_zones" "available" {}

output "available_zones" {
  value = data.google_compute_zones.available.names
}

locals {
  gke_network_name          = "examplelabs-gke-${var.deployment_id}-network"
  gke_subnet_name           = "${var.gcp_region}-${var.deployment_id}-gke-subnet"
  ip_range_pods_name        = "${var.gcp_region}-${var.deployment_id}-gke-pods"
  ip_range_services_name    = "${var.gcp_region}-${var.deployment_id}-gke-services"
  available_zones           = data.google_compute_zones.available.names
}

module "gke-network" {
  source  = "terraform-google-modules/network/google"
  version = ">= 7.5"

  project_id   = var.gcp_project_id
  network_name = local.gke_network_name

  subnets = [
    {
      subnet_name   = local.gke_subnet_name
      subnet_ip     = "10.0.0.0/24"
      subnet_region = var.gcp_region
    },
  ]

  secondary_ranges = {
    (local.gke_subnet_name) = [
      {
        range_name    = local.ip_range_pods_name
        ip_cidr_range = "10.1.0.0/16"
      },
      {
        range_name    = local.ip_range_services_name
        ip_cidr_range = "10.2.0.0/20"
      },
    ]
  }
}

# Subnet For VM Instance
resource "google_compute_subnetwork" "vmsubnet" {
  name          = "${var.gcp_region}-${var.deployment_id}-vm-subnet"
  ip_cidr_range = "10.150.0.0/24"
  region        = var.gcp_region
  network       = module.gke-network.network_name
  depends_on    = [module.gke-network]
}

// Firewall to allow Custom network Access
resource "google_compute_firewall" "corpfwrules" {
  project     = var.gcp_project_id
  name        = "corp-access-${var.deployment_id}-rule"
  network     = local.gke_network_name
  description = "Creates firewall rule for allowing Custom Network connections"

  allow {
    protocol  = "tcp"
    ports     = ["22", "443", "5432", "80"]
  }

  source_ranges = [
    "xxx.xxx.xxx.xxx/24",
    "xxx.xxx.xxx.xxx/24"
  ]

  depends_on   = [google_compute_subnetwork.vmsubnet]
}