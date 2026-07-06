# DeployMate - Deployment Guide

This guide covers deploying the Employee Management API to AWS using Docker, Terraform, and GitHub Actions.

## Prerequisites

### AWS Setup
1. AWS Account
2. IAM User with programmatic access
3. Permissions: AmazonECS_FullAccess, AmazonEC2FullAccess, AmazonS3FullAccess, IAMFullAccess
4. AWS CLI configured

### GitHub Setup
1. GitHub Repository
2. GitHub Actions secrets configured
3. Docker Hub account (for container registry)

### Local Setup
1. Docker Desktop installed
2. Terraform installed (>= 1.0.0)
3. Node.js 18+ installed

## Part 1: Containerize the Application

### 1.1 Create Docker Image

```bash
cd week2

# Build the Docker image
docker build -t employee-management-api:latest .

# Verify the image
docker images | grep employee-management-api
```

### 1.2 Test Locally

```bash
# Run the container
docker run -d -p 3000:3000 \
  -e JWT_SECRET=test_secret_key_12345 \
  --name employee-api \
  employee-management-api:latest

# Verify it's running
docker ps | grep employee-api

# Test the API
curl http://localhost:3000/
# Expected: {"message":"Employee Management API","docs":"/api-docs","graphql":"/graphql"}

# View logs
docker logs employee-api
```

### 1.3 Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag employee-management-api:latest <your-dockerhub-username>/employee-management-api:latest

# Push to Docker Hub
docker push <your-dockerhub-username>/employee-management-api:latest
```

## Part 2: CI/CD Pipeline (GitHub Actions)

### 2.1 Configure GitHub Secrets

Go to your repository Settings > Secrets and variables > Actions > New repository secret

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | For pushing Docker images |
| `DOCKERHUB_TOKEN` | Your Docker Hub access token | For Docker Hub authentication |
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key | AWS programmatic access |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Key | AWS programmatic access |

### 2.2 Configure GitHub Variables

Go to Settings > Secrets and variables > Actions > New repository variable

Add these variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `AWS_ACCOUNT_ID` | Your 12-digit AWS account ID | ECR repository reference |
| `AWS_REGION` | us-east-1 (or your region) | AWS deployment region |

### 2.3 Enable Workflow

The workflow is already configured in `.github/workflows/deploy.yml`. To enable it:

1. Push to main or develop branch
2. Or manually trigger from GitHub Actions tab

### 2.4 Verify Pipeline

1. Go to GitHub Actions tab
2. Run the "DeployMate - CI/CD Pipeline" workflow
3. Verify all jobs pass:
   - ✅ Build and Test
   - ✅ Build and Push Docker Image
   - ✅ Terraform Init
   - ✅ Deploy to ECS

## Part 3: Cloud Deployment (AWS)

### 3.1 Manual Deployment with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Configure variables (copy from example)
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Review what will be created
terraform plan

# Deploy infrastructure
terraform apply

# Confirm with "yes" when prompted
```

### 3.2 Verify Deployment

```bash
# Get the load balancer URL
terraform output load_balancer_url

# Or check in AWS Console
# Go to ECS Console > Clusters > employee-api-cluster
# Note the Load Balancer DNS
```

### 3.3 Test Deployed API

```bash
# Test the deployed API
curl http://<load-balancer-dns>.us-east-1.elb.amazonaws.com/

# Expected response:
# {"message":"Employee Management API","docs":"/api-docs","graphql":"/graphql"}
```

Apply complete! Resources: 8 added, 0 changed, 0 destroyed.

Outputs:

cluster_name = "employee-management-api-cluster"
ecr_repository_url = "287243894965.dkr.ecr.us-east-1.amazonaws.com/employee-management-api-v2"
load_balancer_dns = "employee-management-api-alb-897244966.us-east-1.elb.amazonaws.com"
load_balancer_url = "employee-management-api-alb-897244966.us-east-1.elb.amazonaws.com"
logs_cloudwatch_group = "/ecs/employee-management-api-v2"
security_group_id = "sg-0f02deb93a564ff1a"
service_name = "employee-management-api-service"
task_definition_arn = "arn:aws:ecs:us-east-1:287243894965:task-definition/employee-management-api-task:1"
vpc_id = "vpc-055d8bc92e302c5e4"

kvnni@NITHIN MINGW64 /d/INTERN/Presidio/week4/terraform (master)
$ terraform output load_balancer_url
"employee-management-api-alb-897244966.us-east-1.elb.amazonaws.com"


## Part 4: Infrastructure as Code (Terraform)

### 4.1 Resources Provisioned

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

### 4.2 Modify Infrastructure

Edit `terraform/main.tf` to customize:

- Change `desired_count` for scaling
- Modify `cpu` and `memory` for performance
- Update `container_port` if needed
- Add HTTPS configuration

