# ngrok Setup Guide

## Why ngrok?
- Free tier available (no credit card required)
- Works perfectly with CORS
- Stable tunnel connection
- No authentication required

## Steps to Setup ngrok

### 1. Download ngrok
1. Go to https://ngrok.com
2. Sign up for free account
3. Download ngrok for Windows
4. Extract the zip file

### 2. Authenticate ngrok
1. Open Command Prompt or PowerShell
2. Navigate to the extracted ngrok folder
3. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`
   - Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken

### 3. Start Backend Server
In your project folder:
```bash
cd backend
npm run dev
```

### 4. Start ngrok Tunnel
In a new terminal:
```bash
ngrok http 3000
```

### 5. Get Your ngrok URL
ngrok will display a URL like:
`https://xxxx-xx-xx-xx-xx.ngrok-free.app`

### 6. Update Frontend
Update `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'https://xxxx-xx-xx-xx-xx.ngrok-free.app/api';
```

### 7. Update CORS
Add your ngrok URL to `backend/server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://xxxx-xx-xx-xx-xx.ngrok-free.app'
];
```

## Important Notes
- Free tier: 1 tunnel at a time
- URL changes every time you restart ngrok
- Tunnel is active as long as ngrok is running
- No sleep time (always on when running)

## Tips
- Keep ngrok running in a separate terminal
- Update frontend URL whenever ngrok URL changes
- Use ngrok config file to save settings
