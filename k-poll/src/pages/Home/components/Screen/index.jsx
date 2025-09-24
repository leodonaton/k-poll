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
      {
        !showNote && !showCodeEditor && !showSubjectCards ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#888',
              userSelect: 'none'
            }}
          >
            从下面选一个板块开始创作吧！
          </div>
        ):(
          <Splitter>  
        {showNote ? (
          <Splitter.Panel min={200} collapsible="start">
            <Note />
          </Splitter.Panel>
        ) : null}
        {showCodeEditor === 'codeEditor' ? (
          <Splitter.Panel min={200} collapsible="start">
            <CodeEditor />
          </Splitter.Panel>
        ) : null}
        {showSubjectCards === 'subjectCards' ? (
          <Splitter.Panel min={200} collapsible="start">
            <SubjectCards />
          </Splitter.Panel>
        ) : null}
      </Splitter>
        )
      }
    </div>
  )
}
