# google_client_config and kubernetes provider must be explicitly specified like the following.
data "google_client_config" "default" {}

provider "kubernetes" {
  host                   = "https://${module.gke.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
}

locals {
  gke_cluster_name  = "gke${var.deployment_id}-cc${var.tag_resource_costcenter}"  
  service_account   = "exampleadmin@${var.gcp_project_id}.iam.gserviceaccount.com"
}

module "gke" {
  source                     = "terraform-google-modules/kubernetes-engine/google"
  version                    = "35.0.1"
  project_id                 = var.gcp_project_id
  name                       = local.gke_cluster_name
  kubernetes_version         = var.gke_cluster_version
  release_channel            = "STABLE"
  regional                   = true
  region                     = var.gcp_region
  zones                      = [local.available_zones[0],local.available_zones[1]]
  network                    = module.gke-network.network_name
  subnetwork                 = module.gke-network.subnets_names[0]
  ip_range_pods              = local.ip_range_pods_name
  ip_range_services          = local.ip_range_services_name
  create_service_account     = false
  service_account            = local.service_account  

  deletion_protection        = false
  remove_default_node_pool   = true
  gce_pd_csi_driver          = true
  gateway_api_channel        = "CHANNEL_STANDARD"

  # enable_secret_manager_addon = true
  # monitoring_enabled_components     = [APISERVER,SCHEDULER,CONTROLLER_MANAGER,SYSTEM_COMPONENTS]

  master_authorized_networks = [
    {
      cidr_block   = module.gke-network.subnets_ips[0]
      display_name = "VPC"
    },
    {
      cidr_block   = "10.10.10.0/24"
      display_name = "Network A"
    },
    {
      cidr_block   = "11.11.11.0/24"
      display_name = "Network B"
    },  
  ]  

  node_pools = [
    {
      name                        = "default-node-pool"
      machine_type                = "e2-standard-16"
      node_locations              = "${local.available_zones[0]},${local.available_zones[1]},${local.available_zones[2]}"
      min_count                   = 1
      max_count                   = 3  
      spot                        = false
      disk_size_gb                = 100
      disk_type                   = "pd-standard"
      image_type                  = "COS_CONTAINERD"
      enable_gcfs                 = false
      enable_gvnic                = false
      logging_variant             = "DEFAULT"
      auto_repair                 = true
      auto_upgrade                = true
      service_account             = local.service_account
      preemptible                 = false
      initial_node_count          = 1
    },
  ]

  node_pools_oauth_scopes = {
    all = [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/trace.append"
    ]
  }

  node_pools_labels = {
    all = {}

    default-node-pool = {
      default-node-pool = true
    }
  }

  node_pools_metadata = {
    all = {}

    default-node-pool = {
      node-pool-metadata-custom-value = "${local.gke_cluster_name}-node-pool"
    }
  }

  node_pools_taints = {
    all = []

    default-node-pool = []
  }

  node_pools_tags = {
    all = []

    default-node-pool = [
      "default-node-pool",
    ]
  }

  depends_on = [google_compute_firewall.corpfwrules]
}

# Create Static IP For Load Balancer
resource "google_compute_global_address" "lb_static_ip" {  
  name      = "${local.gke_cluster_name}-static-ip-lb"
  depends_on = [module.gke]
}