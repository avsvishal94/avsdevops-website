# AVSDevOps Website — Deployment Guide

## Project Structure

```
avsdevops-website/
├── index.html              # Main landing page
├── css/style.css           # Design system
├── js/main.js              # Interactive features
├── pages/                  # Sub-pages (curriculum, contact, etc.)
├── icons/                  # SVG tool icons
├── brand_assets/           # Logo + brand guidelines
├── bg_images/              # Hero background image
├── api/health.js           # Vercel serverless health endpoint
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # Docker Compose for local dev
├── nginx.conf              # Production nginx config
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
├── vercel.json             # Vercel deployment config
└── .vercelignore           # Files excluded from Vercel
```

---

## 1. Docker — Local Build & Run

```bash
# Build the image
docker build -t avsdevops-website:latest .

# Run with Docker Compose (recommended)
docker compose up -d --build

# Or run standalone
docker run -p 8080:8080 --name avsdevops-web avsdevops-website:latest

# Verify
curl http://localhost:8080/health
# → {"status":"ok"}

# Stop
docker compose down
```

---

## 2. Local Kubernetes (Minikube)

### Prerequisites
- Docker Desktop running
- minikube installed (`brew install minikube` or `choco install minikube`)
- kubectl installed

### Deploy

```bash
# Start minikube
minikube start --driver=docker

# Load your local Docker image into minikube
minikube image load avsdevops-website:latest

# Apply all K8s manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/

# Check status
kubectl get all -n avsdevops

# Port-forward to access locally
kubectl port-forward -n avsdevops svc/avsdevops-website 8080:80

# Open http://localhost:8080
```

### With Ingress (optional)

```bash
# Enable ingress addon
minikube addons enable ingress

# Add to /etc/hosts (or C:\Windows\System32\drivers\etc\hosts)
# <minikube-ip>  avsdevops.local
echo "$(minikube ip)  avsdevops.local" | sudo tee -a /etc/hosts

# Access at http://avsdevops.local
```

### Teardown

```bash
kubectl delete namespace avsdevops
minikube stop
```

---

## 3. GitHub Pages — Production Hosting

Auto-deploys on every push to `main` via GitHub Actions.

### First-time Setup

1. Create a new repo on GitHub (e.g., `avsdevops-website`)
2. Push your code:

```bash
cd avsdevops-website
git init
git add .
git commit -m "Initial commit — AVSDevOps website"
git branch -M main
git remote add origin https://github.com/avsvishal94/avsdevops-website.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to your repo → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow at `.github/workflows/deploy.yml` will auto-trigger on push

4. The site will be live at `https://YOUR_USERNAME.github.io/avsdevops-website/`
   (or at `avsdevops.com` once DNS is configured — see below)

---

## 4. GoDaddy DNS → GitHub Pages (avsdevops.com)

### Step 1: Configure GoDaddy DNS
1. Log into https://dcc.godaddy.com → **DNS** for avsdevops.com
2. **Delete** any existing A records pointing to GoDaddy parking
3. Add these records:

| Type  | Name | Value                        | TTL  |
|-------|------|------------------------------|------|
| A     | @    | 185.199.108.153              | 600  |
| A     | @    | 185.199.109.153              | 600  |
| A     | @    | 185.199.110.153              | 600  |
| A     | @    | 185.199.111.153              | 600  |
| CNAME | www  | avsvishal94.github.io        | 600  |

> These are GitHub's official Pages IPs.

### Step 2: Add domain in GitHub
1. Go to your repo → **Settings** → **Pages**
2. Under **Custom domain**, enter `avsdevops.com` → **Save**
3. Check **Enforce HTTPS** (may take a few minutes for the cert to provision)

### Step 3: Verify
- The `CNAME` file in your repo root already contains `avsdevops.com`
- DNS propagation takes 5–30 minutes
- Once done, both `avsdevops.com` and `www.avsdevops.com` will serve your site over HTTPS

---

## npm Scripts Reference

| Command                | Description                        |
|------------------------|------------------------------------|
| `npm run docker:build` | Build Docker image                 |
| `npm run docker:up`    | Start with Docker Compose          |
| `npm run docker:down`  | Stop Docker Compose                |
| `npm run k8s:deploy`   | Deploy to local K8s                |
| `npm run k8s:status`   | Check K8s pod/service status       |
| `npm run k8s:delete`   | Tear down K8s namespace            |
