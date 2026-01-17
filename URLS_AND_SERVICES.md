# 🧗 Gandharva - Trekking & Climbing Adventure Platform

## Project URLs & Services

This document provides a complete overview of all URLs and services running in the Gandharva project.

---

## 📊 URL Summary

| Service | URL | Port | Status |
|---------|-----|------|--------|
| Backend API | http://localhost:5000 | 5000 | ✅ Running |
| Frontend Client | http://localhost:3000 | 3000 | ✅ Running |
| Admin Dashboard | http://localhost:3001 | 3001 | ✅ Running |
| Database | localhost:3306 | 3306 | MySQL (trek_api) |

**Total Active Services: 3 servers + 1 database = 4 services**

---

## 🚀 Backend URLs (Port 5000)

### Base URL: `http://localhost:5000`

#### Climbing Endpoints
- `GET /api/climbing` - Get all climbing spots
- `GET /api/climbing/:id` - Get single climbing spot by ID
- `POST /api/climbing` - Create new climbing spot
- `PUT /api/climbing/:id` - Update climbing spot
- `DELETE /api/climbing/:id` - Delete climbing spot

#### Trails Endpoints
- `GET /api/trails` - Get all trails
- `GET /api/trails/:id` - Get single trail
- `POST /api/trails` - Create trail
- `PUT /api/trails/:id` - Update trail
- `DELETE /api/trails/:id` - Delete trail

#### Activities Endpoints
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

#### Destinations Endpoints
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get single destination
- `POST /api/destinations` - Create destination
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination

#### Bookings Endpoints
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

#### Reviews Endpoints
- `GET /api/reviews` - Get reviews
- `GET /api/trails/:trailId/reviews` - Get trail reviews
- `GET /api/activities/:activityId/reviews` - Get activity reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

#### Auth Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify` - Verify email

#### Upload Endpoints
- `POST /api/upload` - Upload image/file
- `GET /api/upload/:filename` - Download file

#### Other Endpoints
- `GET /api/weather` - Weather API
- `GET /api/gallery` - Gallery items
- `GET /api/users` - Get users
- `POST /api/users/profile` - Update user profile

**Total Backend Endpoints: 40+ API routes**

---

## 💻 Frontend URLs (Port 3000)

### Base URL: `http://localhost:3000`

#### Main Pages
- `/` - Home page
- `/climbing` - Climbing spots listing
- `/climbing/:id` - Climbing spot detail page
- `/trails` - Hiking trails listing
- `/trails/:id` - Trail detail page
- `/activities` - Activities listing
- `/activities/:id` - Activity detail page
- `/destinations` - Destinations listing
- `/destinations/:id` - Destination detail page
- `/bookings` - User bookings
- `/contact` - Contact us form
- `/about` - About page
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/profile` - User profile
- `/reviews` - Reviews page

**Total Frontend Pages: 16+ routes**

---

## 🎛️ Admin Dashboard URLs (Port 3001)

### Base URL: `http://localhost:3001`

#### Admin Pages
- `/` - Admin dashboard (main page)
- `/climbing` - Manage climbing spots
- `/trails` - Manage trails
- `/activities` - Manage activities
- `/destinations` - Manage destinations
- `/bookings` - View bookings
- `/reviews` - Moderate reviews
- `/users` - Manage users
- `/analytics` - Analytics dashboard
- `/settings` - Admin settings

**Total Admin Pages: 10+ management routes**

---

## 🗄️ Database Configuration

### MySQL Database
- **Host**: localhost
- **Port**: 3306
- **Database**: trek_api
- **Tables**: 
  - climbing (Rock climbing spots)
  - trails (Hiking trails)
  - activities (Adventure activities)
  - destinations (Tourist destinations)
  - bookings (User bookings)
  - reviews (User reviews)
  - users (User accounts)
  - images (Image files)

---

## 📱 API Query Examples

### Climbing API with Filters
```
GET http://localhost:5000/api/climbing?difficulty=Hard&rockType=Granite&location=Kathmandu
```

### Fetch Single Climbing Spot with Details
```
GET http://localhost:5000/api/climbing/9
```

### Create Climbing Spot (POST)
```
POST http://localhost:5000/api/climbing
Content-Type: application/json

{
  "name": "Dragon Crag",
  "location": "Kathmandu",
  "difficulty": "Hard",
  "rockType": "Granite",
  "heightMeters": 50,
  "routesCount": 15,
  "description": "Amazing climbing spot",
  "price": 2500,
  "lat": 27.7089,
  "lng": 85.3283,
  "image": "🧗"
}
```

---

## 🔗 How to Access

### 1. Start Backend Server
```bash
cd backend
node server.js
# Backend runs on http://localhost:5000
```

### 2. Start Frontend Client
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Start Admin Dashboard
```bash
cd admin
npm run dev
# Admin runs on http://localhost:3001
```

### 4. Access the Applications
- **Client Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Documentation**: http://localhost:5000 (or make API calls)

---

## 🎯 Key Features & Their URLs

