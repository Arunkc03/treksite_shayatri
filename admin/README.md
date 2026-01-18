# Orophiletrek Admin Dashboard

Admin dashboard for managing the Orophiletrek Trekking Platform.

## Features

- **Dashboard Overview** - View statistics for treks, activities, climbing spots, bookings, and revenue
- **Trek Management** - Create, edit, and delete trekking trails
- **Activity Management** - Manage activities and events
- **Climbing Spots** - Manage rock climbing locations
- **Image Upload** - Upload and manage images for treks and activities
- **Admin Authentication** - Secure admin-only access with role-based authentication

## Setup & Running

### Prerequisites
- Node.js 16+
- Backend API running on `http://localhost:5000`
- Admin user created in database (use backend `setupAdmin.js` script)

### Installation & Run

```bash
# Install dependencies
npm install

# Run development server (port 3001)
npm run dev

# Build for production
npm run build
```

Admin dashboard: `http://localhost:3001`

## Default Admin Credentials

Set in `backend/scripts/setupAdmin.js`:
- **Email**: `akc338663@gmail.com`
- **Password**: `Admin@123`

⚠️ **Change credentials after first login!**

## Project Structure

```
admin/
├── src/
│   ├── pages/           # Admin.jsx, SignIn.jsx
│   ├── components/      # Header, Footer, ImageUpload, ProtectedRoute
│   ├── context/         # AuthContext
│   ├── lib/            # API clients (apiClient.js, supabaseClient.js)
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## Admin Dashboard Tabs

- **Dashboard** - Key statistics and overview
- **Treks** - Manage trails (CRUD operations)
- **Activities** - Manage activities and events
- **Climbing** - Manage climbing spots

## API Endpoints

Backend API (`http://localhost:5000/api/`):
- `/trails` - GET, POST, PUT, DELETE
- `/activities` - GET, POST, PUT, DELETE
- `/climbing` - GET, POST, PUT, DELETE
- `/upload` - POST (image uploads)

## Tech Stack

- React 18 + Vite
- React Router v6
- Axios for API calls
- JWT authentication
- Role-based access control

## Security

- Admin role verification on all routes
- JWT token authentication
- Protected API endpoints
- Change default credentials immediately
