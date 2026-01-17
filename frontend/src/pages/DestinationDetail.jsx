import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

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

  // Parse images and videos
  let images = []
  let videos = []
  try {
    images = destination.images ? JSON.parse(destination.images) : (destination.image_url ? [destination.image_url] : [])
    videos = destination.videos ? JSON.parse(destination.videos) : (destination.video_url ? [destination.video_url] : [])
  } catch {
    images = destination.image_url ? [destination.image_url] : []
    videos = destination.video_url ? [destination.video_url] : []
  }

  const getImageUrl = (url) => {
    if (!url) return null
    return url.startsWith('http') ? url : `http://localhost:5000${url}`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/destinations')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </button>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 700 }}>{destination.name}</h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {destination.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Main Image */}
        <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', background: '#f0f4ff', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {images.length > 0 ? (
            <img 
              src={getImageUrl(images[selectedImage])} 
              alt={destination.name}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ fontSize: '120px', textAlign: 'center' }}>
              🏔️
            </div>
          )}
        </div>

        {/* Image Gallery Thumbnails */}
        {images.length > 1 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #667eea' : '2px solid #e2e8f0',
                    transition: 'all 0.3s'
                  }}
                >
                  <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div>
            {/* Details Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2d5016', marginBottom: '20px' }}>Destination Details</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {destination.location && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📍 {destination.location}</p>
                  </div>
                )}
                
                {destination.best_season && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Best Season</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>🌤️ {destination.best_season}</p>
                  </div>
                )}

                {images.length > 0 && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Photos</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📸 {images.length} {images.length === 1 ? 'photo' : 'photos'}</p>
                  </div>
                )}
              </div>

              {destination.description && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginTop: 0, marginBottom: '12px' }}>About This Destination</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8', margin: 0, fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                    {destination.description}
                  </p>
                </div>
              )}

              {/* Videos Section */}
              {videos.length > 0 && (
                <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0369a1', marginTop: 0, marginBottom: '16px' }}>🎬 Videos</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                    {videos.map((video, idx) => (
                      <div key={idx} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                        <video 
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                          controls
                          controlsList="nodownload"
                        >
                          <source src={getImageUrl(video)} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
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
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700, color: '#2d5016' }}>Destination Info</h3>
              
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0f2fe' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px', fontWeight: 600 }}>📍 Location</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>
                  {destination.location}
                </p>
              </div>

              {destination.best_season && (
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0f2fe' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px', fontWeight: 600 }}>🌤️ Best Season</p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>
                    {destination.best_season}
                  </p>
                </div>
              )}

              <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fcd34d' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>📞 Contact Us</p>
                <button
                  onClick={() => window.location.href = 'tel:+977-1-4123456'}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginTop: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ☎️ Call Us
                </button>
              </div>
              
              <button
                onClick={() => navigate('/destinations')}
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
                ← Back to Destinations
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '40px' }}>
          <ReviewList type="destination" typeId={destination.id} />
        </div>

        {/* Review Form */}
        <div style={{ marginTop: '40px' }}>
          <ReviewForm destinationId={destination.id} />
        </div>
      </div>
    </div>
  )
}
