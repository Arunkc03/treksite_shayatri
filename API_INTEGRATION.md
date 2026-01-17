# Frontend API Integration Guide

This document explains the frontend API scaffolding and how to connect the backend services.

## Architecture

The frontend is structured with a centralized **API Client** layer (`src/lib/apiClient.js`) that manages all communication with the backend. This ensures consistency, easy error handling, and simplified maintenance.

### Key Features:
- ✅ Modularized API calls organized by feature
- ✅ Centralized error handling
- ✅ Loading and error state management in all pages
- ✅ Ready for backend integration
- ✅ Fallback to local data during development

---

## API Modules

### 1. **Trails API** (`trailsAPI`)
```javascript
trailsAPI.getAll(filters)        // Get all trails with optional filters
trailsAPI.getById(id)            // Get single trail
trailsAPI.create(data)           // Create new trail (admin)
trailsAPI.update(id, data)       // Update trail (admin)
trailsAPI.delete(id)             // Delete trail (admin)
```

**Usage in Trails.jsx:**
```javascript
const data = await trailsAPI.getAll({
  difficulty: 'Easy',
  min_length: 5,
  max_length: 20,
  location: 'Mountain'
})
```

---

### 2. **Profile API** (`profileAPI`)
```javascript
profileAPI.getProfile(userId)    // Get user profile
profileAPI.updateProfile(userId, data)  // Update profile
profileAPI.getTrekHistory(userId)       // Get user's treks
profileAPI.getStats(userId)             // Get user stats
```

**Usage in Profile.jsx:**
```javascript
const profile = await profileAPI.getProfile(user.id)
const stats = await profileAPI.getStats(user.id)
```

---

### 3. **Tracking API** (`trackingAPI`)
```javascript
trackingAPI.createSession(trailId, data)     // Start tracking
trackingAPI.updateSession(sessionId, data)   // Update with location
trackingAPI.finishSession(sessionId, data)   // End tracking
trackingAPI.getSessions(userId)              // Get user's sessions
trackingAPI.getSession(sessionId)            // Get session details
trackingAPI.subscribeToSession(sessionId, callback)  // WebSocket stream
```

**Usage in Tracking.jsx:**
```javascript
const session = await trackingAPI.createSession(trailId, {
  started_at: new Date()
})

// Send location updates
await trackingAPI.updateSession(session.id, {
  latitude: 40.7128,
  longitude: -74.0060,
  altitude: 100
})

// Finish trek
await trackingAPI.finishSession(session.id, {
  finished_at: new Date(),
  total_distance_km: 15.5,
  total_elevation_gain_m: 500,
  route_coordinates: [[lng,lat], ...]
})
```

---

### 4. **Reviews API** (`reviewsAPI`)
```javascript
reviewsAPI.getByTrail(trailId)   // Get reviews for trail
reviewsAPI.create(trailId, data) // Create review
reviewsAPI.update(reviewId, data)// Update review
reviewsAPI.delete(reviewId)      // Delete review
reviewsAPI.rate(reviewId, helpful) // Mark as helpful/unhelpful
```

**Usage in Reviews.jsx:**
```javascript
const reviews = await reviewsAPI.getByTrail(trailId)

const newReview = await reviewsAPI.create(trailId, {
  rating: 5,
  title: 'Amazing trek!',
  comment: 'Stunning views and well-marked path.'
})
```

---

### 5. **Upload API** (`uploadAPI`)
```javascript
uploadAPI.uploadPhoto(file, targetType, targetId)  // Upload to trail/review
uploadAPI.deletePhoto(photoId)                      // Delete photo
```

**Usage in Reviews.jsx:**
```javascript
const response = await uploadAPI.uploadPhoto(
  file,
  'review',  // 'trail' or 'review'
  reviewId
)
```

---

### 6. **Weather API** (`weatherAPI`)
```javascript
weatherAPI.getWeather(lat, lng)          // Get current weather
weatherAPI.getForecast(lat, lng, days)   // Get weather forecast
```

**Usage in TrailDetail.jsx:**
```javascript
const weather = await weatherAPI.getWeather(40.7128, -74.0060)
const forecast = await weatherAPI.getForecast(40.7128, -74.0060, 5)
```

---

### 7. **Emergency SOS API** (`sosAPI`)
```javascript
sosAPI.initiateSOS(emergencyContacts)    // Activate SOS
sosAPI.updateLocation(sosId, lat, lng)   // Update location
sosAPI.cancelSOS(sosId)                  // Cancel SOS
```

**Usage in EmergencySOS.jsx:**
```javascript
const sos = await sosAPI.initiateSOS([
  { name: 'Mom', phone: '+1234567890', email: 'mom@email.com' },
  { name: 'Friend', phone: '+0987654321', email: 'friend@email.com' }
])

// Update location in real-time
setInterval(() => {
  navigator.geolocation.getCurrentPosition((pos) => {
    sosAPI.updateLocation(sos.id, pos.coords.latitude, pos.coords.longitude)
  })
}, 5000)
```

