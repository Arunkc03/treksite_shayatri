import React, { useState, useEffect } from 'react'
import { climbingAPI } from '../lib/apiClient'

export default function Climbing() {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    difficulty: '',
    rockType: '',
    location: ''
  })

  useEffect(() => {
    fetchClimbingSpots()
  }, [])

  const fetchClimbingSpots = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await climbingAPI.getAll(filters)
      setSpots(data.climbing || [])
    } catch (err) {
      setError(err.message)
      console.error('Failed to fetch climbing spots:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const applyFilters = () => {
    fetchClimbingSpots()
  }

  const resetFilters = () => {
    setFilters({ difficulty: '', rockType: '', location: '' })
    setTimeout(() => fetchClimbingSpots(), 100)
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

  return (
    <div className="page climbing-page">
      <div className="climbing-header">
        <h1>Rock Climbing Spots</h1>
        <p>Discover the best rock climbing locations in Nepal. From beginner-friendly crags to challenging multi-pitch routes.</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>🔍 Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Difficulty</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            >
              <option value="">All</option>
              <option value="Easy">Easy (5.1-5.7)</option>
              <option value="Moderate">Moderate (5.8-5.10)</option>
              <option value="Hard">Hard (5.11+)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Rock Type</label>
            <input
              type="text"
              name="rockType"
              value={filters.rockType}
              onChange={handleFilterChange}
              placeholder="e.g., Granite"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search location"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            onClick={applyFilters}
            style={{ padding: '10px 24px', background: '#2d5016', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#1f3810'}
            onMouseOut={(e) => e.target.style.background = '#2d5016'}
          >
            🔍 Apply Filters
          </button>
          <button
            onClick={resetFilters}
            style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#dc2626'}
            onMouseOut={(e) => e.target.style.background = '#ef4444'}
          >
            🔄 Reset Filters
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-message" style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && <p className="loading-text">Loading climbing spots...</p>}

      {/* Empty State */}
      {!loading && spots.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', margin: '20px 0' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '12px' }}>
            No climbing spots found.
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Try adjusting your filters or check back later for new locations.
          </p>
        </div>
      )}

      {/* Spots Grid */}
      {!loading && spots.length > 0 && (
        <div className="activities-grid">
          {spots.map(spot => {
            const imageSrc = getImageUrl(spot.image)
            const isImage = imageSrc !== null && (imageSrc.startsWith('http') || imageSrc.startsWith('/'))

            return (
              <div key={spot.id} className="activity-card">
                <div className="activity-image">
                  {imageSrc && isImage ? (
                    <img src={imageSrc} alt={spot.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '64px', textAlign: 'center', paddingTop: '50px' }}>
                      {spot.image || '🧗'}
                    </div>
                  )}
                </div>
                <div className="activity-content">
                  <h3>{spot.name}</h3>
                  
                  <div className="activity-header-info">
                    <div className="location-badge">📍 {spot.location}</div>
                    <div className={`difficulty-badge difficulty-${spot.difficulty.toLowerCase()}`}>
                      {spot.difficulty}
                    </div>
                    {spot.price !== null && spot.price !== undefined && (
                      <div style={{ background: '#2d5016', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>
                        ₨ {parseFloat(spot.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                    )}
                  </div>
                  
                  <div className="activity-details">
                    <div className="detail-section">
                      <h4>Climbing Details</h4>
                      <ul className="details-list">
                        <li>
                          <span className="detail-icon">📍</span>
                          <span className="detail-text"><strong>Location:</strong> {spot.location}</span>
                        </li>
                        <li>
                          <span className="detail-icon">🔧</span>
                          <span className="detail-text"><strong>Difficulty:</strong> {spot.difficulty}</span>
                        </li>
                        {spot.rock_type && (
                          <li>
                            <span className="detail-icon">⛰️</span>
                            <span className="detail-text"><strong>Rock Type:</strong> {spot.rock_type}</span>
                          </li>
                        )}
                        {spot.height_meters && (
                          <li>
                            <span className="detail-icon">📏</span>
                            <span className="detail-text"><strong>Height:</strong> {spot.height_meters}m</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <button 
                    className="book-btn"
                    onClick={() => window.location.href = `/climbing/${spot.id}`}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
