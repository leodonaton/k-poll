import React,{useContext} from 'react'
import {CloseOutlined} from '@ant-design/icons'
import { LayoutContext } from '../../Home/LayoutContext'
import './index.css'

export default function CodeEditor() {
  const {showCodeEditor, setShowCodeEditor} = useContext(LayoutContext)
  return (
    <div className='container-code-editor'>
      <button className='close-btn' onClick={() => setShowCodeEditor(null)}>
        <CloseOutlined  style={{ color: '#dcb251', fontSize: 10 }} />
        </button>
      <h2>代码编辑器</h2>
    </div>
  )
}
