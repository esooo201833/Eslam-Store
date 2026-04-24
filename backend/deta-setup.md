# Deta Deployment Guide

## Why Deta?
- Completely free (no credit card required)
- Supports Node.js microservices
- Built-in NoSQL database (Deta Base)
- Easy CLI deployment
- No sleep time (always on)

## Important Note
Your current backend uses PostgreSQL. Deta provides Deta Base (NoSQL), which means you have two options:

### Option 1: Use Deta Base (Recommended for Deta)
- ✅ Everything on Deta
- ✅ No external database needed
- ❌ Requires code changes (PostgreSQL → Deta Base)
- ❌ Need to rewrite database queries

### Option 2: Use Deta Micros + External PostgreSQL
- ✅ Keep PostgreSQL code
- ✅ Use Deta for hosting only
- ❌ Need external PostgreSQL (Supabase, Neon, etc.)
- ❌ More complex setup

## Steps for Option 1 (Deta Base)

### 1. Install Deta CLI
```bash
npm install -g deta-cli
```

### 2. Login to Deta
```bash
deta login
```
This will open a browser for authentication.

### 3. Initialize Deta Project
```bash
cd backend
deta init
```

### 4. Update Code for Deta Base
Replace PostgreSQL with Deta Base:

**Install Deta SDK:**
```bash
npm install deta
```

**Update `src/database/db.js`:**
```javascript
const { Deta } = require('deta');
const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base('users');
const productsDb = deta.Base('products');
const cartDb = deta.Base('cart');
const ordersDb = deta.Base('orders');

module.exports = { db, productsDb, cartDb, ordersDb };
```

**Update all database queries to use Deta Base API:**
- Replace SQL queries with Deta Base methods
- Use `db.put()`, `db.get()`, `db.update()`, `db.delete()`

### 5. Update Environment Variables
Create `.env`:
```env
DETA_PROJECT_KEY=your_deta_project_key
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

### 6. Deploy to Deta
```bash
deta deploy
```

### 7. Get Your Deta URL
Deta will provide a URL like:
`https://xxxxx.deta.dev`

### 8. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://xxxxx.deta.dev/api';
```

### 9. Update CORS
Add your Deta URL to `backend/server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://xxxxx.deta.dev'
];
```

## Steps for Option 2 (Deta Micros + External PostgreSQL)

### 1. Install Deta CLI
```bash
npm install -g deta-cli
deta login
```

### 2. Create Supabase Project
- Go to https://supabase.com
- Create new project
- Get DATABASE_URL

### 3. Update .env
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

### 4. Deploy to Deta
```bash
cd backend
deta init
deta deploy
```

### 5. Run Migration
You'll need to run migration manually or create a migration endpoint.

## Important Notes
- Deta Base is NoSQL, not SQL
- Deta Micros sleep after 15 minutes of inactivity (free tier)
- Wake up on first request (may take a few seconds)
- Storage: 10GB free
- Bandwidth: 100GB per month free

## Recommendation
For quick deployment, use **Option 2** (Deta Micros + Supabase) to avoid code changes.
For better Deta integration, use **Option 1** (Deta Base) but expect code changes.
