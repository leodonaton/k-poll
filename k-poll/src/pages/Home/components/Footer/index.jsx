import React, { useState,useContext } from 'react'
import './index.css'
import { LayoutContext } from '../../LayoutContext'
import { Tooltip } from 'antd'
import { FormOutlined, CodeOutlined, BookOutlined } from '@ant-design/icons'

const menuData = [

]
export default function Footer() {
  const [showMenu, setShowMenu] = useState(null)
  const {
    showNote, showCodeEditor, showSubjectCards,
    setShowNote, setShowCodeEditor, setShowSubjectCards
  } = useContext(LayoutContext)
  return (
    <div className='container-footer'>
      <button
        className='footer-left-btn'
        onClick={() => setShowMenu(showMenu === 'note' ? null : 'note')}>
        <FormOutlined /> <span style={{fontSize: '14px'}}>笔记</span>
      </button>
      <button
        className='footer-left-btn'
        onClick={() => setShowMenu(showMenu === 'codeEditor' ? null : 'codeEditor')}>
        <CodeOutlined /> <span style={{fontSize: '14px'}}>代码编辑器</span>
      </button>
      <button
        className='footer-left-btn'
        onClick={() => setShowMenu(showMenu === 'subjectCards' ? null : 'subjectCards')}>
        <BookOutlined /> <span style={{fontSize: '14px'}}>知识卡片</span>
      </button>



      <button className='footer-right-btn'>5</button>
      <button className='footer-right-btn'>6</button>

      {showMenu === 'note' && (
        <div className='footer-menu-popup' style={{ left: 0 }} onMouseLeave={() => setShowMenu(null)}>
          <button className='footer-menu-btn' onClick={() => setShowNote(!showNote)}>摘录式笔记</button>
          <button className='footer-menu-btn'>思维导图</button>
          <button className='footer-menu-btn'>大纲笔记</button>
        </div>
      )}


      {showMenu === 'codeEditor' && (
        <div className='footer-menu-popup' style={{ left: '100px' }} onMouseLeave={() => setShowMenu(null)}>
          <button className='footer-menu-btn'>代码编辑器</button>
        </div>
      )}

      {showMenu === 'subjectCards' && (
        <div className='footer-menu-popup' style={{ left: '210px' }} onMouseLeave={() => setShowMenu(null)}>
          <button className='footer-menu-btn'>知识卡片</button>
        </div>
      )}
    </div>
  )
}