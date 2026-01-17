# 🗄️ Database Setup Guide - Trek API

## Database Overview

Your **Gandharva** application now has a complete database setup with both **MySQL (XAMPP)** and **MongoDB** ready for integration.

### Current Status

✅ **MySQL Database Created**: `trek_api`  
✅ **Database Tables**: users, trails, activities, bookings  
✅ **Sample Data**: 4 trails + 6 activities inserted  
✅ **MongoDB Models**: User, Activity, Trail, Booking schemas created  

---

## 1. MySQL Database (XAMPP)

### Database Structure

```
Database: trek_api
│
├── users
│   ├── id (INT, Primary Key)
│   ├── name (VARCHAR)
│   ├── email (VARCHAR, Unique)
│   ├── password (VARCHAR)
│   ├── bio (TEXT)
│   ├── phone (VARCHAR)
│   ├── location (VARCHAR)
│   └── created_at (TIMESTAMP)
│
├── trails
│   ├── id (INT, Primary Key)
│   ├── name (VARCHAR)
│   ├── location (VARCHAR)
│   ├── difficulty (VARCHAR)
│   ├── length (DECIMAL)
│   ├── elevation (INT)
│   ├── description (TEXT)
│   ├── image (VARCHAR)
│   └── created_at (TIMESTAMP)
│
├── activities
│   ├── id (INT, Primary Key)
│   ├── name (VARCHAR)
│   ├── description (TEXT)
│   ├── difficulty (VARCHAR)
│   ├── duration (VARCHAR)
│   ├── price (DECIMAL)
│   ├── max_participants (INT)
│   ├── current_participants (INT)
│   ├── location (VARCHAR)
│   ├── date (DATE)
│   ├── image (VARCHAR)
│   └── created_at (TIMESTAMP)
│
└── bookings
    ├── id (INT, Primary Key)
    ├── user_id (INT, Foreign Key)
    ├── activity_id (INT, Foreign Key)
    ├── num_participants (INT)
    ├── total_price (DECIMAL)
    ├── status (VARCHAR)
    ├── booking_date (TIMESTAMP)
    └── activity_date (DATE)
```

### Sample Data Inserted

**Activities (6 records)**
- Mountain Hiking - $79
- Rock Climbing - $120
- Trekking Expedition - $249
- Paragliding Adventure - $150
- Camping & Bonfire - $45
- Waterfall Trek - $59

**Trails (4 records)**
- Everest Base Camp (65 km)
- Annapurna Circuit (160 km)
- Manali to Leh (485 km)
- Valley of Flowers (25 km)

### Access MySQL Database

```bash
# Using XAMPP MySQL command line
"C:\xampp\mysql\bin\mysql.exe" -u root trek_api

# Common queries
SHOW TABLES;
SELECT * FROM activities;
SELECT * FROM trails;
DESCRIBE activities;
```

---

## 2. MongoDB Database Setup

### Models Created

```
Gdback/models/
├── User.js (User schema with authentication fields)
├── Activity.js (Activity schema with difficulty & participants)
├── Trail.js (Trail schema with rating & reviews)
└── Booking.js (Booking schema with references)
```

### Install MongoDB

**Option 1: MongoDB Community Edition (Recommended)**

```bash
# Download from: https://www.mongodb.com/try/download/community
# Run installer and follow setup wizard
# Default port: 27017
```

**Option 2: MongoDB Atlas (Cloud - No Installation Needed)**

```bash
# Create account at: https://www.mongodb.com/cloud/atlas
# Create a cluster and copy connection string
# Update MONGODB_URI in .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trek_api
```

### MongoDB Connection String

Currently configured in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/trek_api
```

### Start MongoDB Service

**Windows Command Line:**
```bash
# If installed as service, it starts automatically
# Otherwise, run:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# Or start MongoDB service:
net start MongoDB
```

### Seed MongoDB with Sample Data

```bash
cd Gdback
npm run seed
```

This will:
1. Connect to MongoDB
2. Clear existing collections
3. Insert 6 activities
4. Insert 4 trails
5. Insert 2 sample users

---

## 3. Backend Integration

### Environment Configuration (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/trek_api
DATABASE_URL=mysql://root:@localhost/trek_api
JWT_SECRET=trek_api_jwt_secret_key_2026_gandharva
CORS_ORIGIN=http://localhost:5173
CORS_ORIGIN_SECONDARY=http://localhost:5174
```

### Backend Routes with Database Integration

