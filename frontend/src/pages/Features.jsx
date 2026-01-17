import React from 'react'

const features = [
  {id:1, title:'Destination', desc:'Explore beautiful trekking destinations with detailed information and stunning visuals.'},
  {id:2, title:'Activities', desc:'Discover various outdoor activities including hiking, adventure sports, and nature experiences.'},
  {id:3, title:'Trekking', desc:'Comprehensive trekking guides with difficulty levels, maps, and route planning tools.'},
  {id:4, title:'Climbing', desc:'Expert climbing routes with safety tips, equipment recommendations, and community reviews.'},
  {id:5, title:'About', desc:'Learn more about our mission to promote sustainable and responsible adventure tourism.'},
  {id:6, title:'Contact', desc:'Get in touch with our team for inquiries, partnerships, and feedback.'}
]

export default function Features(){
  return (
    <div className="page features">
      <h1>Features & Services</h1>
      <ul className="features-list">
        {features.map(f => (
          <li key={f.id}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
