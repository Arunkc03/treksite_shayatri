import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import trails from '../data/trails'
import { trailsAPI } from '../lib/apiClient'

export default function Trails() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    difficulty: '',
    minLength: '',
    maxLength: '',
    location: ''
  })
  const [allTrails, setAllTrails] = useState(trails) // Local state for trails
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch trails from backend when component mounts
  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await trailsAPI.getAll()
        setAllTrails(data.trails || [])
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch trails:', err)
        setAllTrails([]) // Empty array if fetch fails
      } finally {
        setLoading(false)
      }
    }
    fetchTrails()
  }, [])

  const q = (searchParams.get('q') || '').toLowerCase().trim()

  let filtered = q
    ? allTrails.filter(t => (t.name + ' ' + t.location).toLowerCase().includes(q))
    : allTrails

  // Apply additional filters
  if (filters.difficulty) {
    filtered = filtered.filter(t => t.difficulty === filters.difficulty)
  }
  if (filters.minLength) {
    const minLen = parseFloat(filters.minLength)
    filtered = filtered.filter(t => {
      const len = parseFloat(t.length_km || t.length || 0)
      return len >= minLen
    })
  }
  if (filters.maxLength) {
    const maxLen = parseFloat(filters.maxLength)
    filtered = filtered.filter(t => {
      const len = parseFloat(t.length_km || t.length || 0)
      return len <= maxLen
    })
  }
  if (filters.location) {
    filtered = filtered.filter(t => t.location.toLowerCase().includes(filters.location.toLowerCase()))
  }

  const difficulties = ['Easy', 'Moderate', 'Hard']
  const locations = [...new Set(allTrails.map(t => t.location).filter(Boolean))]

  return (
    <div className="page trails" style={{ minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>All Trails</h1>
      {q ? <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>Showing results for "{q}" — {filtered.length} found</p> : null}

      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>🔍 Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={e => setFilters({...filters, difficulty: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            >
              <option value="">All</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Location</label>
            <select
              value={filters.location}
              onChange={e => setFilters({...filters, location: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            >
              <option value="">All</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Min Length (km)</label>
            <input
              type="number"
              value={filters.minLength}
              onChange={e => setFilters({...filters, minLength: e.target.value})}
              placeholder="0"
              min="0"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Max Length (km)</label>
            <input
              type="number"
              value={filters.maxLength}
              onChange={e => setFilters({...filters, maxLength: e.target.value})}
              placeholder="100"
              min="0"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '14px', background: '#fff' }}
            />
          </div>
        </div>

        <button
          onClick={() => setFilters({difficulty: '', minLength: '', maxLength: '', location: ''})}
          style={{ marginTop: '16px', padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.background = '#dc2626'}
          onMouseOut={(e) => e.target.style.background = '#ef4444'}
        >
          🔄 Reset Filters
        </button>
      </div>

      <div className="trails-grid">
        {loading && <p className="loading-text">Loading trails...</p>}
        {error && <p className="error-message" style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>Error: {error}</p>}
        
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', margin: '20px 0', gridColumn: '1 / -1' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '12px' }}>
              No trails match your filters.
            </p>
          </div>
        )}

        {filtered.map(trail => {
          // Handle image URLs properly
          const isImage = trail.image && (
            trail.image.startsWith('http') || 
            trail.image.startsWith('/uploads') || 
            trail.image.includes('localhost') ||
            trail.image.includes('trek-')
          );
          let imageSrc = trail.image;
          if (trail.image && trail.image.startsWith('/uploads')) {
            imageSrc = `http://localhost:5000${trail.image}`;
          }
          
          return (
            <div key={trail.id} className="activity-card">
              <div className="activity-image">
                {trail.image && isImage ? (
                  <img src={imageSrc} alt={trail.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '64px', textAlign: 'center', paddingTop: '50px' }}>
                    {trail.image || '⛰️'}
                  </div>
                )}
              </div>
              <div className="activity-content">
                <h3>{trail.name}</h3>
                
                <div className="activity-header-info">
                  <div className="location-badge">📍 {trail.location}</div>
                  <div className={`difficulty-badge difficulty-${trail.difficulty.toLowerCase()}`}>
                    {trail.difficulty}
                  </div>
                  {trail.price && (
                    <div style={{ background: '#2d5016', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>
                      ₨ {parseFloat(trail.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                </div>

                <div className="activity-details">
                  <div className="detail-section">
                    <h4>Trail Details</h4>
                    <ul className="details-list">
                      <li>
                        <span className="detail-icon">📍</span>
                        <span className="detail-text"><strong>Location:</strong> {trail.location}</span>
                      </li>
                      <li>
                        <span className="detail-icon">🔧</span>
                        <span className="detail-text"><strong>Difficulty:</strong> {trail.difficulty}</span>
                      </li>
                      {trail.length_km && (
                        <li>
                          <span className="detail-icon">📏</span>
                          <span className="detail-text"><strong>Distance:</strong> {trail.length_km} km</span>
                        </li>
                      )}
                      {trail.price && (
                        <li>
                          <span className="detail-icon">💰</span>
                          <span className="detail-text"><strong>Price:</strong> ₨ {parseFloat(trail.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {trail.contact && (
                    <div className="detail-section">
                      <h4>Contact Information</h4>
                      <ul className="details-list">
                        <li>
                          <span className="detail-icon">📞</span>
                          <span className="detail-text">{trail.contact}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button 
                  className="book-btn"
                  onClick={() => window.location.href = `/trails/${trail.id}`}
                >
                  👁️ View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
