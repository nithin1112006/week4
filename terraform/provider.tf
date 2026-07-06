# Provider configuration for DeployMate

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration - commented out to use local state backend
  # backend "s3" {
  #   bucket         = "deploymate-terraform-state"
  #   key            = "employee-api/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "deploymate-terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  # Assume role if using STS
  # assume_role {
  #   role_arn = var.assume_role_arn
  # }
}

# Configure default tags for all resources
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
