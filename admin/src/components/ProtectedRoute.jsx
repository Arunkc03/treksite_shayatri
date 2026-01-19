import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="page" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #2d5016',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>Loading Dashboard...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }
  
  if (!user) return <Navigate to="/signin" replace />
  
  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <div className="page" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#dc2626', marginTop: '0' }}>Access Denied</h2>
          <p style={{ color: '#666' }}>You do not have admin privileges to access this page.</p>
        </div>
      </div>
    )
  }
  
  return children
}
