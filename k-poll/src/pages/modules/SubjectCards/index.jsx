import React,{useContext} from 'react'
import './index.css'
import { LayoutContext } from '../../Home/LayoutContext'
import {CloseOutlined} from '@ant-design/icons'
export default function SubjectCards() {
  const {showSubjectCards, setShowSubjectCards} = useContext(LayoutContext)
  return (
    <div className='container-subject-cards'>
      <h2>学科区</h2>
      <button className='close-btn' onClick={() => setShowSubjectCards(null)}>
        <CloseOutlined  style={{ color: '#dcb251', fontSize: 10 }} />
      </button>
    </div>
  )
}
