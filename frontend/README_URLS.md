# 💻 Frontend Client - URLs & Routes

**Status**: ✅ Running on http://localhost:3000

## Client Information

- **URL**: http://localhost:3000
- **Port**: 3000
- **Framework**: React + Vite
- **Routing**: React Router

---

## 🌐 Frontend Base URL

```
http://localhost:3000
```

All pages are accessed from this base URL.

---

## 🗺️ Frontend Routes & Pages

### 🏠 Main Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home.jsx | Home/landing page |
| `/about` | About.jsx | About page |
| `/contact` | Contact.jsx | Contact us form |

**Example URLs**:
```
http://localhost:3000/
http://localhost:3000/about
http://localhost:3000/contact
```

---

### 🧗 Climbing Routes
**Component**: `pages/Climbing.jsx` & `pages/ClimbingDetail.jsx`

| Route | Component | Description |
|-------|-----------|-------------|
| `/climbing` | Climbing.jsx | List all climbing spots |
| `/climbing/:id` | ClimbingDetail.jsx | View single climbing spot detail |

**Example URLs**:
```
http://localhost:3000/climbing
http://localhost:3000/climbing/9
http://localhost:3000/climbing/10
http://localhost:3000/climbing/13
```

**Features**:
- Filter by difficulty, rock type, location
- View all climbing spots with pricing
- Click "View Details" to see complete information
- Contact Us button redirects to `/contact`
- Reviews section
- Price display in NPR format (₨)

---

### 🥾 Trails Routes
**Component**: `pages/Trails.jsx` & `pages/TrailDetail.jsx`

| Route | Component | Description |
|-------|-----------|-------------|
| `/trails` | Trails.jsx | List all hiking trails |
| `/trails/:id` | TrailDetail.jsx | View single trail detail |

**Example URLs**:
```
http://localhost:3000/trails
http://localhost:3000/trails/1
http://localhost:3000/trails/2
```

**Features**:
- Filter by difficulty
- View trail details with pricing
- Reviews integration
- Contact form link

---

### 🎯 Activities Routes
**Component**: `pages/Activities.jsx` & `pages/ActivityDetail.jsx`

| Route | Component | Description |
|-------|-----------|-------------|
| `/activities` | Activities.jsx | List all activities |
| `/activities/:id` | ActivityDetail.jsx | View single activity detail |

**Example URLs**:
```
http://localhost:3000/activities
http://localhost:3000/activities/1
http://localhost:3000/activities/5
```

**Features**:
- Browse adventure activities
- View detailed information
- Check pricing
- Contact us button
- Reviews

---

### 🏔️ Destinations Routes
**Component**: `pages/Destinations.jsx` & `pages/DestinationDetail.jsx`

| Route | Component | Description |
|-------|-----------|-------------|
| `/destinations` | Destinations.jsx | List all destinations |
| `/destinations/:id` | DestinationDetail.jsx | View destination details |

**Example URLs**:
```
http://localhost:3000/destinations
http://localhost:3000/destinations/1
http://localhost:3000/destinations/2
```

**Features**:
- Browse tourist destinations
- View multiple images
- Get detailed information
- Check availability

---

### 📅 Bookings Routes
**Component**: `pages/Bookings.jsx`

| Route | Component | Description |
|--------|-----------|-------------|
| `/bookings` | Bookings.jsx | View user bookings |

**Example URLs**:
```
http://localhost:3000/bookings
```

**Features**:
- View all user bookings
- Manage reservations
- Track booking status

---

### 👤 Authentication Routes
**Component**: `pages/SignIn.jsx` & `pages/SignUp.jsx`

| Route | Component | Description |
|--------|-----------|-------------|
| `/signin` | SignIn.jsx | User login page |
| `/signup` | SignUp.jsx | User registration page |

**Example URLs**:
```
http://localhost:3000/signin
http://localhost:3000/signup
```

**Features**:
- User login
- User registration
- Email verification
- Password reset

---

### 👥 Profile Route
**Component**: `pages/Profile.jsx`

| Route | Component | Description |
|--------|-----------|-------------|
| `/profile` | Profile.jsx | User profile page |

**Example URLs**:
```
http://localhost:3000/profile
```

**Features**:
- View user profile
- Edit profile information
- Change password
- Manage preferences

---

### ⭐ Reviews Route
**Component**: `pages/Reviews.jsx`

| Route | Component | Description |
|--------|-----------|-------------|
| `/reviews` | Reviews.jsx | User reviews page |

**Example URLs**:
```
http://localhost:3000/reviews
```

**Features**:
- View all user reviews
- Submit new reviews
- Rate experiences

---

## 📊 Total Frontend URLs

| Category | Count |
|----------|-------|
| Main Pages | 3 |
| Climbing Routes | 2 |
| Trails Routes | 2 |
| Activities Routes | 2 |
| Destinations Routes | 2 |
| Bookings Routes | 1 |
| Auth Routes | 2 |
| Profile Route | 1 |
| Reviews Route | 1 |
| **Total** | **16 routes** |

---

## 🔗 API Calls from Frontend

Frontend makes API calls to Backend at: **http://localhost:5000**

### Example API Calls:

```javascript
// Get climbing spots
fetch('http://localhost:5000/api/climbing')

// Get single climbing spot
fetch('http://localhost:5000/api/climbing/9')

// Get with filters
fetch('http://localhost:5000/api/climbing?difficulty=Hard')

// Create booking
fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  body: JSON.stringify({...})
})

// Submit review
fetch('http://localhost:5000/api/reviews', {
  method: 'POST',
  body: JSON.stringify({...})
})
```

---

## 📁 Frontend File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Climbing.jsx
│   │   ├── ClimbingDetail.jsx
│   │   ├── Trails.jsx
│   │   ├── TrailDetail.jsx
│   │   ├── Activities.jsx
│   │   ├── ActivityDetail.jsx
│   │   ├── Destinations.jsx
│   │   ├── DestinationDetail.jsx
│   │   ├── Bookings.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── Profile.jsx
│   │   └── Reviews.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ReviewList.jsx
│   │   ├── ReviewForm.jsx
│   │   └── ...
│   ├── lib/
│   │   └── apiClient.js (Defines http://localhost:5000 URLs)
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx (Route definitions)
│   └── main.jsx
└── index.html
```

---

## 🌍 URL Navigation Examples

### User Journey - Climbing Feature

1. User opens: `http://localhost:3000/`
2. User clicks "Climbing" → goes to `http://localhost:3000/climbing`
3. User filters by "Hard" difficulty
4. User clicks "View Details" on Dragon Wall → goes to `http://localhost:3000/climbing/9`
5. On detail page, user clicks "Contact Us" → goes to `http://localhost:3000/contact`
6. User submits contact form

### User Journey - Activity

1. User opens: `http://localhost:3000/activities`
2. User clicks activity card → goes to `http://localhost:3000/activities/1`
3. User clicks "Contact Us to Book" → goes to `http://localhost:3000/contact`
4. Submit form to get booking information

---

## 🔐 Protected Routes

Some routes require authentication:
- `/bookings` - requires login
- `/profile` - requires login
- `/reviews` - requires login

Unauthenticated users redirected to: `http://localhost:3000/signin`

---

## 🚀 Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

Server will start on: **http://localhost:3000**

---

## 📝 Notes

- All routes use React Router
- Dynamic routes use `:id` parameter (e.g., `/climbing/:id`)
- API calls use `http://localhost:5000` base URL
- Responsive design for mobile and desktop
- Navigation via Header component

---

**Last Updated**: January 17, 2026
**Status**: ✅ All routes operational
**Connected to Backend**: http://localhost:5000
