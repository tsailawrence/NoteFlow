import { memo, useState } from 'react';
import { Handle, Position, NodeToolbar, NodeResizer } from 'reactflow';
import Button from "react-bootstrap/Button";
import "./FlowEditor.scss";

const CustomNode = ({ id, data }) => {
  const [isVisible, setVisible] = useState(false);
  const [resizable, setResizable] = useState(false);

  const onContextMenu = (event) => {
    event.preventDefault();
    setVisible(true);
  }  

  return (
    <div onContextMenu={onContextMenu}>
      <NodeResizer minHeight={50} minWidth={150} handleStyle={{padding:'3px'}} lineStyle={{border:'1px solid', borderColor:"#1e88e5"}} isVisible={resizable} />
        <NodeToolbar isVisible={isVisible} position={data.toolbarPosition}>
          <Button className="btn btn-secondary contextMenuButton" onClick = {()=>setResizable(!resizable)}>{resizable?"Complete":"Resize"}</Button>
          <Button className="btn btn-secondary contextMenuButton" onClick={()=>{}}>Style</Button>
          <Button className="btn btn-secondary contextMenuButton" onClick={()=>{setVisible(false); data.copyNode(id)}}>Copy</Button>
          <Button className="btn btn-primary contextMenuButton" onClick = {()=>{setVisible(false); setResizable(false)}}>Close</Button>
        </NodeToolbar>
        <div style={{ padding: '10px 20px' }}>{data.label}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(CustomNode);

