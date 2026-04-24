# Fly.io Deployment Guide

## Prerequisites
1. Install Fly.io CLI:
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. Login to Fly.io:
   ```bash
   flyctl auth login
   ```

## Deployment Steps

### 1. Initialize Fly.io App
```bash
cd backend
flyctl launch
```
- App name: `eslam-store-backend`
- Region: `ams` (Amsterdam) or choose nearest
- Don't deploy yet (answer 'n')

### 2. Create PostgreSQL Database
```bash
flyctl postgres create
```
- Name: `eslam-store-db`
- Region: Same as app
- Select: `Development` (free tier)

### 3. Attach Database to App
```bash
flyctl postgres attach eslam-store-db --app eslam-store-backend
```

### 4. Set Environment Variables
```bash
flyctl secrets set JWT_SECRET=your_jwt_secret_here --app eslam-store-backend
flyctl secrets set SMTP_USER=your_email@gmail.com --app eslam-store-backend
flyctl secrets set SMTP_PASSWORD=your_app_password --app eslam-store-backend
flyctl secrets set EMAIL_FROM="Eslam Store <noreply@eslamstore.com>" --app eslam-store-backend
flyctl secrets set FRONTEND_URL=https://eslam-store.vercel.app --app eslam-store-backend
flyctl secrets set OTP_EXPIRY_MINUTES=5 --app eslam-store-backend
```

### 5. Run Database Migration
```bash
flyctl ssh console --app eslam-store-backend
# In the console:
npm run migrate
exit
```

### 6. Deploy
```bash
flyctl deploy
```

### 7. Get App URL
After deployment, your app will be available at:
`https://eslam-store-backend.fly.dev`

### 8. Update CORS
Add Fly.io URL to `server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://eslam-store-backend.fly.dev'
];
```

### 9. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://eslam-store-backend.fly.dev/api';
```

## Useful Commands

```bash
# View logs
flyctl logs --app eslam-store-backend

# View app status
flyctl status --app eslam-store-backend

# Open app in browser
flyctl open --app eslam-store-backend

# Scale up/down
flyctl scale count 1 --app eslam-store-backend

# View database connection string
flyctl postgres connect -a eslam-store-db
```

## Notes
- Free tier: 3 shared-cpu-1x VMs, 3GB volume
- Apps sleep after inactivity (free tier)
- PostgreSQL free tier: 1GB storage
- Always-on available in paid plans
