import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data, error: err } = await signIn(email, password)
      console.log('Login response:', { data, err })
      
      if (err) {
        setError(err)
      } else if (data && data.user) {
        // Check if user is admin
        if (data.user.role === 'admin') {
          console.log('Admin login successful, redirecting to /dashboard')
          navigate('/dashboard')
        } else {
          setError('Access denied. Admin privileges required.')
        }
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="page auth-page">
      <div className="auth-form-container">
        <h1>Admin Sign In</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Admin Dashboard Access Only
        </p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="admin@orophiletrek.com"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
