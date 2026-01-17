# Integration Examples for Review System

This document shows how to integrate the review system into different pages.

## Quick Integration Template

```jsx
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

export default function DetailPage() {
  // ... your existing code ...

  return (
    <div>
      {/* Your existing content */}
      
      {/* Add these two sections at the bottom */}
      
      {/* Display approved reviews */}
      <ReviewList type="destination" typeId={id} />
      
      {/* Allow users to submit reviews */}
      <ReviewForm destinationId={id} />
    </div>
  )
}
```

---

## Complete Examples

### Example 1: Destination Detail Page (Already Done)
**File:** `frontend/src/pages/DestinationDetail.jsx`

```jsx
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

export default function DestinationDetail() {
  const { id } = useParams()
  // ... rest of code ...

  return (
    <div>
      {/* Existing destination content */}
      
      {/* Reviews Section */}
      <div style={{ marginBottom: '40px' }}>
        <ReviewList type="destination" typeId={destination.id} />
      </div>

      {/* Review Form */}
      <div style={{ marginBottom: '40px' }}>
        <ReviewForm destinationId={destination.id} />
      </div>
      
      {/* Rest of page */}
    </div>
  )
}
```

### Example 2: Trail Detail Page
**File:** `frontend/src/pages/TrailDetail.jsx`

```jsx
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

export default function TrailDetail() {
  const { id } = useParams()
  // ... existing code ...

  return (
    <div>
      {/* Trail content */}
      
      {/* Add reviews at the bottom */}
      <ReviewList type="trail" typeId={trail.id} />
      <ReviewForm trailId={trail.id} />
    </div>
  )
}
```

### Example 3: Activity Detail Page
**File:** `frontend/src/pages/Activities.jsx`

```jsx
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

export default function Activities() {
  const { id } = useParams()
  // ... existing code ...

  return (
    <div>
      {/* Activity content */}
      
      {/* Add reviews at the bottom */}
      <ReviewList type="activity" typeId={activity.id} />
      <ReviewForm activityId={activity.id} />
    </div>
  )
}
```

---

## Component Props Reference

### ReviewForm Props

```jsx
<ReviewForm 
  destinationId={123}        // Optional: ID of destination
  trailId={456}              // Optional: ID of trail
  activityId={789}           // Optional: ID of activity
  onSuccess={() => {         // Optional: Callback after submission
    console.log('Review submitted!')
    // Refresh page, show message, etc.
  }}
/>
```

### ReviewList Props

```jsx
<ReviewList 
  type="destination"         // Required: 'destination', 'trail', or 'activity'
  typeId={123}               // Required: ID of the resource
/>
```

---

## Styling Customization

### Option 1: Inline Style Overrides
```jsx
<div style={{ 
  padding: '40px 20px',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  borderRadius: '12px'
}}>
  <ReviewForm destinationId={id} />
</div>
```

### Option 2: Custom CSS Classes
```jsx
<div className="custom-review-section">
  <ReviewForm destinationId={id} />
</div>
```

```css
.custom-review-section {
  padding: 40px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  margin: 40px 0;
}

.custom-review-section form input,
.custom-review-section form textarea {
  border-color: #ff69b4 !important;
}
```

---

## Advanced Integration Patterns

### Pattern 1: Conditional Display
```jsx
{/* Only show reviews if destination has a certain tag */}
{destination.allowReviews && (
  <>
    <ReviewList type="destination" typeId={destination.id} />
    <ReviewForm destinationId={destination.id} />
  </>
)}
```

### Pattern 2: Lazy Loading
```jsx
import { lazy, Suspense } from 'react'

const ReviewForm = lazy(() => import('../components/ReviewForm'))
const ReviewList = lazy(() => import('../components/ReviewList'))

export default function DetailPage() {
  return (
    <div>
      {/* Other content */}
      
      <Suspense fallback={<div>Loading reviews...</div>}>
        <ReviewList type="destination" typeId={id} />
      </Suspense>
      
      <Suspense fallback={<div>Loading form...</div>}>
        <ReviewForm destinationId={id} />
      </Suspense>
    </div>
  )
}
```

### Pattern 3: With Error Boundary
```jsx
import { ErrorBoundary } from 'react-error-boundary'

function ReviewErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Error loading reviews: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function DetailPage() {
  return (
    <div>
      <ErrorBoundary FallbackComponent={ReviewErrorFallback}>
        <ReviewList type="destination" typeId={id} />
      </ErrorBoundary>
      
      <ErrorBoundary FallbackComponent={ReviewErrorFallback}>
        <ReviewForm destinationId={id} />
      </ErrorBoundary>
    </div>
  )
}
```

### Pattern 4: With Loading State
```jsx
const [isLoadingReviews, setIsLoadingReviews] = useState(true)

return (
  <div>
    {isLoadingReviews ? (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Loading reviews...
      </div>
    ) : (
      <>
        <ReviewList type="destination" typeId={id} />
        <ReviewForm destinationId={id} />
      </>
    )}
  </div>
)
```

---

## Custom Styling Examples

### Dark Theme
```jsx
<div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '12px' }}>
  <h2 style={{ color: '#fff', marginBottom: '24px' }}>Guest Experiences</h2>
  <ReviewList type="destination" typeId={id} />
  <ReviewForm destinationId={id} />
</div>
```

