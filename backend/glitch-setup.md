# Glitch Deployment Guide

## Why Glitch?
- Completely free (no credit card required)
- Built-in PostgreSQL database
- Easy to use web editor
- No deployment limits

## Steps to Deploy

### 1. Create a New Project
1. Go to https://glitch.com
2. Click "New Project" → "glitch-hello-node" (or any Node template)
3. Name it: `eslam-store-backend`

### 2. Upload Backend Files
Replace the default files with your backend files:
- **server.js** - Copy content from your backend/server.js
- **package.json** - Copy content from your backend/package.json
- **src/** folder - Create this folder and copy all contents from backend/src/
- **.env** - Create this file with your environment variables

### 3. Set Environment Variables
Create a `.env` file with:
```env
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
SMTP_USER=eslammohamed201933@gmail.com
SMTP_PASSWORD=ryba hsae ylka pvup
EMAIL_FROM=Eslam Store <eslammohamed201933@gmail.com>
OTP_EXPIRY_MINUTES=5
```

### 4. Setup PostgreSQL Database
1. In Glitch, click "Assets" → "Database" → "PostgreSQL"
2. Glitch will provide connection details
3. Update `.env` with Glitch DB credentials:
   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

### 5. Run Database Migration
1. Open the Terminal in Glitch (bottom of the screen)
2. Run: `npm install`
3. Run: `npm run migrate`

### 6. Start the Server
The server should start automatically. If not, run:
```bash
npm start
```

### 7. Get Your Glitch URL
Your backend will be available at:
`https://your-project-name.glitch.me`

### 8. Update CORS
Add your Glitch URL to `server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://your-project-name.glitch.me'
];
```

### 9. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://your-project-name.glitch.me/api';
```

## Important Notes
- Glitch projects go to sleep after 5 minutes of inactivity
- They wake up on first request (may take a few seconds)
- PostgreSQL is free and always available
- Storage: 200MB free
- Bandwidth: 4000 requests per hour free

## Troubleshooting
- If server doesn't start, check the Logs in Glitch
- If database connection fails, verify DB credentials in .env
- If migration fails, ensure schema.sql is in src/database/
