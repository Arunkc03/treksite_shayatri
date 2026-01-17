import React, { useState, useMemo } from 'react'

const blogPosts = [
  {
    id: 1,
    title: 'Preparing for Your First Day Hike',
    excerpt: 'A comprehensive guide to preparing for your first day hike, including what to pack, pacing tips, and essential safety considerations.',
    category: 'Beginner Tips',
    author: 'Sarah Mountain',
    date: 'Jan 5, 2026',
    readTime: '8 min',
    image: '🎒',
    content: `Your first day hike is an exciting adventure! Proper preparation ensures you'll have a safe and enjoyable experience. Here's everything you need to know:

## What to Pack for Your Day Hike
The right backpack should be 10-15 liters for a day hike. Pack these essentials:
- 2-3 liters of water (or hydration system)
- Energy-boosting snacks (trail mix, energy bars, fruit)
- Basic first aid kit
- Sun protection (sunscreen, hat, sunglasses)
- Weather-appropriate clothing layers
- Headlamp or flashlight
- Map and compass (or GPS device)

## Pacing and Time Management
Start early to maximize daylight hours. A comfortable pace is typically 2-3 mph on flat terrain. Build in rest breaks every 45-60 minutes. Remember: it's not a race, it's about enjoying the experience.

## Safety Considerations
- Inform someone of your planned route and expected return time
- Stay on marked trails
- Check weather forecasts beforehand
- Know your fitness level and choose appropriate trails
- Start with shorter, easier trails and progress gradually
- Bring identification and emergency contacts
- Never hike alone if possible

## Common Mistakes to Avoid
- Overpacking and carrying too much weight
- Not bringing enough water
- Wearing cotton (choose moisture-wicking fabrics)
- Underestimating distance and time needed
- Ignoring weather warnings
- Not warming up before starting

Your first day hike sets the foundation for a lifetime of adventure. Take your time, enjoy the scenery, and build your confidence gradually!`
  },
  {
    id: 2,
    title: 'Trail Photography Tips for Adventure Seekers',
    excerpt: 'Master landscape photography on the trail with simple techniques and camera settings that will elevate your trek memories.',
    category: 'Photography',
    author: 'Alex River',
    date: 'Jan 3, 2026',
    readTime: '6 min',
    image: '📸',
    content: `Capture breathtaking moments on the trail and preserve your adventure memories with these photography tips.

## Essential Camera Settings for Trail Photography

### Golden Hour Magic
Shoot during the first hour after sunrise or last hour before sunset. The warm, soft light creates stunning landscape photos. The shadows are longer, adding depth and drama to your images.

### Composition Techniques
- Rule of Thirds: Divide your frame into 9 sections and place interesting elements on the lines
- Leading Lines: Use trails, rivers, or edges to guide the viewer's eye
- Foreground Interest: Include elements in the immediate foreground to add depth
- Framing: Use natural elements like trees or rock formations to frame your main subject

## Camera Settings Recommendation
- Aperture: f/8 to f/16 for landscape photos (everything in focus)
- Shutter Speed: 1/100 to 1/500 depending on movement
- ISO: Keep as low as possible (100-400) for cleaner images
- Use manual mode for consistency

## Smartphone Photography Tips
Most phones today take excellent photos. Use these tips:
- Clean your lens frequently (dust impacts quality)
- Use natural light whenever possible
- Try the portrait mode for depth effect
- Use HDR for high-contrast scenes
- Download a photography app for manual control

## Capturing Action Shots
For moving subjects (hikers, wildlife):
- Use continuous shooting mode
- Increase shutter speed (1/500 or faster)
- Focus on the subject's eyes or leading edge
- Anticipate the moment rather than react to it

## Tips for Difficult Lighting
- Backlighting: Create silhouettes or rim lighting
- Overcast Days: Use the diffused light for even exposure
- High Noon: Look for shade to photograph subjects
- Long Shadows: Enhance drama in your compositions

Remember: The best camera is the one you have with you. Focus on composition and lighting over expensive equipment!`
  },
  {
    id: 3,
    title: 'Nutrition and Hydration on Long Treks',
    excerpt: 'Understand the importance of proper nutrition and hydration strategies to maintain energy levels during extended treks.',
    category: 'Health & Fitness',
    author: 'Mike Fitness',
    date: 'Dec 28, 2025',
    readTime: '10 min',
    image: '💧',
    content: `Proper nutrition and hydration are critical for trek performance and health. Here's your comprehensive guide:

## Caloric Needs at Altitude
At altitude, your body burns significantly more calories:
- Sea level: 2,000-2,500 cal/day
- 3,000m altitude: 2,500-3,000 cal/day
- 4,000m+ altitude: 3,500-4,500 cal/day

Increase calorie intake as you gain elevation to maintain energy.

## Best Trail Foods
### High-Energy Snacks
- Nuts and nut butter (400 cal/100g)
- Energy bars (200-400 cal each)
- Dried fruits (250 cal/100g)
- Chocolate (540 cal/100g)

### Main Meal Options
- Freeze-dried meals (lightweight, just add water)
- Rice and beans (requires cooking)
- Pasta and sauce (lightweight, filling)
- Instant noodles with protein additions

### Fresh Foods (First Day)
- Hard cheese, hard bread
- Apples, oranges, carrots
- Cured meats (limited time due to spoilage)

## Hydration Strategy
### Water Intake Guidelines
- Drink 200-300ml every 15-20 minutes during activity
- Drink 500-750ml every hour of trekking
- Total daily intake: 3-4 liters at altitude
- More in hot, dry conditions or high altitude

### Signs of Dehydration
- Dark urine
- Dizziness or lightheadedness
- Reduced energy
- Headaches

## Water Safety and Purification
- Boiling: Most reliable method (kills all pathogens)
- Water Purification Tablets: Lightweight, but less effective on debris
- Filtering: Good for clear water, portable options available
- Combination: Filter first, then use tablets for backup

## Altitude Sickness Prevention Through Diet
- Increase carbohydrate intake (easier to process at altitude)
- Eat small, frequent meals
- Include iron-rich foods (red meat, spinach)
- Avoid alcohol and sleeping pills

## Sample Daily Trek Menu
Breakfast: Oatmeal with nuts and dried fruit (600 cal)
Mid-morning Snack: Energy bar and water (300 cal)
Lunch: Peanut butter sandwich and fruit (700 cal)
Afternoon Snack: Trail mix and electrolyte drink (400 cal)
Dinner: Freeze-dried meal with added protein (800 cal)
Evening: Tea and nuts (200 cal)
Total: ~3,000 calories

Remember: Proper nutrition prevents fatigue, altitude sickness, and injuries. Don't compromise on food quality during treks!`
  },
  {
    id: 4,
    title: 'Navigating with Maps and GPS',
    excerpt: 'Essential navigation skills for trekkers: traditional map reading and modern GPS technology for safe trail exploration.',
    category: 'Safety',
    author: 'Emma Guide',
    date: 'Dec 20, 2025',
    readTime: '9 min',
    image: '🗺️',
    content: `Master navigation skills to trek confidently and safely in any terrain.

## Traditional Map Reading
### Understanding Topographic Maps
- Contour Lines: Show elevation; closer lines mean steeper terrain
- Scale: Typically 1:50,000 for trekking maps
- Legend: Symbols for trails, water, vegetation, landmarks
- Orientation: Always face the map north to match terrain

### Using a Compass
- Orient the map with a compass: Rotate until orienting lines align north
- Set your bearing: Place compass center on destination, rotate bezel until orienting lines align north
- Follow the bearing: Hold compass level and walk in direction of travel arrow
- Triangulation: Identify landmarks to confirm location

## GPS Technology
### GPS Devices
- Garmin eTrex: Popular, reliable, long battery life
- Smartphone Apps: AllTrails, Gaia GPS, Maps.me (offline capability)
- Advantages: Precise location, waypoint marking, track recording

### Using GPS Effectively
- Carry physical maps as backup (batteries fail)
- Download offline maps before trekking
- Mark waypoints at key locations
- Record your track for future reference

## Practical Navigation Tips
- Stay on marked trails when possible
- Watch for trail markers (blazes, cairns, signs)
- Identify landmarks for visual confirmation
- Ask locals for route information
- Start with well-marked, popular trails

## What to Do if Lost
1. Stop and remain calm
2. Establish your last known position
3. Identify landmarks and check your map
4. Retrace your steps if unsure
5. Stay put if completely lost (easier to find)
6. Use whistle to signal (3 blasts = distress)

## Navigation Apps Comparison
| App | Offline Maps | Cost | Best For |
|-----|--------------|------|----------|
| AllTrails | Yes | Free/Pro | Trail discovery |
| Gaia GPS | Yes | Free/Pro | Detailed tracking |
| Maps.me | Yes | Free | Offline maps |
| Komoot | Yes | Free/Pro | Route planning |

Combine technology with traditional skills for the most reliable navigation. Technology fails, but your map reading skills never will!`
  },
  {
    id: 5,
    title: 'Best Gear for Winter Trekking',
    excerpt: 'Complete gear recommendations for cold weather adventures, from insulation to footwear and layering strategies.',
    category: 'Gear Guide',
    author: 'James Winter',
    date: 'Dec 15, 2025',
    readTime: '11 min',
    image: '❄️',
    content: `Winter trekking requires specialized gear. Here's your complete equipment guide:

## Layering System (Most Important)
The key to staying warm is layering, not bulky single jackets.

### Base Layer (Against Skin)
- Material: Merino wool or synthetic (NOT cotton - it absorbs moisture)
- Function: Wick moisture away from skin
- Brands: Smartwool, Patagonia, Decathlon
- Cost: $30-80 per piece

### Mid Layer (Insulation)
- Fleece jackets: Lightweight, compressible
- Down jackets: Excellent insulation, packable
- Synthetic insulation: Better in wet conditions
- Brands: Arc'teryx, The North Face, Mammut
- Cost: $100-300

### Outer Layer (Wind & Water Protection)
- Hard Shell: Rigid, waterproof, less breathable
- Soft Shell: Stretchy, breathable, lighter
- Must be: Waterproof, windproof, breathable
- Brands: Patagonia, Mammut, Columbia
- Cost: $150-400

## Footwear System
### Winter Hiking Boots
- Insulation: 200g to 600g for different conditions
- Waterproofing: Gore-Tex lining essential
- Fit: Must accommodate thick socks (boot one size larger)
- Popular: Salomon, Merrell, Scarpa, Keen
- Cost: $150-300

### Socks Strategy
- Material: Merino wool or synthetic blends
- Thickness: Medium to heavy weight
- Bring 3-4 pairs for multi-day treks
- Cost: $15-25 per pair

## Hand and Foot Protection
### Gloves/Mittens
- Mittens: Warmer but less dexterous
- Gloves: Better control, less warmth
- Liner gloves: Thin inner gloves for tasks
- Material: Wool, synthetic, or leather
- Cost: $30-100

### Foot Warmers
- Hand/foot warmers: Chemical heat packs
- Gaiters: Prevent snow entering boots
- Insoles: Additional foot insulation
- Cost: $10-50

## Head and Face Protection
### Hat/Beanie
- Cover ears completely
- Material: Wool or synthetic
- Cost: $15-40

### Neck Gaiter/Balaclava
- Protects face from wind and cold
- Can be pulled down for ventilation
- Cost: $15-30

### Goggles (for extreme conditions)
- Protects eyes from wind and snow glare
- Essential above 4,000m in winter
- Cost: $30-100

## Backpack and Accessories
### Winter Backpack
- Size: 40-50L for 2-3 day trips
- Waterproof cover: Essential
- Hip belt: Must support weight properly
- Cost: $150-400

### Sleeping System
- Sleeping bag: -10°C to -20°C rating
- Insulated pad: 3-4 R-value for ground insulation
- Bivvy sack: Additional wind/moisture protection
- Cost: $200-800 total

## Complete Winter Trek Gear List
**Clothing:**
- 3x thermal base layers
- 1-2 mid-layer jackets
- 1 hard shell jacket
- 1 pair insulated pants
- 3-4 pairs thick socks
- Winter boots
- Hat, gloves, neck gaiter
- Extra layers for camp

**Accessories:**
- Headlamp with extra batteries
- Sunscreen and lip balm (sun reflection)
- Sunglasses/goggles
- Moisturizer (air is very dry)
- Blister treatment kit

**Sleep System:**
- Winter sleeping bag (-15°C minimum)
- Insulated sleeping pad
- Warm sleeping shirt

## Money-Saving Tips
- Buy last season's gear at outlet prices
- Rent expensive items for single trips
- Start with budget-friendly brands
- Layer inexpensive items instead of one expensive jacket
- Watch for seasonal sales (summer sales for winter gear)

## Weight Considerations
Winter gear is heavier. Typical weight breakdown:
- Clothing and insulation: 2-3kg
- Sleeping system: 2-3kg
- Boots and accessories: 2kg
- Total addition to pack: 6-8kg more than summer

Winter trekking is incredibly rewarding. Proper gear keeps you safe, warm, and able to enjoy the stunning winter landscapes. Invest in quality where it matters most!`
  },
  {
    id: 6,
    title: 'Building Trek Community and Making Friends',
    excerpt: 'How to connect with fellow trekkers, join group hikes, and build lasting friendships through shared adventures.',
    category: 'Community',
    author: 'Lisa Social',
    date: 'Dec 10, 2025',
    readTime: '7 min',
    image: '👥',
    content: `Adventure is more rewarding when shared. Here's how to build connections in the trekking community:

## Finding Trekking Communities
### Online Platforms
- **Meetup.com**: Local hiking and trekking groups
- **AllTrails**: Connect with local trekkers
- **Facebook Groups**: Local trek and hiking communities
- **Discord Servers**: Real-time chat with trek enthusiasts
- **Reddit**: r/CampingandHiking, r/Ultralight communities

### Local Resources
- REI Co-op Stores: Organize group hikes
- Local hiking clubs: Regular organized outings
- Outdoor retailers: Community bulletin boards
- Mountain guiding companies: Group expedition options

## Joining Group Treks
### Benefits of Group Trekking
- Shared experience and memories
- Safety in numbers
- Knowledge sharing from experienced trekkers
- Motivation and encouragement
- Potential lifetime friendships
- Cost sharing (transportation, permits)

### How to Choose a Group
- Check experience level requirements
- Review participant feedback and ratings
- Confirm guide qualifications and certifications
- Verify insurance and safety protocols
- Ensure group size suits your preference
- Check itinerary difficulty matches your fitness

## Making Friends on the Trail
### Conversation Starters
- Ask about their trekking experience
- Share your own adventure goals
- Discuss gear recommendations
- Exchange photography
- Plan future treks together
- Ask for advice on challenging sections

### Building Lasting Connections
- Exchange contact information
- Join the group's social media
- Attend post-trek meetups
- Invite friends to future treks
- Stay in touch between adventures
- Help newer trekkers join the community

## Organized Trek Communities
### Trekking Clubs
- Regular scheduled hikes
- Training programs for challenging treks
- Social events between treks
- Mentorship from experienced members
- Group discounts on gear
- Access to exclusive routes

### Adventure Travel Groups
- Guided international treks
- All-inclusive packages
- Same-age or same-interest groups
- Leadership development opportunities
- Environmental conservation projects

## Online Engagement Tips
- Share photos and stories from treks
- Offer advice to newer trekkers
- Participate in discussions
- Volunteer to lead or mentor
- Be respectful and encouraging
- Respect others' pace and abilities

## Etiquette for Group Trekking
- Arrive on time for departures
- Follow group leader instructions
- Respect group pace (don't rush ahead)
- Help slower members when possible
- Share resources (water, snacks)
- Leave no trace principles
- Respect wildlife and environment
- Be positive and inclusive

## Special Interest Trek Groups
- Women-only trekking groups
- Solo female traveler networks
- Family-oriented trek communities
- Vegan/vegetarian trek groups
- Photography-focused hikes
- Conservation volunteer treks
- LGBTQ+ adventure groups

## Creating Your Own Trek Group
- Define the group's focus (difficulty, frequency, region)
- Start with friends and their friends
- Use platforms like Meetup.com
- Establish clear expectations and etiquette
- Choose regular meeting times
- Share costs transparently
- Be an inclusive and supportive leader

## Trek Travel Companionship
### Finding Trek Partners
- Use compatible matching platforms
- Interview potential partners beforehand
- Start with day hikes before multi-day treks
- Discuss expectations clearly
- Have backup communication plans
- Trust your instincts

### Making Partnerships Work
- Clear communication about goals
- Respect for different paces
- Shared decision-making
- Mutual support and encouragement
- Flexibility and compromise
- Regular check-ins about compatibility

The trekking community is welcoming and supportive. Whether you trek solo and meet people on the trail or join organized groups, you'll find people who share your passion for adventure and nature. Don't hesitate to reach out, introduce yourself, and build connections that last a lifetime!`
  }
]

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))]

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="page blog-page">
      <div className="blog-header">
        <h1>Adventure Stories & Tips</h1>
        <p>Explore insights, guides, and stories from the trekking community</p>
      </div>

      <div className="blog-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-content">
        {selectedPost ? (
          <div className="blog-post-detail">
            <button 
              className="back-btn"
              onClick={() => setSelectedPost(null)}
              style={{ 
                padding: '8px 16px', 
                background: 'transparent', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '24px',
                fontSize: '14px',
                color: '#2d5016'
              }}
            >
              ← Back to Articles
            </button>
            
            <article style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>{selectedPost.image}</div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(45,80,22,0.15)', color: '#2d5016', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                    {selectedPost.category}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>📖 {selectedPost.readTime}</span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>📅 {selectedPost.date}</span>
                </div>

                <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px', lineHeight: '1.3' }}>
                  {selectedPost.title}
                </h1>

                <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '16px 0', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                      <span style={{ fontWeight: 600, color: '#1a1a1a' }}>By {selectedPost.author}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                      ❤️ Like
                    </button>
                    <button style={{ padding: '8px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                      🔗 Share
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563', maxWidth: '100%' }} className="blog-content-text">
                {selectedPost.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('##')) {
                    return (
                      <h2 key={idx} style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginTop: '32px', marginBottom: '16px' }}>
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  } else if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={idx} style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginTop: '24px', marginBottom: '12px' }}>
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={idx} style={{ marginLeft: '24px', marginBottom: '16px' }}>
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} style={{ marginBottom: '8px', color: '#4b5563' }}>
                            {item.replace('- ', '')}
                          </li>
                        ))}
                      </ul>
                    )
                  } else if (paragraph.includes('|')) {
                    // Simple table handling
                    return (
                      <div key={idx} style={{ overflowX: 'auto', marginBottom: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                          <tbody>
                            {paragraph.split('\n').map((row, i) => (
                              <tr key={i}>
                                {row.split('|').map((cell, j) => (
                                  <td key={j} style={{ padding: '12px', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  } else {
                    return (
                      <p key={idx} style={{ marginBottom: '16px', color: '#4b5563' }}>
                        {paragraph}
                      </p>
                    )
                  }
                })}
              </div>

              <div style={{ marginTop: '48px', padding: '24px', background: 'linear-gradient(135deg, rgba(45,80,22,0.05), rgba(212,165,116,0.05))', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>
                  About the Author
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                  <strong>{selectedPost.author}</strong> is an experienced trekker and adventure enthusiast with over a decade of trail experience. They share insights from real-world adventures and extensive research to help the trekking community.
                </p>
              </div>

              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>
                  Related Articles
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {blogPosts.filter(p => p.category === selectedPost.category && p.id !== selectedPost.id).slice(0, 3).map(post => (
                    <div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      style={{ 
                        padding: '16px', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        background: '#fff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d4a574'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(52,101,197,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{post.image}</div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                        {post.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{post.readTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-card" onClick={() => setSelectedPost(post)} style={{ cursor: 'pointer' }}>
                <div className="blog-image">{post.image}</div>
                <div className="blog-meta">
                  <span className="category-badge">{post.category}</span>
                  <span className="read-time">{post.readTime}</span>
                </div>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-footer">
                  <div className="author-info">
                    <span className="author">By {post.author}</span>
                    <span className="date">{post.date}</span>
                  </div>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedPost(post); }} className="read-more">Read More →</a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <p>No articles found matching your search.</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="blog-newsletter">
        <div className="newsletter-card">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for weekly trek tips and adventure stories delivered to your inbox.</p>
          <form onSubmit={e => e.preventDefault()} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  )
}
