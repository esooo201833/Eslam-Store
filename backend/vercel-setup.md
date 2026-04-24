# Vercel Deployment Guide

## Why Vercel?
- Free tier available (no credit card required)
- Fast deployment
- Good for serverless functions
- Automatic HTTPS

## Important Note
Vercel is designed for frontend and serverless functions. Your current backend is a traditional Node.js/Express server. You have two options:

### Option 1: Convert to Vercel Serverless Functions (Recommended)
- ✅ Works perfectly with Vercel
- ✅ Free tier available
- ❌ Requires code changes
- ❌ Convert Express routes to Vercel functions

### Option 2: Use Vercel with External PostgreSQL
- ✅ Keep Express code mostly intact
- ✅ Use Vercel for hosting
- ❌ Need external PostgreSQL (Supabase, Neon)
- ❌ Requires adaptation for serverless

## Steps for Option 1 (Serverless Functions)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Create Vercel Project
```bash
cd backend
vercel
```

### 3. Convert Express to Serverless Functions

**Create `api/index.js`:**
```javascript
const app = require('./server');
module.exports = app;
```

**Update `server.js` to export app:**
```javascript
// At the end of server.js
module.exports = app;
```

**Create `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 4. Add External PostgreSQL
Vercel doesn't provide PostgreSQL. Use Supabase or Neon:

**Create Supabase project:**
- Go to https://supabase.com
- Create new project
- Get DATABASE_URL

**Update `.env`:**
```env
DATABASE_URL=your_supabase_database_url
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

### 5. Deploy to Vercel
```bash
vercel --prod
```

### 6. Get Your Vercel URL
Vercel will provide a URL like:
`https://eslam-store-backend.vercel.app`

### 7. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://eslam-store-backend.vercel.app/api';
```

### 8. Update CORS
Add your Vercel URL to `backend/server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://eslam-store-backend.vercel.app'
];
```

## Steps for Option 2 (Vercel Serverless with Supabase)

### 1. Install Dependencies
```bash
npm install @vercel/node
```

### 2. Create API Functions Structure
Convert each route to a serverless function:

**Create `api/auth/register.js`:**
```javascript
const express = require('express');
const { register } = require('../../src/controllers/authController');
const { registerLimiter } = require('../../src/middleware/rateLimiter');

const app = express();
app.use(express.json());
app.post('/register', registerLimiter, register);

module.exports = app;
```

Repeat for all routes (login, products, cart, orders, payment, otp).

### 3. Create `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ]
}
```

### 4. Deploy
```bash
vercel --prod
```

## Important Notes
- Vercel functions have execution time limits (10-60 seconds)
- Vercel functions are stateless
- PostgreSQL must be external (Supabase, Neon)
- Free tier: 100GB bandwidth per month
- Functions sleep after inactivity

## Recommendation
For quick deployment, use **Option 1** with minimal changes.
For better Vercel integration, use **Option 2** but expect more code changes.
