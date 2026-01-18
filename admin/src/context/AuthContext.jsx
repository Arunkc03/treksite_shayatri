import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({})

const API_BASE = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn('Failed to parse stored user:', err);
      }
    }
    // Immediately set loading to false
    setLoading(false);
    console.log('✅ AuthContext initialized');
  }, [])

  const signUp = async (email, password, name = email.split('@')[0]) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Store user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userToken', data.token || `token_${data.user.id}`);
        setUser(data.user);
      }

      return { data, error: null };
    } catch (error) {
      console.error('SignUp Error:', error);
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store user data and token
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userToken', data.token);
        setUser(data.user);
      }

      return { data, error: null };
    } catch (error) {
      console.error('SignIn Error:', error);
      return { data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.warn('Logout error:', err);
    }
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
