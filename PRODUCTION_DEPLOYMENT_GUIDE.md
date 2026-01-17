# 🚀 Production Deployment Guide - URL Changes

When deploying to production, you need to change hardcoded localhost URLs across all 3 folders. Here's the complete guide:

---

## 📋 Summary of URLs to Change

| Component | Development | Production | Files Affected |
|-----------|------------|-----------|---------|
| Backend API | `http://localhost:5000` | `https://your-api-domain.com` | 15+ files |
| Frontend | `http://localhost:3000` | `https://your-domain.com` | Frontend folder |
| Admin Panel | `http://localhost:3001` | `https://admin.your-domain.com` | Admin folder |
| Database Host | `localhost` | Production DB Host | Backend files |

---

## 🔧 BACKEND CHANGES (backend/ folder)

### 1. **Database Connection** 
**Files to change:**
- `backend/server.js` - Database connection string
- Backend environment files

Change:
```javascript
// FROM
host: 'localhost',
user: 'root',
password: '',
database: 'trek_api'

// TO
host: process.env.DB_HOST || 'production-db-host.com',
user: process.env.DB_USER || 'prod_user',
password: process.env.DB_PASSWORD || 'secure_password',
database: process.env.DB_NAME || 'trek_api'
```

### 2. **CORS Configuration**
**Files to change:**
- `backend/server.js` - CORS middleware

Current setting allows localhost only:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

Change to:
```javascript
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://admin.your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true
}));
```

### 3. **Environment Variables (.env)**
**Create/Update:** `backend/.env`

```env
# Database
DB_HOST=production-db-host.com
DB_USER=prod_username
DB_PASSWORD=your_secure_password
DB_NAME=trek_api_prod

# Server
PORT=5000
NODE_ENV=production

# Payment Gateway (if using Razorpay/eSewa)
RAZORPAY_KEY_ID=your_prod_key
RAZORPAY_KEY_SECRET=your_prod_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. **Database Connection Files**
**Scripts that need updating:**
- `backend/scripts/addPriceToActivities.js` (Line 5)
- `backend/scripts/updateActivityPrices.js` (Line 5)
- `backend/scripts/createTestActivitiesWithPrice.js` (Line 5)
- `backend/scripts/addPriceToClimbing.js` (Line 11)
- `backend/scripts/addColumnsToTrails.js` (Line 7)

Change all instances from:
```javascript
host: process.env.DB_HOST || 'localhost',
```

---

## 🌐 FRONTEND CHANGES (frontend/ folder)

### Files to Change:

**1. API Base URL - Most Important!**

#### `frontend/src/lib/apiClient.js` (Line 5)
```javascript
// FROM
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// TO
const API_BASE = import.meta.env.VITE_API_URL || 'https://your-api-domain.com/api';
```

#### `frontend/src/pages/Destinations.jsx` (Line 18, 69)
```javascript
// FROM
const response = await axios.get('http://localhost:5000/api/destinations')
imageSrc = `http://localhost:5000${dest.image_url}`;

// TO
const response = await axios.get('https://your-api-domain.com/api/destinations')
imageSrc = `https://your-api-domain.com${dest.image_url}`;
```

#### `frontend/src/pages/Home.jsx` (Line 38, 81, 199, 258)
```javascript
// FROM
const response = await fetch('http://localhost:5000/api/destinations')
imageSrc = `http://localhost:5000${activity.image}`;

// TO
const response = await fetch('https://your-api-domain.com/api/destinations')
imageSrc = `https://your-api-domain.com${activity.image}`;
```

#### `frontend/src/pages/DestinationDetail.jsx` (Line 16, 67)
```javascript
// FROM
const response = await fetch(`http://localhost:5000/api/destinations/${id}`)
return url.startsWith('http') ? url : `http://localhost:5000${url}`

// TO
const response = await fetch(`https://your-api-domain.com/api/destinations/${id}`)
return url.startsWith('http') ? url : `https://your-api-domain.com${url}`
```

#### `frontend/src/pages/ActivityDetail.jsx` (Line 57, 64)
```javascript
// FROM
imageSrc = `http://localhost:5000${activity.image}`;

// TO
imageSrc = `https://your-api-domain.com${activity.image}`;
```

#### `frontend/src/pages/ClimbingDetail.jsx` (Line 37, 40, 43)
```javascript
// FROM
if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`
if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`

