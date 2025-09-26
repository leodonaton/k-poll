import React, { useContext } from 'react'
import { NoteContext } from '../../NoteContext'
export default function Line() {
  const { lines } = useContext(NoteContext);
  return (
    <g>
      {lines.map((line, index) => {
        console.log(`line${index}:`, line)
        return (
          <path
            key={index}
            d={`M${line.x1},${line.y1} L${line.x2},${line.y2}`}
            stroke="#ff0000"
            strokeWidth="2"
            opacity="0.8"
          />
        )
      })}
    </g>
  )
}
