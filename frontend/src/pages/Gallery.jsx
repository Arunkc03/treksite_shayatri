import React, { useState, useEffect } from 'react'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page gallery-page">
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center', marginBottom: '0' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 12px 0' }}>🖼️ Adventure Gallery</h1>
        <p style={{ fontSize: '18px', margin: '0', opacity: 0.9 }}>Explore beautiful moments from our trekking adventures</p>
      </section>

      <div style={{ padding: '60px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>Loading gallery...</p>
            </div>
          )}

          {!loading && photos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📸</div>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>No photos in gallery yet</p>
              <p style={{ fontSize: '14px', color: '#999' }}>Admin will add adventure photos soon!</p>
            </div>
          )}

          {!loading && photos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              width: '100%'
            }}>
              {photos.map((photo, index) => (
                <div 
                  key={photo.id}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{
                    height: '240px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
                    position: 'relative'
                  }}>
                    <img
                      src={photo.photo_url.startsWith('http') ? photo.photo_url : `http://localhost:5000${photo.photo_url}`}
                      alt={photo.description || 'Gallery photo'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      #{index + 1}
                    </div>
                  </div>

                  {photo.description && (
                    <div style={{ padding: '16px' }}>
                      <p style={{
                        margin: 0,
                        color: '#333',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {photo.description}
                      </p>
                    </div>
                  )}

                  <div style={{
                    padding: photo.description ? '0 16px 16px' : '16px',
                    borderTop: photo.description ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <p style={{
                      margin: 0,
                      color: '#999',
                      fontSize: '12px'
                    }}>
                      {new Date(photo.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '32px',
              cursor: 'pointer',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)'
            }}
          >
            ✕
          </button>

          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.photo_url.startsWith('http') ? selectedPhoto.photo_url : `http://localhost:5000${selectedPhoto.photo_url}`}
              alt={selectedPhoto.description || 'Gallery photo'}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 'calc(80vh - 120px)',
                objectFit: 'contain'
              }}
            />
            {selectedPhoto.description && (
              <div style={{ padding: '24px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                <p style={{
                  margin: 0,
                  color: '#333',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  {selectedPhoto.description}
                </p>
                <p style={{
                  margin: '12px 0 0 0',
                  color: '#999',
                  fontSize: '13px'
                }}>
                  {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
