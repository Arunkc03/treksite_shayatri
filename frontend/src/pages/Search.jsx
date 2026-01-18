import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { trailsAPI, activitiesAPI } from '../lib/apiClient'

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState({
    trails: [],
    activities: [],
    destinations: []
  })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      performSearch()
    }
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      // Search trails
      const trailsData = await trailsAPI.getAll({ q: query })
      const trails = trailsData.trails || []

      // Search activities
      const activitiesData = await activitiesAPI.getAll({ q: query })
      const activities = activitiesData.activities || []

      // Search destinations
      const destResponse = await fetch(`http://localhost:5000/api/destinations`)
      const destinations = (await destResponse.json()).filter(dest =>
        dest.name?.toLowerCase().includes(query.toLowerCase()) ||
        dest.description?.toLowerCase().includes(query.toLowerCase()) ||
        dest.location?.toLowerCase().includes(query.toLowerCase())
      )

      setResults({
        trails: trails.slice(0, 8),
        activities: activities.slice(0, 8),
        destinations: destinations.slice(0, 8)
      })
    } catch (err) {
      console.error('Search error:', err)
      setResults({ trails: [], activities: [], destinations: [] })
    } finally {
      setLoading(false)
    }
  }

  const totalResults = results.trails.length + results.activities.length + results.destinations.length

  return (
    <div className="page search-results-page">
      <section className="search-header" style={{ padding: '40px 20px', background: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)', textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '16px' }}>Search Results</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          {query && `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`}
        </p>
      </section>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Searching...</p>
        </div>
      )}

      {!loading && !searched && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Enter a search query to find trails, activities, and destinations</p>
        </div>
      )}

      {!loading && searched && totalResults === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No results found for "{query}". Try searching for something else!</p>
        </div>
      )}

      {!loading && searched && totalResults > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Trails Results */}
          {results.trails.length > 0 && (
            <section style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2d5016', marginBottom: '24px', borderBottom: '3px solid #2d5016', paddingBottom: '12px' }}>
                🥾 Trails ({results.trails.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {results.trails.map(trail => (
                  <div 
                    key={trail.id}
                    onClick={() => navigate(`/trails/${trail.id}`)}
                    style={{ cursor: 'pointer', padding: '20px', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '1px solid #f0f0f0' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>{trail.image || '⛰️'}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginBottom: '8px' }}>{trail.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>📍 {trail.location}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ padding: '4px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{trail.difficulty}</span>
                      <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#15803d', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{trail.length_km || trail.length} km</span>
                    </div>
                    {trail.price && <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d5016' }}>₨ {parseFloat(trail.price).toLocaleString('en-NP', { minimumFractionDigits: 0 })}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Activities Results */}
          {results.activities.length > 0 && (
            <section style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2d5016', marginBottom: '24px', borderBottom: '3px solid #2d5016', paddingBottom: '12px' }}>
                🎯 Activities ({results.activities.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {results.activities.map(activity => (
                  <div 
                    key={activity.id}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    style={{ cursor: 'pointer', padding: '20px', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '1px solid #f0f0f0' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>{activity.image || '🎯'}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginBottom: '8px' }}>{activity.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>📍 {activity.location}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ padding: '4px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{activity.difficulty}</span>
                      {activity.price && (
                        <span style={{ padding: '4px 12px', background: '#2d5016', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>₨ {parseFloat(activity.price).toLocaleString('en-NP', { minimumFractionDigits: 0 })}</span>
                      )}
                    </div>
                    {activity.description && <p style={{ fontSize: '13px', color: '#666' }}>{activity.description.substring(0, 80)}...</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Destinations Results */}
          {results.destinations.length > 0 && (
            <section style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2d5016', marginBottom: '24px', borderBottom: '3px solid #2d5016', paddingBottom: '12px' }}>
                🏔️ Destinations ({results.destinations.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {results.destinations.map(dest => (
                  <div 
                    key={dest.id}
                    onClick={() => navigate(`/destinations/${dest.id}`)}
                    style={{ cursor: 'pointer', padding: '20px', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '1px solid #f0f0f0' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>{dest.image_url || '🏔️'}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginBottom: '8px' }}>{dest.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>📍 {dest.location}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Best: {dest.best_season}</p>
                    {dest.description && <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>{dest.description.substring(0, 80)}...</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
