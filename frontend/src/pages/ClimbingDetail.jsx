import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { climbingAPI } from '../lib/apiClient'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'

export default function ClimbingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSpot()
  }, [id])

  const fetchSpot = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await climbingAPI.getById(id)
      setSpot(data.climbing)
    } catch (err) {
      setError('Failed to load climbing spot details')
      console.error('Error fetching climbing spot:', err)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (typeof imagePath !== 'string') return null
    
    // Already a full HTTP URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    
    // Path starting with /uploads
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`
    
    // Just filename or path without /uploads prefix - construct full URL
    if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`
    
    // Default fallback
    return imagePath
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading climbing spot details...</p>
      </div>
    )
  }

  if (error || !spot) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#e74c3c', marginBottom: '16px' }}>{error || 'Climbing spot not found'}</p>
          <button 
            onClick={() => navigate('/climbing')}
            style={{ padding: '10px 20px', background: '#2d5016', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Back to Climbing
          </button>
        </div>
      </div>
    )
  }

  const imageSrc = getImageUrl(spot.image)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/climbing')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </button>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 700 }}>{spot.name}</h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {spot.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Main Image */}
        <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', background: '#f0f4ff', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={spot.name}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ fontSize: '120px', textAlign: 'center' }}>
              🧗
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div>
            {/* Details Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2d5016', marginBottom: '20px' }}>Climbing Details</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {spot.location && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📍 {spot.location}</p>
                  </div>
                )}
                
                {spot.difficulty && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Difficulty</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>⛰️ {spot.difficulty}</p>
                  </div>
                )}

                {spot.height_meters && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Height</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📏 {spot.height_meters}m</p>
                  </div>
                )}
              </div>

              {spot.rock_type && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginTop: 0, marginBottom: '12px' }}>Rock Type</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8', margin: 0, fontSize: '16px' }}>
                    {spot.rock_type}
                  </p>
                </div>
              )}

              {spot.description && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginTop: 0, marginBottom: '12px' }}>About This Spot</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8', margin: 0, fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                    {spot.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700, color: '#2d5016' }}>Quick Info</h3>
              
              {spot.price !== null && spot.price !== undefined && (
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #0369a1', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '12px', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Price per Person</p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#2d5016' }}>
                    ₨ {parseFloat(spot.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
              )}

              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0f2fe' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px', fontWeight: 600 }}>⛰️ Difficulty Level</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>
                  {spot.difficulty || 'Not specified'}
                </p>
              </div>

              {spot.height_meters && (
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0f2fe' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px', fontWeight: 600 }}>📏 Height</p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>
                    {spot.height_meters} meters
                  </p>
                </div>
              )}

              <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fcd34d' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>📞 Get More Information</p>
                <button
                  onClick={() => navigate('/contact', { state: { climbingId: spot.id, climbingName: spot.name } })}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginTop: '8px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ✉️ Contact
                </button>
              </div>
              
              <button
                onClick={() => navigate('/climbing')}
                style={{
                  width: '100%',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  transition: 'background 0.2s',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.background = '#e5e7eb'}
              >
                ← Back to Climbing
              </button>

              {/* Info Box */}
              <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', color: '#92400e' }}>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
                  💡 <strong>Tip:</strong> Book early for your preferred date and don't forget to bring appropriate climbing gear!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '40px' }}>
          <ReviewList type="climbing" typeId={spot.id} />
        </div>

        {/* Review Form */}
        <div style={{ marginTop: '40px' }}>
          <ReviewForm climbingId={spot.id} />
        </div>
      </div>
    </div>
  )
}
