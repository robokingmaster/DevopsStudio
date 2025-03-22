
variable "project_id" {
  description = "GCP Project ID Where RDS Instance Will Be Created"
  type        = string  
}

variable "region" {
  description = "GCP Region Where RDS Instance Will Be Created"
  type        = string  
}

variable "rds_instanceid" {
  description = "RDS Instance ID to Be Created"
  type        = string  
}

variable "rds_dbversion" {
  description = "RDS Instance Version"
  type        = string  
}

variable "rds_rootpwd" {
  description = "RDS Instance Root Password"
  type        = string  
}