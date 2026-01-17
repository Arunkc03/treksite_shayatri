# Booking System - Database Integration Complete ✅

## What Was Fixed

The booking system was using `localStorage` which caused issues because:
- Frontend (localhost:3000) and Admin (localhost:3001) have separate localStorage
- Data saved on port 3000 was not accessible on port 3001
- Solution: Implemented database-backed booking system

## Changes Made

### 1. Database Table Created ✅
- **File**: `backend/scripts/createBookingsTable.js`
- **Table**: `bookings` with columns:
  - `id` - Auto-increment primary key
  - `trek_id` - Trek identifier
  - `trek_name` - Name of the trek
  - `client_name` - Client's full name
  - `client_email` - Client's email
  - `client_phone` - Client's phone number
  - `id_type` - Type of ID (passport, citizenship, etc.)
  - `id_number` - ID document number
  - `id_document` - Path to uploaded ID file
  - `participants` - Number of participants
  - `booking_date` - Date of the trek
  - `amount` - Total amount paid
  - `payment_id` - Payment transaction ID
  - `gateway` - Payment gateway used (esewa, etc.)
  - `status` - Booking status (confirmed, pending, etc.)
  - `created_at` - When booking was created

### 2. Backend Route Updated ✅
- **File**: `backend/routes/bookings.js`
- **Changes**:
  - Updated POST route to accept new booking fields
  - Added multer for ID document file upload
  - Files saved to `backend/uploads/ids/`
  - GET `/api/bookings` - Returns all bookings (for admin)
  - GET `/api/bookings/email/:email` - Get bookings by email
  - Proper error handling and validation

### 3. Frontend Integration ✅
- **File**: `frontend/src/pages/TrailDetail.jsx`
- **Changes**:
  - Replaced `localStorage.setItem()` with API POST request
  - Creates FormData with all booking info + ID document file
  - POSTs to `http://localhost:5000/api/bookings`
  - Shows success/error messages
  - Clears form after successful booking

### 4. Admin Panel Integration ✅
- **File**: `admin/src/pages/Admin.jsx`
- **Changes**:
  - Replaced `localStorage.getItem()` with API GET request
  - Fetches from `http://localhost:5000/api/bookings`
  - Updated field names to match database columns:
    - `trek_name` (was `trekName`)
    - `client_name` (was `clientName`)
    - `client_email` (was `clientEmail`)
    - `client_phone` (was `clientPhone`)
    - `id_type` (was `idType`)
    - `id_number` (was `idNumber`)
    - `booking_date` (was `date`)
    - `payment_id` (was `paymentId`)
  - Refresh button now calls API
  - Stats calculated from database data

## How to Test

### 1. Start All Services
```bash
# From project root
./start-all.bat
```
Or manually:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

### 2. Test Booking Flow
1. Open Frontend: http://localhost:3000
2. Go to Trails page
3. Click on any trek
4. Click "Book Now"
5. Fill in:
   - Number of participants
   - Preferred date
6. Click "Proceed to Payment"
7. Fill in client information:
   - Full Name
   - Email
   - Phone
   - ID Type (select from dropdown)
   - ID Number
   - Upload ID document (image or PDF)
8. Click "Continue to Payment"
9. Complete payment (use test payment)
10. You should see success message

### 3. Verify in Admin Panel
1. Open Admin: http://localhost:3001
2. Login with admin credentials
3. Click "Bookings" tab
4. You should see the booking you just made
5. Click "🔄 Refresh Bookings" to reload data
6. Verify all client information is displayed:
   - Trek Name
   - Client Name
   - Email
   - Phone
   - ID Type
   - ID Number
   - Date
   - Participants
   - Amount
   - Payment ID
   - Status

### 4. Check Database
```bash
cd backend
node -e "const mysql = require('mysql2/promise'); (async () => { const conn = await mysql.createConnection({host:'localhost',user:'root',password:'',database:'trek_api'}); const [rows] = await conn.query('SELECT * FROM bookings'); console.log(rows); await conn.end(); })()"
```

## Files Modified

1. ✅ `backend/routes/bookings.js` - Updated booking route with new schema
2. ✅ `backend/scripts/createBookingsTable.js` - Database migration script
3. ✅ `frontend/src/pages/TrailDetail.jsx` - API integration for booking creation
4. ✅ `admin/src/pages/Admin.jsx` - API integration for booking display

## API Endpoints

### POST `/api/bookings`
Creates a new booking with file upload
```javascript
// FormData fields:
{
  trekId: number,
  trekName: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  idType: string,
  idNumber: string,
  idDocument: File,
  participants: number,
  bookingDate: string (YYYY-MM-DD),
  amount: number,
  paymentId: string,
  gateway: string,
  status: string
}
```

### GET `/api/bookings`
Returns all bookings (for admin)
```javascript
{
  success: true,
  bookings: [...],
  total: number
}
```

### GET `/api/bookings/email/:email`
Returns bookings for specific email
```javascript
{
  success: true,
  bookings: [...],
  total: number
}
```

## Sample Booking Data
The migration script inserted a sample booking:
- Trek: Everest Base Camp Trek
- Client: John Doe (john@example.com)
- Date: 2024-03-15
- Participants: 2
- Amount: NPR 1500
- Status: confirmed

## Next Steps (Optional)

1. **Email Notifications**: Send confirmation emails when bookings are created
2. **Booking Management**: Add edit/cancel functionality in admin panel
3. **Client Portal**: Allow clients to view their bookings by email
4. **ID Document Viewer**: Add ability to view uploaded ID documents in admin panel
5. **Export**: Add CSV/PDF export for bookings report
6. **Search/Filter**: Add search and filter options in bookings table

## Troubleshooting

### Bookings not appearing in admin?
- Check if backend is running on port 5000
- Check browser console for API errors
- Click "Refresh Bookings" button
- Verify database table exists: `SHOW TABLES;`

### File upload errors?
- Check `backend/uploads/ids/` folder exists and is writable
- Check file size (max 5MB)
- Only images (jpg, png) and PDFs are allowed

### CORS errors?
- Backend should allow origins: `http://localhost:3000` and `http://localhost:3001`
- Check `backend/server.js` CORS configuration

## Database Backup

To backup bookings:
```bash
mysqldump -u root trek_api bookings > bookings_backup.sql
```

To restore:
```bash
mysql -u root trek_api < bookings_backup.sql
```

---

✅ **System is ready to use!** Clients can now book treks and admins can view all bookings in real-time.
