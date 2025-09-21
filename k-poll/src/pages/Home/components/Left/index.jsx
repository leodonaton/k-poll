import React, { useContext, useState, useRef, useEffect } from 'react'
import './index.css'
import { LayoutContext } from '../../LayoutContext'
import { Tooltip } from 'antd'
import { BranchesOutlined, HolderOutlined, StarOutlined, DatabaseOutlined, RightOutlined, LeftOutlined, FormatPainterOutlined, HighlightOutlined, InsertRowLeftOutlined } from '@ant-design/icons'

const menuData_of_note = [
  {
    title: '编辑',
    label: <HighlightOutlined />,
    menu: [
      { title: '高亮', label: <HighlightOutlined /> },
      { title: '格式刷', label: <FormatPainterOutlined /> },
      { title: '功能3', label: <FormatPainterOutlined /> },
      { title: '功能4', label: <FormatPainterOutlined /> },
      { title: '功能5', label: <FormatPainterOutlined /> }
    ]
  },
  {
    title: '插入',
    label: <InsertRowLeftOutlined />,
    menu: [
      { title: '插入行', label: <InsertRowLeftOutlined /> },
      { title: '功能2', label: <InsertRowLeftOutlined /> },
      { title: '功能3', label: <InsertRowLeftOutlined /> },
      { title: '功能4', label: <InsertRowLeftOutlined /> },
      { title: '功能5', label: <InsertRowLeftOutlined /> }
    ]
  },
  {
    title: '思维导图',
    label: <BranchesOutlined />,
    menu: [
      { title: '思维导图', label: <BranchesOutlined /> },
      { title: '功能2', label: <BranchesOutlined /> },
      { title: '功能3', label: <BranchesOutlined /> },
      { title: '功能4', label: <BranchesOutlined /> },
      { title: '功能5', label: <BranchesOutlined /> }
    ]
  },
  {
    title: '知识卡片',
    label: <DatabaseOutlined />,
    menu: [
      { title: '知识卡片', label: <DatabaseOutlined /> },
      { title: '功能2', label: <DatabaseOutlined /> },
      { title: '功能3', label: <DatabaseOutlined /> },
      { title: '功能4', label: <DatabaseOutlined /> },
      { title: '功能5', label: <DatabaseOutlined /> }
    ]
  },
  {
    title: '5',
    label: <FormatPainterOutlined />,
    menu: [
      { title: '功能5', label: <FormatPainterOutlined /> },
      { title: '功能2', label: <FormatPainterOutlined /> },
      { title: '功能3', label: <FormatPainterOutlined /> },
      { title: '功能4', label: <FormatPainterOutlined /> },
      { title: '功能5', label: <FormatPainterOutlined /> }
    ]
  }
]

const initialSelectedMenuList = Array(menuData_of_note.length).fill(0).map((_, idx) => ({
  idx,
  menuIdx: 0
}))

function FloatingSubscribeBar({ subscribeList, setSubscribeList, handleMenuBtnClick }) {
  const barRef = useRef(null)
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - 200, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragIdx, setDragIdx] = useState(null)
  const { activefunctionbutton } = useContext(LayoutContext)

  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging) return
      let x = e.clientX - offset.x
      let y = e.clientY - offset.y
      const bar = barRef.current
      const maxX = window.innerWidth - (bar?.offsetWidth || 0)
      const maxY = window.innerHeight - (bar?.offsetHeight || 0)
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > maxX) x = maxX
      if (y > maxY) y = maxY
      setPos({ x, y })
    }
    function handleMouseUp() {
      setDragging(false)
    }
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, offset])

  const handleDragMouseDown = (e) => {
    e.preventDefault()
    const rect = barRef.current.getBoundingClientRect()
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragging(true)
  }

  // 拖拽排序相关
  const handleDragStart = idx => () => setDragIdx(idx)
  const handleDragOver = idx => e => e.preventDefault()
  const handleDrop = idx => () => {
    if (dragIdx === null || dragIdx === idx) return
    const newList = [...subscribeList]
    const [dragged] = newList.splice(dragIdx, 1)
    newList.splice(idx, 0, dragged)
    setSubscribeList(newList)
    setDragIdx(null)
  }

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        background: '#fffbe6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        padding: '10px 20px',
        minWidth: '200px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        userSelect: 'none'
      }}
    >
      <span
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
          marginRight: '12px',
          display: 'flex',
          alignItems: 'center'
        }}
        onMouseDown={handleDragMouseDown}
        title="拖动"
      >
        <HolderOutlined style={{ fontSize: 20, color: '#dcb251' }} />
      </span>
      {(subscribeList.length > 0) ? (
        subscribeList.map((item, idx) => {
          // 判断是否高亮
          const isActive = item.m && item.m.title === activefunctionbutton
          return (
            <div
              key={idx}
              draggable
              onDragStart={handleDragStart(idx)}
              onDragOver={handleDragOver(idx)}
              onDrop={handleDrop(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: dragIdx === idx ? 0.5 : 1
              }}
            >
              <button
                className={`subscribe-btn${isActive ? ' active-menu-item' : ''}`}
                style={{ fontSize: 18 }}
                onClick={() => handleMenuBtnClick(item.parentIdx, item.menuIdx, true)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.m.label}
                </span>
              </button>
            </div>
          )
        })
      ) : null}
    </div>
  )
}

