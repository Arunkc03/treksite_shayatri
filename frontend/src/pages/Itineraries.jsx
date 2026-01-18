import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { itinerariesAPI } from '../lib/apiClient'

export default function Itineraries() {
  const navigate = useNavigate()
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch itineraries from API
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true)
        const response = await itinerariesAPI.getAll()
        if (response.success && response.itineraries && response.itineraries.length > 0) {
          setItineraries(response.itineraries)
        } else {
          setItineraries([])
        }
      } catch (err) {
        console.warn('Failed to fetch itineraries:', err.message)
        setItineraries([])
      } finally {
        setLoading(false)
      }
    }

    fetchItineraries()
  }, [])

  const difficulties = ['All', 'Easy', 'Moderate', 'Hard']

  const filteredItineraries = useMemo(() => {
    return itineraries.filter(trek => {
      const matchesDifficulty = filterDifficulty === 'All' || trek.difficulty === filterDifficulty
      const matchesSearch = searchQuery === '' || 
        trek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesDifficulty && matchesSearch
    })
  }, [itineraries, filterDifficulty, searchQuery])

  if (loading) {
    return (
      <div className="page" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading itineraries...</p>
      </div>
    )
  }

  // Detail view
  if (selectedItinerary) {
    const trek = selectedItinerary
    return (
      <div className="page" style={{ padding: '40px 20px', background: '#f9fafb' }}>
        <button
          onClick={() => setSelectedItinerary(null)}
          style={{
            padding: '8px 16px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Back
        </button>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{trek.image}</div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#2d5016', marginBottom: '16px' }}>
              {trek.title}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Duration</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{trek.duration_days} Days</p>
              </div>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Difficulty</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{trek.difficulty}</p>
              </div>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Location</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{trek.location}</p>
              </div>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Price</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#d4a574' }}>₨{trek.price.toLocaleString()}</p>
              </div>
            </div>

            <div style={{ background: '#fff4e6', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #d4a574' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Best Season</p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>{trek.best_season}</p>
            </div>
          </div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Overview</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563', marginBottom: '20px' }}>
              {trek.description}
            </p>
          </section>

          {Array.isArray(trek.highlights) && trek.highlights.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Highlights</h2>
              <ul style={{ marginLeft: '24px' }}>
                {trek.highlights.map((highlight, idx) => (
                  <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '15px' }}>
                    ✓ {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Array.isArray(trek.dayByDayPlan) && trek.dayByDayPlan.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '20px' }}>Day-by-Day Itinerary</h2>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                {trek.dayByDayPlan.map((dayInfo, idx) => (
                  <div key={idx} style={{ borderBottom: idx !== trek.dayByDayPlan.length - 1 ? '1px solid #e5e7eb' : 'none', padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#2d5016', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                        {dayInfo.day || idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                          {dayInfo.place}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                          {dayInfo.activity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            {Array.isArray(trek.includes) && trek.includes.length > 0 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>What's Included</h2>
                <ul style={{ marginLeft: '20px' }}>
                  {trek.includes.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(trek.excludes) && trek.excludes.length > 0 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>What to Pack</h2>
                <ul style={{ marginLeft: '20px' }}>
                  {trek.excludes.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                      📦 {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <div style={{ background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(212,165,116,0.08))', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>Ready to Trek?</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Contact us to book this amazing trek or customize it to your needs.
            </p>
            <button
              onClick={() => navigate('/contact')}
              style={{
                padding: '12px 32px',
                background: '#2d5016',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="page" style={{ padding: '20px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#2d5016', marginBottom: '12px' }}>
            Trek Itineraries
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '30px' }}>
            Explore our carefully crafted trekking itineraries for all experience levels
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search treks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
              Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {filteredItineraries.map(trek => (
            <div
              key={trek.id}
              onClick={() => setSelectedItinerary(trek)}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(45,80,22,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '3rem', padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(212,165,116,0.08))' }}>
                {trek.image}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>
                  {trek.title}
                </h3>

                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', minHeight: '40px' }}>
                  {trek.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Duration</p>
                    <p style={{ fontWeight: '600', color: '#2d5016' }}>{trek.duration_days} Days</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Difficulty</p>
                    <p style={{ fontWeight: '600', color: '#2d5016' }}>{trek.difficulty}</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Location</p>
                    <p style={{ fontWeight: '600', color: '#2d5016' }}>{trek.location}</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Price</p>
                    <p style={{ fontWeight: '600', color: '#d4a574' }}>₨{trek.price.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2d5016',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItineraries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '20px' }}>
              {itineraries.length === 0 ? 'No itineraries available yet.' : 'No itineraries match your filters.'}
            </p>
            {itineraries.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterDifficulty('All')
                }}
                style={{
                  padding: '10px 20px',
                  background: '#2d5016',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
