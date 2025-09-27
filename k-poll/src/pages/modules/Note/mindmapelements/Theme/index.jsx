import React, { useContext, useState,useRef,useEffect, use } from 'react'
import { NoteContext } from '../../NoteContext'
import './index.css'
import { PlusOutlined } from '@ant-design/icons'

export default function Theme({ item, scale, offset, svgRef }) {
  const { mindmapelements, setMindmapelements, highlightId } = useContext(NoteContext)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(item.text)
  const [isNodeDragging, setIsNodeDragging] = useState(false);
  const [nodeoffset, setNodeoffset] = useState({x:0,y:0});
  const [showAddNode, setShowAddNode] = useState(false);
  const nodeRef = useRef(null);
  
  // 计算缩放和偏移后的中心坐标
  const x = item.x * scale + offset.x
  const y = item.y * scale + offset.y
  // 节点宽高
  const rx = 15 * scale
  const ry = 15 * scale
  // 新增：外扩边框参数（调小）
  const borderPad = 3 * scale
  const borderRx = rx + 1.5 * scale
  const borderRy = ry + 1.5 * scale
  // 最小宽度
  const minWidth = 100 * scale;
  const textMeasureRef = useRef(null);
  const [dynamicWidth, setDynamicWidth] = useState(minWidth);

  useEffect(() => {
    if (textMeasureRef.current) {
      const measured = textMeasureRef.current.offsetWidth + 20 * scale; // 额外加一些内边距
      setDynamicWidth(Math.max(minWidth, measured));
    }
  }, [text, scale]);

  const w = dynamicWidth;
  const h = 50 * scale;

  useEffect(() => {
    setMindmapelements(
      mindmapelements.map(el =>
        el.id === item.id ? { ...el, w, h } : el
      )
    );
  }, [w, h]);

  // 处理节点拖拽
  const handleOnNodeMouseDown = (e) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    // 获取 SVG 坐标
    let svg = svgRef?.current || nodeRef.current?.ownerSVGElement;
    if (!svg) return;
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    let svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    // 计算节点中心坐标
    const nodeX = item.x * scale + offset.x;
    const nodeY = item.y * scale + offset.y;
    setNodeoffset({
      x: svgP.x - nodeX,
      y: svgP.y - nodeY
    });
    setIsNodeDragging(true);
  };
  useEffect(() => {
    function handleMouseMove(e) {
      if (!isNodeDragging) return;
      let svg = svgRef?.current || nodeRef.current?.ownerSVGElement;
      if (!svg) return;
      let pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      let svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      let newX = (svgP.x - nodeoffset.x - offset.x) / scale;
      let newY = (svgP.y - nodeoffset.y - offset.y) / scale;
      function moveSubtree(nodeId, dx, dy, elements) {
          const node = elements.find(el => el.id === nodeId);
          if (!node) return;
          node.x += dx;
          node.y += dy;
          if (node.childIds && node.childIds.length > 0) {
            node.childIds.forEach(cid => {
              moveSubtree(cid, dx, dy, elements);
            });
          }
        }

        const dx = newX - item.x;
        const dy = newY - item.y;
        // 复制数组，避免直接修改原状态
        const updatedElements = mindmapelements.map(el => ({ ...el }));
        moveSubtree(item.id, dx, dy, updatedElements);

        setMindmapelements(updatedElements);
    }
    function handleMouseUp(){
      setIsNodeDragging(false);
    }
    if (isNodeDragging){
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return ()=>{
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isNodeDragging, nodeoffset, scale, offset, mindmapelements, setMindmapelements, item.id, svgRef])


  const handleDoubleClick = () => setEditing(true)
  const handleChange = e => setText(e.target.value)
  const handleBlur = () => {
    setEditing(false)
    setMindmapelements(
      mindmapelements.map(el =>
        el.id === item.id ? { ...el, text } : el
      )
    )
  }
  const handleShow = () => {
    setShowAddNode(true)
  }
  const handleNodeBlur = (e) => {
    setShowAddNode(false)
  }
  useEffect(() => {
    if (!showAddNode) return;
    function handleWindowClick(e) {
      // 判断点击是否在当前节点内
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setShowAddNode(false);
      }
    }
    window.addEventListener('mousedown', handleWindowClick);
    return () => window.removeEventListener('mousedown', handleWindowClick);
  }, [showAddNode]);
  return (
    <g
      id={item.id}
      ref={nodeRef}
      className='node-group'
      fill={item.color}
      onMouseDown={handleOnNodeMouseDown}
      onClick={handleShow}
    >
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={rx}
        ry={ry}
      />
      <path
        d={`
          M ${x - w / 2 - borderPad + borderRx} ${y - h / 2 - borderPad}
          H ${x + w / 2 + borderPad - borderRx}
          A ${borderRx} ${borderRy} 0 0 1 ${x + w / 2 + borderPad} ${y - h / 2 - borderPad + borderRy}
          V ${y + h / 2 + borderPad - borderRy}
          A ${borderRx} ${borderRy} 0 0 1 ${x + w / 2 + borderPad - borderRx} ${y + h / 2 + borderPad}
          H ${x - w / 2 - borderPad + borderRx}
          A ${borderRx} ${borderRy} 0 0 1 ${x - w / 2 - borderPad} ${y + h / 2 + borderPad - borderRy}
          V ${y - h / 2 - borderPad + borderRy}
          A ${borderRx} ${borderRy} 0 0 1 ${x - w / 2 - borderPad + borderRx} ${y - h / 2 - borderPad}
          Z
        `}
        fill="none"
        stroke="blue"
        strokeWidth={1.5 * scale}
        className='node-border'
        style={showAddNode?{opacity:1}:{}}
      />
      <foreignObject
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
        width={9999}
        height={40}
        x={0}
        y={0}
      >
        <span
          ref={textMeasureRef}
          style={{
            fontSize: 20 * scale,
            fontFamily: 'inherit',
            whiteSpace: 'pre',
            userSelect: 'none'
          }}
        >
          {text}
        </span>
      </foreignObject>
      <foreignObject
        height={h}
        width={w}
        x={x - w / 2}
        y={y - h / 2}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            fontSize: 20 * scale,
            color: 'white',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'center'
          }}
          onDoubleClick={handleDoubleClick}
        >
          {editing ? (
            <input
              value={text}
              autoFocus
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={e => { if (e.key === 'Enter') handleBlur() }}
              className='node-input'
              style={{ width: '100%' }}
            />
          ) : (
            <span style={{ userSelect: 'none', width: '100%' }}>{item.text}</span>
          )}
        </div>
      </foreignObject>
      {showAddNode &&
      <g
      className='node-plus-group'
      >
      <circle 
        cx={x + w / 2 + 15 * scale} 
        cy={y} 
        r={10 * scale} 
        fill="none" 
        stroke="white" 
        strokeWidth={1 * scale} 
        style={{ cursor: 'pointer' }} 
      />
      <foreignObject
        x={x + w / 2 + 5 * scale}
        y={y - 10 * scale}
        width={20 * scale}
        height={20 * scale}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <PlusOutlined style={{ color: 'white', fontSize: 16 * scale }} />
        </div>
      </foreignObject>
    </g>
}
    </g>
  )
}
