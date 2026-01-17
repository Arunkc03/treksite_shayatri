import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileAPI } from '../lib/apiClient'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(localStorage.getItem('userBio') || '')
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || '')
  const [treksCompleted, setTreksCompleted] = useState(parseInt(localStorage.getItem('treksCompleted') || 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [trekHistory, setTrekHistory] = useState([])

  // Fetch user profile and stats from backend
  useEffect(() => {
    if (!user) return

    const fetchProfileData = async () => {
      setLoading(true)
      setError(null)
      try {
        // When backend is ready, uncomment:
        // const profileData = await profileAPI.getProfile(user.id)
        // setBio(profileData.bio || '')
        // setLocation(profileData.location || '')
        // setTreksCompleted(profileData.treks_completed || 0)

        // const statsData = await profileAPI.getStats(user.id)
        // setStats(statsData)

        // const historyData = await profileAPI.getTrekHistory(user.id)
        // setTrekHistory(historyData.treks || [])

        // For now, use localStorage
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  async function handleSave() {
    setLoading(true)
    setError(null)
    try {
      const profileData = { bio, location, treks_completed: treksCompleted }
      
      // When backend is ready, uncomment:
      // await profileAPI.updateProfile(user.id, profileData)

      // For now, save to localStorage
      localStorage.setItem('userBio', bio)
      localStorage.setItem('userLocation', location)
      localStorage.setItem('treksCompleted', treksCompleted)
      
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
      console.error('Failed to update profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="page profile-page">
      <h1>Your Profile</h1>
      {error && <p className="error-text">Error: {error}</p>}
      {loading && <p className="loading-text">Loading profile...</p>}
      {user && (
        <div className="profile-card">
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id.slice(0, 8)}...</p>
            <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>

          {stats && (
            <div className="profile-stats">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-label">Total Distance</p>
                  <p className="stat-value">{stats.total_distance_km || 0} km</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Total Elevation</p>
                  <p className="stat-value">{stats.total_elevation_gain || 0} m</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Trek Time</p>
                  <p className="stat-value">{stats.total_hours || 0} hrs</p>
                </div>
              </div>
            </div>
          )}

          <div className="profile-section">
            <h3>Trekking Profile</h3>
            {isEditing ? (
              <form className="profile-form">
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about your trekking experience..."
                />
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Your home location"
                />
                <label>Treks Completed</label>
                <input
                  type="number"
                  value={treksCompleted}
                  onChange={e => setTreksCompleted(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                />
                <div className="button-group">
                  <button onClick={handleSave} className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-display">
                <p><strong>Bio:</strong> {bio || 'No bio added'}</p>
                <p><strong>Location:</strong> {location || 'Not set'}</p>
                <p><strong>Treks Completed:</strong> {treksCompleted}</p>
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
              </div>
            )}
          </div>

          {trekHistory.length > 0 && (
            <div className="trek-history">
              <h3>Trek History</h3>
              <ul>
                {trekHistory.map(trek => (
                  <li key={trek.id}>
                    {trek.trail_name} — {trek.distance_km} km • {new Date(trek.completed_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  )
}