export default function Left() {
  const [activeMenu, setActiveMenu] = useState(null)
  const [selectedMenuList, setSelectedMenuList] = useState(initialSelectedMenuList)
  const menuRef = useRef(null)
  const {
    showNote, setShowNote,
    showCodeEditor, setShowCodeEditor,
    showSubjectCards, setShowSubjectCards,
    subscribe, setSubscribe,
    subscribeList, setSubscribeList,
    activefunctionbutton, setActivefunctionbutton
  } = useContext(LayoutContext)

  const handlesubscribe = () => {
    setSubscribe(!subscribe)
  }
  const handleAddSubscribe = (m, menuIdx, parentIdx) => () => {
    const key = `${parentIdx}-${menuIdx}`
    setSubscribeList((prevList) => {
      // 参数prevList表示最新的state状态
      // some方法用于检查数组中是否至少有一个元素满足提供的测试函数
      const exists = prevList.some(item => item.menuIdx === menuIdx && item.parentIdx === parentIdx)
      const newList = exists
        ? prevList.filter(item => !(item.menuIdx === menuIdx && item.parentIdx === parentIdx))
        : [...prevList, { m, menuIdx, parentIdx }]
      return newList
    })
  }


  useEffect(() => {
    if (activeMenu === null) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [activeMenu])

  useEffect(() => {
    function handleRightClick(e) {
      if (activefunctionbutton) {
        e.preventDefault()
        setActivefunctionbutton(null)
      }
    }
    document.addEventListener('contextmenu', handleRightClick)
    return () => document.removeEventListener('contextmenu', handleRightClick)
  }, [activefunctionbutton])

  const handleMenuBtnClick = (parentIdx, menuIdx, isSubscribed) => {
    setSelectedMenuList(prev =>
      prev.map(item =>
        item.idx === parentIdx ? { ...item, menuIdx } : item
      )
    )
    // 传递当前子功能title到activefunctionbutton
    setActivefunctionbutton(menuData_of_note[parentIdx].menu[menuIdx].title)
  }

  return (
    <>
      <div className='container-left' ref={menuRef}>
        <div className='note-menu' style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 5,
              width: '40px',
              borderTop: '2px solid #dcb251',
              height: 0,
              zIndex: 1
            }}
          />
          {menuData_of_note.map((item, idx) => {
            const selected_notemenu = selectedMenuList.find(v => v.idx === idx)
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <button className='left-btn'> 
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {selected_notemenu ? selected_notemenu.m = item.menu[selected_notemenu.menuIdx].label : item.label}
                  </span>
                </button>
                <div
                  onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                  className='left-toggle-btn'
                >
                  <Tooltip title={activeMenu === idx ? null : item.title} placement='right' mouseEnterDelay={0} color='#dcb251'>
                    {activeMenu === idx ? <LeftOutlined /> : <RightOutlined />}
                  </Tooltip>
                </div>
                {activeMenu === idx && (
                  <div className="left-menu-popup" style={{ top: 0, left: '100%' }}>
                    {item.menu.map((m, i) => {
                      const isSubscribed = subscribeList.some(v => v.menuIdx === i && v.parentIdx === idx)
                      const isActive = activefunctionbutton === m.title
                      return (
                        <div
                          key={i}
                          className={`left-menu-item-container${isActive ? ' active-menu-item' : ''}`}
                        >
                          <button
                            className='left-menu-btn'
                            onClick={() => handleMenuBtnClick(idx, i, isSubscribed)}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {m.label}
                              <span>{m.title}</span>
                            </span>
                          </button>
                          <button
                            className={`left-menu-btn star-btn${isSubscribed ? ' subscribed' : ''}`}
                            style={{
                              width: '30px',
                              height: '30px',
                              marginTop: '10px',
                              textAlign: 'center',
                              background: isSubscribed ? '#f2a900' : undefined
                            }}
                            onClick={handleAddSubscribe(m, i, idx)}
                          >
                            <StarOutlined />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className='bottom-button-container'>
          <button className={subscribe ? 'left-btn-bottom-active' : 'left-btn'} onClick={handlesubscribe}><StarOutlined /></button>
        </div>
      </div>

      {(subscribe && subscribeList.length > 0) && (
        <FloatingSubscribeBar
          subscribeList={subscribeList}
          setSubscribeList={setSubscribeList}
          handleMenuBtnClick={handleMenuBtnClick}
        />
      )}
    </>
  )
}