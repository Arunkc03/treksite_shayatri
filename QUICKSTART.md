# 🚀 Quick Start Guide - Gandharva Project

## Step 1: Install Backend Dependencies

```bash
cd Gdback
npm install
```

Dependencies installed:
- ✅ express
- ✅ cors
- ✅ dotenv
- ✅ bcryptjs
- ✅ jsonwebtoken
- ✅ mongoose
- ✅ multer
- ✅ express-validator
- ✅ nodemon (dev)

## Step 2: Start Backend Server

```bash
# From Gdback directory
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📍 Environment: development
```

## Step 3: Install Frontend Dependencies

```bash
# From project root (go back to main folder)
npm install
```

## Step 4: Start Frontend Server

```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

## Step 5: Open in Browser

Visit: **http://localhost:5173**

## ✨ What You Get

### Backend (http://localhost:5000)
- ✅ RESTful API endpoints
- ✅ Trail management system
- ✅ Activity booking system
- ✅ User authentication
- ✅ Booking management
- ✅ CORS enabled

### Frontend (http://localhost:5173)
- ✅ Beautiful blue & white UI
- ✅ Responsive design
- ✅ Activity booking with modal
- ✅ Trail browsing
- ✅ User authentication pages
- ✅ Contact & FAQ pages
- ✅ Dropdown navigation menu

## 🔌 API Integration

The frontend automatically connects to the backend at `http://localhost:5000/api`

Try these endpoints:
```bash
# Get all activities
curl http://localhost:5000/api/activities

# Get all trails
curl http://localhost:5000/api/trails

# Health check
curl http://localhost:5000/api/health
```

## 📋 Project Structure

```
Gandharva/
├── src/                          # Frontend React app
│   ├── pages/Activities.jsx      # NEW: Activity booking page
│   ├── components/Header.jsx     # Navigation with dropdown
│   └── ...other files
├── Gdback/                       # Backend Express server
│   ├── routes/
│   │   ├── trails.js
│   │   ├── activities.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── bookings.js
│   └── server.js
└── README.md
```

## 🎯 Features Ready to Use

1. **Browse Activities** - Go to Activities page and see 6 adventure activities
2. **Book Activities** - Click "Book Now" to reserve spots with a booking form
3. **Search Trails** - Use the search bar to find trails
4. **Explore Menu** - Click "Explore ▼" for destination, activities, trekking, climbing
5. **User Account** - Sign in/Sign up pages available
6. **Contact & FAQ** - Get support through contact form and FAQ page

## 🔧 Troubleshooting

### Backend not starting?
```bash
# Make sure you're in Gdback folder
cd Gdback
node server.js  # Direct start without nodemon
```

### Port 5000 already in use?
Edit `.env` in Gdback:
```env
PORT=3001  # Change to different port
```

### Frontend not connecting to backend?
Check that:
1. Backend is running on port 5000
2. Frontend can access `http://localhost:5000/api`
3. CORS is configured in backend

## 📚 Next Steps

1. ✅ Both servers running
2. 📱 Test the Activities booking page
3. 🔍 Try the search functionality
4. 👤 Create a user account
5. 📦 Explore all features

## 🎉 Congratulations!

Your full-stack Gandharva application is now running with:
- React frontend with beautiful blue UI
- Node.js/Express backend API
- Activity booking system
- Trail management
- User authentication ready to use

**Happy Trekking! 🥾⛰️**

For more details, see:
- `FULL_SETUP.md` - Complete project documentation
- `Gdback/README.md` - Backend API documentation
