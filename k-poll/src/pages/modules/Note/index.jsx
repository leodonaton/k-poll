import React, { useContext, useRef, useState, useEffect } from 'react'
import './index.css'
import { LayoutContext } from '../../Home/LayoutContext'
import { CloseOutlined } from '@ant-design/icons'
import Theme from './mindmapelements/Theme'
import Subtheme from './mindmapelements/Subtheme'
import Conection from './mindmapelements/Conection'
import Summary from './mindmapelements/Summary'
import { NoteContext } from './NoteContext'
export default function Note() {
  const { showNote, setShowNote,
    activefunctionbutton, setActivefunctionbutton,
    notedragging, setNotedragging,
    continueactive
  } = useContext(LayoutContext)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const offsetRef = useRef(offset)
  useEffect(() => {
    offsetRef.current = offset
  }, [offset])
  const [mindmapelements, setMindmapelements] = useState([])
  //格式: [{id:'',label:'',x:0,y:0,w:0,h:0,text:'',connections:[id,id]}]
  const [selectedIds, setSelectedIds] = useState([])
  const [scale, setScale] = useState(1)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })
  const [highlightId, setHighlightId] = useState(null);
  // 通知拖拽状态
  const notifyDragStatus = (status) => {
    window.dispatchEvent(new CustomEvent('note-drag-status', { detail: { notedragging: status } }))
  }

  // 鼠标按下左键进入拖拽
  const handleMouseDown = e => {
    if (e.button !== 0) return
    // const isSvg = e.target.tagName === 'svg'
    // if (!isSvg) return
    // console.log(e.target.tagName)
    setNotedragging(true)
    notifyDragStatus(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }
  // 鼠标移动
  const handleMouseMove = e => {
    if (!notedragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const newOffset = {
      x: offsetStart.current.x + dx,
      y: offsetStart.current.y + dy
    }
    setOffset(newOffset)
    // 拖拽时同步 offsetRef
    offsetRef.current = newOffset
  }
  // 鼠标松开时取消拖拽
  const handleMouseUp = () => {
    if (notedragging) {
      setNotedragging(false)
      notifyDragStatus(false)
    }
  }
  // 鼠标滚轮缩放
  const handleWheel = e => {
    e.preventDefault()
    let svg = null
    if (showNote === 'mindMap') {
      svg = document.getElementById('mindmap-svg')
    } else if (showNote === 'excerpt') {
      svg = document.getElementById('excerpt-svg')
    }
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const currentOffset = offsetRef.current
    const mouseX = (mx - currentOffset.x) / scale
    const mouseY = (my - currentOffset.y) / scale

    let next = scale - e.deltaY * 0.001
    next = Math.max(0.2, Math.min(3, next))
    setScale(next)
    setOffset({
      x: mx - mouseX * next,
      y: my - mouseY * next
    })
    offsetRef.current = {
      x: mx - mouseX * next,
      y: my - mouseY * next
    }
  }

  const handleAddNode = (e, type = activefunctionbutton) => {
    if (e.target.tagName !== 'svg') return;
    const typeConfig = {
      '主题': { label: '主题', text: '主题', childIds: [] },
      '子主题': { label: '子主题', text: '子主题',  fatherId: null, childIds: [] },
      '关联': { label: '关联', text: '关联', connections: [] },
      '概要': { label: '概要', text: '概要', connections: [] }
    };
    const config = typeConfig[type];
    if (!config) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    const w = 100 * scale;
    const h = 50 * scale;
    const newNode = {
      id: Date.now().toString(),
      ...config,
      x,
      y,
      w,
      h
    };
    setMindmapelements([...mindmapelements, newNode]);
    if (!continueactive) {
      setActivefunctionbutton(null);
    }
  }
  // 绑定事件
  useEffect(() => {
    if (notedragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [notedragging])

  useEffect(() => {
    let svg = null
    if (showNote === 'mindMap') {
      svg = document.getElementById('mindmap-svg')
    } else if (showNote === 'excerpt') {
      svg = document.getElementById('excerpt-svg')
    }
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false })
      return () => svg.removeEventListener('wheel', handleWheel)
    }
  }, [showNote, scale])


  function renderNodeByLabel(item, scale, offset) {
    switch (item.label) {
      case '主题':
        return (
          <Theme
            item={item}
            scale={scale}
            offset={offset}
            key={item.id}
          />
        )
      case '子主题':
        return (
          <Subtheme item={item} scale={scale} offset={offset} key={item.id} />
        )
      case '关联':
        return (
          <Conection item={item} scale={scale} offset={offset} key={item.id} />
        )
      case '概要':
        return (
          <Summary item={item} scale={scale} offset={offset} key={item.id} />
        )
      default:
        return null
    }
  }

  return (
    <div
      className='container-note'
      style={{
        minHeight: 300,
        width: '100%',
        height: '100%',
        cursor: notedragging ? 'grabbing' : 'crosshair',
        position: 'relative'
      }}
      onMouseDown={handleMouseDown}
    >
      <NoteContext.Provider value={{ 
        mindmapelements, setMindmapelements,
        highlightId, setHighlightId
      }}>
        <button
          className='close-button'
          onClick={() => setShowNote(null)}
        >
          <CloseOutlined style={{ color: '#dcb251', fontSize: 10 }} />
        </button>

        {showNote === 'excerpt' &&
          <svg
            id="excerpt-svg"
            width="100%" height="100%" style={{ display: 'block', width: '100%', height: '100%' }}>
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${offset.x},${offset.y}) scale(${scale})`}
              >
                <rect x="0" y="0" width="20" height="20" fill="none" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fff" strokeWidth="1" opacity="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        }
        {showNote === 'mindMap' &&
          <svg
            id="mindmap-svg"
            width="100%"
            height="100%"
            style={{ display: 'block', width: '100%', height: '100%' }}
            onClick={e => handleAddNode(e, activefunctionbutton)}
          >
            {mindmapelements.map((item, _) => (
              renderNodeByLabel(item, scale, offset)
            ))}
          </svg>
        }
        {showNote === 'outline' &&
          <svg
            width="100%"
            height="100%"
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <defs>
              <pattern
                id="notebook-lines"
                width="100"
                height="30"
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${offset.x},${offset.y}) scale(${scale})`}
              >
                <line x1="0" y1="29" x2="100" y2="29" stroke="#fff" strokeWidth="2" opacity="0.8" />
              </pattern>
            </defs>
            <rect
              x="20%"
              width="60%"
              height="100%"
              fill="url(#notebook-lines)"
              stroke="#dcb251"
              strokeWidth="1"
            />
          </svg>
        }
      </NoteContext.Provider>
    </div>
  )
}