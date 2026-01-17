import React, { useState, useEffect } from 'react'

export default function ReviewList({ type = 'destination', typeId = null }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, average: 0 })

  useEffect(() => {
    if (!typeId) return

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/type/${type}/${typeId}`)
        const data = await response.json()

        if (data.success) {
          setReviews(data.reviews)
          
          // Calculate stats
          if (data.reviews.length > 0) {
            const avg = (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
            setStats({ total: data.reviews.length, average: avg })
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [type, typeId])

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading reviews...</div>
  }

  return (
    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '32px' }}>
      <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#2d5016', marginBottom: '24px' }}>
        📝 Guest Reviews ({stats.total})
      </h3>

      {stats.total > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #2d5016 0%, #1a3509 100%)',
          color: '#fff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Average Rating</div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.average}/5</div>
          </div>
          <div style={{ fontSize: '32px' }}>{renderStars(Math.round(stats.average))}</div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#94a3b8'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ color: '#1e293b', fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>
                    {review.title}
                  </h4>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    by <strong>{review.name}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#2d5016' }}>
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Review Text */}
              <p style={{
                color: '#475569',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: '12px 0'
              }}>
                {review.review}
              </p>

              {/* Footer */}
              <div style={{
                fontSize: '12px',
                color: '#94a3b8',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0'
              }}>
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
