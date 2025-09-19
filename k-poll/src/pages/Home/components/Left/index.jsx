import React, { useContext, useState, useRef, useEffect } from 'react'
import './index.css'
import { LayoutContext } from '../../LayoutContext'
import { Tooltip } from 'antd'
import { StarOutlined,DatabaseOutlined, RightOutlined, LeftOutlined, FormatPainterOutlined, HighlightOutlined, InsertRowLeftOutlined } from '@ant-design/icons'

const menuData_of_note = [
  { title: '编辑', label: <HighlightOutlined />, menu: [<FormatPainterOutlined />, '2', '3', '4', '5'] },
  { title: '插入', label: <InsertRowLeftOutlined />, menu: ['表格', '2', '3', '4', '5'] },
  { title: '思维导图', label: <FormatPainterOutlined />, menu: ['思维导图', '2', '3', '4', '5'] },
  { title: '知识卡片', label: <DatabaseOutlined />, menu: ['知识卡片', '2', '3', '4', '5'] },
  { title: '5', label: <FormatPainterOutlined />, menu: ['5', '2', '3', '4', '5'] }
]

export default function Left() {
  const [activeMenu, setActiveMenu] = useState(null)
  
  const menuRef = useRef(null)
  const {
    showNote, showCodeEditor, showSubjectCards, subscribe,subscribeList, 
    setShowNote, setShowCodeEditor, setShowSubjectCards, setSubscribe,setSubscribeList,
  } = useContext(LayoutContext)

  const handlesubscribe = () => {
    setSubscribe(!subscribe)
  }
  const handleAddSubscribe = (m, menuIdx, parentIdx) => () => {
    const key = `${parentIdx}-${menuIdx}`
    setSubscribeList((prevList) => {
      const exists = prevList.some(item => item.menuIdx === menuIdx && item.parentIdx === parentIdx)
      if (exists) {
        return prevList.filter(item => !(item.menuIdx === menuIdx && item.parentIdx === parentIdx))
      } else {
        return [...prevList, { m, menuIdx, parentIdx }]
      }
    })
    console.log(subscribeList);
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

  return (
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
        {menuData_of_note.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <button className='left-btn'>{item.label}</button>
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
                  return (
                    <div key={i} className='left-menu-item-container'>
                      <button className='left-menu-btn'>{m}</button>
                      <button
                        className='left-menu-btn'
                        style={{
                          width:'30px',
                          height:'30px',
                          marginTop:'10px',
                          textAlign:'center', 
                          background: isSubscribed ? '#f2a900' : undefined}}
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
        ))}
      </div>

      {/* 收藏栏输出 */}
      <div className='subscribe-list-bar'>
        {subscribeList.map((item, idx) => (
          <div key={idx} className='left-menu-item-container'>
            <button
              className='left-menu-btn'
              style={{background:'#f2a900'}}
              // 可复用主菜单点击逻辑
            >
              {item.m}
            </button>
          </div>
        ))}
      </div>
      {/* 收藏栏输出结束 */}
      <div className='bottom-button-container'>
        <button className={subscribe ? 'left-btn-bottom-active' : 'left-btn'} onClick={handlesubscribe}><StarOutlined /></button>
      </div>
    </div>
  )
}