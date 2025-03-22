provider "google" {  
  project = var.gcp_project_id
  region  = var.gcp_region
  zone    = var.gcp_region 
}

data "google_client_config" "default" {}

// GKE cluster details
data "google_container_cluster" "gke_cluster_data" {
  project  = var.gcp_project_id
  name     = var.gke_cluster_name
  location = var.gcp_region  
} 

// Create Local Veriables
locals {
    cluster_name           = var.gke_cluster_name
    cluster_endpoint       = "https://${data.google_container_cluster.gke_cluster_data.endpoint}"
    cluster_ca_certificate = data.google_container_cluster.gke_cluster_data.master_auth.0.cluster_ca_certificate
    access_token           = data.google_client_config.default.access_token
    cluster_path           = "gke_${var.gcp_project_id}_${var.gcp_region}_${data.google_container_cluster.gke_cluster_data.name}"
    network_name           = split("/", data.google_container_cluster.gke_cluster_data.network)[4]
}

// Create Config File From Template
data "template_file" "kubeconfig" {
  template = "${file("${path.module}/templates/kubeconfig.tftpl")}"

  vars = {
    cluster_name           = local.cluster_name
    cluster_endpoint       = local.cluster_endpoint
    cluster_ca_certificate = local.cluster_ca_certificate
    access_token           = local.access_token
    cluster_path           = local.cluster_path
  }
}

// Writing Local File With Actual Values
resource "local_file" "kubeconfig" {
  content  = data.template_file.kubeconfig.rendered
  filename = "${path.module}/generated/kubeconfig"
}

// Check If File Created
resource "null_resource" "show_config_file" {
  triggers  =  { always_run = "${timestamp()}" }
  provisioner "local-exec" {
    command = "ls -ltr ${local_file.kubeconfig.filename}"
  }
  depends_on = [local_file.kubeconfig]
}

// Test If Able To Run kubectl Command
resource "null_resource" "run_kubectl_cmd" {
  triggers  =  { always_run = "${timestamp()}" }
  provisioner "local-exec" {
    command = "kubectl get nodes" 
    environment = {
      KUBECONFIG = local_file.kubeconfig.filename
    }
  }

  depends_on = [local_file.kubeconfig]
}