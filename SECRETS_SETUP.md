# Secrets Setup Guide

This guide explains how to securely manage secrets for the DeployMate project.

## AWS Secrets Setup

### Step 1: Create IAM User

1. Go to IAM Console > Users > Add user
2. Select "Programmatic access"
3. Attach policies:
   - AmazonECS_FullAccess
   - AmazonEC2FullAccess
   - AmazonS3FullAccess
   - IAMFullAccess
4. Download CSV with credentials

### Step 2: Configure AWS CLI

```bash
# Configure with your credentials
aws configure

# Enter when prompted:
AWS Access Key ID: [your_access_key]
AWS Secret Access Key: [your_secret_key]
Default region name: us-east-1
Default output format: json
```

### Step 3: Store Secrets in GitHub Actions

Go to your repository: Settings > Secrets and variables > Actions > New repository secret

| Secret Name | How to Get | Description |
|-------------|------------|-------------|
| `AWS_ACCESS_KEY_ID` | From IAM user | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | From IAM user | Your AWS secret key |

### Step 4: Store Secrets in AWS Secrets Manager (Recommended)

```bash
# Create secrets.json file
cat > secrets.json << 'EOF'
{
  "JWT_SECRET": "your_very_secret_jwt_key_min_32_chars",
  "DB_PASSWORD": "your_database_password",
  "API_KEY": "your_api_key"
}
EOF

# Create secret in AWS Secrets Manager
aws secretsmanager create-secret \
  --name employee-api/secrets \
  --description "Employee API secrets" \
  --secret-string file://secrets.json

# Clean up
rm secrets.json

# Verify secret created
aws secretsmanager list-secrets

# Get secret value (for verification only)
aws secretsmanager get-secret-value \
  --secret-id employee-api/secrets \
  --query SecretString \
  --output text
```

### Step 5: Update Terraform to Use Secrets Manager

Modify `terraform/main.tf`:

```hcl
# Data source to fetch secrets
data "aws_secretsmanager_secret" "app" {
  name = "employee-api/secrets"
}

data "aws_secretsmanager_secret_version" "app" {
  secret_id = data.aws_secretsmanager_secret.app.id
}

# In container_definitions, add:
environment = [
  {
    name  = "JWT_SECRET"
    value = jsondecode(data.aws_secretsmanager_secret_version.app.secret_string).JWT_SECRET
  }
]
```

## Docker Hub Secrets Setup

### Step 1: Create Docker Hub Account

1. Go to https://hub.docker.com
2. Create an account
3. Verify your email

### Step 2: Generate Access Token

1. Go to Account Settings > Security
2. Click "New Access Token"
3. Give it a name (e.g., "GitHubActions")
4. Select "Read, Write, Delete" permissions
5. Click "Generate"
6. Copy the token (you won't see it again!)

### Step 3: Add to GitHub Secrets

Go to: Settings > Secrets and variables > Actions > New repository secret

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | The access token you created | Docker Hub access token |

## Best Practices

### 1. Use Environment-Specific Secrets

```bash
# Create separate secrets for each environment
# Staging
aws secretsmanager create-secret \
  --name employee-api/staging/secrets \
  --secret-string '{"JWT_SECRET":"staging_secret"}'

# Production
aws secretsmanager create-secret \
  --name employee-api/production/secrets \
  --secret-string '{"JWT_SECRET":"production_secret"}'
```

### 2. Rotate Secrets Regularly

```bash
# Update secret
aws secretsmanager update-secret \
  --secret-id employee-api/secrets \
  --secret-string file://new-secrets.json
```

### 3. Restrict Access with IAM Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:employee-api/*"
      ]
    }
  ]
}
```

### 4. Never Commit Secrets

✅ **DO:**
- Use environment variables
- Use Secrets Manager
- Use CI/CD secret stores
- Rotate secrets regularly
- Encrypt at rest

❌ **DON'T:**
```bash
# NEVER do this
echo 'JWT_SECRET=mysecret' >> .env
git add .env
git commit -m "Add secrets"
```

## Verification

### Verify GitHub Secrets

```bash
# Test AWS credentials
aws sts get-caller-identity

# Should show your IAM user
# {
#   "UserId": "AID...",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/github-actions"
# }

# Test Docker Hub
docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
```

### Verify AWS Secrets Manager

```bash
# List secrets
aws secretsmanager list-secrets

# Get secret value
aws secretsmanager get-secret-value \
  --secret-id employee-api/secrets \
  --query SecretString \
  --output text
```

## Troubleshooting

### Issue: "Access Denied" for AWS

**Solution:**
- Verify IAM user has correct permissions
- Check AWS region is correct
- Ensure credentials are for correct account

### Issue: "Authentication Required" for Docker Hub

**Solution:**
- Verify DOCKERHUB_TOKEN is correct
- Check token hasn't expired
- Ensure DOCKERHUB_USERNAME is correct

### Issue: "Failed to pull image"

**Solution:**
- Verify ECR repository exists
- Check ECS task execution role has ECR permissions
- Ensure Docker image tag is correct

## Security Checklist

- [ ] Secrets stored in environment variables
- [ ] No secrets committed to git
- [ ] IAM user with least privilege
- [ ] Secrets rotated every 90 days
- [ ] AWS Secrets Manager used for production
- [ ] GitHub secrets encrypted at rest
- [ ] Access keys rotated regularly
- [ ] Secrets manager policies least privilege
- [ ] HTTPS enabled in production
- [ ] Secrets audit log enabled

## Additional Resources

- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Hub Authentication](https://docs.docker.com/docker-hub/authentication/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
