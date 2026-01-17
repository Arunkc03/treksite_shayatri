import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Map from '../components/Map'
import { trackingAPI } from '../lib/apiClient'

export default function Tracking() {
  const { user } = useAuth()
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [distance, setDistance] = useState(0)
  const [elevation, setElevation] = useState(0)
  const [pace, setPace] = useState('--')
  const [startTime, setStartTime] = useState(null)
  const [positions, setPositions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const watchId = React.useRef(null)

  async function startTracking() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // When backend is ready, uncomment:
      // const session = await trackingAPI.createSession(null, {
      //   started_at: new Date(),
      // })
      // setSessionId(session.id)

      setIsTracking(true)
      setStartTime(Date.now())
      setPositions([])
      setDistance(0)
      setElevation(0)
    } catch (err) {
      setError(err.message)
      console.error('Failed to start tracking session:', err)
    } finally {
      setLoading(false)
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords
        const newPos = [longitude, latitude, altitude || 0]

        setCurrentLocation({ lat: latitude, lng: longitude, alt: altitude || 0 })
        setPositions(prev => {
          const updated = [...prev, newPos]
          
          // Calculate distance (simple Haversine)
          if (updated.length > 1) {
            const prev_pos = updated[updated.length - 2]
            const curr_pos = updated[updated.length - 1]
            const dist = haversine(prev_pos[1], prev_pos[0], curr_pos[1], curr_pos[0])
            setDistance(d => {
              const nd = d + dist
              if (startTime) {
                const elapsedMin = (Date.now() - startTime) / 1000 / 60
                const speedKmh = elapsedMin > 0 ? (nd / (elapsedMin / 60)) : 0
                setPace(elapsedMin > 0 ? speedKmh.toFixed(1) : '--')
              }
              return nd
            })
          }

          // Send location update to backend (optional)
          if (sessionId) {
            // trackingAPI.updateSession(sessionId, {
            //   latitude,
            //   longitude,
            //   altitude,
            // }).catch(err => console.error('Failed to update session:', err))
          }

          // Calculate elevation gain
          if (updated.length > 1) {
            const prevAlt = updated[updated.length - 2][2] || 0
            const currAlt = updated[updated.length - 1][2] || 0
            const gain = currAlt - prevAlt
            if (gain > 0) {
              setElevation(e => e + gain)
            }
          }

          // Calculate pace
          if (startTime) {
            const elapsed = (Date.now() - startTime) / 1000 / 60 // minutes
            const pace_val = elapsed > 0 ? (distance / (elapsed / 60)).toFixed(1) : '--'
            setPace(pace_val)
          }

          return updated
        })
      },
      (error) => alert('GPS error: ' + error.message),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }

  function stopTracking() {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current)
    }
    setIsTracking(false)

    // Save session to backend
    if (sessionId) {
      // trackingAPI.finishSession(sessionId, {
      //   finished_at: new Date(),
      //   total_distance_km: distance,
      //   total_elevation_gain_m: elevation,
      //   route_coordinates: positions,
      // }).catch(err => console.error('Failed to finish session:', err))
    }
  }


  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div className="page tracking-page">
      <h1>Live Trek Tracking</h1>
      {error && <p className="error-text">Error: {error}</p>}

      <div className="tracking-controls">
        {!isTracking ? (
          <button onClick={startTracking} className="start-btn" disabled={loading}>
            {loading ? 'Starting...' : 'Start Tracking'}
          </button>
        ) : (
          <button onClick={stopTracking} className="stop-btn">Stop Tracking</button>
        )}
      </div>

      {currentLocation && (
        <div className="stats-panel">
          <div className="stat">
            <span className="label">Distance</span>
            <span className="value">{distance.toFixed(2)} km</span>
          </div>
          <div className="stat">
            <span className="label">Elevation Gain</span>
            <span className="value">{elevation.toFixed(0)} m</span>
          </div>
          <div className="stat">
            <span className="label">Pace</span>
            <span className="value">{pace} km/h</span>
          </div>
          <div className="stat">
            <span className="label">Coordinates</span>
            <span className="value">{currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
          </div>
        </div>
      )}

      {positions.length > 0 && (
        <Map route={positions} center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [0, 0]} />
      )}

      {!positions.length && (
        <div className="map-placeholder">
          <p>Start tracking to see your route on the map</p>
        </div>
      )}
    </div>
  )
}
