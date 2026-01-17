# Multiple Users Booking Same Trek - Testing Guide

## ✅ Issue Fixed

**Problem**: Multiple users couldn't book the same trek (type mismatch in comparison)
**Solution**: 
- Fixed type comparison: Convert both trek IDs to integers before comparing
- `booking.trek_id` (number from DB) === `parseInt(trail.id)` (from URL params)
- Refresh booking status after successful payment

---

## 🧪 Testing Scenario

### Test Case 1: Different Users Book Same Trek
```
User A:
1. Sign in as user A (email: userA@example.com)
2. Go to "Annapurna Circuit" trek
3. Book trek with 2 participants
4. Complete payment
5. Should see "✅ Already Booked!"

User B (Different user, same browser/device):
1. Sign out User A
2. Sign in as user B (email: userB@example.com)
3. Go to "Annapurna Circuit" trek
4. Should see "📅 Book Now" button (NOT "Already Booked")
5. Book trek with 3 participants
6. Complete payment
7. Should see "✅ Already Booked!" (for this user only)

Result: ✅ Both users can book same trek!
```

### Test Case 2: Same User Tries to Book Same Trek Twice
```
User A:
1. Sign in (email: userA@example.com)
2. Go to "Annapurna Circuit"
3. Book trek
4. Complete payment
5. See "✅ Already Booked!"
6. Go back to same trek
7. Still shows "✅ Already Booked!" ✅

Result: ✅ Same user CANNOT book same trek twice!
```

### Test Case 3: Same User Can Book Different Treks
```
User A:
1. Sign in (email: userA@example.com)
2. Go to "Annapurna Circuit"
3. Book trek 1
4. See "✅ Already Booked!" for trek 1
5. Go to "Manaslu Circuit"
6. Should see "📅 Book Now" button (NOT "Already Booked")
7. Book trek 2
8. Complete payment
9. Should see "✅ Already Booked!" for trek 2

Result: ✅ Same user can book different treks!
```

---

## 🔍 How It Works

### Frontend Logic
```javascript
// Check if THIS user has booked THIS trek
const checkBooking = async () => {
  // Get all bookings for logged-in user
  const response = await fetch(`/api/bookings/email/${user.email}`)
  
  // Check if any booking matches this trek (by ID)
  const alreadyBooked = data.bookings.some(booking => {
    // Type-safe comparison: convert both to integers
    return parseInt(booking.trek_id) === parseInt(trail.id)
  })
  
  setIsAlreadyBooked(alreadyBooked)
}
```

### Database Check
```sql
-- Get bookings for specific user
SELECT * FROM bookings 
WHERE client_email = ?  -- Only this user's bookings
ORDER BY created_at DESC
```

### Booking Flow
```
1. Frontend checks user's bookings by email
2. Compares trek IDs (type-safe comparison)
3. Shows "Book Now" or "Already Booked" based on result
4. On payment success:
   - Save booking to database with trek_id
   - Refresh check to update UI
   - Show "Already Booked" button
```

---

## 📊 Database Records

### Multiple Users, Same Trek
```
bookings table:
id | trek_id | trek_name | client_email | participants | status
1  | 5       | Annapurna Circuit | userA@example.com | 2 | confirmed
2  | 5       | Annapurna Circuit | userB@example.com | 3 | confirmed  ✅ Both can book!
3  | 7       | Manaslu Circuit   | userA@example.com | 1 | confirmed  ✅ Different trek
```

### Same User, Different Treks
```
bookings table:
id | trek_id | trek_name | client_email | participants | status
1  | 5       | Annapurna Circuit | userA@example.com | 2 | confirmed ✅
2  | 7       | Manaslu Circuit   | userA@example.com | 1 | confirmed ✅ Same user different trek
```

---

## ✨ Key Improvements

1. **Type-Safe Comparison**: Convert to integers before comparing IDs
2. **User-Specific Filtering**: Check only this user's bookings (via email)
3. **Real-time Updates**: Refresh booking status after payment
4. **Multiple Bookings Allowed**: Different users can book same trek
5. **Duplicate Prevention**: Same user cannot book same trek twice

---

## 🚀 Testing Checklist

- [ ] Test with 2 different user accounts
- [ ] Book same trek with both users → should both succeed
- [ ] Same user tries to book same trek again → should show "Already Booked"
- [ ] Same user books different trek → should succeed
- [ ] Check Admin panel shows all bookings from both users
- [ ] Verify booking amounts calculated correctly per user
- [ ] Test with different browser profiles or incognito for different users

---

## 💾 Live URLs

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:5000/api/bookings