---

### 8. **Admin API** (`adminAPI`)
```javascript
adminAPI.getUsers()                // Get all users
adminAPI.getStats()                // Get system stats
adminAPI.moderateReview(reviewId, action)  // Approve/reject/delete review
adminAPI.getTrailAnalytics(trailId)        // Get trail analytics
```

---

### 9. **Notifications API** (`notificationsAPI`)
```javascript
notificationsAPI.getNotifications(userId)  // Get notifications
notificationsAPI.markAsRead(notificationId) // Mark as read
notificationsAPI.subscribe(userId, callback) // WebSocket stream
```

---

## Backend Integration Steps

### Step 1: Environment Setup
Create a `.env.local` file in the project root:
```bash
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
VITE_MAPBOX_TOKEN=xxxxx
```

### Step 2: Uncomment Backend Calls
In each component/page, find commented sections like:
```javascript
// When backend is ready, uncomment:
// const data = await trailsAPI.getAll()
// setTrails(data.trails || [])
```

Replace with the active code and remove the local data fallback.

### Step 3: Implement Backend Endpoints
Create corresponding REST/GraphQL endpoints:

**Example REST structure:**
```
GET    /api/trails
GET    /api/trails/:id
POST   /api/trails                (admin)
PUT    /api/trails/:id            (admin)
DELETE /api/trails/:id            (admin)

GET    /api/users/:userId/profile
PUT    /api/users/:userId/profile
GET    /api/users/:userId/stats

POST   /api/tracking/sessions
PUT    /api/tracking/sessions/:id
POST   /api/tracking/sessions/:id/finish

GET    /api/trails/:id/reviews
POST   /api/trails/:id/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id

POST   /api/sos/initiate
POST   /api/sos/:id/location
POST   /api/sos/:id/cancel

... (etc for other APIs)
```

### Step 4: Database Schema
Create tables for:
- `users` (extended profile: bio, location, trek_count)
- `trails` (name, location, difficulty, length_km, description, geometry)
- `tracking_sessions` (user_id, trail_id, started_at, finished_at, route)
- `reviews` (trail_id, user_id, rating, title, comment, created_at)
- `photos` (url, trail_id/review_id, uploaded_at)
- `sos_sessions` (user_id, started_at, emergency_contacts, route)

---

## Current Frontend Status

### ✅ Completed
- Trails listing & filtering with API scaffold
- Profile management with API scaffold
- GPS tracking with API scaffold & real-time location updates
- Reviews & photo uploads with API scaffold
- Weather forecast display with API scaffold
- Admin Trek CRUD interface with API scaffold
- Emergency SOS component with location sharing
- Loading/error states on all pages
- Fallback to local data for development

### 🔄 In Progress (Backend Ready)
- Connect all APIs to backend endpoints
- Database persistence
- Real-time WebSocket updates for tracking
- Admin analytics & reporting
- PWA offline support

---

## Testing Checklist

Before connecting backend:
- [ ] All API calls have try-catch error handling
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Local fallback data works for demo purposes
- [ ] Forms collect proper data structures
- [ ] File uploads use FormData API
- [ ] Authentication token is included in headers

---

## Frontend Pages Map

| Page | File | Status | Backend Ready |
|------|------|--------|---------------|
| Home | `Home.jsx` | ✅ | Yes |
| Trails | `Trails.jsx` | ✅ API Scaffold | Ready |
| Trail Detail | `TrailDetail.jsx` | ✅ API Scaffold | Ready |
| Profile | `Profile.jsx` | ✅ API Scaffold | Ready |
| Tracking | `Tracking.jsx` | ✅ API Scaffold | Ready |
| Admin | `Admin.jsx` | ✅ API Scaffold | Ready |
| Reviews | `Reviews.jsx` | ✅ API Scaffold | Ready |
| SOS | `EmergencySOS.jsx` | ✅ API Scaffold | Ready |
| Auth (Sign In) | `SignIn.jsx` | ✅ Supabase | Connected |
| Auth (Sign Up) | `SignUp.jsx` | ✅ Supabase | Connected |

---

## Quick Reference

### To add a new API endpoint:

1. Add function to `apiClient.js`:
```javascript
export const newFeatureAPI = {
  getData: async (params) => {
    return apiCall('/new-endpoint', { 
      method: 'GET'
    })
  }
}
```

2. Import and use in component:
```javascript
import { newFeatureAPI } from '../lib/apiClient'

// In useEffect:
const data = await newFeatureAPI.getData()
```

3. Implement backend route:
```
GET /api/new-endpoint
```

---

## Support

For questions about the API scaffolding or backend integration, refer to:
- `src/lib/apiClient.js` — All API methods
- Individual page files for usage examples
- `ARCHITECTURE.md` — System design overview
