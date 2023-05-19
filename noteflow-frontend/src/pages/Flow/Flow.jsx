import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Position,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  useViewport,
  isEdge,
} from 'reactflow';
import CustomNode from '../../Components/Flow/Node';
import ToolBar from '../../Components/Flow/ToolBar';
import StyleBar from '../../Components/Flow/StyleBar';
import PageTab from '../../Components/PageTab/PageTab';
import { Navigate, useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import './Flow.scss';
import 'reactflow/dist/style.css';
import FlowWebSocket from '../../hooks/flowConnection';
import { useNavigate } from 'react-router-dom';
import { usePageTab } from '../../hooks/usePageTab';
import Node from '../Node/Node';

const nodeTypes = {
  CustomNode,
};

// const edgeTypes = {
//   CustomEdge,
// };

const defaultNodeStyle = {
  border: '2px solid',
  background: 'white',
  borderRadius: 10,
  height: 50,
  width: 150,
};

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function Flow() {
  const rfInstance = useReactFlow();
  const xPos = useRef(50);
  const yPos = useRef(0);
  const nodeId = useRef(0);
  const edgeId = useRef(0);
  const subRef = useRef(null);

  const [bgVariant, setBgVariant] = useState('line');
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [title, setTitle] = useState('');
  const [isStyleBarOpen, setIsStyleBarOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flowWebSocket, setFlowWebSocket] = useState(null);
  const [nodeWidth, setNodeWidth] = useState(700);
  const [editorId, setEditorId] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const { user } = useApp();
  const flowId = searchParams.get('id');

  const { addTab } = usePageTab();

  const navigateTo = useNavigate();

  const onResize = (event, { element, size, handle }) => {
    setNodeWidth(size.width);
    console.log(size.width);
  };

  const trackerCallback = useCallback(
    (tracker) => {
      // [1234-gmail_com: {email: ..., name: ..., x: ..., y: ...}]
      // 創一個 child element
      Object.keys(tracker).forEach((email, index) => {
        let instance = document.querySelector(`#sub-flow-${email}`);
        if (!instance) {
          instance = FlowWebSocket.createInstance(email, 'sub-flow');
          subRef.current.appendChild(instance);
        } else {
          // 有沒有在閒置
          if (tracker[email].lastUpdate - Date.now() >= 60000) {
            instance.style.opacity = 0.5;
          } else {
            instance.style.opacity = 1;
          }
        }
      });
    },
    [subRef],
  );

  useEffect(() => {
    if (!flowId) {
      navigateTo('/home');
    }
    if (!user) return;

    const flowConnection = new FlowWebSocket(
      flowId,
      user.email,
      (data) => {
        if (data.error) {
          navigateTo('/error');
          navigateTo('/home');
        } else rerender(data);
      },
      trackerCallback,
    );
    setFlowWebSocket(flowConnection);

    return () => {
      flowConnection.close();
    };
  }, [flowId, user]);
  //
  const rerender = (data) => {
    setNodes(data.nodes);
    setEdges(data.edges);
    setTitle(data.name);
    const node_ids = new Array(data.nodes.length);
    Object.keys(data.nodes).forEach((element, index) => {
      node_ids[index] = Number(element);
    });
    const edge_ids = new Array(data.edges.length);
    Object.keys(data.edges).forEach((element, index) => {
      edge_ids[index] = Number(element);
    });
    nodeId.current = data.nodes.length === 0 ? 0 : Math.max(...node_ids) + 1;
    edgeId.current = data.edges.length === 0 ? 0 : Math.max(...edge_ids) + 1;
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);
          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );
          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );
          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  const onAdd = useCallback(() => {
    yPos.current += 50;
    if (yPos.current > 400) {
      yPos.current = 50;
      xPos.current += 150;
    }
    instance
      .post('/nodes/new-node')
      .then((res) => {
        const editorId = res.data.nodeId;
        const newNode = {
          id: nodeId.current.toString(),
          data: { label: 'Untitle', toolbarPosition: Position.Top },
          type: 'CustomNode',
          position: { x: xPos.current, y: yPos.current },
          style: defaultNodeStyle,
          class: 'Node',
          editorId: editorId,
        };
        // webSocket
        flowWebSocket.addComponent(newNode, 'node');
      })
      .catch((e) => console.log(e));
  }, [setNodes, flowWebSocket]);

  const changeStyle = () => {
    setIsStyleBarOpen(true);
  };

  const onSave = (title) => {
    flowWebSocket.editFlowTitle(title);
    setBack(true);
  };

  const [restart, setRestart] = useState(false);

  const onNodeDoubleClick = useCallback((event, node) => {
    //open editor by nodeID
    setEditorId(node.editorId);
    setIsEdit(true);
    addTab({
      type: 'node',
      objectId: node.editorId,
      name: node.data.label ? node.data.label : ':)',
    });
  });

  const canvasRef = useRef();
  const { x, y, zoom } = useViewport();

  useEffect(() => {
    console.log('x: ', x);
    console.log('y:', y);

    if (flowWebSocket && flowWebSocket.self) {
      flowWebSocket.updateInfo({
        xPort: -x,
        yPort: -y,
        zoom: zoom,
      });
    }
  }, [x, y, flowWebSocket]);

  const handleMouseMove = (e) => {
    if (isEdit || !flowWebSocket) return;
    const { clientX, clientY } = e;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const canvasX = clientX - canvasRect.left;
    const canvasY = clientY - canvasRect.top;

    flowWebSocket.updateInfo({
      x: canvasX,
      y: canvasY,
      left: canvasRect.left,
      top: canvasRect.top,
      width: canvasRect.width,
      height: canvasRect.height,
    });

    // 這個時候就要嘗試送資料出去給大家了
    /*
      我送的資料包括
      { x: canvasX, y: canvasY, xPort: x, yPort:y, zoom: zoom }
      我在 render 游標的時候, 我會先看一下自己的可視範圍到哪裡。
      可視範圍：
      x 的範圍：[xPort, (xPort + width) / zoom]
      y 的範圍：[yPort, (yPort + height) / zoom]

      對方點點：(xPort + (x / zoom), yPort + (y / zoom)) 如果介在我的可視範圍裡面的話
      我就：`
      1. 如果直接透過瀏覽器 render：render 一個紫色箭頭在 clientX, client Y 的地方
      2. 如果透過 React flow render：render 一個紫色箭頭在 canvasRect.left + xPort + (x/zoom), canvasRect.top + yPort + (y/zoom) 的地方
    */
    // 目前只考慮“只有滑鼠移動”，並沒有考慮拖動整個 flow 的情況，
    // 因為這並不會觸發 handleMouseMove

    flowWebSocket.sendLocation({
      x: canvasX / zoom,
      y: canvasY / zoom,
      xPort: -x / zoom,
      yPort: -y / zoom,
      // zoom: zoom,
    });
  };

  return (
    <div
      className="FlowEditPanel"
      onMouseMove={handleMouseMove}
      ref={canvasRef}
    >
      {!back ? (
        <ReactFlow
          className="NodePanel"
          nodes={nodes}
          edges={edges}
          onNodesChange={(param) => {
            onNodesChange(param);
            flowWebSocket.editComponent(param, 'node');
          }}
          onEdgesChange={(param) => {
            onEdgesChange(param);
            flowWebSocket.editComponent(param, 'edge');
          }}
          onEdgeUpdate={(param) => {
            onEdgeUpdate(param);
            console.log('2');
          }}
          onConnect={(param) => {
            onConnect(param);
            flowWebSocket.addComponent(
              { ...param, id: edgeId.current.toString() },
              'edge',
            );
            console.log(param);
          }}
          // onInit={setRfInstance}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
        >
          <ToolBar
            setTitle={setTitle}
            title={title}
            addNode={onAdd}
            onSave={onSave}
            changeBackground={(bgStyle) => {
              setBgVariant(bgStyle);
            }}
            flowWebSocket={flowWebSocket}
            flowId={flowId}
            subRef={subRef}
            isEdit={isEdit}
          />
          {isStyleBarOpen ? <StyleBar isOpen={isStyleBarOpen} /> : null}
          <MiniMap nodeStrokeWidth={10} zoomable pannable />
          <Controls />
          <Background color="#ccc" variant={bgVariant} />
        </ReactFlow>
      ) : (
        <Navigate to="/home" />
      )}
      {isEdit && (
        // <div className="EditorContainer">
        <Resizable
          className="box"
          height={Infinity}
          width={nodeWidth}
          onResize={onResize}
          resizeHandles={['w']}
          minConstraints={[400, Infinity]}
          maxConstraints={[window.innerWidth * 0.7, Infinity]}
        >
          <div style={{ width: `${nodeWidth}px` }}>
            <Node
              nodeId={editorId}
              setIsEdit={setIsEdit}
              nodeWidth={nodeWidth}
            />
          </div>
        </Resizable>
      )}
    </div>
  );
}

function FlowWithProvider(...props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const flowId = searchParams.get('id');

  return (
    <div className="Flow-container">
      <PageTab />
      <ReactFlowProvider>
        <Flow flowId={flowId} />
      </ReactFlowProvider>
    </div>
  );
}

export default FlowWithProvider;
