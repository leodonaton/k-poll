import React, { use } from 'react'
import { useContext, useState, useRef, useEffect } from 'react'
import { NoteContext } from '../../NoteContext'
import './index.css'
import { PlusOutlined } from '@ant-design/icons'
export default function Subtheme({ item, scale, offset, svgRef }) {
  const { mindmapelements, setMindmapelements,
    highlightId, setHighlightId
  } = useContext(NoteContext)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(item.text)
  const [isNodeDragging, setIsNodeDragging] = useState(false)
  const [nodeoffset, setNodeoffset] = useState({ x: 0, y: 0 });
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
      const measured = textMeasureRef.current.offsetWidth + 20 * scale;
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
    if (item.fatherId) {
      mindmapelements.find(el => el.id === item.fatherId)
        .childIds = mindmapelements.find(
          el => el.id === item.fatherId
        ).childIds.filter(cid => cid !== item.id);

      mindmapelements.find(el => el.id === item.id).fatherId = null;

      setMindmapelements([...mindmapelements]);
    }
  };

  // 递归移动子树
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
function moveSubtreeWhilemouseupAtrightPattern(nodeId, finalX, finalY, elements) {
  const node = elements.find(el => el.id === nodeId);
  if (!node) return;

  const father = elements.find(el => el.id === node.fatherId);

  if (!father) {
    layoutSubtree(node, finalX, finalY, elements);
    adjustLevels(elements, nodeId, finalY);
    return;
  }
  const siblings = father.childIds.map(cid => elements.find(el => el.id === cid)).filter(Boolean);
  const count = siblings.length;
  const totalHeight = siblings.reduce((sum, sib) => sum + sib.h, 0) + (count - 1) * 60 * scale;
  let startY = father.y * scale + offset.y - totalHeight / 2 + siblings[0].h / 2;

  siblings.forEach(sib => {
    const parentRight = father.x * scale + offset.x + father.w / 2;
    const sibNewX = (parentRight + 100 + sib.w / 2 - offset.x) / scale;
    const sibNewY = (startY - offset.y) / scale;

    layoutSubtree(sib, sibNewX, sibNewY, elements);

    startY += sib.h + 60 * scale;
  });

  adjustLevels(elements, nodeId, finalY);
}

function layoutSubtree(node, finalX, finalY, elements) {
  node.x = finalX;
  node.y = finalY;

  if (!node.childIds || node.childIds.length === 0) return;

  const parentRight = finalX * scale + offset.x + node.w / 2;
  const children = node.childIds.map(cid => elements.find(el => el.id === cid)).filter(Boolean);
  const count = children.length;
  const totalHeight = children.reduce((sum, child) => sum + child.h, 0) + (count - 1) * 60 * scale;
  let startY = finalY * scale + offset.y - totalHeight / 2 + children[0].h / 2;

  children.forEach(child => {
    const childNewX = (parentRight + 100 + child.w / 2 - offset.x) / scale;
    const childNewY = (startY - offset.y) / scale;

    layoutSubtree(child, childNewX, childNewY, elements);

    startY += child.h + 60 * scale;
  });
}

