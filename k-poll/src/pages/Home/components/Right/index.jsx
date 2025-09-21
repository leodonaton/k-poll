import React, { useContext,useState } from 'react'
import './index.css'
import { LayoutContext } from '../../LayoutContext'
import layers from '../../../../assets/layers.png'
import checklist from '../../../../assets/清单.png'
import Checklist from './components/Checklist'
import Clock from './components/clock'
import Comment from './components/comment'
import ObjectTree from './components/Objecttree'
import Search from './components/Search'
import { Tooltip } from 'antd'
import { SearchOutlined, ClockCircleOutlined, CommentOutlined } from '@ant-design/icons'
const menu_right = [
  { icon: <SearchOutlined />, text: 'search',label:'搜索' },
  { icon: <img src={checklist} style={{ width: '55%', height: '55%' }} />, text: 'checklist',label:'清单' },
  { icon: <ClockCircleOutlined />, text: 'clock',label:'时钟' },
  { icon: <img src={layers} style={{ width: '55%', height: '55%' }} />, text: 'layers',label:'对象树' },
  { icon: <CommentOutlined />, text: 'comment',label:'评论' },
]
export default function Right() {
  const { selectedright, setSelectedright } = useContext(LayoutContext)
  const handleClick = (text) => () => {
    if (selectedright === text) {
      setSelectedright(null);
    } else {
      setSelectedright(text);
    }
  }
  return (
    <div className={`container-right ${selectedright ? 'expanded' : ''}`}>
      <div className={`right-panel ${selectedright ? 'visible' : ''}`}>
        {selectedright === 'search' && <div className="right-panel-content"><Search /></div>}
        {selectedright === 'checklist' && <div className="right-panel-content"><Checklist /></div>}
        {selectedright === 'clock' && <div className="right-panel-content"><Clock /></div>}
        {selectedright === 'layers' && <div className="right-panel-content"><ObjectTree /></div>}
        {selectedright === 'comment' && <div className="right-panel-content"><Comment /></div>}
      </div>
      <div style={selectedright?{borderLeft:'1px solid #dfa522',height:'90%'}:{}}>
        {menu_right.map((item, index) => {
          const isactive = selectedright === item.text;
          return (
            <Tooltip title={item.label} key={index} placement="left" color="#dcb251" overlayInnerStyle={{ color: '#fff', fontSize: '14px' }}>
              <button
                className={`right-btn ${isactive ? 'active' : ''}`}
                onClick={handleClick(item.text)}>
                {item.icon}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  )
}
