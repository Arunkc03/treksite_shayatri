# MySQL Setup Instructions for Gandharva

## Issue
The backend server needs MySQL to be running, but it's not currently installed or running on your system.

## Solution - Choose One:

### Option 1: Use XAMPP (Recommended - Easiest)
1. Download XAMPP from: https://www.apachefriends.org/download.html
2. Install XAMPP on your machine
3. Start XAMPP Control Panel
4. Click "Start" next to Apache and MySQL
5. Run the backend: `node server.js` in `Gdback` folder

### Option 2: Install MySQL Server
1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server (port 3306, default)
3. Set root password (or leave blank as per .env)
4. Start MySQL service
5. Run the backend: `node server.js` in `Gdback` folder

### Option 3: Use Cloud Database (Temporary)
1. Use MySQL on Railway.app or similar free tier
2. Update `.env` with cloud database credentials:
   ```
   DB_HOST=your-cloud-host
   DB_USER=your-user
   DB_PASSWORD=your-password
   DB_NAME=trek_api
   ```
3. Run migrations: `node scripts/migrate.js`
4. Setup admin: `node scripts/setupAdmin.js`
5. Run backend: `node server.js`

## Verify MySQL is Running
- XAMPP: Check MySQL row shows green (Running)
- Command line: `mysql -u root -p` (if installed globally)

## After Setup
Once MySQL is running, you should see:
```
✅ Connected to MySQL (trek_api database)
```

Then try signing in again with: akc338663@gmail.com / Admin@123
