import React from 'react'

const gear = [
  {id:1, name:'Hiking Boots'},
  {id:2, name:'Backpack 25L'},
  {id:3, name:'Hydration Pack'}
]

export default function Gear(){
  return (
    <div className="page gear">
      <h1>Recommended Gear</h1>
      <ul>
        {gear.map(g => <li key={g.id}>{g.name}</li>)}
      </ul>
    </div>
  )
}
