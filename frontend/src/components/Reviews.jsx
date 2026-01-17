import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { reviewsAPI, uploadAPI } from '../lib/apiClient'

export default function Reviews({ trailId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  })
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // Fetch reviews for the trail
  useEffect(() => {
    if (!trailId) return

    const fetchReviews = async () => {
      setLoading(true)
      setError(null)
      try {
        // When backend is ready, uncomment:
        // const data = await reviewsAPI.getByTrail(trailId)
        // setReviews(data.reviews || [])

        // For now, use mock data
        setReviews([
          {
            id: 1,
            user_name: 'John Doe',
            rating: 5,
            title: 'Amazing trek!',
            comment: 'Great trail with stunning views.',
            created_at: new Date().toISOString(),
            helpful_count: 12,
          },
          {
            id: 2,
            user_name: 'Jane Smith',
            rating: 4,
            title: 'Good trail, moderate difficulty',
            comment: 'Well-marked path. A bit crowded on weekends.',
            created_at: new Date().toISOString(),
            helpful_count: 8,
          },
        ])
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [trailId])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to leave a review')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // When backend is ready, uncomment:
      // const newReview = await reviewsAPI.create(trailId, {
      //   rating: formData.rating,
      //   title: formData.title,
      //   comment: formData.comment,
      // })

      // If photo is selected, upload it
      if (selectedPhoto) {
        // await uploadAPI.uploadPhoto(selectedPhoto, 'review', newReview.id)
      }

      // Reset form
      setFormData({ rating: 5, title: '', comment: '' })
      setSelectedPhoto(null)
      setShowForm(false)

      // Refetch reviews
      // const data = await reviewsAPI.getByTrail(trailId)
      // setReviews(data.reviews || [])
    } catch (err) {
      setError(err.message)
      console.error('Failed to submit review:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      // When backend is ready, uncomment:
      // await uploadAPI.uploadPhoto(file, 'review', null)

      setSelectedPhoto(file)
      alert('Photo ready to upload with review')
    } catch (err) {
      setError(err.message)
      console.error('Failed to upload photo:', err)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleHelpful = async (reviewId, helpful) => {
    try {
      // When backend is ready, uncomment:
      // await reviewsAPI.rate(reviewId, helpful)

      // Update local state
      setReviews(reviews.map(r =>
        r.id === reviewId
          ? { ...r, helpful_count: r.helpful_count + (helpful ? 1 : -1) }
          : r
      ))
    } catch (err) {
      console.error('Failed to rate review:', err)
    }
  }

  return (
    <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1a202c', margin: 0 }}>
          ⭐ Reviews ({reviews.length})
        </h3>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            style={{ padding: '10px 20px', background: '#2d5016', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#1f3610'}
            onMouseOut={(e) => e.target.style.background = '#2d5016'}
          >
            ✍️ Write a Review
          </button>
        )}
      </div>

      {error && <p style={{ color: '#ef4444', background: '#fee2e2', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>⚠️ {error}</p>}

      {showForm && (
        <form onSubmit={handleSubmitReview} style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>⭐ Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '16px', fontWeight: 600, background: '#fff' }}
              >
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{'⭐'.repeat(n)} {n} stars</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>📝 Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summary of your experience"
                required
                style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '16px', background: '#fff' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>💬 Your Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share details about the trail, scenery, difficulty, and overall experience..."
              rows="5"
              required
              style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '16px', background: '#fff', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>📷 Add Photos (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
              style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '2px solid #d1d5db', background: '#fff', cursor: 'pointer' }}
            />
            {selectedPhoto && <p style={{ color: '#10b981', marginTop: '8px', fontSize: '14px' }}>✓ Photo attached: {selectedPhoto.name}</p>}
            {uploadingPhoto && <p style={{ color: '#3b82f6', marginTop: '8px', fontSize: '14px' }}>Uploading...</p>}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, minWidth: '150px', padding: '12px 24px', background: loading ? '#9ca3af' : '#2d5016', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 600, transition: 'background 0.2s' }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1f3610')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#2d5016')}
            >
              {loading ? '⏳ Submitting...' : '📤 Submit Review'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              style={{ padding: '12px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#d1d5db'}
              onMouseOut={(e) => e.target.style.background = '#e5e7eb'}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        {loading && !showForm && <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Loading reviews...</p>}
        {reviews.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f9fafb', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💭</div>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>No reviews yet</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>Be the first to share your experience!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(review => (
              <div key={review.id} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a202c', marginBottom: '4px' }}>{review.user_name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontSize: '18px', color: '#f59e0b', fontWeight: 700 }}>{'⭐'.repeat(review.rating)}</p>
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>{review.rating}/5</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#9ca3af' }}>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>{review.title}</h4>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#4b5563', marginBottom: '16px' }}>{review.comment}</p>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                  <button 
                    onClick={() => handleHelpful(review.id, true)}
                    style={{ padding: '8px 16px', background: '#fff', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.borderColor = '#d1d5db'; }}
                    onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e5e7eb'; }}
                  >
                    👍 Helpful ({review.helpful_count})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
