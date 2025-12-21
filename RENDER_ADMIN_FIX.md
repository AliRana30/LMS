# Fix Admin Dashboard Not Showing Data on Render

## Problem
Admin dashboard shows no sales, users, or courses data on Render deployment.

## Root Cause
Cross-site cookies not working properly due to:
1. **ORIGIN environment variable** not set correctly in Render
2. **NODE_ENV** not set to "production"
3. **CORS configuration** needs exact frontend URL

## Solution

### Step 1: Configure Render Environment Variables

Go to your Render Dashboard → Your Backend Service → Environment Tab

**Add/Update these variables:**

```bash
# CRITICAL - Must match your Vercel frontend URL exactly (no trailing slash)
ORIGIN=https://your-app.vercel.app

# CRITICAL - Must be "production" for secure cookies
NODE_ENV=production

# Redis URL (required for session storage)
REDIS_URL=your_redis_url

# MongoDB URI (required for data)
DB_URI=your_mongodb_uri

# JWT Secrets (must match frontend)
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret

# Email Configuration (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_SERVICE=your_smtp_service
SMTP_MAIL=your_smtp_email
SMTP_PASSWORD=your_smtp_password
```

### Step 2: Configure Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Add/Update these:**

```bash
# CRITICAL - Must match your Render backend URL exactly (no trailing slash)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1

# For real-time features
NEXT_PUBLIC_SOCKET_SERVER_URI=wss://your-backend.onrender.com

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
SECRET=same_as_nextauth_secret

# OAuth Credentials (must have production callback URLs configured)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Step 3: Verify CORS and Cookies

The code has been updated with logging to help debug. After deploying, check Render logs for:

```
CORS Origin configured: https://your-app.vercel.app
Auth check - Cookies: [list of cookies]
Auth check - Access Token: present/missing
```

### Step 4: Test Authentication Flow

1. **Login** to your production app
2. **Check browser DevTools** → Application → Cookies
3. **Verify cookies are set:**
   - `access_token` (HttpOnly, Secure, SameSite=None)
   - `refresh_token` (HttpOnly, Secure, SameSite=None)
4. **Go to Admin Dashboard** - data should now load

## Common Issues

### Issue: "No access token in cookies"
**Solution:** 
- Ensure ORIGIN in Render matches your Vercel URL EXACTLY
- Ensure NODE_ENV=production in Render
- Clear browser cookies and login again

### Issue: "User not found in Redis"
**Solution:**
- Verify REDIS_URL is set correctly in Render
- Check Render logs for Redis connection errors
- Login again to create a fresh session

### Issue: "CORS error" in browser console
**Solution:**
- ORIGIN must match Vercel URL with NO trailing slash
- Use https:// not http://
- Redeploy backend after changing ORIGIN

### Issue: Cookies not being sent with requests
**Solution:**
- Verify NEXT_PUBLIC_API_URL starts with https:// (not http://)
- Check that frontend uses credentials: 'include' in all API calls
- Ensure both domains use HTTPS (Vercel and Render do by default)

## Checklist

- [ ] Set ORIGIN in Render to exact Vercel URL
- [ ] Set NODE_ENV=production in Render
- [ ] Set NEXT_PUBLIC_API_URL in Vercel to exact Render URL
- [ ] Both URLs use HTTPS
- [ ] No trailing slashes in URLs
- [ ] Redeploy both frontend and backend
- [ ] Clear browser cookies
- [ ] Login with admin account
- [ ] Check admin dashboard for data

## Need More Help?

Check the Render logs for detailed error messages:
```bash
# Look for these log lines:
CORS Origin configured: [should show your Vercel URL]
Auth check - Cookies: [should list access_token]
Auth success - User role: admin
```

If you see "Auth failed: No access token in cookies", the issue is cookie configuration.
If you see "Auth failed: User not found in Redis", the issue is Redis connection.
