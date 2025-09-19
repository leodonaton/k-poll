import React, { useContext } from 'react'
import { LayoutContext } from '../../LayoutContext'
import Note from '../../../modules/Note'
import CodeEditor from '../../../modules/CodeEditor'
import SubjectCards from '../../../modules/SubjectCards'
import './index.css'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
const ResponsiveGridLayout = WidthProvider(Responsive)

export default function Screen() {
  const { showNote, showCodeEditor, showSubjectCards } = useContext(LayoutContext)
  // 布局配置
  const layouts = {
    lg: [
      { i: 'normalnote', x: 0, y: 0, w: 1, h: 2 },
      { i: 'codeEditor', x: 1, y: 0, w: 1, h: 2 },
      { i: 'subjectCards', x: 2, y: 0, w: 1, h: 2 }
    ]
  }
  return (
    <div className='container-screen'>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}//lg: 大于1200px, md: 996px-1200px, sm: 768px-996px, xs: 小于480px
        cols={{ lg: 3, md: 3, sm: 1, xs: 1 }}//lg: 大屏幕, md: 中等屏幕, sm: 小屏幕, xs: 超小屏幕
        rowHeight={40}//每行的高度
        isResizable={true} // 显式允许拉伸
        resizeHandles={['se']}
      >
        {showNote && (
          <div key="normalnote" data-grid={{x:0, y:0, w:1, h:2, minW:1, minH:1}}>
            <Note />
          </div>
        )}
        {showCodeEditor && (
          <div key="codeEditor" data-grid={{x:1, y:0, w:1, h:2, minW:1, minH:1}}>
            <CodeEditor />
          </div>
        )}
        {showSubjectCards && (
          <div key="subjectCards" data-grid={{x:2, y:0, w:1, h:2, minW:1, minH:1}}>
            <SubjectCards />
          </div>
        )}
      </ResponsiveGridLayout>
    </div>
  )
}
