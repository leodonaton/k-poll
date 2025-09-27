import React,{useState,useEffect,useContext, use} from 'react'
import './index.css'
import {NoteContext} from'../../NoteContext'

export default function Line() {
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
    <div>
      
    </div>
  )
}
