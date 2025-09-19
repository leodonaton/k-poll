import React,{useContext} from 'react'
import { DesktopOutlined, EllipsisOutlined,AppstoreAddOutlined } from '@ant-design/icons'
import { LayoutContext } from '../../LayoutContext'
import './index.css'

export default function Top() {
  return (
    <div className='container-top'>
      <button className='top-left-btn' style={{width:'100px'}}>新建</button>
      <button className='top-left-btn' style={{width:'156px'}}>当前文件</button>
      <button className='top-left-btn' style={{width:'80px'}}>工具</button>
      <button className='top-left-btn' style={{width:'60px'}}><AppstoreAddOutlined /></button>
      <button className='top-btn'><DesktopOutlined /></button>
      <button className='top-btn'><EllipsisOutlined /></button>
    </div>
  )
}