// TO
if (imagePath.startsWith('/uploads')) return `https://your-api-domain.com${imagePath}`
if (!imagePath.startsWith('/')) return `https://your-api-domain.com/uploads/${imagePath}`
```

#### `frontend/src/components/RazorpayPayment.jsx` (Line 34, 64)
```javascript
// FROM
const orderResponse = await fetch('http://localhost:5000/api/payments/create-order', {
const verifyResponse = await fetch('http://localhost:5000/api/payments/verify-payment', {

// TO
const orderResponse = await fetch('https://your-api-domain.com/api/payments/create-order', {
const verifyResponse = await fetch('https://your-api-domain.com/api/payments/verify-payment', {
```

### 2. **Frontend Environment Variables**
**Create/Update:** `frontend/.env.production`

```env
VITE_API_URL=https://your-api-domain.com/api
```

**Update:** `frontend/vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://your-api-domain.com/api'
        : 'http://localhost:5000/api'
    )
  }
})
```

---

## 🔐 ADMIN PANEL CHANGES (admin/ folder)

### Files to Change:

#### `admin/src/pages/Admin.jsx` (Multiple lines)
All hardcoded `http://localhost:5000` need to change:

Lines: 71, 75, 80, 85, 244-245, 259, 388, 390, 488, 506, 875, 1019, 1036, 1054, 1069, 1500, 1505, 1562, 1567, 1800, 1804, 1856, 1901, 2021, 2174, 2182, 2278, 2279, 2309, 2399

**Pattern to replace:**
```javascript
// FROM
fetch('http://localhost:5000/api/destinations')
fetch(`http://localhost:5000/api/destinations/${id}`)
src={url.startsWith('http') ? url : `http://localhost:5000${url}`}

// TO
fetch('https://your-api-domain.com/api/destinations')
fetch(`https://your-api-domain.com/api/destinations/${id}`)
src={url.startsWith('http') ? url : `https://your-api-domain.com${url}`}
```

### 2. **Admin Environment Variables**
**Create/Update:** `admin/.env.production`

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_ADMIN_URL=https://admin.your-domain.com
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
# Essential
DB_HOST=your-production-db.com
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=trek_api_prod
PORT=5000
NODE_ENV=production

# Frontend URLs (for email links, redirects)
FRONTEND_URL=https://your-domain.com
ADMIN_URL=https://admin.your-domain.com
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Admin (.env.production)
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## 🎯 Quick Checklist for Deployment

### Backend
- [ ] Update database connection (host, user, password)
- [ ] Configure CORS for production domains
- [ ] Set up .env file with production values
- [ ] Update database scripts if using them
- [ ] Enable HTTPS (SSL/TLS certificate)
- [ ] Set NODE_ENV=production

### Frontend
- [ ] Replace all `http://localhost:5000` with production API URL
- [ ] Update apiClient.js base URL
- [ ] Create/update .env.production file
- [ ] Build for production: `npm run build`
- [ ] Configure HTTPS
- [ ] Update API calls in all components

### Admin Panel
- [ ] Replace all `http://localhost:5000` with production API URL
- [ ] Update all fetch URLs in Admin.jsx
- [ ] Create/update .env.production file
- [ ] Build for production: `npm run build`
- [ ] Configure HTTPS
- [ ] Test all CRUD operations with production API

### General
- [ ] Test CORS (should allow your domains only)
- [ ] Test image uploads/downloads
- [ ] Test all API endpoints
- [ ] Verify database connectivity
- [ ] Check email functionality (if applicable)
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain DNS

---

## 🔄 Search & Replace Strategy

### For VS Code Find & Replace:

**Find:** `http://localhost:5000`
**Replace:** `https://your-api-domain.com`

**Find:** `localhost:5000`
**Replace:** `your-api-domain.com`

**Find:** `host: process.env.DB_HOST || 'localhost'`
**Replace:** `host: process.env.DB_HOST || 'production-db-host'`

---

## 🌍 Domain Examples

| What | Example |
|------|---------|
| API Domain | `api.gandharva.com` |
| Frontend | `gandharva.com` |
| Admin Panel | `admin.gandharva.com` |
| Database | `db.gandharva.com` or `rds-instance.region.rds.amazonaws.com` |

---

## ✅ Testing After Deployment

```bash
# Test API connectivity
curl https://your-api-domain.com/api/climbing

# Test CORS
curl -H "Origin: https://your-domain.com" https://your-api-domain.com/api/climbing -v

# Test database
# From backend server, verify DB_HOST and credentials work

# Test frontend
# Visit https://your-domain.com and check browser console for errors

# Test admin
# Visit https://admin.your-domain.com and verify all forms work
```

---

## 🚨 Common Issues & Solutions

**Issue:** API calls fail with CORS error
**Solution:** Check CORS configuration in backend/server.js, whitelist your domain

**Issue:** Images not loading
**Solution:** Verify image URLs in API responses, check `http://` vs `https://`

**Issue:** Database connection fails
**Solution:** Check DB_HOST, DB_USER, DB_PASSWORD in .env, verify database accessibility

**Issue:** Admin forms don't submit
**Solution:** Check all `fetch` URLs are updated, verify API endpoints are accessible

---

## 📚 Files Summary

**Total files with localhost URLs: 20+**

- Backend server.js
- Backend scripts (5 files)
- Frontend pages (6 files)
- Frontend components (1 file)
- Admin pages (1 file, multiple lines)

**Most Critical:**
1. `backend/server.js` - CORS & Database
2. `frontend/src/lib/apiClient.js` - API base URL
3. `admin/src/pages/Admin.jsx` - All fetch URLs

