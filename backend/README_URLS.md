# 🚀 Backend Server - URLs & API Endpoints

**Status**: ✅ Running on http://localhost:5000

## Server Information

- **URL**: http://localhost:5000
- **Port**: 5000
- **Environment**: Development
- **Database**: MySQL (trek_api)

---

## 📡 API Base URL

```
http://localhost:5000
```

All endpoints use this base URL.

---

## 🗺️ API Routes & Endpoints

### 🧗 Climbing Routes
**File**: `routes/climbing.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/climbing` | Get all climbing spots with optional filters |
| GET | `/api/climbing/:id` | Get single climbing spot by ID |
| POST | `/api/climbing` | Create new climbing spot |
| PUT | `/api/climbing/:id` | Update climbing spot |
| DELETE | `/api/climbing/:id` | Delete climbing spot |

**Query Parameters**: `?difficulty=Easy&rockType=Granite&location=Kathmandu`

**Example URLs**:
```
GET http://localhost:5000/api/climbing
GET http://localhost:5000/api/climbing/9
GET http://localhost:5000/api/climbing?difficulty=Hard
POST http://localhost:5000/api/climbing
PUT http://localhost:5000/api/climbing/9
DELETE http://localhost:5000/api/climbing/9
```

---

### 🥾 Trails Routes
**File**: `routes/trails.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trails` | Get all trails |
| GET | `/api/trails/:id` | Get single trail |
| POST | `/api/trails` | Create trail |
| PUT | `/api/trails/:id` | Update trail |
| DELETE | `/api/trails/:id` | Delete trail |

**Example URLs**:
```
GET http://localhost:5000/api/trails
GET http://localhost:5000/api/trails/1
POST http://localhost:5000/api/trails
PUT http://localhost:5000/api/trails/1
DELETE http://localhost:5000/api/trails/1
```

---

### 🎯 Activities Routes
**File**: `routes/activities.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get all activities |
| GET | `/api/activities/:id` | Get single activity |
| POST | `/api/activities` | Create activity |
| PUT | `/api/activities/:id` | Update activity |
| DELETE | `/api/activities/:id` | Delete activity |

**Example URLs**:
```
GET http://localhost:5000/api/activities
GET http://localhost:5000/api/activities/1
POST http://localhost:5000/api/activities
PUT http://localhost:5000/api/activities/1
DELETE http://localhost:5000/api/activities/1
```

---

### 🏔️ Destinations Routes
**File**: `routes/destinations.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | Get all destinations |
| GET | `/api/destinations/:id` | Get single destination |
| POST | `/api/destinations` | Create destination |
| PUT | `/api/destinations/:id` | Update destination |
| DELETE | `/api/destinations/:id` | Delete destination |

**Example URLs**:
```
GET http://localhost:5000/api/destinations
GET http://localhost:5000/api/destinations/1
POST http://localhost:5000/api/destinations
PUT http://localhost:5000/api/destinations/1
DELETE http://localhost:5000/api/destinations/1
```

---

### 📅 Bookings Routes
**File**: `routes/bookings.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:id` | Get single booking |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Delete booking |

**Example URLs**:
```
GET http://localhost:5000/api/bookings
POST http://localhost:5000/api/bookings
PUT http://localhost:5000/api/bookings/1
DELETE http://localhost:5000/api/bookings/1
```

---

### ⭐ Reviews Routes
**File**: `routes/reviews.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | Get all reviews |
| GET | `/api/trails/:trailId/reviews` | Get reviews for trail |
| GET | `/api/climbing/:climbingId/reviews` | Get reviews for climbing spot |
| POST | `/api/reviews` | Create review |
| DELETE | `/api/reviews/:id` | Delete review |

**Example URLs**:
```
GET http://localhost:5000/api/reviews
GET http://localhost:5000/api/trails/1/reviews
GET http://localhost:5000/api/climbing/9/reviews
POST http://localhost:5000/api/reviews
DELETE http://localhost:5000/api/reviews/1
```

---

### 🔐 Auth Routes
**File**: `routes/auth.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/verify` | Verify email |

**Example URLs**:
```
POST http://localhost:5000/api/auth/signup
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/logout
POST http://localhost:5000/api/auth/verify
```

---

### 📤 Upload Routes
**File**: `routes/upload.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload image/file |
| GET | `/api/upload/:filename` | Download file |

**Example URLs**:
```
POST http://localhost:5000/api/upload
GET http://localhost:5000/api/upload/image.jpg
```

---

### 👥 Users Routes
**File**: `routes/users.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| POST | `/api/users/profile` | Update user profile |

**Example URLs**:
```
GET http://localhost:5000/api/users
GET http://localhost:5000/api/users/1
PUT http://localhost:5000/api/users/1
POST http://localhost:5000/api/users/profile
```

---

### 🌤️ Weather Routes
**File**: `routes/weather.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather` | Get weather data |
| GET | `/api/weather/:location` | Get weather for location |

**Example URLs**:
```
GET http://localhost:5000/api/weather
GET http://localhost:5000/api/weather/Kathmandu
```

---

### 🖼️ Gallery Routes
**File**: `routes/gallery.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | Get all gallery items |
| POST | `/api/gallery` | Add gallery item |
| DELETE | `/api/gallery/:id` | Delete gallery item |

**Example URLs**:
```
GET http://localhost:5000/api/gallery
POST http://localhost:5000/api/gallery
DELETE http://localhost:5000/api/gallery/1
```

---

## 📊 Total Backend URLs

| Category | Count |
|----------|-------|
| Climbing Endpoints | 5 |
| Trails Endpoints | 5 |
| Activities Endpoints | 5 |
| Destinations Endpoints | 5 |
| Bookings Endpoints | 5 |
| Reviews Endpoints | 5 |
| Auth Endpoints | 4 |
| Upload Endpoints | 2 |
| Users Endpoints | 4 |
| Weather Endpoints | 2 |
| Gallery Endpoints | 3 |
| **Total** | **45 endpoints** |

---

## 🔧 How to Use Backend URLs

### Example: Create Climbing Spot
```bash
POST http://localhost:5000/api/climbing
Content-Type: application/json

{
  "name": "Dragon Wall",
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

### Example: Get Filtered Climbing Spots
```bash
GET http://localhost:5000/api/climbing?difficulty=Hard&location=Kathmandu
```

### Example: Update Climbing Spot
```bash
PUT http://localhost:5000/api/climbing/9
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 3000,
  "height_meters": 55
}
```

---

## 🚀 Start Backend Server

```bash
cd backend
node server.js
```

Server will start on: **http://localhost:5000**

---

## 📝 Notes

- All APIs return JSON responses
- Authentication required for some endpoints
- CORS enabled for frontend (3000) and admin (3001)
- Database: MySQL on localhost:3306
- Default timeout: 30 seconds

---

**Last Updated**: January 17, 2026
**Status**: ✅ All endpoints operational
