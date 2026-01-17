# 🎛️ Admin Dashboard - URLs & Routes

**Status**: ✅ Running on http://localhost:3001

## Admin Information

- **URL**: http://localhost:3001
- **Port**: 3001
- **Framework**: React + Vite
- **Routing**: React Router
- **Purpose**: Manage all content (Climbing, Trails, Activities, Destinations)

---

## 🎯 Admin Base URL

```
http://localhost:3001
```

All admin pages are accessed from this base URL.

---

## 🗺️ Admin Routes & Pages

### 📊 Main Dashboard

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Admin.jsx | Main admin dashboard |

**Example URL**:
```
http://localhost:3001/
```

**Features**:
- Dashboard overview
- Tab-based navigation
- Manage all content types
- Quick statistics

---

## 🧗 Climbing Management
**Tab/Section**: Climbing in Admin.jsx

| Feature | URL | Description |
|---------|-----|-------------|
| Climbing Tab | `http://localhost:3001/` (Climbing tab) | Manage climbing spots |

**What you can do**:
- ✅ View all climbing spots in table format
- ✅ Click "Edit" to modify existing spot
- ✅ Click "Delete" to remove spot
- ✅ Click "New Climbing Spot" to create new spot
- ✅ Upload images with file picker
- ✅ Set prices in NPR
- ✅ Fill in all details: name, location, difficulty, rock type, height, routes count, description

**Form Fields**:
- Name (required)
- Location (required)
- Difficulty (dropdown: Easy, Moderate, Hard)
- Rock Type (required)
- Height in meters (required, number)
- Number of Routes (required, number)
- Price in NPR (optional)
- Description (required, textarea)
- Latitude & Longitude (required)
- Image upload

**API Calls Made**:
```
POST http://localhost:5000/api/climbing (Create)
PUT http://localhost:5000/api/climbing/:id (Update)
DELETE http://localhost:5000/api/climbing/:id (Delete)
GET http://localhost:5000/api/climbing (List)
```

---

## 🥾 Trails Management
**Tab/Section**: Trails in Admin.jsx

| Feature | URL | Description |
|---------|-----|-------------|
| Trails Tab | `http://localhost:3001/` (Trails tab) | Manage trails |

**What you can do**:
- ✅ Add new trails
- ✅ Edit trail information
- ✅ Delete trails
- ✅ Upload trail images
- ✅ Set trail prices
- ✅ Set trail length (km)
- ✅ Set duration

**Form Fields**:
- Name (required)
- Location (required)
- Difficulty
- Length (km)
- Duration
- Price
- Description
- Image upload
- Latitude & Longitude

**API Calls Made**:
```
POST http://localhost:5000/api/trails (Create)
PUT http://localhost:5000/api/trails/:id (Update)
DELETE http://localhost:5000/api/trails/:id (Delete)
GET http://localhost:5000/api/trails (List)
```

---

## 🎯 Activities Management
**Tab/Section**: Activities in Admin.jsx

| Feature | URL | Description |
|---------|-----|-------------|
| Activities Tab | `http://localhost:3001/` (Activities tab) | Manage activities |

**What you can do**:
- ✅ Create new activities
- ✅ Edit activity details
- ✅ Delete activities
- ✅ Upload activity images
- ✅ Set activity prices
- ✅ Set difficulty level
- ✅ Add description

**Form Fields**:
- Name (required)
- Location (required)
- Difficulty
- Price
- Description
- Image upload

**API Calls Made**:
```
POST http://localhost:5000/api/activities (Create)
PUT http://localhost:5000/api/activities/:id (Update)
DELETE http://localhost:5000/api/activities/:id (Delete)
GET http://localhost:5000/api/activities (List)
```

---

## 🏔️ Destinations Management
**Tab/Section**: Destinations in Admin.jsx

| Feature | URL | Description |
|---------|-----|-------------|
| Destinations Tab | `http://localhost:3001/` (Destinations tab) | Manage destinations |

**What you can do**:
- ✅ Add tourist destinations
- ✅ Edit destination info
- ✅ Delete destinations
- ✅ Upload multiple images (up to 6)
- ✅ Upload multiple videos (up to 3)
- ✅ Set best season
- ✅ Add description

**Form Fields**:
- Name (required)
- Location
- Best Season
- Description
- Multiple Image upload (6 max)
- Multiple Video upload (3 max)

**API Calls Made**:
```
POST http://localhost:5000/api/destinations (Create)
PUT http://localhost:5000/api/destinations/:id (Update)
DELETE http://localhost:5000/api/destinations/:id (Delete)
GET http://localhost:5000/api/destinations (List)
```

---

## 📋 Additional Management Sections

| Feature | URL | Description |
|---------|-----|-------------|
| Bookings | `http://localhost:3001/` (Bookings tab) | View and manage bookings |
| Reviews | `http://localhost:3001/` (Reviews tab) | Moderate user reviews |

**Features**:
- View all bookings
- See booking details
- Track reservation status
- Moderate/approve reviews
- Delete inappropriate reviews

