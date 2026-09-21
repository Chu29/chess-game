# Chess Platform Production Deployment Guide

This guide provides end-to-end instructions for deploying all services in the Chess Game platform.

---

## Architecture Overview

```mermaid
flowchart TD
    subgraph Client Layer
        Web["🌐 Web Showcase (React/Vite)<br/>Render Static Site / Vercel"]
        MobileWeb["📱 Mobile Web (Expo Web)<br/>Render Static Site / Vercel"]
        MobileNative["📲 Native Mobile (Android/iOS)<br/>Expo EAS Build"]
    end

    subgraph Render Cloud
        API["⚙️ Backend API & WebSockets (NestJS)<br/>Render Web Service (Docker)"]
        Stockfish["♟️ Stockfish Engine (Linux UCI)"]
        Keycloak["🔐 Keycloak 26.1 Auth Server<br/>Render Web Service (Docker)"]
        Postgres[("🐘 Managed PostgreSQL<br/>Render PostgreSQL")]
    end

    subgraph External APIs
        Gemini["✨ Google Gemini API"]
    end

    Web -->|CTA Links| MobileWeb
    MobileWeb -->|REST & WebSockets| API
    MobileNative -->|REST & WebSockets| API
    API -->|Prisma ORM| Postgres
    API -->|JWT/JWKS Validation| Keycloak
    API -->|UCI Spawn| Stockfish
    API -->|AI Hints| Gemini
```

---

## Option 1: Automated Deployment via Render Blueprint (Recommended)

Render provides **Blueprints** (`render.yaml`) to provision all interconnected services with a single click.

### Steps:

1. Push your latest code including [`render.yaml`](../render.yaml) to your GitHub/GitLab repository.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Blueprint**.
4. Connect your `chess-game` repository.
5. Render will detect [`render.yaml`](../render.yaml) and display the services to be created:
   - `chess-postgres` (PostgreSQL Database)
   - `chess-keycloak` (Docker Web Service)
   - `chess-api` (Docker Web Service with WebSockets)
   - `chess-web` (Static Site for Landing Page)
   - `chess-mobile-web` (Static Site for Mobile Web Play)
