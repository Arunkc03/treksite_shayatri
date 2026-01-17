import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  function submitSearch(e){
    e.preventDefault()
    const qs = q.trim()
    navigate(qs ? `/trails?q=${encodeURIComponent(qs)}` : '/trails')
    setQ('')
    setOpen(false)
  }

  useEffect(() => {
    // Close on ESC
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        setDropdownOpen(null)
      }
    }
    // Close mobile menu if viewport expanded
    function onResize() {
      if (window.innerWidth > 720) {
        setOpen(false)
        setDropdownOpen(null)
      }
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    // When opening, focus first link for accessibility
    if (open && navRef.current) {
      const first = navRef.current.querySelector('a, button')
      first && first.focus()
    } else if (!open && toggleRef.current) {
      toggleRef.current.focus()
    }
  }, [open])

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <div className="container header-inner">
        <h1 className="logo"><NavLink to="/">🏔️ Trek<span>Site</span></NavLink></h1>

        <nav
          id="primary-navigation"
          ref={navRef}
          className={`site-nav ${open ? 'open' : ''}`}
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Home</NavLink>
          
          <div className="nav-dropdown">
            <button 
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault()
                setDropdownOpen(dropdownOpen === 'explore' ? null : 'explore')
              }}
            >
              Explore ▼
            </button>
            {dropdownOpen === 'explore' && (
              <div className="dropdown-menu">
                <NavLink to="/trails" onClick={() => setDropdownOpen(null)}>Trails</NavLink>
                <NavLink to="/climbing" onClick={() => setDropdownOpen(null)}>Climbing</NavLink>
                <NavLink to="/activities" onClick={() => setDropdownOpen(null)}>Activities</NavLink>
                <NavLink to="/destinations" onClick={() => setDropdownOpen(null)}>Destinations</NavLink>
                <NavLink to="/itineraries" onClick={() => setDropdownOpen(null)}>Itineraries</NavLink>
              </div>
            )}
          </div>
          
          <NavLink to="/about" className={({isActive}) => isActive ? 'active' : undefined}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : undefined}>Contact</NavLink>
          <NavLink to="/blog" className={({isActive}) => isActive ? 'active' : undefined}>Blog</NavLink>
          <NavLink to="/gallery" className={({isActive}) => isActive ? 'active' : undefined}>Gallery</NavLink>

          <form className="search-form" onSubmit={submitSearch} role="search">
            <input
              aria-label="Search trails"
              placeholder="🔍 Search..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button className="search-btn" type="submit">Search</button>
          </form>
        </nav>
      </div>
    </header>
  )
}