### Climbing Feature (Complete Implementation)
| Feature | Frontend URL | Admin URL | API Endpoint |
|---------|-------------|----------|--------------|
| View all spots | /climbing | /climbing | GET /api/climbing |
| View details | /climbing/:id | - | GET /api/climbing/:id |
| Create spot | - | /climbing | POST /api/climbing |
| Edit spot | - | /climbing | PUT /api/climbing/:id |
| Delete spot | - | /climbing | DELETE /api/climbing/:id |
| Filter spots | /climbing?difficulty=... | - | GET /api/climbing?difficulty=... |
| View pricing | /climbing/:id | /climbing | GET /api/climbing |
| Contact form | /contact | - | Submit via form |

### Activities Feature
| Feature | Frontend URL | Admin URL | API Endpoint |
|---------|-------------|----------|--------------|
| View all | /activities | /activities | GET /api/activities |
| View details | /activities/:id | - | GET /api/activities/:id |
| Create | - | /activities | POST /api/activities |
| Edit | - | /activities | PUT /api/activities/:id |
| Delete | - | /activities | DELETE /api/activities/:id |

### Trails Feature
| Feature | Frontend URL | Admin URL | API Endpoint |
|---------|-------------|----------|--------------|
| View all | /trails | /trails | GET /api/trails |
| View details | /trails/:id | - | GET /api/trails/:id |
| Create | - | /trails | POST /api/trails |
| Edit | - | /trails | PUT /api/trails/:id |
| Delete | - | /trails | DELETE /api/trails/:id |

---

## 📊 URL Statistics

```
Total Services Running:        3 (Backend, Frontend, Admin)
Total Backend API Routes:      40+
Total Frontend Pages:          16+
Total Admin Pages:             10+
Total Database Tables:         8
Total Unique URLs:             66+
```

---

## 🔐 Security & CORS

All backend APIs are configured with:
- CORS enabled for localhost:3000 and localhost:3001
- JSON request/response format
- Error handling and validation
- Authentication middleware (where required)

---

## 📝 Data Flow

```
User Browser (Frontend 3000)
    ↓
React Router Navigation
    ↓
API Calls to Backend (5000)
    ↓
Express.js Routes
    ↓
MySQL Database
    ↓
Response back to Frontend
    ↓
Display in UI

Admin Browser (Admin 3001)
    ↓
React Router Navigation
    ↓
Admin API Calls to Backend (5000)
    ↓
Express.js Routes (with Admin checks)
    ↓
MySQL Database (Create/Update/Delete)
    ↓
Response back to Admin
    ↓
Update Dashboard
```

---

## 🎉 Project Structure

```
Gandharva/
├── backend/                    (Port 5000)
│   ├── server.js
│   ├── routes/
│   │   ├── climbing.js
│   │   ├── trails.js
│   │   ├── activities.js
│   │   ├── destinations.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   ├── middleware/
│   └── scripts/
│
├── frontend/                   (Port 3000)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Climbing.jsx
│   │   │   ├── ClimbingDetail.jsx
│   │   │   ├── Activities.jsx
│   │   │   ├── Trails.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── ...
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── apiClient.js
│   │   └── App.jsx
│   └── index.html
│
└── admin/                      (Port 3001)
    ├── src/
    │   ├── pages/
    │   │   └── Admin.jsx
    │   ├── components/
    │   ├── lib/
    │   │   └── apiClient.js
    │   └── App.jsx
    └── index.html
```

---

## ✨ Current Features

### ✅ Climbing Section
- [x] Full CRUD operations (Create, Read, Update, Delete)
- [x] Image upload support
- [x] Price management (₨ NPR format)
- [x] Filtering by difficulty, rock type, location
- [x] Detail page with complete information
- [x] Contact Us button → Contact page redirect
- [x] Reviews integration
- [x] Professional UI/UX

### ✅ Activities Section
- [x] Full CRUD operations
- [x] Image support
- [x] Pricing
- [x] Detail pages
- [x] Contact Us functionality
- [x] Reviews

### ✅ Trails Section
- [x] Full CRUD operations
- [x] Image support
- [x] Pricing
- [x] Detail pages
- [x] Reviews

### ✅ General Features
- [x] User authentication
- [x] Image upload/download
- [x] Contact form
- [x] Reviews system
- [x] Booking management
- [x] Responsive design

---

## 🚀 How to Run Everything

### Step 1: Start Backend
```bash
cd backend
npm install
node server.js
# ✅ Backend ready at http://localhost:5000
```

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# ✅ Frontend ready at http://localhost:3000
```

### Step 3: Start Admin
```bash
cd admin
npm install
npm run dev
# ✅ Admin ready at http://localhost:3001
```

### Step 4: Access Applications
- Open browser to http://localhost:3000 (Client)
- Open another tab to http://localhost:3001 (Admin)
- Test API at http://localhost:5000/api/climbing

---

## 📞 Contact & Support

- **Client Website**: http://localhost:3000/contact
- **Admin Panel**: http://localhost:3001
- **API Status**: http://localhost:5000

---

**Last Updated**: January 17, 2026
**Project Status**: ✅ Fully Operational
**All 3 Servers**: Running and Connected
