import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDestinations()
  }, [])

  async function fetchDestinations() {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/destinations')
      setDestinations(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching destinations:', err)
      setError('Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Loading destinations...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#dc2626' }}>
        <h2>{error}</h2>
      </div>
    )
  }

  return (
    <div className="page destinations-page">
      <div className="destinations-header">
        <h1>Popular Destinations</h1>
        <p>Explore amazing destinations for your next adventure</p>
      </div>

      {destinations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', margin: '20px 0' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '12px' }}>
            No destinations available yet.
          </p>
        </div>
      ) : (
        <div className="activities-grid">
          {destinations.map((dest) => {
            // Handle image URLs - check both images and image_url fields
            let imageSrc = null
            
            // Try to use images field first (our new data)
            if (dest.images) {
              if (typeof dest.images === 'string' && !dest.images.startsWith('[')) {
                // It's a simple string path
                imageSrc = dest.images.startsWith('http') ? dest.images : `http://localhost:5000/${dest.images}`
              } else {
                // Try to parse as JSON array
                try {
                  const parsed = JSON.parse(dest.images)
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    imageSrc = parsed[0].startsWith('http') ? parsed[0] : `http://localhost:5000/${parsed[0]}`
                  }
                } catch {
                  // Not JSON, treat as string
                  imageSrc = dest.images.startsWith('http') ? dest.images : `http://localhost:5000/${dest.images}`
                }
              }
            }
            
            // Fallback to image_url if images not available
            if (!imageSrc && dest.image_url) {
              imageSrc = dest.image_url.startsWith('http') ? dest.image_url : `http://localhost:5000${dest.image_url}`
            }

            return (
              <div key={dest.id} className="activity-card">
                <div className="activity-image">
                  {imageSrc ? (
                    <img src={imageSrc} alt={dest.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '64px', textAlign: 'center', paddingTop: '50px' }}>
                      🏔️
                    </div>
                  )}
                </div>
                <div className="activity-content">
                  <h3>{dest.name}</h3>
                  
                  <div className="activity-header-info">
                    {dest.location && <div className="location-badge">📍 {dest.location}</div>}
                    {dest.best_season && (
                      <div style={{ background: '#f59e0b', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>
                        🌤️ {dest.best_season}
                      </div>
                    )}
                  </div>

                  <div className="activity-details">
                    <div className="detail-section">
                      <h4>Destination Details</h4>
                      <ul className="details-list">
                        {dest.location && (
                          <li>
                            <span className="detail-icon">📍</span>
                            <span className="detail-text"><strong>Location:</strong> {dest.location}</span>
                          </li>
                        )}
                        {dest.best_season && (
                          <li>
                            <span className="detail-icon">🌤️</span>
                            <span className="detail-text"><strong>Best Season:</strong> {dest.best_season}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <button 
                    className="book-btn"
                    onClick={() => window.location.href = `/destinations/${dest.id}`}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
