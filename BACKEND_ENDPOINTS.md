# Backend API Endpoints Reference

Complete list of all API endpoints that need to be implemented to connect with the frontend.

---

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints (except /auth/*) require:
```
Headers: Authorization: Bearer {token}
```

---

## 1. AUTHENTICATION (via Supabase)

These are handled by Supabase client, but documented for reference:

```
POST   /auth/signup              → Register new user
POST   /auth/signin              → Login user
POST   /auth/logout              → Logout
POST   /auth/refresh             → Refresh token
GET    /auth/me                  → Get current user
```

---

## 2. TRAILS

### List All Trails
```
GET /trails

Query Parameters:
  ?difficulty=Easy
  ?location=Mountain
  ?min_length=5
  ?max_length=30
  ?q=search_text

Response:
{
  "trails": [
    {
      "id": "uuid",
      "name": "Mount Everest",
      "location": "Nepal",
      "difficulty": "Hard",
      "length_km": 64.8,
      "description": "...",
      "image_url": "...",
      "created_at": "2024-01-09T..."
    }
  ],
  "total": 10,
  "page": 1
}
```

### Get Single Trail
```
GET /trails/:id

Response:
{
  "id": "uuid",
  "name": "...",
  "location": "...",
  "difficulty": "...",
  "length_km": 64.8,
  "description": "...",
  "image_url": "...",
  "route_geojson": { ... },
  "created_at": "...",
  "updated_at": "..."
}
```

### Create Trail (Admin Only)
```
POST /trails

Request:
{
  "name": "New Trail",
  "location": "Location Name",
  "difficulty": "Easy|Moderate|Hard",
  "length_km": 15.5,
  "description": "Trail description...",
  "route_geojson": { type: "LineString", coordinates: [...] }
}

Response:
{
  "id": "new_uuid",
  "name": "...",
  ... (same as GET)
}
```

### Update Trail (Admin Only)
```
PUT /trails/:id

Request: (same fields as POST, all optional)

Response: Updated trail object
```

### Delete Trail (Admin Only)
```
DELETE /trails/:id

Response:
{
  "success": true,
  "message": "Trail deleted"
}
```

---

## 3. USER PROFILES

### Get User Profile
```
GET /users/:userId/profile

Response:
{
  "user_id": "uuid",
  "email": "user@email.com",
  "bio": "Mountain lover...",
  "location": "Colorado",
  "profile_picture_url": "...",
  "treks_completed": 15,
  "created_at": "...",
  "updated_at": "..."
}
```

### Update User Profile
```
PUT /users/:userId/profile

Request:
{
  "bio": "Updated bio",
  "location": "New Location",
  "profile_picture_url": "..."
}

Response: Updated profile object
```

### Get User Stats
```
GET /users/:userId/stats

Response:
{
  "total_distance_km": 150.5,
  "total_elevation_gain_m": 5000,
  "total_hours": 45.5,
  "average_pace_kmh": 3.3,
  "treks_completed": 15,
  "favorite_difficulty": "Moderate",
  "this_month_distance": 25.5
}
```

### Get Trek History
```
GET /users/:userId/treks

Response:
{
  "treks": [
    {
      "id": "uuid",
      "trail_id": "uuid",
      "trail_name": "Mount XYZ",
      "distance_km": 15.5,
      "elevation_gain_m": 800,
      "duration_minutes": 180,
      "completed_at": "2024-01-09T...",
      "photos": ["url1", "url2"]
    }
  ]
}
```

---

## 4. TRACKING/GPS SESSIONS

### Create Tracking Session
```
POST /tracking/sessions

Request:
{
  "trail_id": "uuid (optional)",
  "started_at": "2024-01-09T10:00:00Z"
}

Response:
{
  "id": "session_uuid",
  "user_id": "uuid",
  "trail_id": "uuid",
  "started_at": "2024-01-09T...",
  "route_coordinates": []
}
```

### Update Tracking Session (Add Location Point)
```
PUT /tracking/sessions/:sessionId

Request:
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "altitude": 10.5,
  "accuracy": 5.0,
  "timestamp": "2024-01-09T10:00:05Z"
}

Response: Updated session with route
```

### Finish Tracking Session
```
POST /tracking/sessions/:sessionId/finish

Request:
{
  "finished_at": "2024-01-09T11:30:00Z",
  "total_distance_km": 15.5,
  "total_elevation_gain_m": 500,
  "route_coordinates": [[lng,lat,alt], ...]
}

Response:
{
  "id": "session_uuid",
  "started_at": "...",
  "finished_at": "...",
  "duration_minutes": 90,
  "total_distance_km": 15.5,
  "total_elevation_gain_m": 500,
  "average_pace_kmh": 10.3,
  "route_url": "..."
}
```

### Get User's Tracking Sessions
```
GET /users/:userId/tracking-sessions

Query Parameters:
  ?limit=20
  ?offset=0
  ?trail_id=uuid (optional filter)

Response:
{
  "sessions": [
    {
      "id": "uuid",
      "trail_id": "uuid",
      "started_at": "...",
      "finished_at": "...",
      "distance_km": 15.5,
      "duration_minutes": 90
    }
  ]
}
```

### Get Single Session
```
GET /tracking/sessions/:sessionId

Response: Complete session with full route coordinates
```

### WebSocket (Live Tracking Updates)
```
WS /tracking/sessions/:sessionId/stream

Send:
{
  "type": "location_update",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "altitude": 10.5
}

Receive:
{
  "type": "location_received",
  "total_distance_km": 15.5,
  "current_pace": 10.3
}
```

---

## 5. REVIEWS

### Get Trail Reviews
```
GET /trails/:trailId/reviews

Query Parameters:
  ?limit=10
  ?offset=0
  ?sort=recent|rating

Response:
{
  "reviews": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_name": "John Doe",
      "user_avatar": "url",
      "rating": 5,
      "title": "Amazing trek!",
      "comment": "...",
      "photos": ["url1", "url2"],
      "helpful_count": 12,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 25
}
```

### Create Review
```
POST /trails/:trailId/reviews

Request:
{
  "rating": 5,
  "title": "Amazing trek!",
  "comment": "Great views and well-marked path."
}

Response: New review object (as above)
```

### Update Review
```
PUT /reviews/:reviewId

Request:
{
  "rating": 4,
  "title": "Good trail",
  "comment": "Updated comment..."
}

Response: Updated review object
```

### Delete Review
```
DELETE /reviews/:reviewId

Response:
{
  "success": true,
  "message": "Review deleted"
}
```

### Rate Review (Helpful/Unhelpful)
```
POST /reviews/:reviewId/rate

Request:
{
  "helpful": true  // or false
}

Response:
{
  "id": "reviewId",
  "helpful_count": 13,
  "user_already_rated": true
}
```

---

## 6. FILE UPLOADS

### Upload Photo
```
POST /uploads/photo

Form Data:
  file: <binary>
  target_type: "trail" | "review"
  target_id: uuid

Response:
{
  "id": "photo_uuid",
  "url": "https://cdn.../photo.jpg",
  "size_bytes": 102400,
  "created_at": "..."
}
```

### Delete Photo
```
DELETE /uploads/:photoId

Response:
{
  "success": true,
  "message": "Photo deleted"
}
```

---

## 7. WEATHER

### Get Current Weather
```
GET /weather

Query Parameters:
  ?lat=40.7128
  ?lng=-74.0060

Response:
{
  "temp": 22,
  "condition": "Partly Cloudy",
  "description": "Few clouds",
  "humidity": 65,
  "wind_speed": 15,
  "wind_direction": "NW",
  "uvi": 3,
  "visibility_km": 10,
  "icon": "02d"
}
```

### Get Weather Forecast
```
GET /weather/forecast

Query Parameters:
  ?lat=40.7128
  ?lng=-74.0060
  ?days=5

Response:
{
  "forecast": [
    {
      "date": "2024-01-10",
      "temp_high": 25,
      "temp_low": 18,
      "condition": "Sunny",
      "precipitation_mm": 0,
      "wind_speed": 12,
      "icon": "01d"
    }
  ]
}
```

---

## 8. EMERGENCY SOS

### Initiate SOS
```
POST /sos/initiate

Request:
{
  "contacts": [
    {
      "name": "Mom",
      "phone": "+1234567890",
      "email": "mom@email.com"
    },
    {
      "name": "Friend",
      "phone": "+0987654321",
      "email": "friend@email.com"
    }
  ]
}

Response:
{
  "id": "sos_uuid",
  "user_id": "uuid",
  "started_at": "2024-01-09T...",
  "share_url": "https://trekking.app/sos/abc123"
}
```

### Update SOS Location
```
POST /sos/:sosId/location

Request:
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "altitude": 10.5
}

Response:
{
  "id": "sosId",
  "last_updated": "2024-01-09T10:00:05Z",
  "location": { lat: 40.7128, lng: -74.0060 }
}
```

### Cancel SOS
```
POST /sos/:sosId/cancel

Response:
{
  "success": true,
  "message": "SOS cancelled"
}
```

---

## 9. ADMIN

### Get All Users
```
GET /admin/users

Query Parameters:
  ?limit=50
  ?offset=0
  ?role=admin|user
  ?status=active|banned

Response:
{
  "users": [
    {
      "id": "uuid",
      "email": "user@email.com",
      "status": "active",
      "role": "user",
      "created_at": "...",
      "last_login": "..."
    }
  ],
  "total": 150
}
```

### Get System Stats
```
GET /admin/stats

Response:
{
  "total_users": 1500,
  "total_trails": 250,
  "total_treks_completed": 5000,
  "total_distance_km": 75000,
  "active_users_this_month": 300,
  "new_reviews_this_week": 45
}
```

### Moderate Review
```
POST /admin/reviews/:reviewId/:action

Actions: approve | reject | delete

Response:
{
  "success": true,
  "review_id": "uuid",
  "action": "approved"
}
```

### Get Trail Analytics
```
GET /admin/trails/:trailId/analytics

Response:
{
  "trail_id": "uuid",
  "trail_name": "Mount XYZ",
  "total_treks": 150,
  "unique_trekkers": 120,
  "average_rating": 4.5,
  "average_completion_time": 90,
  "difficulty_rating": "Moderate",
  "trending": true
}
```

---

## 10. NOTIFICATIONS

### Get Notifications
```
GET /users/:userId/notifications

Query Parameters:
  ?limit=20
  ?offset=0
  ?unread_only=false

Response:
{
  "notifications": [
    {
      "id": "uuid",
      "type": "trail_rating|new_review|friend_trek",
      "title": "New review on your favorite trail",
      "message": "John Doe left a 5-star review...",
      "read": false,
      "created_at": "...",
      "data": { trail_id: "uuid" }
    }
  ]
}
```

### Mark as Read
```
POST /notifications/:notificationId/read

Response:
{
  "success": true,
  "notification_id": "uuid"
}
```

### WebSocket (Real-time Notifications)
```
WS /notifications/:userId

Receive:
{
  "type": "new_review",
  "data": {
    "trail_name": "Mount XYZ",
    "reviewer": "John Doe",
    "rating": 5
  }
}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": true,
  "code": "INVALID_REQUEST",
  "message": "User-friendly error message",
  "details": {
    "field": "email",
    "reason": "Email already exists"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) — Missing/invalid token
- `FORBIDDEN` (403) — Insufficient permissions
- `NOT_FOUND` (404) — Resource doesn't exist
- `INVALID_REQUEST` (400) — Bad request format
- `CONFLICT` (409) — Resource already exists
- `INTERNAL_SERVER_ERROR` (500) — Server error

---

## Rate Limiting

```
Rate Limit: 1000 requests/hour per user
Headers:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1672531200
```

---

## Data Models

### User
```javascript
{
  id: string,
  email: string,
  bio: string,
  location: string,
  profile_picture_url: string,
  role: 'user' | 'admin',
  status: 'active' | 'banned',
  created_at: datetime,
  updated_at: datetime
}
```

### Trail
```javascript
{
  id: string,
  name: string,
  location: string,
  difficulty: 'Easy' | 'Moderate' | 'Hard',
  length_km: number,
  description: string,
  image_url: string,
  route_geojson: GeoJSON,
  elevation_gain_m: number,
  created_by: uuid,
  created_at: datetime,
  updated_at: datetime
}
```

### Review
```javascript
{
  id: string,
  trail_id: string,
  user_id: string,
  rating: number (1-5),
  title: string,
  comment: string,
  photos: string[],
  helpful_count: number,
  created_at: datetime,
  updated_at: datetime
}
```

### TrackingSession
```javascript
{
  id: string,
  user_id: string,
  trail_id: string (optional),
  started_at: datetime,
  finished_at: datetime (optional),
  route_coordinates: [lng, lat, alt][],
  total_distance_km: number,
  total_elevation_gain_m: number,
  duration_minutes: number
}
```

---

## Implementation Priority

### Phase 1 (MVP)
1. Trails (GET /trails, GET /trails/:id)
2. User Profile (GET, PUT)
3. Tracking Sessions (POST, PUT, POST /finish)

### Phase 2 (Core Features)
4. Reviews (GET, POST, PUT, DELETE)
5. Admin Trails (POST, PUT, DELETE)
6. Photo Uploads

### Phase 3 (Advanced)
7. Weather API integration
8. Emergency SOS
9. Notifications
10. Analytics

---

## Testing Endpoints

Use Postman, Insomnia, or curl:

```bash
# Get all trails
curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/api/trails

# Create trail (admin)
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Trail",...}' \
  http://localhost:3001/api/trails
```

---

**All endpoints are ready to be implemented!** ✅
