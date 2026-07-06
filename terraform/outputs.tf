# Outputs for DeployMate Terraform Configuration

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = try(aws_ecs_cluster.app.name, "")
}

output "service_name" {
  description = "Name of the ECS service"
  value       = try(aws_ecs_service.app.name, "")
}

output "task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = try(aws_ecs_task_definition.app.arn, "")
}

output "load_balancer_dns" {
  description = "DNS of the Application Load Balancer"
  value       = try(aws_lb.app.dns_name, "")
}

output "load_balancer_url" {
  description = "URL of the Application Load Balancer"
  value       = try(aws_lb.app.dns_name, "")
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = try(aws_ecr_repository.app.repository_url, "")
}

output "logs_cloudwatch_group" {
  description = "CloudWatch Logs group name"
  value       = try(aws_cloudwatch_log_group.app.name, "")
}

output "security_group_id" {
  description = "Security group ID for ECS tasks"
  value       = try(aws_security_group.ecs_task.id, "")
}

output "vpc_id" {
  description = "VPC ID where resources are deployed"
  value       = var.vpc_id
}
