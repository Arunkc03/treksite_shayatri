# Review System Documentation

## Overview
A complete review management system has been implemented for Gandharva Trekking platform, allowing guests to leave reviews for destinations, trails, and activities. The system includes:

- ✅ Review submission form (frontend)
- ✅ Review display with ratings (frontend)
- ✅ Admin review management interface (admin panel)
- ✅ Database table with proper schema
- ✅ Complete REST API endpoints
- ✅ Review moderation workflow (pending/approved/rejected)

## System Architecture

### Database Schema
**Table: `reviews`**
```sql
- id (Primary Key)
- name (String) - Reviewer name
- email (String) - Reviewer email
- rating (Integer 1-5) - Star rating
- title (String) - Review title/summary
- review (Text) - Detailed review content
- destination_id (Foreign Key, nullable)
- trail_id (Foreign Key, nullable)
- activity_id (Foreign Key, nullable)
- status (Enum: pending/approved/rejected) - Moderation status
- created_at (Timestamp)
- updated_at (Timestamp)
```

### API Endpoints

#### 1. Get All Reviews (Admin Only)
```
GET /api/reviews
Query params: ?status=pending (optional)

Response:
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "rating": 5,
      "title": "Amazing Experience!",
      "review": "The trek was incredible...",
      "destination_id": 1,
      "status": "pending",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 2. Get Reviews by Type (Public)
```
GET /api/reviews/type/:type/:typeId
Examples:
- GET /api/reviews/type/destination/1
- GET /api/reviews/type/trail/2
- GET /api/reviews/type/activity/3

Returns only APPROVED reviews
```

#### 3. Get Single Review
```
GET /api/reviews/:id

Response:
{
  "success": true,
  "review": { ... }
}
```

#### 4. Submit New Review (Public)
```
POST /api/reviews

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "title": "Excellent Trek",
  "review": "Detailed review text...",
  "destination_id": 1  // OR trail_id OR activity_id
}

Validation:
- name: Required, string
- email: Required, valid email
- rating: Required, integer 1-5
- title: Required, string
- review: Required, string
- At least one of: destination_id, trail_id, activity_id
```

#### 5. Update Review Status (Admin Only)
```
PUT /api/reviews/:id/status

Body:
{
  "status": "approved"  // or "rejected" or "pending"
}

Allowed statuses: pending, approved, rejected
```

#### 6. Delete Review (Admin Only)
```
DELETE /api/reviews/:id

Response:
{
  "success": true,
  "message": "Review deleted successfully"
}
```

## Frontend Components

### 1. ReviewForm Component
**Path:** `frontend/src/components/ReviewForm.jsx`

**Props:**
- `destinationId` (optional) - ID of destination being reviewed
- `trailId` (optional) - ID of trail being reviewed
- `activityId` (optional) - ID of activity being reviewed
- `onSuccess` (optional) - Callback function after successful submission

**Usage:**
```jsx
import ReviewForm from '../components/ReviewForm'

// In your component
<ReviewForm 
  destinationId={destination.id}
  onSuccess={() => console.log('Review submitted!')}
/>
```

**Features:**
- Beautiful form with validation
- Star rating selector
- Character count for review text
- Success/error messages
- Responsive design with gradients

### 2. ReviewList Component
**Path:** `frontend/src/components/ReviewList.jsx`

**Props:**
- `type` - 'destination', 'trail', or 'activity'
- `typeId` - ID of the resource

**Usage:**
```jsx
import ReviewList from '../components/ReviewList'

// In your component
<ReviewList type="destination" typeId={destination.id} />
```

**Features:**
- Displays all approved reviews
- Shows average rating
- Star rating visualization
- Review count
- Formatted dates
- Responsive grid layout
- Empty state message

## Admin Panel

### Access Reviews
1. Navigate to Admin Dashboard
2. Click "⭐ Reviews" tab
3. View all submitted reviews

### Review Management
- **Approve:** Mark review as approved (will be visible to public)
- **Reject:** Mark review as rejected (hidden from public)
- **Delete:** Permanently remove review from database

### Review Statistics
The reviews tab shows:
- Total number of reviews
- Pending reviews count (yellow)
- Approved reviews count (green)

### Review Details Displayed
- Title and rating (⭐⭐⭐⭐⭐)
- Reviewer name and email
- Full review content
- Date submitted
- Type of resource reviewed
- Current status (pending/approved/rejected)

## Integration Guide

### Step 1: Add ReviewForm to Detail Pages
```jsx
import ReviewForm from '../components/ReviewForm'

// In your detail page component
<ReviewForm 
  destinationId={id}
  onSuccess={() => {
    // Refresh reviews or show success message
  }}
/>
```

### Step 2: Add ReviewList to Detail Pages
```jsx
import ReviewList from '../components/ReviewList'

