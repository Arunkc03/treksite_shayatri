import React from 'react'

const events = [
  {id:1, title:'Community Clean Hike - June 12'},
  {id:2, title:'Full Moon Night Trek - July 3'}
]

export default function Events(){
  return (
    <div className="page events">
      <h1>Events</h1>
      <ul>
        {events.map(e => <li key={e.id}>{e.title}</li>)}
      </ul>
    </div>
  )
}
