import React, { useContext, useState,useRef,useEffect, use } from 'react'
import { NoteContext } from '../../NoteContext'
import './index.css'
import { PlusOutlined } from '@ant-design/icons'

export default function Theme({ item, scale, offset, id }) {
  const { mindmapelements, setMindmapelements } = useContext(NoteContext)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(item.text)
  const [isNodeDragging, setIsNodeDragging] = useState(false);
  const [nodeoffset, setNodeoffset] = useState({x:0,y:0});
  const [showAddNode, setShowAddNode] = useState(false);
  const nodeRef = useRef(null);
  
  // 计算缩放和偏移后的中心坐标
  const x = item.x * scale + offset.x
  const y = item.y * scale + offset.y
  // 节点宽高
  const w = 100 * scale
  const h = 50 * scale
  const rx = 15 * scale
  const ry = 15 * scale
  // 新增：外扩边框参数（调小）
  const borderPad = 3 * scale
  const borderRx = rx + 1.5 * scale
  const borderRy = ry + 1.5 * scale
  // 处理节点拖拽
  const handleOnNodeMouseDown = (e) => {
    e.stopPropagation()
    if (e.button !== 0) return
    console.log('鼠标位置', e.clientX, e.clientY)
    const rect = nodeRef.current.getBoundingClientRect()
    console.log('节点位置', rect.left, rect.top)
    console.log('偏移', e.clientX - rect.left, e.clientY - rect.top)
    setNodeoffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsNodeDragging(true)
  }
  useEffect(()=>{
    function handleMouseMove(e){
      if(!isNodeDragging) return;
      let newX = (e.clientX - nodeoffset.x - offset.x) / scale;
      let newY = (e.clientY - nodeoffset.y - offset.y) / scale;
      setMindmapelements(
        mindmapelements.map(el =>
          el.id === item.id ? { ...el, x: newX, y: newY } : el
        )
      );
    }
    function handleMouseUp(){
      setIsNodeDragging(false);
    }
    if (isNodeDragging){
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return ()=>{
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  },[isNodeDragging,nodeoffset])


  const handleDoubleClick = () => setEditing(true)
  const handleChange = e => setText(e.target.value)
  const handleBlur = () => {
    setEditing(false)
    setMindmapelements(
      mindmapelements.map(el =>
        el.id === item.id ? { ...el, text } : el
      )
    )
  }
  const handleShow = () => {
    setShowAddNode(true)
  }
  const handleNodeBlur = (e) => {
    setShowAddNode(false)
  }
  useEffect(() => {
    if (!showAddNode) return;
    function handleWindowClick(e) {
      // 判断点击是否在当前节点内
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setShowAddNode(false);
      }
    }
    window.addEventListener('mousedown', handleWindowClick);
    return () => window.removeEventListener('mousedown', handleWindowClick);
  }, [showAddNode]);
  return (
    <g
      id={id}
      ref={nodeRef}
      className='node-group'
      onMouseDown={handleOnNodeMouseDown}
      onClick={handleShow}
    >
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={rx}
        ry={ry}
      />
      {/* 外扩一点的 path 边框 */}
      <path
        d={`
          M ${x - w / 2 - borderPad + borderRx} ${y - h / 2 - borderPad}
          H ${x + w / 2 + borderPad - borderRx}
          A ${borderRx} ${borderRy} 0 0 1 ${x + w / 2 + borderPad} ${y - h / 2 - borderPad + borderRy}
          V ${y + h / 2 + borderPad - borderRy}
          A ${borderRx} ${borderRy} 0 0 1 ${x + w / 2 + borderPad - borderRx} ${y + h / 2 + borderPad}
          H ${x - w / 2 - borderPad + borderRx}
          A ${borderRx} ${borderRy} 0 0 1 ${x - w / 2 - borderPad} ${y + h / 2 + borderPad - borderRy}
          V ${y - h / 2 - borderPad + borderRy}
          A ${borderRx} ${borderRy} 0 0 1 ${x - w / 2 - borderPad + borderRx} ${y - h / 2 - borderPad}
          Z
        `}
        fill="none"
        stroke="blue"
        strokeWidth={1.5 * scale}
        className='node-border'
        style={showAddNode?{opacity:1}:{}}
      />
      <foreignObject
        height={h / 2}
        width={w * 0.8}
        x={x - (w * 0.8) / 2}
        y={y - (h / 4)}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            fontSize: 20 * scale,
            color: 'white',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
          onDoubleClick={handleDoubleClick}
        >
          {editing ? (
            <input
              value={text}
              autoFocus
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={e => { if (e.key === 'Enter') handleBlur() }}
              className='node-input'
            />
          ) : (
            <span>{item.text}</span>
          )}
        </div>
      </foreignObject>
      {showAddNode &&
      <g
      className='node-plus-group'
      >
      <circle 
        cx={x + w / 2 + 15 * scale} 
        cy={y} 
        r={10 * scale} 
        fill="none" 
        stroke="white" 
        strokeWidth={1 * scale} 
        style={{ cursor: 'pointer' }} 
      />
      <foreignObject
        x={x + w / 2 + 5 * scale}
        y={y - 10 * scale}
        width={20 * scale}
        height={20 * scale}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <PlusOutlined style={{ color: 'white', fontSize: 16 * scale }} />
        </div>
      </foreignObject>
    </g>
}
    </g>
  )
}
