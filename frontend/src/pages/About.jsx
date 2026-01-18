import React from 'react'

export default function About(){
  return (
    <div className="page about" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#1a202c', marginBottom: '20px' }}>About Orophiletrek</h1>
        <p style={{ fontSize: '20px', color: '#4a5568', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
          Your gateway to the most breathtaking mountain trails and unforgettable trekking adventures in the Himalayas.
        </p>
      </div>

      {/* Our Story Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '20px' }}>Our Story</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div>
            <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', marginBottom: '16px' }}>
              Founded by passionate trekkers and nature enthusiasts, Orophiletrek was born from a deep love for the mountains and a desire to share these incredible experiences with adventurers from around the world.
            </p>
            <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', marginBottom: '16px' }}>
              For over a decade, we've been curating and organizing treks across Nepal's most stunning landscapes, from the iconic Everest Base Camp to hidden gems known only to local communities.
            </p>
          </div>
          <div>
            <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', marginBottom: '16px' }}>
              Our team consists of experienced guides, mountaineers, and local experts who know every trail, every viewpoint, and every story these mountains have to tell.
            </p>
            <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.8', marginBottom: '16px' }}>
              We believe that trekking is more than just reaching a destination—it's about the journey, the connections you make, and the memories that last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section style={{ marginBottom: '60px', background: '#f7fafc', padding: '40px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '20px' }}>Our Mission</h2>
        <p style={{ fontSize: '18px', color: '#4a5568', lineHeight: '1.8', marginBottom: '20px' }}>
          To provide safe, sustainable, and transformative trekking experiences that connect people with nature while supporting local communities and preserving the pristine beauty of the Himalayas.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏔️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Safety First</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              Expert guides, quality equipment, and comprehensive safety protocols on every trek.
            </p>
          </div>
          <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Eco-Friendly</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              Leave no trace practices and sustainable tourism to protect our natural heritage.
            </p>
          </div>
          <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤝</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Community Support</h3>
            <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
              Working with local communities to create positive economic impact.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '30px', textAlign: 'center' }}>Why Choose Orophiletrek?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>✓ Expert Local Guides</h3>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6' }}>
              Our certified guides are born and raised in the mountains, bringing unmatched local knowledge and cultural insights.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>✓ Small Group Experience</h3>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6' }}>
              We maintain small group sizes for personalized attention, better safety, and minimal environmental impact.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>✓ Flexible Itineraries</h3>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6' }}>
              Customizable trek plans to match your fitness level, interests, and schedule.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>✓ Quality Equipment</h3>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6' }}>
              Top-grade trekking gear and equipment available for rent or included in packages.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>✓ 24/7 Support</h3>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6' }}>
              Round-the-clock assistance before, during, and after your trek for complete peace of mind.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a202c', marginBottom: '12px' }}>✓ Best Value</h3>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6' }}>
              Competitive pricing with transparent costs and no hidden fees—quality adventures at fair prices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '30px' }}>Our Core Values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Excellence</h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>Highest standards in every aspect of service</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🙏</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Respect</h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>For nature, culture, and every individual</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💚</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Integrity</h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>Honest, transparent, and ethical practices</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌟</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Passion</h3>
            <p style={{ fontSize: '14px', color: '#718096' }}>Deep love for mountains and adventure</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ marginBottom: '60px', background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2b 100%)', padding: '50px 40px', borderRadius: '12px', color: '#fff' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '40px', textAlign: 'center', color: '#fff' }}>Our Journey in Numbers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>10+</div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>Years Experience</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>5000+</div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>Happy Trekkers</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>50+</div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>Trail Routes</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>98%</div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ textAlign: 'center', padding: '40px', background: '#f7fafc', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1a202c', marginBottom: '20px' }}>Ready to Start Your Adventure?</h2>
        <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Join thousands of trekkers who have discovered the magic of the Himalayas with us. Your next great adventure awaits!
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/trails" style={{ display: 'inline-block', padding: '14px 32px', background: '#2d5016', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 600, transition: 'background 0.2s' }}>
            Explore Trails
          </a>
          <a href="/contact" style={{ display: 'inline-block', padding: '14px 32px', background: '#fff', color: '#2d5016', border: '2px solid #2d5016', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 600, transition: 'all 0.2s' }}>
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
