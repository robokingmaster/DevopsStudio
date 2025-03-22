terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.11.0"
    }
    google-beta = {
      source = "hashicorp/google-beta"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0"
    }    
  }

  required_version = ">= 0.14"
}