6. Click **Apply**.
7. In the `chess-api` environment settings, add your `GEMINI_API_KEY` for the AI Coach.
8. Once the database is provisioned, run Prisma migrations (see [Database Migrations](#database-migrations)).

---

## Option 2: Manual Step-by-Step Deployment on Render

If you prefer to configure each service manually via the Render UI:

### Step 1: Deploy PostgreSQL Database

1. Go to **New +** -> **PostgreSQL**.
2. **Name**: `chess-postgres`.
3. **Database**: `chess_game`.
4. **User**: `postgres`.
5. **Region**: Choose a region close to your users (e.g., `Oregon`).
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (for Render services) and **External Database URL** (for local CLI access).

---

### Step 2: Deploy Keycloak Authentication

1. Go to **New +** -> **Web Service**.
2. Connect your repository.
3. Select **Docker** runtime.
4. **Name**: `chess-keycloak`.
5. **Dockerfile Path**: `keycloak/Dockerfile`.
6. **Docker Context**: `keycloak`.
7. Configure Environment Variables:
   | Key                           | Value               | Notes                               |
   | :---------------------------- | :------------------ | :---------------------------------- |
   | `KC_BOOTSTRAP_ADMIN_USERNAME` | `admin`             | Keycloak admin user                 |
   | `KC_BOOTSTRAP_ADMIN_PASSWORD` | `<secure-password>` | Keycloak admin password             |
   | `KC_HEALTH_ENABLED`           | `true`              | Health check endpoint               |
   | `KC_HTTP_ENABLED`             | `true`              | Enables HTTP behind reverse proxy   |
   | `KC_HOSTNAME_STRICT`          | `false`             | Accepts Render dynamic hostname     |
   | `KC_PROXY_HEADERS`            | `xforwarded`        | Handles SSL termination from Render |
   | `PORT`                        | `8080`              | Port Keycloak binds to              |
8. Click **Create Web Service**.
9. Note down the public URL: `https://chess-keycloak.onrender.com`.

---

### Step 3: Deploy Backend API (`apps/api`)

1. Go to **New +** -> **Web Service**.
2. Connect your repository.
3. Select **Docker** runtime.
4. **Name**: `chess-api`.
5. **Dockerfile Path**: `apps/api/Dockerfile`.
6. **Docker Context**: `.` (root directory, required for monorepo dependencies).
7. Configure Environment Variables:
   | Key                            | Value                                              | Notes                               |
   | :----------------------------- | :------------------------------------------------- | :---------------------------------- |
   | `NODE_ENV`                     | `production`                                       | Production mode                     |
   | `PORT`                         | `3000`                                             | Render assigns port                 |
   | `DATABASE_URL`                 | _Reference `chess-postgres` internal URL_          | Auto-linked if using Blueprint      |
   | `KEYCLOAK_URL`                 | `https://chess-keycloak.onrender.com`              | Keycloak base URL                   |
   | `KEYCLOAK_REALM`               | `chess`                                            | Configured realm                    |
   | `KEYCLOAK_ISSUER`              | `https://chess-keycloak.onrender.com/realms/chess` | Token issuer URL                    |
   | `KEYCLOAK_API_CLIENT_ID`       | `chess-api`                                        | Pre-configured in realm export      |
   | `KEYCLOAK_API_CLIENT_SECRET`   | `chess-api-secret`                                 | Pre-configured in realm export      |
   | `KEYCLOAK_ADMIN_CLIENT_ID`     | `chess-admin`                                      | Pre-configured in realm export      |
   | `KEYCLOAK_ADMIN_CLIENT_SECRET` | `chess-admin-secret`                               | Pre-configured in realm export      |
   | `STOCKFISH_PATH`               | `/usr/games/stockfish`                             | Installed via Docker apt package    |
   | `GEMINI_API_KEY`               | `<your-google-gemini-key>`                         | Optional: for AI coach explanations |
8. Click **Create Web Service**.

---

### Step 4: Run Database Migrations

Once `chess-postgres` and `chess-api` are created, apply Prisma migrations:

#### From your local machine:

```bash
# Set your DATABASE_URL to the External Connection String from Render:
export DATABASE_URL="postgresql://postgres:password@dpg-xxx.oregon-postgres.render.com/chess_game"

# Run migrations
cd apps/api
npx prisma migrate deploy
```

#### Or from Render Shell:

In the Render dashboard for `chess-api`, navigate to the **Shell** tab and run:

```bash
npx prisma migrate deploy
```

---

### Step 5: Deploy Web Landing Page (`apps/web`)

1. Go to **New +** -> **Static Site**.
2. Connect your repository.
3. **Name**: `chess-web`.
4. **Build Command**: `npm run build --filter=web`
5. **Publish Directory**: `apps/web/dist`
6. Add Environment Variable:
   - `VITE_MOBILE_APP_URL`: `https://chess-mobile-web.onrender.com` (or your mobile web app URL).
7. Click **Create Static Site**.

---

## Deploying the Mobile Application (`apps/mobile`)

### Option A: Mobile Web App (Host on Render or Vercel)

You can deploy the Expo application to the web so players can play directly in their browsers without installing an app:

1. Go to **New +** -> **Static Site** on Render.
2. **Build Command**: `cd apps/mobile && npx expo export -p web`
3. **Publish Directory**: `apps/mobile/dist`
4. **Environment Variables**:
   - `EXPO_PUBLIC_API_URL`: `https://chess-api.onrender.com/api/v1`
5. Click **Create Static Site**.

### Option B: Native Mobile Builds (iOS & Android via EAS)

To generate `.apk` (Android) and `.ipa` (iOS) binaries:

1. Install Expo Application Services CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Navigate to the mobile directory and configure EAS:
   ```bash
   cd apps/mobile
   eas build:configure
   ```
4. Set the production environment secret:
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://chess-api.onrender.com/api/v1
   ```
5. Trigger production builds:
   ```bash
   # Build Android APK / AAB
   eas build --platform android --profile production

   # Build iOS IPA
   eas build --platform ios --profile production
   ```

---

## Post-Deployment Checklist

- [ ] **Database Connectivity**: Verify API connects to Postgres on startup without `PrismaClientInitializationError`.
- [ ] **Keycloak Endpoints**: Access `https://chess-keycloak.onrender.com/realms/chess/.well-known/openid-configuration` in browser to confirm realm is loaded.
- [ ] **WebSockets**: Join a game and ensure Socket.IO connects via `wss://chess-api.onrender.com/game`.
- [ ] **Stockfish AI**: Start a Player vs AI game and confirm AI plays moves within 1–2 seconds.
- [ ] **AI Coach**: Click "Get Hint" during an active match to verify Gemini generates natural language advice.
