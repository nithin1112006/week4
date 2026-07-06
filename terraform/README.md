# Terraform Configuration for DeployMate

This directory contains Terraform configurations for deploying the Employee Management API to AWS.

## Resources Provisioned

| Resource | Description |
|----------|-------------|
| VPC & Subnets | Networking infrastructure |
| Security Groups | Firewall rules |
| ECR Repository | Docker container registry |
| ECS Cluster | Container orchestration |
| ECS Task Definition | Container configuration |
| ECS Service | Run tasks in cluster |
| Application Load Balancer | Traffic distribution |
| IAM Roles | Permissions management |
| CloudWatch Logs | Application logging |

## Prerequisites

- AWS CLI configured
- Terraform >= 1.0.0
- AWS account with appropriate permissions

## Quick Start

```bash
# Initialize
terraform init

# Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Review changes
terraform plan

# Apply
terraform apply
```

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `aws_region` | `us-east-1` | AWS region |
| `environment` | `production` | Deployment environment |
| `project_name` | `employee-management-api` | Project identifier |
| `docker_image` | (empty) | Docker image URI |
| `desired_count` | `1` | Number of ECS tasks |
| `cpu` | `256` | CPU units for task |
| `memory` | `512` | Memory (MiB) for task |
| `container_port` | `3000` | Container port |
| `host_port` | `3000` | Host port |

## Outputs

| Output | Description |
|--------|-------------|
| `cluster_name` | ECS cluster name |
| `service_name` | ECS service name |
| `task_definition_arn` | Task definition ARN |
| `load_balancer_dns` | ALB DNS name |
| `ecr_repository_url` | ECR repository URL |
| `logs_cloudwatch_group` | CloudWatch logs group |

## Security

- All state is encrypted at rest
- IAM roles follow least privilege
- Secrets should be stored in AWS Secrets Manager
- HTTPS should be enabled in production

## Cleanup

```bash
# Destroy all resources
terraform destroy

# Or destroy specific resources
terraform destroy -target=aws_ecs_service.app
```

## Best Practices

1. Use remote state backend (S3 + DynamoDB)
2. Enable version control for state
3. Use workspaces for different environments
4. Enable CloudTrail for auditing
5. Use IAM roles instead of access keys

## Cost Estimation

| Resource | Monthly Cost |
|----------|--------------|
| ECR | ~$0.10 (storage) |
| ALB | ~$16-20 |
| CloudWatch Logs | ~$0.50 |
| ECS (Fargate) | ~$15-30 (varies by usage) |

**Total: ~$32-50/month** (varies by usage and region)

## Troubleshooting

### Common Issues

**Issue:** Terraform can't authenticate
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Reconfigure if needed
aws configure
```

**Issue:** ECS task fails to start
```bash
# Check logs
aws logs tail /ecs/employee-management-api --follow

# Describe task
aws ecs describe-tasks --cluster employee-api-cluster
```

### Debug Commands

```bash
# List all resources
terraform state list

# Show specific resource
terraform state show aws_ecs_cluster.app

# Verify configuration
terraform validate
```

## Next Steps

1. Review `DEPLOYMENT.md` for full deployment guide
2. Configure GitHub Actions CI/CD
3. Set up monitoring with CloudWatch
4. Enable HTTPS with ACM certificate

## Support

For issues, see `DEPLOYMENT.md#troubleshooting`
