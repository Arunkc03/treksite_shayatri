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
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>
        Destinations
      </h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '48px' }}>
        Explore amazing destinations for your next adventure
      </p>

      {destinations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '18px' }}>No destinations available yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '32px' 
        }}>
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigate(`/destinations/${dest.id}`)}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              {dest.image_url && (
                <div style={{ 
                  height: '240px', 
                  overflow: 'hidden',
                  background: '#e2e8f0'
                }}>
                  <img
                    src={dest.image_url.startsWith('http') ? dest.image_url : `http://localhost:5000${dest.image_url}`}
                    alt={dest.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  marginBottom: '12px',
                  color: '#1e293b'
                }}>
                  {dest.name}
                </h3>
                
                {dest.description && (
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#64748b', 
                    marginBottom: '16px',
                    lineHeight: '1.6'
                  }}>
                    {dest.description}
                  </p>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  flexWrap: 'wrap',
                  marginTop: '16px'
                }}>
                  {dest.location && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      📍 {dest.location}
                    </span>
                  )}
                  
                  {dest.best_season && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      🌤️ {dest.best_season}
                    </span>
                  )}
                </div>

                <button style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)'
                  e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = 'none'
                }}>
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