**API Calls Made**:
```
GET http://localhost:5000/api/bookings
GET http://localhost:5000/api/reviews
DELETE http://localhost:5000/api/reviews/:id
```

---

## 📊 Admin Statistics

| Category | Count |
|----------|-------|
| Climbing Management | 1 tab |
| Trails Management | 1 tab |
| Activities Management | 1 tab |
| Destinations Management | 1 tab |
| Bookings Management | 1 tab |
| Reviews Management | 1 tab |
| **Total Tabs** | **6 tabs** |

---

## 🔗 API Calls from Admin

Admin makes API calls to Backend at: **http://localhost:5000**

### Common Admin API Calls:

```javascript
// Get all climbing spots
fetch('http://localhost:5000/api/climbing')

// Create climbing spot
fetch('http://localhost:5000/api/climbing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Dragon Wall',
    location: 'Kathmandu',
    difficulty: 'Hard',
    rockType: 'Granite',
    heightMeters: 50,
    routesCount: 15,
    description: '...',
    price: 2500,
    lat: 27.7089,
    lng: 85.3283,
    image: '🧗'
  })
})

// Update climbing spot
fetch('http://localhost:5000/api/climbing/9', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...updated data...})
})

// Delete climbing spot
fetch('http://localhost:5000/api/climbing/9', {
  method: 'DELETE'
})

// Upload image
const formData = new FormData()
formData.append('image', fileInput.files[0])
fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
})
```

---

## 📁 Admin File Structure

```
admin/
├── src/
│   ├── pages/
│   │   ├── Admin.jsx (Main admin dashboard with all tabs)
│   │   └── SignIn.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ImageUpload.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── apiClient.js (Defines http://localhost:5000 URLs)
│   │   └── supabaseClient.js
│   ├── App.jsx (Route definitions)
│   └── main.jsx
└── index.html
```

---

## 🔐 Admin Access

### Login Required
- All admin pages require authentication
- Unauthenticated users directed to: `http://localhost:3001/signin`

### Access URLs:
```
http://localhost:3001/ → Requires login, redirects to signin if not authenticated
http://localhost:3001/signin → Public, allows login
```

---

## 👨‍💼 Admin Workflow Example

### Creating a Climbing Spot:

1. Visit: `http://localhost:3001/`
2. Login with admin credentials
3. Click on "Climbing" tab (already on dashboard)
4. Click "New Climbing Spot" button
5. Fill in the form:
   - Name: "Dragon Wall"
   - Location: "Kathmandu"
   - Difficulty: "Hard"
   - Rock Type: "Granite"
   - Height: 50 meters
   - Routes: 15
   - Price: 2500 NPR
   - Description: "..."
   - Image: upload file
   - Latitude: 27.7089
   - Longitude: 85.3283
6. Click "Create Climbing Spot"
7. Automatically added to database
8. New spot appears in the climbing spots table
9. Shows in frontend at: `http://localhost:3000/climbing/:id`

---

## 🎯 Tab Navigation

All management is done through tabs on one main page:

```
Admin Dashboard (http://localhost:3001/)
├── Climbing Tab
├── Trails Tab
├── Activities Tab
├── Destinations Tab
├── Bookings Tab
└── Reviews Tab
```

Simply click the tab to switch sections. No page reload required.

---

## 📸 Image Upload Flow

1. Click "Image/Icon" in form
2. Select image file
3. File uploaded to: `http://localhost:5000/api/upload`
4. Image URL returned
5. Image preview shown in form
6. Image saved to database when form submitted
7. Image accessible in frontend at: `http://localhost:5000/uploads/{filename}`

---

## ✨ Features by Tab

### Climbing Tab
- [x] View all spots in table
- [x] Create new spot with form
- [x] Edit existing spot
- [x] Delete spot (confirm dialog)
- [x] Image upload with preview
- [x] Price management (₨ NPR)
- [x] Complete form validation

### Trails Tab
- [x] Same CRUD features as Climbing
- [x] Length (km) field
- [x] Duration field
- [x] Difficulty selector

### Activities Tab
- [x] Same CRUD features
- [x] Simplified form (fewer fields)
- [x] Image upload
- [x] Price & difficulty

### Destinations Tab
- [x] Multiple image upload (up to 6)
- [x] Multiple video upload (up to 3)
- [x] Best season field
- [x] Rich description

### Bookings Tab
- [x] View all bookings
- [x] See booking status
- [x] Track reservations

### Reviews Tab
- [x] View all reviews
- [x] Moderate content
- [x] Delete reviews
- [x] See ratings

---

## 🚀 Start Admin Server

```bash
cd admin
npm install
npm run dev
```

Server will start on: **http://localhost:3001**

---

## 📝 Notes

- Single-page dashboard with tabs
- No page refresh when switching tabs
- Real-time data updates
- Form validation on all inputs
- Image upload with preview
- Responsive design
- Protected routes (requires login)

---

**Last Updated**: January 17, 2026
**Status**: ✅ All admin functions operational
**Connected to Backend**: http://localhost:5000
**Admin Port**: 3001
