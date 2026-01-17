import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const itinerariesData = [
  {
    id: 1,
    title: 'Everest Base Camp Trek',
    duration: '14 Days',
    difficulty: 'Moderate',
    altitude: '5,364m',
    bestSeason: 'Sep - May',
    price: '₨45,000',
    image: '🏔️',
    description: 'Trek to the base camp of the world\'s highest mountain',
    overview: 'The Everest Base Camp Trek is one of the most popular trekking routes in the world. This trek takes you through the stunning Sagarmatha National Park and provides breathtaking views of Mount Everest and other Himalayan peaks.',
    highlights: [
      'Visit Kala Pathar viewpoint (5,644m) for sunrise views of Everest',
      'Acclimatization day in Namche Bazaar',
      'Experience Sherpa culture and monasteries',
      'Trek through rhododendron forests and alpine meadows',
      'Stay in teahouses with warm hospitality'
    ],
    dayByDay: [
      { day: 1, place: 'Kathmandu', activity: 'Arrival and city orientation', altitude: '1,400m' },
      { day: 2, place: 'Kathmandu to Phakding', activity: 'Trek begins, scenic Dudh Kosi valley', altitude: '2,610m' },
      { day: 3, place: 'Phakding to Namche Bazaar', activity: 'Steep climb with Everest views', altitude: '3,440m' },
      { day: 4, place: 'Namche Bazaar', activity: 'Acclimatization day, explore markets', altitude: '3,440m' },
      { day: 5, place: 'Namche to Tengboche', activity: 'Pine forests and mountain views', altitude: '3,867m' },
      { day: 6, place: 'Tengboche to Dingboche', activity: 'Continue upward through alpine terrain', altitude: '4,410m' },
      { day: 7, place: 'Dingboche', activity: 'Rest day for acclimatization', altitude: '4,410m' },
      { day: 8, place: 'Dingboche to Lobuche', activity: 'High altitude trek, rocky terrain', altitude: '4,910m' },
      { day: 9, place: 'Lobuche to Gorak Shep', activity: 'Everest Base Camp trek', altitude: '5,160m' },
      { day: 10, place: 'Kala Pathar Summit', activity: 'Early morning climb for sunrise (5,644m)', altitude: '5,644m' },
      { day: 11, place: 'Gorak Shep to Pheriche', activity: 'Descend to lower altitude', altitude: '4,371m' },
      { day: 12, place: 'Pheriche to Namche', activity: 'Continue descent through forests', altitude: '3,440m' },
      { day: 13, place: 'Namche to Phakding', activity: 'Descend to lower elevation', altitude: '2,610m' },
      { day: 14, place: 'Phakding to Kathmandu', activity: 'Return to Kathmandu', altitude: '1,400m' }
    ],
    whatToInclude: [
      'Experienced mountain guide',
      'Porter support for baggage',
      'Teahouse accommodation',
      'Meals (breakfast, lunch, dinner)',
      'All permits and entrance fees',
      'Kathmandu city tour'
    ],
    whatToPack: [
      'Warm sleeping bag (-10°C)',
      'Thermal layers and insulated jacket',
      'Waterproof jacket and pants',
      'Trekking boots (broken in)',
      'Hat, gloves, and sunscreen',
      'First aid kit and medications'
    ],
    importantNotes: [
      'Altitude acclimatization is crucial',
      'Physical fitness required',
      'Book 1-2 months in advance',
      'Travel insurance mandatory',
      'Permits obtained by operator'
    ]
  },
  {
    id: 2,
    title: 'Annapurna Base Camp Trek',
    duration: '7 Days',
    difficulty: 'Moderate',
    altitude: '4,130m',
    bestSeason: 'Oct - Nov, Mar - Apr',
    price: '₨25,000',
    image: '⛰️',
    description: 'Stunning views of Annapurna massif from its base camp',
    overview: 'The Annapurna Base Camp Trek is a spectacular 7-day trek offering close-up views of the Annapurna massif. This shorter alternative to the Annapurna Circuit provides amazing mountain scenery and diverse terrain.',
    highlights: [
      'Highest point at Annapurna Base Camp (4,130m)',
      'Panoramic views of Annapurna I and other peaks',
      'Trek through diverse vegetation zones',
      'Experience local villages and culture',
      'Moderate difficulty suitable for most trekkers'
    ],
    dayByDay: [
      { day: 1, place: 'Kathmandu to Pokhara', activity: 'Travel by bus', altitude: '822m' },
      { day: 2, place: 'Pokhara to Dhampus', activity: 'Trek start with Annapurna views', altitude: '1,650m' },
      { day: 3, place: 'Dhampus to Ghandruk', activity: 'Through rhododendron forests', altitude: '1,950m' },
      { day: 4, place: 'Ghandruk to Chhomrong', activity: 'Steep climb and descent', altitude: '2,184m' },
      { day: 5, place: 'Chhomrong to Himalaya Base Camp', activity: 'Alpine meadows', altitude: '3,900m' },
      { day: 6, place: 'Himalaya to Annapurna Base Camp', activity: 'Final push to base camp', altitude: '4,130m' },
      { day: 7, place: 'Return to Pokhara', activity: 'Descend back to starting point', altitude: '822m' }
    ],
    whatToInclude: [
      'Transport from Kathmandu',
      'Experienced guide',
      'Porter for luggage',
      'Teahouse accommodation',
      'Meals and permits',
      'National park fees'
    ],
    whatToPack: [
      'Sleeping bag (-5°C)',
      'Warm clothing and layers',
      'Trekking boots',
      'Sun protection',
      'Medications for altitude'
    ],
    importantNotes: [
      'Less crowded than Everest trek',
      'Good for first-time trekkers',
      'Early booking recommended',
      'Altitude gain is significant'
    ]
  },
  {
    id: 3,
    title: 'Langtang Valley Trek',
    duration: '5 Days',
    difficulty: 'Easy to Moderate',
    altitude: '3,844m',
    bestSeason: 'Mar - May, Sep - Nov',
    price: '₨15,000',
    image: '🗻',
    description: 'Alpine valley trek with stunning peaks and lush forests',
    overview: 'The Langtang Valley Trek is a perfect choice for those seeking a shorter trek without compromising on natural beauty. The trek offers stunning alpine scenery, rich forests, and Tamang culture.',
    highlights: [
      'Beautiful Langtang Valley',
      'Kyanjin Gompa monastery',
      'Yak cheese and dairy operations',
      'Diverse flora and fauna',
      'Close to Kathmandu'
    ],
    dayByDay: [
      { day: 1, place: 'Kathmandu to Syabru Bensi', activity: 'Drive and trek start', altitude: '1,460m' },
      { day: 2, place: 'Syabru Bensi to Lama Hotel', activity: 'Through rhododendron forest', altitude: '2,470m' },
      { day: 3, place: 'Lama Hotel to Kyanjin Gompa', activity: 'Valley views open up', altitude: '3,870m' },
      { day: 4, place: 'Kyanjin Gompa (exploration day)', activity: 'Climb to surrounding peaks', altitude: '3,870m' },
      { day: 5, place: 'Return to Kathmandu', activity: 'Descend and return', altitude: '1,400m' }
    ],
    whatToInclude: [
      'Guide and porter',
      'Accommodation and meals',
      'Transport arrangements',
      'Permits'
    ],
    whatToPack: [
      'Light sleeping bag',
      'Warm jacket',
      'Trekking shoes',
      'Weather-appropriate clothing'
    ],
    importantNotes: [
      'Closest trek to Kathmandu',
      'Best for limited time',
      'Lower altitude than other treks'
    ]
  },
  {
    id: 4,
    title: 'Manaslu Circuit Trek',
    duration: '18 Days',
    difficulty: 'Hard',
    altitude: '5,160m',
    bestSeason: 'Sep - Oct, Mar - May',
    price: '₨55,000',
    image: '🏔️',
    description: 'Remote and challenging trek around Mount Manaslu',
    overview: 'The Manaslu Circuit Trek is an adventurous journey around the 8,163m Mount Manaslu. This less-visited trek offers pristine wilderness, diverse ecosystems, and authentic mountain villages.',
    highlights: [
      'Larkya La pass (5,160m)',
      'Remote mountain villages',
      'Buddhism heritage sites',
      'Diverse landscapes',
      'Off the beaten path'
    ],
    dayByDay: [
      { day: 1, place: 'Kathmandu to Sotikhola', activity: 'Drive and trek start', altitude: '700m' },
      { day: 2, place: 'Sotikhola to Machha Khola', activity: 'Gradual ascent', altitude: '876m' },
      { day: 3, place: 'Machha Khola to Deng', activity: 'Continue uphill', altitude: '1,860m' },
      { day: 4, place: 'Deng to Jagat', activity: 'Rocky terrain', altitude: '1,340m' },
      { day: 5, place: 'Jagat to Philim', activity: 'River valley', altitude: '1,570m' },
      { day: 6, place: 'Philim to Syala', activity: 'Alpine zone begins', altitude: '2,434m' },
      { day: 7, place: 'Syala to Samagaon', activity: 'Manaslu Base Camp region', altitude: '3,530m' },
      { day: 8, place: 'Samagaon rest day', activity: 'Acclimatization', altitude: '3,530m' },
      { day: 9, place: 'Samagaon to Samdo', activity: 'Higher altitude', altitude: '3,875m' },
      { day: 10, place: 'Samdo to Larkya La', activity: 'Cross Larkya La pass', altitude: '5,160m' },
      { day: 11, place: 'Larkya La to Bhimthang', activity: 'Descend westside', altitude: '3,720m' },
      { day: 12, place: 'Bhimthang to Namrung', activity: 'Gradual descent', altitude: '2,630m' },
      { day: 13, place: 'Namrung to Gorkha', activity: 'Lower elevation', altitude: '560m' },
      { day: 14, place: 'Gorkha to Kathmandu', activity: 'Return journey', altitude: '1,400m' }
    ],
    whatToInclude: [
      'Experienced guide',
      'Porter support',
      'Teahouse accommodation',
      'All meals',
      'Permits for remote area',
      'National park fees'
    ],
    whatToPack: [
      'High-altitude sleeping bag (-15°C)',
      'Heavy winter gear',
      'Sturdy trekking boots',
      'Altitude medications',
      'Comprehensive first aid'
    ],
    importantNotes: [
      'Requires good physical fitness',
      'Limited teahouse facilities',
      'Remote area with basic amenities',
      'Permit required (ACAP)',
      'Book well in advance'
    ]
  },
  {
    id: 5,
    title: 'Rolwaling Valley Trek',
    duration: '10 Days',
    difficulty: 'Moderate',
    altitude: '4,984m',
    bestSeason: 'Oct - Nov, Mar - May',
    price: '₨30,000',
    image: '⛰️',
    description: 'Hidden valley with pristine alpine scenery',
    overview: 'Rolwaling Valley is a hidden gem in the Himalayas, featuring pristine glaciers, alpine lakes, and traditional Sherpa villages. This trek offers a perfect balance of adventure and culture.',
    highlights: [
      'Tso Rolpa glacial lake',
      'Ramdung Pass (5,984m)',
      'Pristine alpine meadows',
      'Sherpa hospitality',
      'Traditional villages'
    ],
    dayByDay: [
      { day: 1, place: 'Kathmandu to Charikot', activity: 'Drive and trek start', altitude: '2,170m' },
      { day: 2, place: 'Charikot to Simigaon', activity: 'Mountain village trail', altitude: '2,400m' },
      { day: 3, place: 'Simigaon to Beding', activity: 'Enter Rolwaling Valley', altitude: '2,668m' },
      { day: 4, place: 'Beding to Na', activity: 'Alpine landscape', altitude: '4,180m' },
      { day: 5, place: 'Na to Tso Rolpa', activity: 'Reach glacial lake', altitude: '4,984m' },
      { day: 6, place: 'Tso Rolpa rest/explore', activity: 'Day hikes around lake', altitude: '4,984m' },
      { day: 7, place: 'Tso Rolpa to Na', activity: 'Return descent', altitude: '4,180m' },
      { day: 8, place: 'Na to Beding', activity: 'Continue descent', altitude: '2,668m' },
      { day: 9, place: 'Beding to Charikot', activity: 'Exit valley', altitude: '2,170m' },
      { day: 10, place: 'Charikot to Kathmandu', activity: 'Return to city', altitude: '1,400m' }
    ],
    whatToInclude: [
      'Expert guide',
      'Porter assistance',
      'Accommodation',
      'Meals (mostly teahouse)',
      'Permits'
    ],
    whatToPack: [
      'Winter sleeping bag',
      'Warm layers',
      'High-altitude gear',
      'Microspikes (optional)',
      'Glacier travel skills helpful'
    ],
    importantNotes: [
      'Less crowded trek',
      'Good for experienced trekkers',
      'Glacier exposure possible',
      'Weather can change rapidly'
    ]
  }
]

