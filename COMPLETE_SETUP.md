# Gandharva Trekking Platform - Complete Setup Guide

## 📦 Three-Part Architecture

The application is split into three independent parts:

1. **Frontend** - User-facing website (port 3000)
2. **Admin** - Admin dashboard (port 3001)
3. **Backend** - API server (port 5000)

## 🚀 Quick Start (All Services)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
✅ Backend running on `http://localhost:5000`

### 2. Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on `http://localhost:3000`

### 3. Admin Dashboard Setup
```bash
cd admin
npm install
npm run dev
```
✅ Admin running on `http://localhost:3001`

## 📁 Complete Project Structure

```
Gandharva/
│
├── frontend/              # User Website (Port 3000)
│   ├── src/
│   │   ├── pages/        # Home, Trails, Activities, Climbing, etc.
│   │   ├── components/   # Header, Footer, Map, etc.
│   │   ├── context/      # AuthContext
│   │   └── lib/          # API clients
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── admin/                # Admin Dashboard (Port 3001)
│   ├── src/
│   │   ├── pages/        # Admin.jsx (main dashboard), SignIn.jsx
│   │   ├── components/   # ProtectedRoute, ImageUpload
│   │   ├── context/      # AuthContext
│   │   └── lib/          # API clients
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/              # API Server (Port 5000)
│   ├── controllers/      # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── scripts/         # Setup scripts
│   │   └── setupAdmin.js # Create admin user
│   ├── uploads/         # File storage
│   ├── server.js
│   └── package.json
│
└── Documentation Files (*.md)
```

## 🔐 Admin Setup

Before using the admin dashboard, create an admin user:

```bash
cd backend
node scripts/setupAdmin.js
```

**Default Credentials:**
- Email: `akc338663@gmail.com`
- Password: `Admin@123`

## 🌐 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User website |
| Admin | http://localhost:3001 | Admin dashboard |
| Backend | http://localhost:5000 | API server |

## 📝 Running in Development

You need **3 terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin:**
```bash
cd admin
npm run dev
```

## 🏗️ Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Admin Build
```bash
cd admin
npm run build
# Output: admin/dist/
```

### Backend (No build needed)
```bash
cd backend
npm start
```

## 🔗 Features

### User Frontend
- Browse trekking trails
- View climbing spots
- Book activities
- User authentication
- Payment integration (eSewa)
- Weather information
- Photo gallery

### Admin Dashboard
- Dashboard with statistics
- Manage trails (CRUD)
- Manage activities (CRUD)
- Manage climbing spots (CRUD)
- Upload images
- View bookings
- User management

### Backend API
- RESTful API endpoints
- JWT authentication
- File upload handling
- MySQL database integration
- Role-based access control

## 📚 Documentation Files

- `README.md` - This file (main overview)
- `QUICKSTART.md` - Quick setup guide
- `FULL_SETUP.md` - Detailed setup instructions
- `DATABASE_SETUP.md` - Database configuration
- `API_INTEGRATION.md` - API documentation
- `ARCHITECTURE.md` - System architecture
- `BACKEND_ENDPOINTS.md` - API endpoints reference

## 🛠️ Technology Stack

**Frontend & Admin:**
- React 18
- Vite
- React Router v6
- Axios

**Backend:**
- Node.js
- Express
- MySQL
- JWT
- Multer (file uploads)

## ⚠️ Important Notes

1. **All three services must run simultaneously** for full functionality
2. Backend must be running before frontend/admin can make API calls
3. Create admin user before accessing admin dashboard
4. Configure environment variables in backend `.env` file
5. Ensure MySQL database is set up and running

## 🐛 Troubleshooting

**Frontend/Admin can't connect to backend:**
- Check backend is running on port 5000
- Verify API proxy settings in vite.config.js
- Check CORS settings in backend

**Admin login fails:**
- Run `node scripts/setupAdmin.js` in backend
- Verify database connection
- Check user role in database

**Database errors:**
- Ensure MySQL is running
- Check database credentials in backend/.env
- Run database migrations if needed

## 📞 Support

For issues and questions, refer to the detailed documentation files in the root directory.
