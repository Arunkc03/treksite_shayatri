import React from 'react'
import { Link } from 'react-router-dom'

export default function TrailCard({ trail }) {
  // Handle both emoji and image URLs
  const isImage = trail.image && (
    trail.image.startsWith('http') || 
    trail.image.startsWith('/uploads') || 
    trail.image.includes('localhost') ||
    trail.image.includes('trek-')
  );
  
  // Convert relative paths to full backend URLs
  let imageSrc = trail.image;
  if (trail.image && trail.image.startsWith('/uploads')) {
    imageSrc = `http://localhost:5000${trail.image}`;
  }
  
  return (
    <article className="trail-card">
      {isImage ? (
        <img 
          src={imageSrc} 
          alt={trail.name} 
          loading="lazy" 
          style={{ objectFit: 'cover', width: '100%', height: '200px' }} 
          onError={(e) => { 
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 200px; background: #f0f0f0; font-size: 80px;">⛰️</div>';
          }} 
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '200px', background: '#f0f0f0', fontSize: '80px' }}>
          {trail.image || '⛰️'}
        </div>
      )}
      <div className="card-body">
        <h3>{trail.name}</h3>
        <p className="meta">{trail.location} • {trail.length || trail.length_km} km</p>
        <p className="difficulty">{trail.difficulty}</p>
        <Link to={`/trails/${trail.id}`} className="btn">View</Link>
      </div>
    </article>
  )
}