export default function Itineraries() {
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const difficulties = ['All', 'Easy to Moderate', 'Moderate', 'Hard']

  const filteredItineraries = useMemo(() => {
    return itinerariesData.filter(trek => {
      const matchesDifficulty = filterDifficulty === 'All' || trek.difficulty === filterDifficulty
      const matchesSearch = trek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trek.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesDifficulty && matchesSearch
    })
  }, [filterDifficulty, searchQuery])

  if (selectedItinerary) {
    return (
      <div className="page" style={{ padding: '20px' }}>
        <button 
          onClick={() => setSelectedItinerary(null)}
          style={{
            padding: '10px 20px',
            background: '#2d5016',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '14px'
          }}
        >
          ← Back to All Itineraries
        </button>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{selectedItinerary.image}</div>
            
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#2d5016', marginBottom: '16px' }}>
              {selectedItinerary.title}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Duration</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{selectedItinerary.duration}</p>
              </div>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Difficulty</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{selectedItinerary.difficulty}</p>
              </div>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Altitude</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{selectedItinerary.altitude}</p>
              </div>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Price</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{selectedItinerary.price}</p>
              </div>
            </div>

            <div style={{ background: '#fff4e6', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #d4a574' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Best Season</p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>{selectedItinerary.bestSeason}</p>
            </div>
          </div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Overview</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563', marginBottom: '20px' }}>
              {selectedItinerary.overview}
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Highlights</h2>
            <ul style={{ marginLeft: '24px' }}>
              {selectedItinerary.highlights.map((highlight, idx) => (
                <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '15px' }}>
                  ✓ {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '20px' }}>Day-by-Day Itinerary</h2>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {selectedItinerary.dayByDay.map((dayInfo, idx) => (
                <div key={idx} style={{ borderBottom: idx !== selectedItinerary.dayByDay.length - 1 ? '1px solid #e5e7eb' : 'none', padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ background: '#2d5016', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      {dayInfo.day}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                        {dayInfo.place}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {dayInfo.activity}
                      </p>
                      <p style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
                        Altitude: {dayInfo.altitude}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>What's Included</h2>
              <ul style={{ marginLeft: '20px' }}>
                {selectedItinerary.whatToInclude.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>What to Pack</h2>
              <ul style={{ marginLeft: '20px' }}>
                {selectedItinerary.whatToPack.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                    📦 {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Important Notes</h2>
            <ul style={{ marginLeft: '20px' }}>
              {selectedItinerary.importantNotes.map((note, idx) => (
                <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                  ⚠️ {note}
                </li>
              ))}
            </ul>
          </section>

          <div style={{ background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(212,165,116,0.08))', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>Ready to Trek?</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Contact us to book this amazing trek or customize it to your needs.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              style={{
                padding: '12px 32px',
                background: '#2d5016',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ padding: '20px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#2d5016', marginBottom: '12px' }}>
            Trek Itineraries
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '30px' }}>
            Explore our carefully crafted trekking itineraries for all experience levels
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search treks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
              Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {filteredItineraries.map(trek => (
            <div
              key={trek.id}
              onClick={() => setSelectedItinerary(trek)}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(45,80,22,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '3rem', padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(212,165,116,0.08))' }}>
                {trek.image}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>
                  {trek.title}
                </h3>

                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', minHeight: '40px' }}>
                  {trek.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Duration</p>
                    <p style={{ fontWeight: '600', color: '#2d5016' }}>{trek.duration}</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Difficulty</p>
                    <p style={{ fontWeight: '600', color: '#2d5016' }}>{trek.difficulty}</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Max Altitude</p>
                    <p style={{ fontWeight: '600', color: '#2d5016' }}>{trek.altitude}</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', marginBottom: '2px' }}>Price</p>
                    <p style={{ fontWeight: '600', color: '#d4a574' }}>{trek.price}</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2d5016',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItineraries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '20px' }}>
              No itineraries found. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterDifficulty('All')
              }}
              style={{
                padding: '10px 20px',
                background: '#2d5016',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
