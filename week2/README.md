# Employee Management API

A comprehensive Employee Management API with JWT authentication, RBAC, GraphQL support, and production-ready features.

## Features

- 📦 Node.js & Express.js
- 🔐 JWT Authentication with refresh tokens
- 🛡️ Role-Based Access Control (RBAC)
- 📊 GraphQL API support
- 📝 Swagger/OpenAPI Documentation
- 🔄 Async processing queue
- 🔒 Security: Helmet, CORS, Rate Limiting
- 📈 Winston logging
- 🐳 Dockerized for easy deployment
- ☁️ AWS ECS deployment ready

## Environment Variables

```bash
PORT=3000
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

## Quick Start

### Docker (Recommended)

```bash
# Build the image
docker build -t employee-management-api .

# Run the container
docker run -p 3000:3000 \
  -e JWT_SECRET=your_secret_key \
  employee-management-api
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## API Endpoints

### REST API
- `GET /` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/departments` - List departments (Auth required)
- `POST /api/departments` - Create department (Manager/Admin required)
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee

### GraphQL
- `POST /graphql` - GraphQL endpoint (GraphiQL enabled)

### Documentation
- `GET /api-docs` - Swagger UI

## Deployment

### AWS ECS Deployment

1. Build and push Docker image to ECR
2. Run Terraform to provision infrastructure:
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

### CI/CD Pipeline

The project includes a GitHub Actions pipeline that:
- Builds and tests the application
- Creates Docker images
- Pushes to ECR and Docker Hub
- Deploys to AWS ECS

See `.github/workflows/deploy.yml` for details.

## Security

- Secrets are managed via environment variables
- Never commit `.env` files
- Use IAM roles for AWS access
- Enable HTTPS in production
- Regular security scanning in CI/CD

## Monitoring

- CloudWatch Logs for application logs
- ECS CloudWatch Insights for performance
- Health checks for container monitoring

## License

MIT
