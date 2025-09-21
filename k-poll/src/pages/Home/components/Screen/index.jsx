import React, { useContext } from 'react'
import { LayoutContext } from '../../LayoutContext'
import Note from '../../../modules/Note'
import CodeEditor from '../../../modules/CodeEditor'
import SubjectCards from '../../../modules/SubjectCards'
import { Splitter } from "antd";
import './index.css'

export default function Screen() {
  const {
    showNote, showCodeEditor, showSubjectCards, activefunctionbutton, setActivefunctionbutton,
    selectedright
  } = useContext(LayoutContext)
  // console.log('activefunctionbutton', activefunctionbutton);
  return (
    <div className={`container-screen ${selectedright ? 'with-right-panel' : ''}`}>
      <Splitter>  
        {showNote ? (
          <Splitter.Panel min={200} collapsible="start">
            <Note />
          </Splitter.Panel>
        ) : null}
        {showCodeEditor ? (
          <Splitter.Panel min={200} collapsible="start">
            <CodeEditor />
          </Splitter.Panel>
        ) : null}
        {showSubjectCards ? ( 
          <Splitter.Panel min={200} collapsible="start">
            <SubjectCards />
          </Splitter.Panel>
        ) : null}
      </Splitter>
    </div>
  )
}
