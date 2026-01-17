# 🏔️ Gandharva - Trekking & Adventure Platform

A full-stack web application for discovering, booking, and managing trekking trails and adventure activities. Built with React (frontend) and Node.js/Express (backend).

## 📁 Project Structure

```
Gandharva/
├── src/                    # React frontend (Vite)
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── context/           # Context providers
│   ├── lib/               # Utilities and API client
│   └── styles.css         # Global styles
├── Gdback/                # Node.js backend (Express)
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/            # Database models
│   └── server.js          # Main server file
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to backend
cd Gdback

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# From project root
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## ✨ Features

### Frontend Features 🎨
- **Beautiful UI** - Blue and white color scheme with smooth animations
- **Responsive Design** - Mobile-friendly interface
- **Navigation Dropdown** - Explore menu with Destination, Activities, Trekking, Climbing
- **Activity Management** - Browse and book adventures
- **User Authentication** - Sign in/sign up functionality
- **Booking System** - Reserve spots for activities
- **Trail Listings** - Discover trekking trails
- **User Profiles** - Manage bookings and preferences
- **Contact & FAQ** - Get support and answers

### Backend API Features 🔌
- **RESTful API** - Well-structured endpoints
- **Trails Management** - CRUD operations for trails
- **Activities Management** - CRUD operations for activities
- **Authentication** - User registration and login
- **Booking System** - Create and manage bookings
- **User Profiles** - Store user information
- **Filtering & Search** - Query trails and activities
- **CORS Support** - Secure cross-origin requests

## 📊 Database

Currently uses **in-memory storage**. Ready for **MongoDB** integration:

```env
MONGODB_URI=mongodb://localhost:27017/gandharva
```

## 🔐 Environment Variables

**Frontend** (`src/lib/apiClient.js`):
```javascript
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`.env` in Gdback):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gandharva
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## 📚 API Documentation

### Key Endpoints

**Trails:**
- `GET /api/trails` - List all trails
- `GET /api/trails/:id` - Get trail details
- `POST /api/trails` - Create trail

**Activities:**
- `GET /api/activities` - List all activities
- `GET /api/activities/:id` - Get activity details
- `POST /api/activities` - Create activity

**Auth:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `DELETE /api/bookings/:id` - Cancel booking

See `Gdback/README.md` for complete API documentation.

## 🎯 Pages & Routes

### Frontend Routes
- `/` - Home page
- `/trails` - Trails listing
- `/trails/:id` - Trail detail
- `/activities` - Adventure activities with booking
- `/features` - Platform features
- `/about` - About us
- `/contact` - Contact page
- `/blog` - Blog/news
- `/events` - Events listing
- `/gear` - Gear recommendations
- `/faq` - Frequently asked questions
- `/profile` - User profile (protected)
- `/tracking` - Activity tracking (protected)
- `/signin` - Sign in page
- `/signup` - Sign up page

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom design

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Ready for Integration
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File uploads

## 📝 Installation & Running

### Run Both Servers

**Terminal 1 - Backend:**
```bash
cd Gdback
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 🎨 Design

- **Color Scheme**: Blue (#3465c5) and White (#ffffff)
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🚧 Development Roadmap

- [ ] MongoDB integration
- [ ] JWT authentication middleware
- [ ] Input validation with express-validator
- [ ] Password hashing with bcryptjs
- [ ] Image upload with multer
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Real-time notifications

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test both frontend and backend
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Happy Trekking! 🥾⛰️**
