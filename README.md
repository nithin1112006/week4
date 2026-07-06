# DeployMate - CI/CD & Cloud Deployment Project

A comprehensive deployment solution for the Employee Management API using Docker, Terraform, and GitHub Actions on AWS.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Part 1: Containerization](#part-1-containerization)
- [Part 2: CI/CD Pipeline](#part-2-ci-cd-pipeline)
- [Part 3: Cloud Deployment](#part-3-cloud-deployment)
- [Part 4: Infrastructure as Code](#part-4-infrastructure-as-code)
- [Part 5: Security Best Practices](#part-5-security-best-practices)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [Bonus Features](#bonus-features)
- [Screenshots](#screenshots)
- [License](#license)

## 🚀 Overview

This project implements a production-ready CI/CD pipeline and cloud deployment for the Employee Management API.

**Stack:**
- **Backend**: Node.js + Express.js + GraphQL + JWT Auth
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (ECS, ECR, ALB, IAM, CloudWatch)
- **IaC**: Terraform
- **Monitoring**: CloudWatch Logs (optional: CloudWatch Metrics, Prometheus)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Actions CI/CD                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Build      │  │   Docker     │  │   Terraform  │          │
│  │   & Test     │  │   Push       │  │   Apply        │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                                │
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │  Docker Hub     │     │    AWS ECR      │                    │
│  │  / GitHub       │────▶│    Registry     │                    │
│  │  Packages       │     │                 │                    │
│  └─────────────────┘     └─────────────────┘                    │
│                                            ┌────────────────┐   │
│                                            │   Application  │   │
│  ┌─────────────────┐     ┌─────────────────┼───── Load     ───┤   │
│  │  GitHub Actions │────▶│    ECS Cluster  │Balancer (ALB) │   │
│  │  (CI/CD)        │     │                 └────────────────┘   │
│  └─────────────────┘     └─────────────────┘                    │
│                                            ┌────────────────┐   │
│                                            │  CloudWatch    │   │
│  ┌─────────────────┐     ┌─────────────────┼───── Logs      ───┤   │
│  │  Terraform      │────▶│  Infrastructure │  Metrics       │   │
│  │  (IaC)          │     │  Provisioning   └────────────────┘   │
│  └─────────────────┘     └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### AWS Setup

1. **AWS Account**
   - Sign up at https://aws.amazon.com

2. **IAM User**
   - Create IAM user with programmatic access
   - Attach policies:
     - AmazonECS_FullAccess
     - AmazonEC2FullAccess
     - AmazonS3FullAccess
     - IAMFullAccess

3. **AWS CLI**
   ```bash
   # Install AWS CLI
   # Windows (using scoop)
   scoop install aws
   
   # Or download from:
   # https://aws.amazon.com/cli/
   
   # Configure
   aws configure
   ```

4. **Terraform**
   ```bash
   # Windows (using scoop)
   scoop install terraform
   
   # Or download from:
   # https://www.terraform.io/downloads
   ```

### GitHub Setup

1. **GitHub Repository**
   - Create a new repository
   - Push your code

2. **GitHub Actions**
   - No additional setup needed (enabled by default)

### Local Setup

1. **Docker Desktop**
   - Download from https://www.docker.com/products/docker-desktop

2. **Node.js**
   - Version 18+
   - Download from https://nodejs.org

## 🚀 Quick Start

### 1. Containerize the Application

```bash
# Navigate to week2 directory
cd week2

# Build Docker image
docker build -t employee-management-api:latest .

# Test locally
docker run -p 3000:3000 -e JWT_SECRET=test employee-management-api:latest
```

### 2. Push to Docker Hub

```bash
# Login
docker login

# Tag and push
docker tag employee-management-api:latest <username>/employee-management-api:latest
docker push <username>/employee-management-api:latest
```

### 3. Configure GitHub Secrets

1. Go to your repository Settings
2. Navigate to Secrets and variables > Actions
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |

4. Add the following variables:

| Variable Name | Description |
|---------------|-------------|
| `AWS_ACCOUNT_ID` | Your 12-digit AWS account ID |
| `AWS_REGION` | AWS region (default: us-east-1) |

### 4. Deploy to AWS

```bash
# Navigate to terraform directory
cd ../terraform

# Initialize
terraform init

# Review changes
terraform plan

# Deploy
terraform apply
```

### 5. Verify Deployment

```bash
# Get the load balancer URL
terraform output load_balancer_url

# Test the API
curl http://<load-balancer-url>/
```

## 📁 Project Structure

```
week4/
├── week2/                          # Backend API
│   ├── src/
│   │   ├── app.js                  # Express app
│   │   ├── server.js               # Server entry
│   │   ├── controllers/            # Request handlers
│   │   ├── models/                 # Database models
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Express middleware
│   │   ├── services/               # Business logic
│   │   ├── graphql/                # GraphQL schema
│   │   └── utils/                  # Utilities
│   ├── Dockerfile                  # Docker configuration
│   ├── docker-compose.yml          # Local development
│   ├── .dockerignore               # Docker ignore rules
│   ├── package.json                # Dependencies
│   └── README.md                   # API documentation
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD Pipeline
│
├── terraform/                      # Infrastructure as Code
│   ├── main.tf                     # Main configuration
│   ├── variables.tf                # Variables
│   ├── outputs.tf                  # Outputs
│   ├── provider.tf                 # Provider config
│   ├── terraform.tfvars.example    # Variable example
│   ├── .gitignore                  # Terraform ignore
│   └── task-definition.json        # ECS task definition
│
├── DEPLOYMENT.md                   # Deployment guide
├── SECRETS_SETUP.md                # Secrets guide
└── README.md                       # This file
```

## 🐳 Part 1: Containerization

### Dockerfile Features

- **Multi-stage build**: Optimize image size
- **Non-root user**: Security best practice
- **Health check**: Container monitoring
- **Production dependencies only**: Smaller image
- **Alpine base**: Minimal footprint

### Build Commands

```bash
# Build image
docker build -t employee-management-api:latest .

# Build with specific tag
docker build -t employee-management-api:v1.0.0 .

# Build with cache
docker build --cache-from employee-management-api:latest .
```

### Run Commands

```bash
# Run in background
docker run -d -p 3000:3000 employee-management-api:latest

# Run with environment variables
docker run -d -p 3000:3000 \
  -e JWT_SECRET=secret_key \
  employee-management-api:latest

# Run with volumes
docker run -d -p 3000:3000 \
  -v ./logs:/usr/src/app/logs \
  -v ./database.sqlite:/usr/src/app/database.sqlite \
  employee-management-api:latest
```

## 🔄 Part 2: CI/CD Pipeline

### Pipeline Stages

1. **Build & Test**
   - Install dependencies
   - Run linter
   - Run tests

2. **Docker Build & Push**
   - Build Docker image
   - Push to Docker Hub
   - Push to AWS ECR

3. **Terraform Init**
   - Initialize Terraform
   - Plan infrastructure changes

4. **Deploy to ECS**
   - Update ECS service
   - Blue-green deployment

5. **Notification**
   - Success/Failure alert

### GitHub Actions Workflow

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:  # Manual trigger
```

### Trigger Pipeline

```bash
# Push to trigger
git push origin main

# Or manually trigger
gh workflow run deploy.yml
```

## ☁️ Part 3: Cloud Deployment

### Resources Provisioned

| Resource | Purpose | Cost Estimate |
|----------|---------|---------------|
| ECS Cluster | Container orchestration | Free |
| ECS Service | Run tasks | Free |
| ECR Repository | Docker registry | Free (storage ~$0.10/month) |
| ALB | Load balancing | ~$16-20/month |
| IAM Roles | Permissions | Free |
| CloudWatch Logs | Logging | ~$0.50/month |

### AWS Services

#### ECS (Elastic Container Service)

- Container orchestration
- Auto-scaling
- Service discovery

#### ECR (Elastic Container Registry)

- Private Docker registry
- Image scanning
- Integration with ECS

#### ALB (Application Load Balancer)

- HTTP/HTTPS load balancing
- Health checks
- SSL termination

#### IAM (Identity and Access Management)

- Roles for ECS
- Least privilege access
- Service linked roles

#### CloudWatch

- Log collection
- Metrics
- Alarms (optional)

## 🛠️ Part 4: Infrastructure as Code

### Terraform Configuration

#### main.tf

Provisions:
- VPC & Subnets
- Security Groups
- ECR Repository
- ECS Cluster
- ECS Task Definition
- ECS Service
- ALB
- IAM Roles

#### variables.tf

Configurable parameters:
- `aws_region` - AWS region
- `environment` - Environment name
- `project_name` - Project identifier
- `docker_image` - Docker image URI
- `desired_count` - Task count
- `cpu` - CPU units
- `memory` - Memory (MiB)

#### outputs.tf

Returns:
- Cluster name
- Service name
- Task definition ARN
- Load balancer URL
- ECR repository URL

### Terraform Commands

```bash
# Initialize
terraform init

# Validate
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Apply specific target
terraform apply -target=aws_ecs_service.app

# Destroy
terraform destroy

# Show state
terraform state list

# Show output
terraform output
```

## 🔒 Part 5: Security Best Practices

### Secrets Management

✅ **DO:**
- Use environment variables
- Store in AWS Secrets Manager
- Rotate secrets regularly
- Use IAM roles instead of keys
- Enable encryption at rest

❌ **DON'T:**
- Never commit `.env` files
- Never hardcode secrets
- Never push secrets to GitHub
- Never use default passwords

### Security Checklist

- [x] Non-root Docker user
- [x] Environment variables for secrets
- [x] IAM roles with least privilege
- [x] HTTPS in production
- [x] Rate limiting
- [x] Security headers (Helmet)
- [x] CORS configuration
- [x] SQL injection prevention
- [x] XSS prevention
- [x] Security scanning in CI/CD

### Security Features

#### Docker Security

```dockerfile
# Non-root user
USER nodejs

# Health check
HEALTHCHECK ...

# Minimal image
FROM node:18-alpine
```

#### AWS Security

```hcl
# Least privilege IAM
aws_iam_role_policy_attachment "read_only"

# Encryption at rest
encrypt = true

# Security groups
aws_security_group "restricted_ports"
```

## 📚 Deployment Guide

### Complete Deployment Steps

1. **Containerize Application** → `DEPLOYMENT.md: Part 1`
2. **CI/CD Pipeline** → `DEPLOYMENT.md: Part 2`
3. **Cloud Deployment** → `DEPLOYMENT.md: Part 3`
4. **Infrastructure as Code** → `DEPLOYMENT.md: Part 4`
5. **Security** → `DEPLOYMENT.md: Part 5`

### Deployment Checklist

- [ ] Docker image built and tested
- [ ] Docker Hub account created
- [ ] Docker image pushed to registry
- [ ] GitHub secrets configured
- [ ] AWS credentials configured
- [ ] Terraform initialized
- [ ] Infrastructure planned
- [ ] Infrastructure applied
- [ ] Service deployed
- [ ] API tested
- [ ] Logs verified
- [ ] Monitoring configured

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Docker Build Fails

```bash
# Check Dockerfile
ls -la Dockerfile

# Verify Docker daemon
docker info

# Build with verbose output
docker build --progress=plain .
```

#### Issue 2: Terraform Authentication Error

```bash
# Verify credentials
aws sts get-caller-identity

# Reconfigure
aws configure
```

#### Issue 3: ECS Task Fails to Start

```bash
# Check logs
aws logs tail /ecs/employee-management-api --follow

# Describe task
aws ecs describe-tasks \
  --cluster employee-api-cluster \
  --tasks <task-id>
```

#### Issue 4: CI/CD Pipeline Fails

```bash
# Check GitHub Actions logs
# Go to Actions tab > Workflow run > Job logs

# Verify secrets are configured
# Settings > Secrets and variables > Actions
```

## 🎁 Bonus Features

### Kubernetes Deployment

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: employee-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: employee-api
  template:
    metadata:
      labels:
        app: employee-api
    spec:
      containers:
      - name: employee-api
        image: employee-management-api:latest
        ports:
        - containerPort: 3000
```

### Docker Hub Push

```bash
# Push to Docker Hub
docker push <username>/employee-management-api:latest
```

### HTTPS Configuration

```hcl
# Add ACM certificate
resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  validation_method = "DNS"
}

# Update ALB listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.app.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.main.arn
  # ...
}
```

### Monitoring Setup

```bash
# CloudWatch Logs
aws logs tail /ecs/employee-management-api --follow

# CloudWatch Metrics
aws cloudwatch list-metrics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization

# Prometheus (optional)
# Configure Prometheus to scrape ECS tasks
```

### Auto-Deployment

```yaml
# Enable auto-deploy on push
on:
  push:
    branches:
      - main
```

## 📸 Screenshots

### GitHub Actions Pipeline

```
✅ Build and Test
✅ Build and Push Docker Image  
✅ Terraform Init
✅ Deploy to ECS
✅ Notification
```

### Running Application

```json
{
  "message": "Employee Management API",
  "docs": "/api-docs",
  "graphql": "/graphql"
}
```

### Cloud Resources

```
ECS Cluster: employee-api-cluster
  └─ Service: employee-api-service
     └─ Task Definition: employee-api-task
        └─ Load Balancer: employee-api-alb
```

### Terraform Execution

```
Terraform has been successfully initialized!

Terraform will perform the following actions:

  # aws_ecs_cluster.app will be created
  + resource "aws_ecs_cluster" "app" {
      + arn                    = (known after apply)
      + id                     = (known after apply)
      + name                   = "employee-management-api-cluster"
    }

Plan: 10 to add, 0 to change, 0 to destroy.
```

## 📄 License

MIT License

## 📞 Support

For issues:
1. Check GitHub Actions logs
2. Check CloudWatch logs
3. Review ECS task logs
4. Check Docker container logs

## 🎯 Key Achievements

✅ **Containerization**: Dockerized application with multi-stage build  
✅ **CI/CD**: Automated pipeline with GitHub Actions  
✅ **Cloud Deployment**: Production-ready AWS ECS deployment  
✅ **IaC**: Infrastructure defined as code with Terraform  
✅ **Security**: Secrets management, least privilege, encryption  
✅ **Documentation**: Comprehensive deployment guide  
✅ **Monitoring**: CloudWatch logs integration  

---

**Built with 🚀 for production deployment**