### Minimal Style
```jsx
<div style={{ maxWidth: '600px', margin: '40px auto' }}>
  <ReviewForm destinationId={id} />
  <div style={{ marginTop: '40px' }}>
    <ReviewList type="destination" typeId={id} />
  </div>
</div>
```

### Full Width with Background
```jsx
<div style={{ 
  width: '100%',
  padding: '60px 40px',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  borderRadius: '16px',
  margin: '40px 0'
}}>
  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#2d5016' }}>
      What Our Guests Say
    </h2>
    <ReviewList type="destination" typeId={id} />
    <ReviewForm destinationId={id} />
  </div>
</div>
```

---

## Performance Tips

### Memoization
```jsx
import { memo } from 'react'

const MemoizedReviewList = memo(ReviewList)
const MemoizedReviewForm = memo(ReviewForm)

export default function DetailPage() {
  return (
    <div>
      <MemoizedReviewList type="destination" typeId={id} />
      <MemoizedReviewForm destinationId={id} />
    </div>
  )
}
```

### Code Splitting
```jsx
import { dynamic } from 'react'

const ReviewForm = dynamic(() => import('../components/ReviewForm'), {
  loading: () => <p>Loading form...</p>
})

const ReviewList = dynamic(() => import('../components/ReviewList'), {
  loading: () => <p>Loading reviews...</p>
})
```

---

## SEO Considerations

### Adding Schema.org Markup
```jsx
export default function DetailPage() {
  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": destination.name,
          "review": {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "John Doe"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": 5
            }
          }
        })}
      </script>
      
      <ReviewList type="destination" typeId={id} />
      <ReviewForm destinationId={id} />
    </div>
  )
}
```

---

## Testing Examples

### Unit Test for ReviewForm
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewForm from '../ReviewForm'

test('submits review with valid data', async () => {
  render(<ReviewForm destinationId={1} />)
  
  fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
    target: { value: 'John Doe' }
  })
  fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), {
    target: { value: 'john@example.com' }
  })
  fireEvent.click(screen.getByText('Submit Review'))
  
  expect(await screen.findByText(/Thank you/)).toBeInTheDocument()
})
```

### Unit Test for ReviewList
```jsx
import { render, screen } from '@testing-library/react'
import ReviewList from '../ReviewList'

test('displays reviews correctly', async () => {
  render(<ReviewList type="destination" typeId={1} />)
  
  expect(await screen.findByText('Guest Reviews')).toBeInTheDocument()
  // More assertions...
})
```

---

## Common Integration Mistakes to Avoid

### ❌ Wrong: Forgetting to import
```jsx
export default function DetailPage() {
  return <ReviewForm destinationId={id} /> // ERROR: ReviewForm not defined
}
```

### ✅ Correct: Import first
```jsx
import ReviewForm from '../components/ReviewForm'

export default function DetailPage() {
  return <ReviewForm destinationId={id} />
}
```

### ❌ Wrong: Missing required props
```jsx
<ReviewList /> // ERROR: missing type and typeId
```

### ✅ Correct: Provide all required props
```jsx
<ReviewList type="destination" typeId={123} />
```

### ❌ Wrong: Wrong type value
```jsx
<ReviewList type="destinations" typeId={123} /> // ERROR: should be 'destination'
```

### ✅ Correct: Use exact type values
```jsx
<ReviewList type="destination" typeId={123} />
```

---

## Troubleshooting Integration

### Issue: "ReviewForm is not defined"
**Solution:** Add import at top of file
```jsx
import ReviewForm from '../components/ReviewForm'
```

### Issue: Reviews not showing
**Solution:** Check that backend is running and review is approved
```bash
# Verify backend
curl http://localhost:5000/api/reviews/type/destination/1

# Check admin panel - review might be pending
```

### Issue: Form errors after submission
**Solution:** Check browser console for validation errors, ensure all required fields filled

### Issue: Styling looks broken
**Solution:** Check that styles are applied correctly, no CSS conflicts with existing styles

---

## Quick Start for New Pages

1. **Add imports:**
```jsx
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
```

2. **Add to JSX:**
```jsx
<ReviewList type="destination" typeId={id} />
<ReviewForm destinationId={id} />
```

3. **Wrap in container if needed:**
```jsx
<div style={{ marginBottom: '40px' }}>
  <ReviewList type="destination" typeId={id} />
</div>
<div style={{ marginBottom: '40px' }}>
  <ReviewForm destinationId={id} />
</div>
```

That's it! Your page now has reviews.

---

## Documentation Links

- [Main Review System Documentation](./REVIEW_SYSTEM.md)
- [Quick Reference Guide](./REVIEW_SYSTEM_QUICK_GUIDE.md)
- [API Documentation](./REVIEW_SYSTEM.md#api-endpoints)
- [Admin Panel Guide](./REVIEW_SYSTEM.md#admin-panel)

---

## Need Help?

### Check the existing integration:
- See `frontend/src/pages/DestinationDetail.jsx` for a complete example
- Copy and adapt for your needs

### Verify backend:
```bash
curl http://localhost:5000/api/reviews
```

### Check browser console:
- Press F12 in browser
- Go to Console tab
- Look for error messages

### Inspect network:
- Press F12 in browser
- Go to Network tab
- Check API calls to `/api/reviews`
