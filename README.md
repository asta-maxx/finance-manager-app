# Finance Manager App

A full-stack finance management application built with Next.js, Prisma, PostgreSQL, Docker, and Kubernetes.

## Features
- Account management
- Transaction tracking
- Category management
- Financial reports with charts
- Professional UI with white/black/orange theme

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes (kind/AKS)
- **Infrastructure**: Terraform (Azure)
- **CI/CD**: GitHub Actions

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Set up database
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance?schema=public"
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

### Docker
```bash
docker compose up -d --build
```

### Kubernetes (Local)
```bash
# Create kind cluster
kind create cluster --name finance-cluster

# Deploy to Kubernetes
kubectl apply -k k8s/overlays/dev
```

## Deployment

See `docs/STEP_BY_STEP.md` for detailed deployment instructions.

## Azure Resources
- Resource Group: finance-rg
- AKS Cluster: finance-aks
- Container Registry: financeacr12345.azurecr.io
- PostgreSQL: finance-pg