function adjustLevels(elements, rootId, rootY) {
  const root = elements.find(el => el.id === rootId);
  if (!root) return;

  // 按层级分组
  const levelMap = {};
  function collect(node, depth) {
    if (!levelMap[depth]) levelMap[depth] = [];
    levelMap[depth].push(node);
    if (node.childIds && node.childIds.length > 0) {
      node.childIds.forEach(cid => {
        const child = elements.find(el => el.id === cid);
        if (child) collect(child, depth + 1);
      });
    }
  }
  collect(root, 0);

  // 遍历每一层，重新排布纵向位置
  Object.keys(levelMap).forEach(depthStr => {
    const depth = parseInt(depthStr);
    const nodes = levelMap[depth];

    if (nodes.length <= 1) return;

    // 总高度 = 所有节点高度 + (n-1)*间距
    const minGap = 60; // 最小间距（缩放前）
    const totalHeight = nodes.reduce((sum, n) => sum + n.h, 0);
    const availableHeight = totalHeight + (nodes.length - 1) * minGap;

    // 层的中心线以 rootY 为基准
    let startY = rootY - availableHeight / 2 + nodes[0].h / 2;

    nodes.forEach(node => {
      node.y = startY;
      startY += node.h + minGap;
    });
  });
}


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

      const dx = newX - item.x;
      const dy = newY - item.y;

      const updatedElements = mindmapelements.map(el => ({ ...el }));
      moveSubtree(item.id, dx, dy, updatedElements);
      setMindmapelements(updatedElements);

      const foundElement = mindmapelements.find(el => {
        const el_x = el.x * scale + offset.x;
        const el_y = el.y * scale + offset.y;
        if((el_x - el.w / 2 < x - item.w / 2 && el_x + el.w / 2 > x - item.w / 2) && (
          el_y - el.h / 2 < y - item.h / 2 && el_y + el.h / 2 > y - item.h / 2 ||
          el_y - el.h / 2 < y + item.h / 2 && el_y + el.h / 2 > y + item.h / 2
        ))
      return el
      });

      // console.log('鼠标',e.clientX,e.clientY);
      if (foundElement && foundElement.id !== item.id) {
        setHighlightId(foundElement.id);
      }
      else {
        setHighlightId(null);
      }
    }
    function handleMouseUp(e) {
      setIsNodeDragging(false);
      if (highlightId) {
        const parent = mindmapelements.find(el => el.id === highlightId);
        if (parent) {
          let svg = svgRef?.current || nodeRef.current?.ownerSVGElement;
          let mouseY = 0;
          if (svg && e) {
            let pt = svg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            let svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
            mouseY = svgP.y;
          }
          const parentCenterY = parent.y * scale + offset.y;
          let newChildIds;
          if (mouseY < parentCenterY) {
            newChildIds = [item.id, ...parent.childIds.filter(cid => cid !== item.id)];
          } else {
            newChildIds = [...parent.childIds.filter(cid => cid !== item.id), item.id];
          }
          parent.childIds = newChildIds;
        }
        mindmapelements.find(el => el.id === item.id).fatherId = highlightId;
        // mindmapelements.find(el => el.id === item.id).x += 100 / scale;
        setMindmapelements([...mindmapelements]);
        const updatedElements = mindmapelements.map(el => ({ ...el }));
        const finalX= parent.x + ((parent.w/2 + 100 + item.w/2)) / scale;
        moveSubtreeWhilemouseupAtrightPattern(item.id, finalX, parent.y, updatedElements);
        setMindmapelements(updatedElements);
        setHighlightId(null); 
      }
    }
    if (isNodeDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp); 
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isNodeDragging, nodeoffset, scale, offset, mindmapelements, setMindmapelements, item.id, svgRef])
  
  // useEffect(() => {
  //   console.log('highlightId changed:', highlightId);
  //   console.log('Current mindmapelements:', mindmapelements);
  // }, [highlightId])
  // useEffect(() => {
  //   // console.log(mindmapelements);
  //   console.log('center-pos:', item.x*scale + offset.x, item.y*scale + offset.y);
  //   console.log('item-range:', item.x*scale + offset.x - item.w / 2, item.x*scale + offset.x + item.w / 2);
  //   console.log('--------------------------------------------------------')
  // }, [item.w, item.h]);

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
      className='sub-node-group'
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
        className='sub-node-border'
        style={showAddNode ? { opacity: 1 } : {}}
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
              className='sub-node-input'
              style={{ width: '100%' }}
            />
          ) : (
            <span style={{ userSelect: 'none', width: '100%' }}>{item.text}</span>
          )}
        </div>
      </foreignObject>
      {showAddNode &&
        <g
          className='sub-node-plus-group'
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