### 4.3 Update Infrastructure

```bash
cd terraform

# Make changes to .tf files
# Review changes
terraform plan

# Apply changes
terraform apply
```

### 4.4 Destroy Infrastructure

```bash
cd terraform

# Warning: This will delete all resources
terraform destroy

# Or for a full cleanup including state
terraform destroy -force
```

## Part 5: Security Best Practices

### 5.1 Secrets Management

✅ **DO:**
- Use environment variables for secrets
- Store secrets in AWS Secrets Manager or Parameter Store
- Rotate secrets regularly
- Use IAM roles instead of access keys
- Enable encryption at rest

❌ **DON'T:**
- Never commit `.env` files
- Never hardcode secrets in code
- Never push secrets to GitHub
- Never use default passwords

### 5.2 Current Setup

```bash
# Environment variables (in .env)
JWT_SECRET=your_secret_key  # Must be at least 32 characters

# AWS credentials (via environment or IAM role)
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Docker Hub credentials (via GitHub secrets)
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

### 5.3 Enhanced Security (Optional)

For production, use AWS Secrets Manager:

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name employee-api/secrets \
  --description "Employee API secrets" \
  --secret-string file://secrets.json

# Update Terraform to use Secrets Manager
# (See AWS documentation for ECS Secrets Manager integration)
```

## Part 6: Monitoring (Optional)

### 6.1 CloudWatch Logs

View application logs:

```bash
# Via AWS CLI
aws logs tail /ecs/employee-management-api --follow

# Via AWS Console
# Go to CloudWatch > Logs > /ecs/employee-management-api
```

### 6.2 CloudWatch Metrics

- ECS Task CPU/Memory utilization
- ALB request counts
- Container health status

### 6.3 CloudWatch Alarms (Optional)

Set up alarms for:
- High CPU utilization (>80%)
- Container failures
- High error rates

## Part 7: Troubleshooting

### 7.1 Common Issues

**Issue:** Docker build fails
```bash
# Verify Dockerfile exists
ls -la Dockerfile

# Check Docker daemon
docker info
```

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
aws ecs describe-tasks \
  --cluster employee-api-cluster \
  --tasks <task-id>

# Check container logs
aws logs tail /ecs/employee-management-api
```

### 7.2 Debug Commands

```bash
# List ECS tasks
aws ecs list-tasks --cluster employee-api-cluster

# Describe task
aws ecs describe-task --cluster employee-api-cluster --task <task-id>

# Check service status
aws ecs describe-service --cluster employee-api-cluster --service employee-api-service
```

## Part 8: CI/CD Best Practices

### 8.1 Pipeline Configuration

The pipeline includes:

- **Build & Test:** Verify code quality
- **Docker Build:** Create container images
- **Terraform Init:** Prepare infrastructure
- **Terraform Plan:** Preview changes
- **Terraform Apply:** Deploy infrastructure
- **Deploy to ECS:** Update service

### 8.2 Manual Triggers

Use workflow_dispatch to manually deploy:

```bash
gh workflow run deploy.yml -f environment=production
```

### 8.3 Automatic Deployment

Auto-deploy on push to main:

```yaml
on:
  push:
    branches:
      - main
```

## Part 9: Monitoring and Maintenance

### 9.1 Health Checks

The container includes a health check:

```json
{
  "test": ["CMD", "curl", "-f", "http://localhost:3000/"],
  "interval": 30,
  "timeout": 10,
  "retries": 3
}
```

### 9.2 Log Rotation

Logs are rotated automatically:
- Max file size: 5MB
- Max files: 5

### 9.3 Auto-Scaling

Modify `desired_count` in `terraform.tfvars`:

```hcl
desired_count = 2  # Run 2 instances for high availability
```

## Part 10: Cleanup

### 10.1 Destroy Everything

```bash
# Destroy Terraform resources
cd terraform
terraform destroy

# Remove Docker images
docker rmi employee-management-api:latest

# Clear GitHub cache
# Go to Settings > Actions > General > Clear cache
```

### 10.2 Partial Cleanup

```bash
# Remove only the service
terraform apply -target=aws_ecs_service.app -destroy

# Or use AWS CLI
aws ecs delete-service --cluster employee-api-cluster --service employee-api-service --force
```

## Next Steps

1. ✅ Deploy to staging environment first
2. ✅ Configure HTTPS with ACM certificate
3. ✅ Set up CI/CD auto-deployment on push
4. ✅ Configure monitoring and alerting
5. ✅ Implement blue-green deployments
6. ✅ Add database migration support

## Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Best Practices](https://docs.docker.com/develop/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues, check:
1. GitHub Actions workflow logs
2. CloudWatch logs
3. ECS task logs
4. Docker container logs

Happy deploying! 🚀
