import React, { useState } from 'react'

export default function ReviewForm({ destinationId = null, trailId = null, activityId = null, onSuccess = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    review: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = {
        ...formData,
        destination_id: destinationId,
        trail_id: trailId,
        activity_id: activityId
      }

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage('✅ Thank you! Your review has been submitted and will be reviewed by our team.')
        setFormData({ name: '', email: '', rating: 5, title: '', review: '' })
        if (onSuccess) onSuccess()
      } else {
        setMessage(`❌ ${data.error || 'Failed to submit review'}`)
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#2d5016', marginBottom: '24px' }}>✍️ Share Your Experience</h3>
      
      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '8px',
          background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
          color: message.includes('✅') ? '#065f46' : '#991b1b',
          fontSize: '14px',
          fontWeight: 500
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2d5016'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2d5016'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Rating */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
            Rating *
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              style={{
                padding: '10px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent (5 stars)</option>
              <option value={4}>⭐⭐⭐⭐ Good (4 stars)</option>
              <option value={3}>⭐⭐⭐ Average (3 stars)</option>
              <option value={2}>⭐⭐ Poor (2 stars)</option>
              <option value={1}>⭐ Very Poor (1 star)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
            Review Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Brief summary of your experience"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2d5016'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Review Text */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
            Your Review *
          </label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            placeholder="Share your detailed experience, what you loved, and suggestions for improvement..."
            rows="6"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2d5016'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            {formData.review.length} characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #2d5016 0%, #1a3509 100%)',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 16px rgba(45,80,22,0.3)'
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
        >
          {loading ? '⏳ Submitting...' : '📤 Submit Review'}
        </button>
      </form>
    </div>
  )
}
