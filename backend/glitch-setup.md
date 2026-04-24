# Glitch Deployment Guide

## Steps to Deploy on Glitch

### 1. Create a New Project
1. Go to https://glitch.com
2. Click "New Project" → "glitch-hello-node" (or any Node template)
3. Name it: `eslam-store-backend`

### 2. Upload Backend Files
Copy all files from the `backend` folder to Glitch:
- `server.js`
- `package.json`
- `src/` folder (all contents)
- `.env` (create from .env.example)

### 3. Set Environment Variables
In Glitch, create a `.env` file with:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eslam_store
DB_USER=postgres
DB_PASSWORD=your_glitch_db_password
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://eslam-store.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=Eslam Store <noreply@eslamstore.com>
OTP_EXPIRY_MINUTES=5
```

### 4. Setup PostgreSQL Database
Glitch provides free PostgreSQL:
1. Go to your project
2. Click "Assets" → "Database" → "PostgreSQL"
3. Glitch will provide connection details
4. Update `.env` with Glitch DB credentials

### 5. Run Migration
In Glitch terminal:
```bash
npm run migrate
```

### 6. Update CORS
Add your Glitch URL to allowedOrigins in `server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://your-project-name.glitch.me'
];
```

### 7. Get Your Glitch URL
Your backend will be available at:
`https://your-project-name.glitch.me`

### 8. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://your-project-name.glitch.me/api';
```

## Notes
- Glitch projects go to sleep after 5 minutes of inactivity
- They wake up on first request (may take a few seconds)
- PostgreSQL is free and always available
