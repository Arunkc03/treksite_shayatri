import React, { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      // Simulate API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form submitted:', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page contact-page">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions about trails or features? We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-wrapper">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}
          
          {error && (
            <div className="error-message">{error}</div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us your thoughts, questions, or feedback..."
                rows={6}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Other Ways to Reach Us</h2>
          
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p><a href="mailto:support@treksite.com">support@treksite.com</a></p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Location</h3>
            <p>123 Mountain Trail<br />Adventure City, AC 12345</p>
          </div>

          <div className="info-card">
            <div className="info-icon">⏰</div>
            <h3>Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM<br />Sat - Sun: 10:00 AM - 4:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
