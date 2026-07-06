# DeployMate - Quick Start Guide

Get up and running with DeployMate in minutes.

## Prerequisites

- Docker Desktop installed
- AWS Account (for cloud deployment)
- GitHub Account (for CI/CD)
- Node.js 18+ (for local development)

## Quick Deploy (Local)

```bash
# Navigate to week2
cd week2

# Build Docker image
docker build -t employee-management-api:latest .

# Run locally
docker run -p 3000:3000 -e JWT_SECRET=test123 employee-management-api:latest

# Test
curl http://localhost:3000/
```

## Cloud Deployment (Minimal)

```bash
# 1. Configure AWS credentials
aws configure

# 2. Navigate to terraform
cd terraform

# 3. Initialize
terraform init

# 4. Plan
terraform plan

# 5. Apply
terraform apply
```

## CI/CD Setup (Minimal)

1. Go to GitHub > Repository Settings > Secrets and variables > Actions
2. Add secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
3. Push to `main` branch

## Documentation

- **Full Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Secrets Setup**: [SECRETS_SETUP.md](SECRETS_SETUP.md)
- **Terraform Reference**: [terraform/README.md](terraform/README.md)

## What Was Created

| File | Purpose |
|------|---------|
| `Dockerfile` | Container configuration |
| `.github/workflows/deploy.yml` | CI/CD pipeline |
| `terraform/` | Infrastructure as code |
| `DEPLOYMENT.md` | Complete deployment guide |
| `SECRETS_SETUP.md` | Secrets management guide |

## Next Steps

1. Review [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps
2. Test locally with Docker
3. Configure GitHub secrets
4. Deploy to AWS with Terraform

## Support

Check [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting) for troubleshooting.