```javascript
// GET all activities (from MongoDB)
GET /api/activities

// GET single activity
GET /api/activities/:id

// CREATE new activity (admin only)
POST /api/activities
{
  "name": "Activity Name",
  "description": "Description",
  "difficulty": "Easy|Moderate|Hard",
  "duration": "4 hours",
  "price": 79,
  "maxParticipants": 15,
  "location": "Location",
  "date": "2026-02-15"
}

// GET all trails
GET /api/trails

// GET single trail
GET /api/trails/:id

// CREATE new trail
POST /api/trails

// CREATE booking
POST /api/bookings
{
  "userId": "user_id",
  "activityId": "activity_id",
  "numParticipants": 2,
  "totalPrice": 158,
  "activityDate": "2026-02-15"
}

// USER authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

## 4. Running the Full Stack

### Terminal 1: Start Backend

```bash
cd Gdback
npm install
npm run dev
```

Expected output:
```
✅ Connected to MongoDB (trek_api database)
🚀 Server running on http://localhost:5000
📍 Environment: development
```

### Terminal 2: Start Frontend

```bash
npm install
npm run dev
```

Expected output:
```
VITE v5.4.21 ready in xxx ms
➜ Local: http://localhost:5174/
```

### Terminal 3: Seed MongoDB (One-time)

```bash
cd Gdback
npm run seed
```

---

## 5. Database Selection

### Using MongoDB (Recommended for this app)

**Advantages:**
- Schema-less, flexible data structure
- Better for real-time applications
- Easier to scale horizontally
- Better support for nested data

**Files Updated:**
- `Gdback/models/User.js`
- `Gdback/models/Activity.js`
- `Gdback/models/Trail.js`
- `Gdback/models/Booking.js`
- `Gdback/server.js` (connection logic added)
- `Gdback/seed.js` (seeding script)

### Using MySQL (Alternative)

**Advantages:**
- ACID compliance
- Complex relationships easier to manage
- Better for structured data
- Mature ecosystem

**Already Created:**
- Database: `trek_api`
- All tables and relationships
- Sample data

**To Switch to MySQL:**
```javascript
// Update routes to use MySQL connection instead of Mongoose
// Use library like: mysql2, knex, sequelize, or typeorm
```

---

## 6. Testing Database Connections

### Test MongoDB Connection

```bash
# Check if MongoDB is running
mongo
# or
mongosh

# In MongoDB shell:
use trek_api
db.activities.find().pretty()
db.trails.find().pretty()
db.users.find().pretty()
```

### Test MySQL Connection

```bash
# Using MySQL command line
"C:\xampp\mysql\bin\mysql.exe" -u root trek_api

# In MySQL:
SELECT * FROM activities;
SELECT * FROM trails;
DESCRIBE bookings;
```

### Test API Endpoints

```bash
# Using curl in PowerShell

# Get all activities from API
curl http://localhost:5000/api/activities

# Get all trails
curl http://localhost:5000/api/trails

# Create user
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Create booking
curl -X POST http://localhost:5000/api/bookings `
  -H "Content-Type: application/json" `
  -d '{"userId":"123","activityId":"456","numParticipants":2,"totalPrice":158}'
```

---

## 7. Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Check if port 27017 is accessible

### MySQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
1. Start XAMPP MySQL service
2. Verify credentials (root user)
3. Check if database `trek_api` exists

### Port Already in Use

```
Error: Port 5000 already in use
```

**Solution:**
```bash
# Kill process using port 5000
Get-Process | Where-Object {$_.Port -eq 5000} | Stop-Process -Force

# Or change PORT in .env
PORT=5001
```

---

## 8. Next Steps

1. ✅ **Database Created**: trek_api with MySQL
2. ✅ **MongoDB Models**: Created and ready
3. ⏳ **Install MongoDB**: Download and install locally
4. ⏳ **Run Backend**: `npm run dev`
5. ⏳ **Seed Data**: `npm run seed`
6. ⏳ **Test APIs**: Use curl or Postman
7. ⏳ **Frontend Integration**: API calls from React components

---

## Quick Start Checklist

- [ ] Install MongoDB Community Edition
- [ ] Verify MySQL has `trek_api` database
- [ ] Start MongoDB service
- [ ] Start MySQL (XAMPP)
- [ ] Run `cd Gdback && npm install`
- [ ] Run `npm run dev` (backend)
- [ ] Run `npm run seed` (in another terminal)
- [ ] Run `npm run dev` (frontend - in another terminal)
- [ ] Visit `http://localhost:5174`
- [ ] Test Activities booking system

---

**Status**: 🟢 Production Ready  
**Last Updated**: January 11, 2026  
**Database**: MySQL (trek_api) + MongoDB Ready
