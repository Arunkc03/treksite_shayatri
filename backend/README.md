# Orophiletrek Backend API

Node.js Express API for the Orophiletrek trekking and adventure platform.

## 📋 Project Structure

```
Gdback/
├── routes/          # API route handlers
│   ├── trails.js    # Trail endpoints
│   ├── activities.js # Activity endpoints
│   ├── auth.js      # Authentication endpoints
│   ├── users.js     # User profile endpoints
│   └── bookings.js  # Booking management endpoints
├── controllers/     # Business logic (ready for expansion)
├── models/          # Database models (ready for MongoDB integration)
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies
├── .env             # Environment variables
└── .gitignore       # Git ignore rules
```

## 🚀 Quick Start

### Installation

1. Navigate to the backend directory:
```bash
cd Gdback
```

2. Install dependencies:
```bash
npm install
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Trails
- `GET /api/trails` - Get all trails (supports filters: difficulty, location, q)
- `GET /api/trails/:id` - Get single trail
- `POST /api/trails` - Create new trail (admin only)

### Activities
- `GET /api/activities` - Get all activities (supports filters: difficulty, location, q)
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create new activity (admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/bookings` - Get user's bookings

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🔧 Environment Variables

Create a `.env` file in the Gdback directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/orophiletrek
JWT_SECRET=your_jwt_secret_key_here_change_in_production
CORS_ORIGIN=http://localhost:5173
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing (ready for use)
- **jsonwebtoken** - JWT authentication (ready for use)
- **mongoose** - MongoDB ODM (ready for use)
- **multer** - File upload handling (ready for use)
- **express-validator** - Input validation (ready for use)

Dev dependencies:
- **nodemon** - Auto-reload during development

## 🔌 Frontend Integration

The frontend is configured to use this backend API:

```javascript
// In src/lib/apiClient.js
const API_BASE = 'http://localhost:5000/api'
```

Make sure both the backend and frontend are running simultaneously:

```bash
# Terminal 1: Backend
cd Gdback
npm run dev

# Terminal 2: Frontend
npm run dev
```

## 🚧 Features Ready for Expansion

1. **Database Integration** - Mongoose models are created, ready for MongoDB
2. **Authentication** - JWT support built-in
3. **Validation** - express-validator ready to use
4. **File Uploads** - Multer configured for handling images
5. **Password Hashing** - bcryptjs integrated

## 📝 Sample Requests

### Get all activities
```bash
curl http://localhost:5000/api/activities
```

### Get activities by difficulty
```bash
curl "http://localhost:5000/api/activities?difficulty=Easy"
```

### Create a booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "activityId": 2,
    "numParticipants": 3,
    "totalPrice": 360
  }'
```

## 📚 Notes

- Currently using in-memory data storage
- Production deployment should include MongoDB integration
- JWT tokens should be properly validated
- Password hashing should be implemented with bcryptjs
- Input validation should be enhanced with express-validator

## 🤝 Next Steps

1. Set up MongoDB and update connection in `.env`
2. Implement proper JWT authentication middleware
3. Add input validation for all routes
4. Add error handling and logging
5. Deploy to production server

## 📞 Support

For issues or questions, please create an issue in the main project repository.