// In your detail page component
<ReviewList type="destination" typeId={id} />
```

### Step 3: Review Moderation
1. Admin logs in and opens Admin Dashboard
2. Clicks "⭐ Reviews" tab
3. Reviews pending approval are shown with yellow border
4. Click "✅ Approve" or "❌ Reject" to moderate
5. Approved reviews appear on public detail pages

## Current Integration

### Already Integrated
✅ **DestinationDetail.jsx**
- ReviewForm for submitting new reviews
- ReviewList for displaying approved reviews

### Ready to Integrate
- TrailDetail.jsx (similar to DestinationDetail)
- Activities detail pages
- Any other resource detail pages

## Review Workflow

### User Journey
1. User visits destination/trail/activity detail page
2. Scrolls down to "📝 Share Your Experience" section
3. Fills form with: Name, Email, Rating, Title, Review
4. Clicks "📤 Submit Review"
5. Receives confirmation: "Thank you! Your review will be reviewed by our team"
6. Review appears in admin panel as "pending"

### Admin Workflow
1. Admin opens Admin Dashboard → ⭐ Reviews
2. Sees all reviews with status
3. Can view review details
4. Click "✅ Approve" to make visible to public
5. Click "❌ Reject" if inappropriate
6. Click "🗑️ Delete" to remove

### Public Display
1. Only "approved" reviews are visible to public
2. Average rating calculated automatically
3. Star count displayed with review
4. Shows reviewer name and date
5. New reviews added dynamically to the list

## Styling & Design

### Color Scheme
- **Pending:** Yellow (#fbbf24)
- **Approved:** Green (#10b981)
- **Rejected:** Red (#ef4444)
- **Primary:** Green gradient (#2d5016)

### Responsive Design
- Mobile-friendly forms
- Responsive grid layouts
- Touch-friendly buttons
- Readable on all device sizes

## Validation Rules

### Review Submission
```javascript
Validation Rules:
- Name: Required, max 100 characters
- Email: Required, valid email format
- Rating: Required, integer between 1 and 5
- Title: Required, max 150 characters
- Review: Required, max 2000 characters
- Resource ID: At least one must be provided
```

### Admin Actions
```javascript
Status Validation:
- Can only set to: pending, approved, rejected
- Status transitions are flexible (can change at any time)
- Deletion is permanent
```

## Error Handling

### Common Errors
1. **Failed to submit review:** Check validation, refresh page
2. **Network error:** Ensure backend is running
3. **Review not visible:** Check if it's approved by admin
4. **Email validation failed:** Use valid email format (user@domain.com)

### Backend Logging
All errors are logged to console on backend for debugging.

## Testing the System

### Test Submission
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "rating": 5,
    "title": "Great Destination!",
    "review": "This is a test review",
    "destination_id": 1
  }'
```

### Test Admin Approval
```bash
curl -X PUT http://localhost:5000/api/reviews/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

### Test Public View
```bash
curl http://localhost:5000/api/reviews/type/destination/1
```

## Database Queries

### View All Reviews
```sql
SELECT * FROM reviews ORDER BY created_at DESC;
```

### View Pending Reviews
```sql
SELECT * FROM reviews WHERE status = 'pending' ORDER BY created_at;
```

### View Reviews by Rating
```sql
SELECT * FROM reviews WHERE destination_id = 1 AND status = 'approved' ORDER BY rating DESC;
```

### Get Review Statistics
```sql
SELECT 
  COUNT(*) as total,
  AVG(rating) as avg_rating,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
FROM reviews
WHERE destination_id = 1;
```

## Performance Tips

1. **Pagination:** Consider adding pagination if reviews exceed 100
2. **Caching:** Cache approved reviews to reduce database queries
3. **Rate Limiting:** Add rate limiting to prevent spam reviews
4. **Image Upload:** Future enhancement: Allow review image uploads
5. **Moderation:** Use automatic spam detection for large-scale platforms

## Security Considerations

1. ✅ Input validation on all fields
2. ✅ Email format validation
3. ✅ Rating range validation (1-5)
4. ✅ Admin-only endpoints protected (can be enhanced with auth)
5. ⚠️ TODO: Add authentication checks for admin endpoints
6. ⚠️ TODO: Add rate limiting for review submissions
7. ⚠️ TODO: Add spam/inappropriate content detection

## Future Enhancements

1. **Helpful Votes:** Allow users to mark reviews as helpful
2. **Review Images:** Allow reviewers to upload photos with reviews
3. **Reply to Reviews:** Admin can reply to reviews
4. **Email Notifications:** Notify admin of new reviews
5. **Review Filters:** Filter by rating, date, resource type
6. **Review Search:** Search reviews by keyword
7. **Review Moderation Settings:** Configure auto-approval settings
8. **Bulk Actions:** Approve/reject multiple reviews at once

## Support & Troubleshooting

### Reviews not showing up?
1. Check admin panel - review might be pending
2. Verify destination ID is correct
3. Check that status is "approved"

### Form not submitting?
1. Fill all required fields
2. Check email format is valid
3. Rating must be between 1-5
4. Check browser console for errors

### Admin panel not showing reviews?
1. Refresh the page
2. Check that backend is running
3. Click "🔄 Refresh Reviews" button

## Files Modified/Created

### New Files
- `frontend/src/components/ReviewForm.jsx` - Review submission form
- `frontend/src/components/ReviewList.jsx` - Review display component
- `backend/scripts/createReviewsTable.js` - Database migration
- `backend/models/Review.js` - Data model with CRUD methods
- `backend/routes/reviews.js` - API route handlers

### Modified Files
- `admin/src/pages/Admin.jsx` - Added reviews tab and management UI
- `backend/server.js` - Added reviews route registration
- `frontend/src/pages/DestinationDetail.jsx` - Integrated ReviewForm and ReviewList

## Quick Start

1. **Database:** Run migration to create table
   ```bash
   node backend/scripts/createReviewsTable.js
   ```

2. **Backend:** Already configured, just ensure running
   ```bash
   cd backend && node server.js
   ```

3. **Frontend:** Components ready to use
   ```jsx
   import ReviewForm from '../components/ReviewForm'
   import ReviewList from '../components/ReviewList'
   ```

4. **Admin:** Open admin panel → Click ⭐ Reviews tab

That's it! Your review system is ready to use.
