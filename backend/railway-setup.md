# Railway Deployment Guide

## Why Railway?
- Free tier available (no credit card required)
- Built-in PostgreSQL database
- Easy GitHub integration
- Automatic deployments

## Steps to Deploy

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. No credit card required for free tier

### 2. Create New Project
1. Click "New Project" → "Deploy from GitHub repo"
2. Select: `esooo201833/Eslam-Store`
3. Select: `backend` folder (or root directory)
4. Click "Deploy"

### 3. Add PostgreSQL Database
1. In your project, click "New" → "Database"
2. Select "PostgreSQL"
3. Railway will create a free PostgreSQL database

### 4. Set Environment Variables
In your project → "Variables" tab, add:
```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://eslam-store.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=eslammohamed201933@gmail.com
SMTP_PASSWORD=ryba hsae ylka pvup
EMAIL_FROM=Eslam Store <eslammohamed201933@gmail.com>
OTP_EXPIRY_MINUTES=5
```

### 5. Run Database Migration
1. Go to your project → "Deployments"
2. Click on the latest deployment
3. Click "Console"
4. Run: `npm run migrate`

### 6. Get Your Backend URL
After deployment, Railway will provide a URL like:
`https://eslam-store-backend-production.up.railway.app`

### 7. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://eslam-store-backend-production.up.railway.app/api';
```

### 8. Update CORS
Update `backend/server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://eslam-store-backend-production.up.railway.app'
];
```

## Notes
- Free tier: $5/month credit (enough for small projects)
- PostgreSQL: 1GB storage free
- Automatic sleep after inactivity (free tier)
- Wake up on first request (may take a few seconds)
