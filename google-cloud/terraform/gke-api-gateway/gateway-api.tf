
// Create Config File From Template
data "template_file" "gatewayapi" {
  template = "${file("${path.module}/templates/gatewayapi.tftpl")}"

  vars = {
    cluster_name  = local.cluster_name
    domain_name   = var.gcp_managed_domain
    tls_cert_map  = var.gcp_tls_cert_map_name
  }
}

// Writing Local File With Actual Values
resource "local_file" "gatewayyaml" {
  content  = data.template_file.gatewayapi.rendered
  filename = "${path.module}/generated/create-gateway.yaml"
}

// Check If File Created
resource "null_resource" "show_gateway_file" {
  triggers  =  { always_run = "${timestamp()}" }
  provisioner "local-exec" {
    command = "ls -ltr ${local_file.gatewayyaml.filename}"
  }
  depends_on = [local_file.gatewayyaml]
}

// Create Gateway From Created File
resource "null_resource" "create_gateway" {
  triggers  =  { always_run = "${timestamp()}" }
  provisioner "local-exec" {
    command = "kubectl apply -f ${local_file.gatewayyaml.filename}" 
    environment = {
      KUBECONFIG = local_file.kubeconfig.filename
    }
  }
  depends_on = [local_file.kubeconfig, local_file.gatewayyaml]
}
