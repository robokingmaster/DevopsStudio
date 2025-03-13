terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.75"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6.1"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 3.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.9"
    }
    cloudinit = {
      source  = "hashicorp/cloudinit"
      version = "~> 2.3.5"
    }
    helm = {
      source = "hashicorp/helm"
      version = "2.9.0"
    }    
  }

  backend "s3" {
    bucket                  = "examplelabs-s3-terraform-statefiles"
    key                     = "tfstate-file-dpl10201-cc6778"  
    region                  = "us-east-2"
    shared_credentials_file = "~/.aws/credentials"
  }  

  required_version = ">= 1.3"
}