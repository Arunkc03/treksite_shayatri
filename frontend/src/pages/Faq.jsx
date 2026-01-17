import React, { useState } from 'react'
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How do I find the right trail for my skill level?',
      answer: 'We categorize trails by difficulty (Easy, Moderate, Hard) and distance. Use our filters to narrow down options based on your experience level. Each trail page includes detailed information about terrain type, elevation gain, and estimated time to complete.'
    },
    {
      question: 'Are pets allowed on the trails?',
      answer: 'Pet policies vary by trail and location. Always check the specific trail\'s details and local regulations before bringing your pets. Most trails allow leashed dogs, but some have restrictions during certain seasons.'
    },
    {
      question: 'How do I use the Live Tracking feature?',
      answer: 'Once you\'re logged in, navigate to the Tracking page. Click "Start Tracking" to begin recording your route in real-time. The GPS will track your distance, elevation gain, and pace. Click "Stop Tracking" when you finish, and your trek data will be saved.'
    },
    {
      question: 'Can I download offline maps?',
      answer: 'Currently, our platform requires an internet connection to display maps. However, we recommend downloading offline maps from external sources like Google Maps or Gaia GPS before heading out on your trek.'
    },
    {
      question: 'What should I bring on a trek?',
      answer: 'Essential items include: water, snacks, appropriate footwear, weather-appropriate clothing, a map or GPS device, first aid kit, sunscreen, and a headlamp. Check our Gear guide for detailed recommendations based on trail difficulty and season.'
    },
    {
      question: 'How can I share my trek with friends?',
      answer: 'After completing a trek, you can generate a shareable link from your profile. This allows friends to see your route, distance, elevation gain, and personal notes about the trail experience.'
    },
    {
      question: 'Is my personal data secure?',
      answer: 'We take security seriously. Your data is encrypted and stored securely using industry-standard practices. Check our Privacy Policy for detailed information about how we handle your information.'
    },
    {
      question: 'How often are trails updated?',
      answer: 'We update trail information regularly based on user feedback and local reports. Trail conditions, closures, and hazards are flagged in real-time by our community. Always check for recent updates before heading out.'
    },
    {
      question: 'Can I contribute trail reviews?',
      answer: 'Yes! Once you\'ve completed a trek, you can leave a review with photos, ratings, and detailed feedback. Your contributions help other adventurers make informed decisions and keep our community engaged.'
    },
    {
      question: 'What is the Emergency SOS feature?',
      answer: 'Our Emergency SOS feature allows you to quickly alert emergency contacts or rescue services with your exact location. This feature is available on the Tracking page when you\'re actively tracking a trek.'
    }
  ]

  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="page faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about TrekSite and your trekking adventures</p>
      </div>

      <div className="faq-container">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <span className="question-text">{faq.question}</span>
                <span className="toggle-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-sidebar">
          <div className="help-card">
            <h3>Still have questions?</h3>
            <p>Can't find the answer you're looking for? Our support team is here to help.</p>
            <a href="/contact" className="contact-link">Get in Touch</a>
          </div>

          <div className="help-card">
            <h3>Community Tips</h3>
            <ul>
              <li>Check trail reviews for recent updates</li>
              <li>Start with easier trails to build experience</li>
              <li>Share your treks to help others</li>
              <li>Use tracking to monitor your progress</li>
              <li>Follow safety guidelines always</li>
            </ul>
          </div>

          <div className="help-card">
            <h3>Quick Links</h3>
            <nav className="quick-nav">
              <a href="/trails">Browse Trails</a>
              <a href="/tracking">Start Tracking</a>
              <a href="/gear">Gear Guide</a>
              <a href="/about">About Us</a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
