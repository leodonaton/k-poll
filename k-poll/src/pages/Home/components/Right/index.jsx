import React,{useContext} from 'react'
import './index.css'
import { LayoutContext } from '../../LayoutContext'
import {SearchOutlined} from '@ant-design/icons'
export default function Right() {
  return (
    <div className='container-right'>
      <button className='right-btn'><SearchOutlined /></button>
      <button className='right-btn'>2</button>
      <button className='right-btn'>3</button>
      <button className='right-btn'>4</button>
    </div>  
  )
}
