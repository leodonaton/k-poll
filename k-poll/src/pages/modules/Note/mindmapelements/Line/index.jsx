import React,{useState,useEffect,useContext, use} from 'react'
import './index.css'
import {NoteContext} from'../../NoteContext'

export default function Line({scale, offset}) {
  const { mindmapelements, setMindmapelements} = useContext(NoteContext)
  const [lineElements, setLineElements] = useState([])
  useEffect(()=>{
    const lines = [];
    mindmapelements.forEach(item =>{
      if(item.childIds && item.childIds.length>0){
        item.childIds.forEach(childId=>{
          const child = mindmapelements.find(el=>el.id===childId);
          if(child){
            lines.push({id:`line-${item.id}-${child.id}`, from:item, to:child});
          }
        })
      }
    })
    setLineElements(lines);
  },[mindmapelements])

  // useEffect(()=>{
  //   console.log('lineElements updated', lineElements);
  // },[lineElements])
  return (
    <g>
      {lineElements.map(path=>(
        <path
          key={path.id}
          d = {`M ${path.from.x*scale + offset.x} ${path.from.y*scale + offset.y} 
                C ${ (path.from.x + path.to.x)/2 * scale + offset.x } ${ path.to.y*scale + offset.y },
                  ${ (path.from.x + path.to.x)/2 * scale + offset.x } ${ path.to.y*scale + offset.y },
                  ${ path.to.x*scale + offset.x } ${ path.to.y*scale + offset.y }
          `}
          stroke="gray"
          strokeWidth={2 * scale}
          fill="none"
        />
      ))}
    </g>
  )
}
