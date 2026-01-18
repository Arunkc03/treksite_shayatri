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
    <div className="page auth-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)'
    }}>
      <div className="auth-form-container" style={{
        background: 'white',
        padding: 'clamp(20px, 5vw, 40px)',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '420px'
      }}>
        <h1 style={{
          textAlign: 'center',
          margin: '0 0 10px 0',
          color: '#1e293b',
          fontSize: 'clamp(24px, 6vw, 32px)',
          fontWeight: '700'
        }}>Admin Sign In</h1>
        <p style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#666',
          fontSize: 'clamp(13px, 4vw, 14px)'
        }}>
          Admin Dashboard Access Only
        </p>
        {error && <p className="error" style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: 'clamp(13px, 4vw, 14px)',
          textAlign: 'center'
        }}>{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: 'clamp(13px, 4vw, 14px)',
              fontWeight: '500'
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: 'clamp(14px, 4vw, 16px)',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: 'clamp(13px, 4vw, 14px)',
              fontWeight: '500'
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: 'clamp(14px, 4vw, 16px)',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            background: loading ? '#9ca3af' : '#2d5016',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 4vw, 16px)',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px',
            transition: 'background 0.2s',
            width: '100%'
          }} onMouseEnter={(e) => !loading && (e.target.style.background = '#4a7c2c')} onMouseLeave={(e) => !loading && (e.target.style.background = '#2d5016')}>
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
