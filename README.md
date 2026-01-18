# Orophiletrek - Trekking Platform

A full-stack trekking website built with React (Vite) + Node.js (Express) + MySQL.

## 🎯 Quick Start

**Simple Method - Run all services at once:**
```bash
# Windows Command Prompt
start-all.bat

# Windows PowerShell
.\start-all.ps1
```

**Manual Method - Run each service separately:**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Admin
cd admin && npm run dev
```

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | User website |
| **Admin** | http://localhost:3001 | Admin dashboard |
| **Backend** | http://localhost:5000 | API server |

```
Orophiletrek/
├── frontend/          # React + Vite frontend application (User-facing)
│   ├── src/          # React components and pages
│   ├── index.html    # Entry HTML file
│   ├── vite.config.js
│   └── package.json  # Frontend dependencies
│
├── admin/            # React + Vite admin dashboard (Admin-only)
│   ├── src/          # Admin components and pages
│   │   ├── pages/    # Admin.jsx dashboard page
│   │   ├── components/
│   │   ├── context/  # AuthContext
│   │   └── lib/      # API clients
│   ├── index.html
│   ├── vite.config.js
│   └── package.json  # Admin dependencies
│
├── backend/          # Node.js + Express backend API
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── scripts/      # Setup scripts (setupAdmin.js, etc.)
│   ├── uploads/      # File uploads storage
│   ├── server.js     # Express server
│   └── package.json  # Backend dependencies
│
└── docs/            # Documentation files (*.md)
```

## 🚀 Quick Start

### Frontend Setup (User App)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

### Admin Dashboard Setup
```bash
cd admin
npm install
npm run dev
```
Admin dashboard will run on `http://localhost:3001`

### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend API will run on `http://localhost:5000`

**Note:** You need to run all three applications simultaneously for full functionality.

## 📚 Documentation

See the various `.md` files in the root directory for detailed setup instructions:
- `QUICKSTART.md` - Quick setup guide
- `FULL_SETUP.md` - Complete setup instructions
- `DATABASE_SETUP.md` - Database configuration
- `API_INTEGRATION.md` - API integration guide
- `ARCHITECTURE.md` - System architecture

## 🔗 Main Features

- Trail discovery and booking
- Rock climbing routes
- Activity tracking
- Payment integration (Razorpay)
- Admin dashboard
- Image gallery
- Weather information
