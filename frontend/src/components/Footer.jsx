import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #e5e7eb',
      padding: '60px 20px 20px',
      marginTop: '80px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Section */}
        <div>
          <h2 style={{ color: '#000000', fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
            Orophiletrek
          </h2>
          <p style={{ color: '#666666', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
            Your adventure starts here. Explore beautiful mountain trails and book your next trekking experience.
          </p>
        </div>

        {/* Explore Adventures */}
        <div>
          <h3 style={{ color: '#000000', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Explore Adventures</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/trails" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Trails</NavLink>
            <NavLink to="/climbing" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Climbing</NavLink>
            <NavLink to="/activities" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Activities</NavLink>
            <NavLink to="/gallery" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Gallery</NavLink>
          </nav>
        </div>

        {/* Tools & Services */}
        <div>
          <h3 style={{ color: '#000000', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Tools & Services</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/tracking" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Live Tracking</NavLink>
            <NavLink to="/gear" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Gear Guide</NavLink>
            <NavLink to="/events" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Events</NavLink>
            <NavLink to="/blog" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Blog</NavLink>
          </nav>
        </div>

        {/* Help & Support */}
        <div>
          <h3 style={{ color: '#000000', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Help & Support</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/faq" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>FAQ</NavLink>
            <NavLink to="/contact" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Contact Us</NavLink>
            <NavLink to="/about" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>About Us</NavLink>
            <a href="#terms" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</a>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ color: '#000000', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ color: '#333333', fontSize: '14px', margin: 0 }}>Email: info@orophiletrek.com</p>
            <p style={{ color: '#333333', fontSize: '14px', margin: 0 }}>Phone: +977-1-1234567</p>
            <p style={{ color: '#333333', fontSize: '14px', margin: 0 }}>Kathmandu, Nepal</p>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h3 style={{ color: '#000000', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Quick Access</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Home</NavLink>
            <NavLink to="/features" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Features</NavLink>
            <a href="#privacy" style={{ color: '#333333', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</a>
          </nav>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '20px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666666', fontSize: '14px', margin: 0 }}>
          &copy; {currentYear} Orophiletrek. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
