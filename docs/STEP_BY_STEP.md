# Step-by-Step Guide

This guide walks you through running the Finance Manager app locally, with Docker Compose, on Kubernetes (kind), and deploying to Azure (AKS + ACR + Postgres) with CI/CD.

## 0) Prerequisites
- macOS (Linux/Windows similar with equivalent tools)
- Git
- Node.js 20 and npm
- Docker Desktop

Optional (for Kubernetes):
- Homebrew
- kind
- kubectl
- kustomize
- Ansible

Install optional tools:
```bash
brew install kind kubectl kustomize ansible
```

## 0.5) Set up PostgreSQL and DATABASE_URL
Pick ONE of the following:

- Option A: Docker (easiest)
```bash
# start only the database container
cd /Users/offx.all3n/projects/DevOps
docker compose up -d db

# set DATABASE_URL for your shell session
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance?schema=public"

# (optional) persist to .env
printf 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finance?schema=public\n' > .env
```

- Option B: Local Postgres (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16

# create database if missing
createdb finance || true

# set DATABASE_URL
export DATABASE_URL="postgresql://localhost:5432/finance?schema=public"
# or include user/password if you configured them
```

Run Prisma once DB is reachable:
```bash
cd /Users/offx.all3n/projects/DevOps
npx prisma generate
npx prisma migrate dev --name init
```

---
## 1) Run locally (no containers)
```bash
cd /Users/offx.all3n/projects/DevOps
npm install
# ensure DATABASE_URL is set and DB is running (see 0.5)
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000

---
## 2) Run with Docker Compose
```bash
cd /Users/offx.all3n/projects/DevOps
docker compose up -d --build
```
Open http://localhost:3000

Stop containers:
```bash
docker compose down
```

---
## 3) Run on Kubernetes (kind)
Create cluster and deploy via Ansible playbook:
```bash
cd /Users/offx.all3n/projects/DevOps
ansible-playbook ansible/playbook.yml
```
Check status:
```bash
kubectl get pods
kubectl get svc
```
(Optional) Add Ingress later for a browser-accessible URL.

Delete kind cluster:
```bash
kind delete cluster --name finance
```

---
## 4) Azure deployment (Terraform + AKS + ACR + Postgres)
Note: Azure resources can incur costs. Choose small SKUs and destroy when done.

Authenticate and select subscription:
```bash
az login
az account set --subscription "<SUBSCRIPTION_ID>"
```
Provision infrastructure:
```bash
cd /Users/offx.all3n/projects/DevOps/infra/terraform/azure
terraform init
terraform apply -auto-approve
```
Copy outputs:
- ACR login server (e.g., `yourregistry.azurecr.io`)
- Postgres connection string (use as `DATABASE_URL`)

Get AKS credentials:
```bash
RG=finance-rg
AKS=finance-aks
az aks get-credentials -g $RG -n $AKS --overwrite-existing
```
Set image registry in Kustomize overlay and deploy:
```bash
ACR=yourregistry.azurecr.io
sed -i '' "s#REPLACE_WITH_ACR#${ACR}#g" /Users/offx.all3n/projects/DevOps/k8s/overlays/azure/kustomization.yaml
kubectl apply -k /Users/offx.all3n/projects/DevOps/k8s/overlays/azure
```
Create database secret:
```bash
kubectl create secret generic finance-secrets \
  --from-literal=DATABASE_URL="postgresql://<user>:<pass>@<fqdn>:5432/finance?sslmode=require" \
  -o yaml --dry-run=client | kubectl apply -f -
```

Build/push image (optional; CI will also do this):
```bash
az acr login --name $ACR
docker build -t $ACR/finance-app:latest /Users/offx.all3n/projects/DevOps
docker push $ACR/finance-app:latest
```

---
## 5) CI/CD on GitHub
Repository secrets required:
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
- `AZURE_ACR_LOGIN_SERVER` (e.g., `yourregistry.azurecr.io`)
- `AZURE_AKS_RESOURCE_GROUP` (e.g., `finance-rg`)
- `AZURE_AKS_CLUSTER_NAME` (e.g., `finance-aks`)

Flow:
- Push to `main` → builds app, pushes image to ACR, deploys to AKS.

---
## 6) Verify and troubleshoot
```bash
kubectl get pods -A
kubectl logs deployment/finance-app -f
kubectl describe deployment finance-app
```
Check Service:
```bash
kubectl get svc
```

---
## 7) Clean up
Local Docker:
```bash
docker compose down -v
```
kind cluster:
```bash
kind delete cluster --name finance
```
Azure resources:
```bash
cd /Users/offx.all3n/projects/DevOps/infra/terraform/azure
terraform destroy -auto-approve
```

---
## Endpoints
- App: `/` (home)
- Health: `/api/health`
- APIs: `/api/accounts`, `/api/categories`, `/api/transactions`

This guide covers end-to-end setup without paid services by default; Azure section may incur minimal costs while resources exist.
