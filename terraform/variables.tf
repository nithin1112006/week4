# Variables for DeployMate Terraform Configuration

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (development, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "employee-management-api"
}

variable "docker_image" {
  description = "Docker image URI (optional, uses latest from ECR if empty)"
  type        = string
  default     = ""
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}

variable "cpu" {
  description = "CPU units for ECS task (1 vCPU = 1024 CPU units)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Memory (MiB) for ECS task"
  type        = number
  default     = 512
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 3000
}

variable "host_port" {
  description = "Port the host listens on"
  type        = number
  default     = 3000
}

variable "enable_https" {
  description = "Enable HTTPS with ACM certificate"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Domain name for HTTPS (required if enable_https is true)"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}

variable "vpc_id" {
  description = "The ID of the VPC where resources will be deployed"
  type        = string
  default     = ""
}

variable "subnet_ids" {
  description = "The list of subnet IDs for the resources"
  type        = list(string)
  default     = []
}
