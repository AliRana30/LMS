# Deployment Configuration Guide

## 1. Get Your Deployment URLs

After deploying:
- **Vercel Frontend URL**: https://your-app.vercel.app
- **Render Backend URL**: https://your-backend.onrender.com

## 2. Update OAuth Providers

### Google OAuth Console (https://console.cloud.google.com/apis/credentials)
Add these Authorized redirect URIs:
- https://your-app.vercel.app/api/auth/callback/google
- http://localhost:3000/api/auth/callback/google (for local dev)

### GitHub OAuth App (https://github.com/settings/developers)
Update Authorization callback URL:
- https://your-app.vercel.app/api/auth/callback/github
- http://localhost:3000/api/auth/callback/github (for local dev)

## 3. Vercel Environment Variables (Client)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_SERVER_URI=https://your-backend.onrender.com

NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<same as SECRET below>

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

SECRET=<copy from local .env>
```

## 4. Render Environment Variables (Server)

Go to Render Dashboard → Your Service → Environment

Add these (use your actual values from local server/.env):
```
PORT=5000
ORIGIN=https://your-app.vercel.app
NODE_ENV=production
MONGO_URI=<your-mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
REDIS_URI=<your-redis-connection-string>
ACTIVATION_SECRET=<your-activation-secret>

ACCESS_TOKEN=<your-access-token>
ACCESS_TOKEN_EXPIRE=15
REFRESH_TOKEN=<your-refresh-token>
REFRESH_TOKEN_EXPIRE=7

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=<your-gmail-address>
SMTP_PASSWORD=<your-gmail-app-password>

VDOCIPHER_API_SECRET=<your-vdocipher-secret>

STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

## 5. After Configuration

1. Redeploy both services (Vercel will auto-deploy, trigger Render manual deploy)
2. Test OAuth login
3. Test course purchase
4. Check admin panel analytics

## Common Issues

### OAuth not working
- Verify callback URLs in Google/GitHub match exactly
- Check NEXTAUTH_URL is set correctly
- Ensure NEXTAUTH_SECRET is set

### CORS errors
- Make sure ORIGIN in Render matches your Vercel URL
- No trailing slashes in URLs

### Analytics not showing
- Check NEXT_PUBLIC_API_URL points to Render backend
- Verify MongoDB connection string is correct
