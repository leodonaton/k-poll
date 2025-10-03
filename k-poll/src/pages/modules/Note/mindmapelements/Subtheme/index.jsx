import React, { use } from 'react'
import { useContext, useState, useRef, useEffect } from 'react'
import { NoteContext } from '../../NoteContext'
import './index.css'
import { PlusOutlined } from '@ant-design/icons'
export default function Subtheme({ item, scale, offset, svgRef }) {
  const { mindmapelements, setMindmapelements,
    highlightId, setHighlightId, highlightpos, setHighlightpos
  } = useContext(NoteContext)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(item.text)
  const [isNodeDragging, setIsNodeDragging] = useState(false)
  const [nodeoffset, setNodeoffset] = useState({ x: 0, y: 0 });
  const [showAddNode, setShowAddNode] = useState(false);
  const [preFather, setPreFather] = useState(null);
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
      setPreFather(mindmapelements.find(el => el.id === item.fatherId));
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
  // function moveSubtreeWhilemouseupAtrightPattern(nodeId, finalX, finalY, elements) {
  //   //历遍方式:前序历遍
  //   const node = elements.find(el => el.id === nodeId);
  //   if (!node) return;

  //   const father = elements.find(el => el.id === node.fatherId);

  //   if (!father) {
  //     layoutSubtree(node, finalX, finalY, elements);
  //     // adjustLevels(elements, nodeId, finalY);
  //     return;
  //   }
  //   const siblings = father.childIds.map(cid => elements.find(el => el.id === cid)).filter(Boolean);
  //   const count = siblings.length;
  //   const totalHeight = siblings.reduce((sum, sib) => sum + sib.h, 0) + (count - 1) * 60 * scale;
  //   let startY = father.y * scale + offset.y - totalHeight / 2 + siblings[0].h / 2;

  //   siblings.forEach(sib => {
  //     const parentRight = father.x * scale + offset.x + father.w / 2;
  //     const sibNewX = (parentRight + 100 + sib.w / 2 - offset.x) / scale;
  //     const sibNewY = (startY - offset.y) / scale;

  //     layoutSubtree(sib, sibNewX, sibNewY, elements);

  //     startY += sib.h + 60 * scale;
  //   });

  //   // adjustLevels(elements, nodeId, finalY);
  // }

  // function layoutSubtree(node, finalX, finalY, elements) {
  //   node.x = finalX;
  //   node.y = finalY;

  //   if (!node.childIds || node.childIds.length === 0) return;

  //   const parentRight = finalX * scale + offset.x + node.w / 2;
  //   const children = node.childIds.map(cid => elements.find(el => el.id === cid)).filter(Boolean);
  //   const count = children.length;
  //   const totalHeight = children.reduce((sum, child) => sum + child.h, 0) + (count - 1) * 60 * scale;
  //   let startY = finalY * scale + offset.y - totalHeight / 2 + children[0].h / 2;

  //   children.forEach(child => {
  //     const childNewX = (parentRight + 100 + child.w / 2 - offset.x) / scale;
  //     const childNewY = (startY - offset.y) / scale;

  //     layoutSubtree(child, childNewX, childNewY, elements);

  //     startY += child.h + 60 * scale;
  //   });
  // }

  function adjustLevels(rootId, elements) {
    // 按层级遍历
    function orderbylevel(root) {
      if (!root) return [];
      const result = [];
      let queue = [root];
      while (queue.length > 0) {
        const level = [];
        const nextQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const current = queue[i];
          level.push(current);
          const children = current.childIds.map(cid => elements.find(el => el.id === cid)).filter(Boolean);
          nextQueue.push(...children);
        }
        result.push(level);
        queue = nextQueue;
      }
      return result;
    }

    const root = elements.find(el => el.id === rootId);
    if (!root) return;
    const levels = orderbylevel(root);
    const rootX = root.x;
    const rootY = root.y;

    // 层级间距和节点间距
    //==================
    const layerGap = 200;
    const nodeGap = 60;
    //==================
    for (let layer = 0; layer < levels.length; layer++) {
  if (levels[layer].length > 1) {
    // console.log('第', layer, '层：');
    const conflictrange = checkconflict(levels[layer]);
    const n = conflictrange.length;
    let adjusted = false; 

    if (n > 1) {
      // 上半部分，从中间往前调整
      for (let i = Math.floor(n / 2); i > 0; i--) {
        const start = conflictrange[i].start.y * scale + offset.y;
        const h1 = conflictrange[i].start.h;
        const end = conflictrange[i - 1].end.y * scale + offset.y;
        const h2 = conflictrange[i - 1].end.h;

        if (start - h1 / 2 - nodeGap <= end + h2 / 2) {
          const displacement = end + h2 / 2 - (start - h1 / 2) + nodeGap;
          for (let j = 0; j < i; j++) {
            conflictrange[j].displacement -= displacement; 
          }
        }
      }

      for (let i = Math.floor(n / 2); i < n - 1; i++) {
        const start = conflictrange[i + 1].start.y * scale + offset.y;
        const h1 = conflictrange[i + 1].start.h;
        const end = conflictrange[i].end.y * scale + offset.y;
        const h2 = conflictrange[i].end.h;

        if (end + h2 / 2 + nodeGap >= start - h1 / 2) {
          const displacement = end + h2 / 2 - (start - h1 / 2) + nodeGap;
          for (let j = i + 1; j < n; j++) {
            conflictrange[j].displacement += displacement;
          }
        }
      }

      // 应用调整
      conflictrange.forEach(obj => {
        if (obj.displacement !== 0) {
          const father = elements.find(el => el.id === obj.father);
          if (father) {
            father.y += obj.displacement / scale;
            adjusted = true;
          }
          obj.displacement = 0; 
        }
      });
    }

    if (adjusted && layer > 0) {
      layer = Math.max(layer - 2, -1); 
      continue;
    }
  }

  const level = levels[layer];
  level.forEach(node => {
    const children = node.childIds;
    if (children.length === 0) return;

    const totalHeight = children.reduce((sum, cid) => {
      const child = elements.find(el => el.id === cid);
      return sum + (child ? child.h : 0);
    }, 0) + (children.length - 1) * nodeGap;

    let startY =
      node.y * scale +
      offset.y -
      totalHeight / 2 +
      ((elements.find(el => el.id === children[0])?.h) || 0) / 2;

    const x =
      node.x * scale +
      offset.x +
      (node.w / 2 + 100 + ((elements.find(el => el.id === children[0])?.w) || 0) / 2);

    children.forEach(cid => {
      const child = elements.find(el => el.id === cid);
      if (child) {
        child.y = (startY - offset.y) / scale;
        child.x = (x - offset.x) / scale;
        startY += child.h + nodeGap;
      }
    });
  });
}

  }
  function checkconflict(nodes) {
    const n = nodes.length;
    let firstcome = new Set();
    let res = []; //{father:,start:,end:,displacement:}
    nodes.forEach(node => {
      if (!firstcome.has(node.fatherId)) {
        firstcome.add(node.fatherId);
        res.push({ father: node.fatherId, start: node, end: node, displacement: 0 });
      }
      else {
        const obj = res.find(r => r.father === node.fatherId);
        if (obj) {
          obj.end = node;
        }
      }
    });
    // console.log('res:', res);
    return res;
  }



  function findroot(nodeId) {
    const node = mindmapelements.find(el => el.id === nodeId);
    if (!node) return null;
    let current = node;
    while (current.fatherId) {
      const parent = mindmapelements.find(el => el.id === current.fatherId);
      if (!parent) break;
      current = parent;
    }
    return current;
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isNodeDragging) return;
      let svg = svgRef?.current || nodeRef.current?.ownerSVGElement;
      if (!svg) return;
      let mouseY = 0;
      let pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      let svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      mouseY = svgP.y;
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
        if ((el_x - el.w / 2 < x - item.w / 2 && el_x + el.w / 2 > x - item.w / 2) && (
          el_y - el.h / 2 < y - item.h / 2 && el_y + el.h / 2 > y - item.h / 2 ||
          el_y - el.h / 2 < y + item.h / 2 && el_y + el.h / 2 > y + item.h / 2
        ))
          return el
      });
      // console.log('鼠标',e.clientX,e.clientY);
      if (foundElement && foundElement.id !== item.id) {
        setHighlightId(foundElement.id);
        if (foundElement.childIds.length === 0)
          setHighlightpos('middle');
        else
          setHighlightpos(mouseY < (foundElement.y * scale + offset.y) ? 'top' : 'bottom');
      }
      else {
        setHighlightId(null);
        setHighlightpos(null);
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
        mindmapelements.find(el => el.id === item.id).layer = parent.layer + 1;
        // mindmapelements.find(el => el.id === item.id).x += 100 / scale;
        setMindmapelements([...mindmapelements]);
        const updatedElements = mindmapelements.map(el => ({ ...el }));
        // // console.log('preFather:', preFather);
        // if (preFather && preFather.layer < parent.layer) {
        //   const siblings = preFather.childIds.map(cid => updatedElements.find(el => el.id === cid)).filter(Boolean);
        //   const count = siblings.length;
        //   if (count > 0) {
        //     const finalX = preFather.x + ((preFather.w / 2 + 100 + siblings[0].w / 2)) / scale;
        //     moveSubtreeWhilemouseupAtrightPattern(siblings[0].id, finalX, preFather.y, updatedElements);
        //     setMindmapelements(updatedElements);
        //   }
        // }
        // const finalX = parent.x + ((parent.w / 2 + 100 + item.w / 2)) / scale;
        // moveSubtreeWhilemouseupAtrightPattern(item.id, finalX, parent.y, updatedElements);

        adjustLevels(findroot(item.id).id, updatedElements);
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
  //   console.log('highlightpos changed:', highlightpos);
  // },[highlightpos])
  // useEffect(() => {
  //   console.log('highlightId changed:', highlightId);
  //   console.log('Current mindmapelements:', mindmapelements);
  // }, [mindmapelements])
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
      {
        highlightId === item.id && highlightpos === 'top' &&
        <g>
          <path
            d={`
              M ${x} ${y - h / 2}
              C ${x + w / 2 - 36 * scale} ${y - h / 2 - 18 * scale},${x + w / 2 - 36 * scale} ${y - h / 2 - 18 * scale}, ${x + w / 2} ${y - h / 2 - 18 * scale}
            `}
            stroke="orange"
            strokeWidth={2 * scale}
            fill="none"
          />
          <rect
            x={x + w / 2}
            y={y - h / 2 - 22 * scale}
            width={18 * scale}
            height={8 * scale}
            rx={3 * scale}
            fill="orange"
            stroke="orange"
            strokeWidth={1 * scale}
          />
        </g>
      }
      {
        highlightId === item.id && highlightpos === 'middle' &&
        <g>
          <path
            d={`
              M ${x + w / 2} ${y}
              H ${x + w / 2 + 50 * scale}
            `}
            stroke="orange"
            strokeWidth={2 * scale}
            fill="none"
          />
          <rect
            x={x + w / 2 + 30 * scale}
            y={y - 4 * scale}
            width={18 * scale}
            height={8 * scale}
            rx={3 * scale}
            fill="orange"
            stroke="orange"
            strokeWidth={1 * scale}
          />
        </g>
      }
      {
        highlightId === item.id && highlightpos === 'bottom' &&
        <g>
          <path
            d={`
              M ${x} ${y + h / 2}
              C ${x + w / 2 - 36 * scale} ${y + h / 2 + 18 * scale},${x + w / 2 - 36 * scale} ${y + h / 2 + 18 * scale}, ${x + w / 2} ${y + h / 2 + 18 * scale}
            `}
            stroke="orange"
            strokeWidth={2 * scale}
            fill="none"
          />
          <rect
            x={x + w / 2}
            y={y + h / 2 + 14 * scale}
            width={18 * scale}
            height={8 * scale}
            rx={3 * scale}
            fill="orange"
            stroke="orange"
            strokeWidth={1 * scale}
          />
        </g>
      }
    </g>
  )
}