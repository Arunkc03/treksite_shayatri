import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function DestinationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/destinations/${id}`)
        if (!response.ok) throw new Error('Failed to fetch destination')
        const data = await response.json()
        setDestination(data)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }
    fetchDestination()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏔️</div>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>Loading destination...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#64748b', marginBottom: '20px' }}>Destination not found</p>
          <button onClick={() => navigate('/destinations')} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>
            Back to Destinations
          </button>
        </div>
      </div>
    )
  }

  // Parse images
  let images = []
  try {
    images = destination.images ? JSON.parse(destination.images) : (destination.image_url ? [destination.image_url] : [])
  } catch {
    images = destination.image_url ? [destination.image_url] : []
  }

  const getImageUrl = (url) => {
    if (!url) return null
    return url.startsWith('http') ? url : `http://localhost:5000${url}`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/destinations')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back
          </button>
          <div>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 700 }}>{destination.name}</h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {destination.location}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Main Image */}
        <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
          {images.length > 0 && (
            <div style={{ position: 'relative', width: '100%', paddingBottom: '66.66%', background: '#f1f5f9' }}>
              <img 
                src={getImageUrl(images[selectedImage])} 
                alt={`${destination.name} - Image ${selectedImage + 1}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Image counter */}
              <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          )}
        </div>

        {/* Image Gallery Thumbnails */}
        {images.length > 1 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>📸 Gallery ({images.length} photos)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{ 
                    position: 'relative', 
                    aspectRatio: '1', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #667eea' : '2px solid #e2e8f0',
                    transition: 'all 0.3s',
                    boxShadow: selectedImage === idx ? '0 4px 12px rgba(102,126,234,0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedImage !== idx) {
                      e.currentTarget.style.borderColor = '#cbd5e1'
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedImage !== idx) {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {selectedImage === idx && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(102,126,234,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        ✓
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {destination.best_season && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #fbbf24' }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>🌤️ Best Season</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{destination.best_season}</div>
            </div>
          )}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>📍 Location</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{destination.location}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid '#10b981' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>🖼️ Photos</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{images.length} {images.length === 1 ? 'photo' : 'photos'}</div>
          </div>
        </div>

        {/* Description */}
        {destination.description && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📝 About
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#475569', margin: 0, whiteSpace: 'pre-wrap' }}>
              {destination.description}
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0' }}>Ready for an Adventure?</h3>
          <p style={{ fontSize: '16px', margin: '0 0 24px 0', opacity: 0.9 }}>Explore this amazing destination with Orophiletrek</p>
          <button onClick={() => navigate('/contact')} style={{ background: 'white', color: '#667eea', padding: '14px 32px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  )
}
