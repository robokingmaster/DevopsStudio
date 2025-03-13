resource "google_sql_database_instance" "postgres_pvp_instance_name" {
  name             = var.rds_instanceid
  region           = var.region
  database_version = var.rds_dbversion
  root_password    = var.rds_rootpwd
  edition          = "ENTERPRISE"
  settings {
    tier = "db-custom-2-7680"
    
  }
  # set `deletion_protection` to true, will ensure that one cannot accidentally delete this instance by
  # use of Terraform whereas `deletion_protection_enabled` flag protects this instance at the GCP level.
  deletion_protection = false
}