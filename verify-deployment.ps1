# DeployMate - Deployment Verification Script
# This script verifies all deployment files are in place and valid

Write-Host "=== DeployMate Deployment Verification ===" -ForegroundColor Cyan
Write-Host ""

# Check if required files exist
Write-Host "[1/6] Checking required files..." -ForegroundColor Yellow

$files = @(
    "week2/Dockerfile",
    "week2/.dockerignore",
    "week2/docker-compose.yml",
    "week2/.gitignore",
    "week2/.env.example",
    "week2/README.md",
    ".github/workflows/deploy.yml",
    "terraform/main.tf",
    "terraform/variables.tf",
    "terraform/outputs.tf",
    "terraform/provider.tf",
    "terraform/terraform.tfvars.example",
    "terraform/.gitignore",
    "terraform/task-definition.json",
    "DEPLOYMENT.md",
    "SECRETS_SETUP.md",
    "README.md"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check Dockerfile syntax
Write-Host "[2/6] Checking Dockerfile syntax..." -ForegroundColor Yellow
if (Test-Path "week2/Dockerfile") {
    $dockerfile = Get-Content "week2/Dockerfile"
    $hasFrom = $dockerfile -match "^FROM"
    $hasWorkdir = $dockerfile -match "^WORKDIR"
    $hasCopy = $dockerfile -match "^COPY"
    $hasExpose = $dockerfile -match "^EXPOSE"
    $hasCmd = $dockerfile -match "^CMD"
    
    if ($hasFrom -and $hasWorkdir -and $hasCopy -and $hasExpose -and $hasCmd) {
        Write-Host "  OK: Dockerfile contains all required instructions" -ForegroundColor Green
    } else {
        Write-Host "  ISSUE: Dockerfile missing some instructions" -ForegroundColor Yellow
    }
} else {
    Write-Host "  MISSING: Dockerfile not found" -ForegroundColor Red
}

Write-Host ""

# Check GitHub Actions workflow syntax
Write-Host "[3/6] Checking GitHub Actions workflow..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    $workflow = Get-Content ".github/workflows/deploy.yml" -Raw
    $hasBuildTest = $workflow -match "build-and-test"
    $hasDockerPush = $workflow -match "build-and-push-docker"
    $hasTerraform = $workflow -match "terraform-init"
    $hasDeploy = $workflow -match "deploy-to-ecs"
    
    if ($hasBuildTest -and $hasDockerPush -and $hasTerraform -and $hasDeploy) {
        Write-Host "  OK: Workflow contains all required jobs" -ForegroundColor Green
    } else {
        Write-Host "  ISSUE: Workflow missing some jobs" -ForegroundColor Yellow
    }
} else {
    Write-Host "  MISSING: Workflow file not found" -ForegroundColor Red
}

Write-Host ""

# Check Terraform files
Write-Host "[4/6] Checking Terraform configuration..." -ForegroundColor Yellow
$terraformFiles = @("main.tf", "variables.tf", "outputs.tf", "provider.tf")
$allTerraformValid = $true
foreach ($file in $terraformFiles) {
    $path = "terraform/$file"
    if (Test-Path $path) {
        Write-Host "  OK: $file exists" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $file missing" -ForegroundColor Red
        $allTerraformValid = $false
    }
}

Write-Host ""

# Check secrets setup
Write-Host "[5/6] Checking secrets configuration..." -ForegroundColor Yellow
if (Test-Path "SECRETS_SETUP.md") {
    Write-Host "  OK: Secrets setup guide exists" -ForegroundColor Green
} else {
    Write-Host "  MISSING: Secrets setup guide missing" -ForegroundColor Red
}

Write-Host ""

# Check deployment documentation
Write-Host "[6/6] Checking deployment documentation..." -ForegroundColor Yellow
if (Test-Path "DEPLOYMENT.md") {
    Write-Host "  OK: Deployment guide exists" -ForegroundColor Green
} else {
    Write-Host "  MISSING: Deployment guide missing" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "=== Verification Summary ===" -ForegroundColor Cyan
if ($allFilesExist -and $allTerraformValid) {
    Write-Host "SUCCESS: All files are in place and ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review DEPLOYMENT.md for deployment steps"
    Write-Host "2. Configure GitHub secrets in repository settings"
    Write-Host "3. Configure AWS credentials"
    Write-Host "4. Run 'cd terraform && terraform init' to initialize"
} else {
    Write-Host "WARNING: Some files are missing or incomplete" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed deployment instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
