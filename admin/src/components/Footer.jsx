import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <h2 className="footer-logo">🏔️ Trek<span>Site</span></h2>
          <p style={{ marginBottom: '16px' }}>Your adventure starts here. Explore trails, share experiences, and discover the world.</p>
          <div className="footer-socials" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <a href="#" title="Facebook" style={{ fontSize: '20px', color: '#1877f2', textDecoration: 'none' }}>f</a>
            <a href="#" title="Instagram" style={{ fontSize: '20px', color: '#e1306c', textDecoration: 'none' }}>📷</a>
            <a href="#" title="Twitter" style={{ fontSize: '20px', color: '#1da1f2', textDecoration: 'none' }}>𝕏</a>
            <a href="#" title="YouTube" style={{ fontSize: '20px', color: '#ff0000', textDecoration: 'none' }}>▶️</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <nav className="footer-nav">
            <NavLink to="/trails">Trails</NavLink>
            <NavLink to="/climbing">Climbing</NavLink>
            <NavLink to="/activities">Activities</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <nav className="footer-nav">
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
          </nav>
        </div>

        {/* More */}
        <div className="footer-section">
          <h3>More</h3>
          <nav className="footer-nav">
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/tracking">Tracking</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Info</h3>
          <nav className="footer-nav" style={{ lineHeight: '1.8', fontSize: '14px' }}>
            <p style={{ margin: '8px 0' }}>📧 info@treksite.com</p>
            <p style={{ margin: '8px 0' }}>📱 +977-1-1234567</p>
            <p style={{ margin: '8px 0' }}>📍 Kathmandu, Nepal</p>
          </nav>
        </div>

        {/* Working Hours */}
        <div className="footer-section">
          <h3>Working Hours</h3>
          <nav className="footer-nav" style={{ lineHeight: '1.8', fontSize: '14px' }}>
            <p style={{ margin: '8px 0' }}>Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p style={{ margin: '8px 0' }}>Sat: 10:00 AM - 4:00 PM</p>
            <p style={{ margin: '8px 0' }}>Sun: Closed</p>
          </nav>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px', textAlign: 'center' }}>
        <p>&copy; {currentYear} TrekSite. All rights reserved. | Built with ❤️ for adventure seekers</p>
      </div>
    </footer>
  )
}
