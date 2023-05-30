import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  forwardRef,
} from 'react';
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
  useViewport,
} from 'reactflow';
import CustomNode from '../../Components/Flow/Node';
import ToolBar from '../../Components/Flow/ToolBar';
import StyleBar from '../../Components/Flow/StyleBar';
import NodeBar from '../../Components/Flow/NodeBar';
import { useParams } from '../../hooks/useParams';

import PageTab from '../../Components/PageTab/PageTab';
import { Navigate, useLocation } from 'react-router-dom';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import './Flow.scss';
import 'reactflow/dist/style.css';
import FlowWebSocket, { convert } from '../../hooks/flowConnection';
import { useNavigate } from 'react-router-dom';
import { usePageTab } from '../../hooks/usePageTab';
import Node from '../Node/Node';

const nodeTypes = {
  CustomNode,
};

const defaultNodeStyle = {
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'black',
  background: 'white',
  borderRadius: 10,
  height: 50,
  width: 150,
};

function Flow() {
  const rfInstance = useReactFlow();

  const xPos = useRef(50);
  const yPos = useRef(0);
  const nodeId = useRef(0);
  const edgeId = useRef(0);
  const subRef = useRef(null);
  const miniRef = useRef();

  const [bgVariant, setBgVariant] = useState('line');
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [title, setTitle] = useState('');
  const [isStyleBarOpen, setIsStyleBarOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(window.innerWidth * 0.4);
  const [editorId, setEditorId] = useState(null);
  const { flowWebSocket, renewFlowWebSocket, renameTab } = usePageTab();
  const [isNodeBarOpen, setIsNodeBarOpen] = useState(false);
  const [dragNode, setDragNode] = useState({});
  const [changeLabelId, setChangeLabelId] = useState({ id: null, label: null });
  const [changeStyleId, setChangeStyleId] = useState(null);
  const [changeStyleContent, setChangeStyleContent] = useState(null);
  const [nodeIsEditing, setNodeIsEditing] = useState(null);
  const { nodeMenuOpen, setNodeMenuOpen } = useParams();

  // for node remove
  const [lastSelectedNode, setLastSelectedNode] = useState(null);
  const [lastSelectedEdge, setLastSelectedEdge] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const { user } = useApp();
  const flowId = searchParams.get('id');

  const navigateTo = useNavigate();
  const deleteComponent = (event) => {
    if (event.key === 'Backspace') {
      const id = lastSelectedNode ? lastSelectedNode : lastSelectedEdge;
      const type = lastSelectedNode ? 'node' : 'edge';

      const param = [
        {
          type: 'remove',
          id: id,
        },
      ];

      flowWebSocket.editComponent(param, type);
      if (type == 'node') {
        setNodes(nodes.filter((nds) => nds.id !== id));
        onNodesChange(param);
        setLastSelectedNode(null);
      } else {
        setEdges(edges.filter((edg) => edg.id !== id));
        onEdgesChange(param);
        setLastSelectedEdge(null);
      }
    }
  };

  const openNodeContextMenu = () => {
    setNodeMenuOpen(lastSelectedNode);
  };

  const onLabelChange = (id, event) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id == id) {
          node.data = {
            ...node.data,
            label: event.target.value,
          };
        }
        return node;
      }),
    );
  };

  const openStyleBar = (id) => {
    setIsStyleBarOpen(true);
    setChangeStyleId(id);
  };

  const handleStyleBarClose = () => {
    setIsStyleBarOpen(false);
    setChangeStyleId(null);
    setChangeStyleContent(null);
  };

  const nodeChangeStyle = (id, event, type) => {
    // setChangeStyleId(id);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id == id) {
          switch (type) {
            case 'background':
              node.style = {
                ...node.style,
                background: event.target.value,
              };
              setChangeStyleContent(node.style);
              break;
            case 'color':
              node.style = {
                ...node.style,
                borderColor: event.target.value,
              };
              setChangeStyleContent(node.style);
              break;
            case 'stroke':
              node.style = {
                ...node.style,
                borderWidth: event.target.value,
              };
              setChangeStyleContent(node.style);
              break;
          }
        }
        return node;
      }),
    );
  };
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (typeof type === 'undefined' || !type) {
      return;
    }
    // ? 要從 event.clientX cast 到 react flow 的 x, y
    const position = {
      x: event.clientX,
      y: event.clientY,
    };
    // console.log('dragged:', dragNode);
    const editorId = dragNode.id;
    instance
      .post('/nodes/new-node')
      .then((res) => {
        const newNode = {
          id: nodeId.current.toString(),
          data: {
            label: dragNode.name,
            toolbarPosition: Position.Right,
            openStyleBar: (id) => {
              openStyleBar(id);
            },
            onLabelChange: (id, event) => {
              onLabelChange(id, event);
            },
            editLabel: (id, label) => {
              setChangeLabelId({ id, label });
            },
            onLabelEdit: (id) => {
              setNodeIsEditing(id);
            },
            onLabelStopEdit: () => {
              setNodeIsEditing(null);
            },
          },

          type: 'CustomNode',
          position,
          style: defaultNodeStyle,
          class: 'Node',
          editorId: editorId,
        };

        setNodes((nds) => {
          nds.concat(newNode);
        });

        // webSocket
        flowWebSocket.addComponent(newNode, 'node');
        setDragNode({});
        // nodeId.current++;
      })
      .catch((e) => console.log(e));
  });

  const onResize = (event, { element, size, handle }) => {
    setNodeWidth(size.width);
  };

  const rerenderNodes = (nodes) => {
    nodes.map((node) => {
      node.data = {
        ...node.data,
        openStyleBar: (id) => {
          openStyleBar(id);
        },
        onLabelChange: (id, event) => {
          onLabelChange(id, event);
        },
        editLabel: (id, label) => {
          setChangeLabelId({ id, label });
        },
        onLabelEdit: (id) => {
          setNodeIsEditing(id);
        },
        onLabelStopEdit: () => {
          setNodeIsEditing(null);
        },
      };
      return node;
    });
    setNodes(nodes);
  };

  const trackerCallback = useCallback(
    async (tracker, record) => {
      // [1234-gmail_com: {email: ..., name: ..., x: ..., y: ...}]
      // 創一個 child element
      if (!subRef.current) return;

      Object.keys(tracker).forEach((email, index) => {
        if (!(email in record)) {
          record[email] = true;
          FlowWebSocket.createInstance(email, 'sub-flow').then((instance) => {
            const oldInstance = document.getElementById(`sub-flow-${email}`);
            // if (oldInstance) {
            //   subRef.current.removeChild(oldInstance);
            // }
            instance.onclick = (e) => {
              const { xPort, yPort } = tracker[email];
              console.log('teleport to ', -xPort, -yPort);
              console.log('rf instance:', rfInstance);
              rfInstance.setViewport({ x: -xPort, y: -yPort, zoom: 1 });
            };
            subRef.current.appendChild(instance);
          });
        } else {
          // 有沒有在閒置
          const instance = document.querySelector(`#sub-flow-${email}`);
          if (instance) {
            if (Date.now() - tracker[email].lastUpdate >= 5000) {
              instance.style.opacity = 0.75;
            } else {
              instance.style.opacity = 1;
            }
          }
        }
      });
    },
    [subRef, rfInstance],
  );

  // useEffect(() => {
  //   if (!rfInstance) return;
  // }, [rfInstance]);

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
        } else {
          rerender(data);
        }
      },
      trackerCallback,
      (title) => {
        renameTab(flowId, title);
      },
    );
    renewFlowWebSocket(flowConnection);

    return () => {
      flowConnection.close();
    };
  }, [flowId, user]);

  useEffect(() => {
    if (lastSelectedNode != nodeIsEditing) {
      document.addEventListener('keydown', deleteComponent);
      return () => document.removeEventListener('keydown', deleteComponent);
    }
  }, [lastSelectedNode, lastSelectedEdge, nodeIsEditing]);

  const rerender = (data) => {
    // setNodes(data.nodes);
    rerenderNodes(data.nodes);
    setEdges(data.edges);
    setTitle(data.name);
    const node_ids = new Array(data.nodes.length);
    data.nodes.forEach((element, index) => {
      node_ids[index] = Number(element.id);
    });

    const edge_ids = new Array(data.edges.length);
    data.edges.forEach((element, index) => {
      edge_ids[index] = Number(element.id);
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

  // const onNodesDelete = useCallback(
  //   (deleted) => {
  //     setEdges(
  //       deleted.reduce((acc, node) => {
  //         const incomers = getIncomers(node, nodes, edges);
  //         const outgoers = getOutgoers(node, nodes, edges);
  //         const connectedEdges = getConnectedEdges([node], edges);
  //         const remainingEdges = acc.filter(
  //           (edge) => !connectedEdges.includes(edge),
  //         );
  //         const createdEdges = incomers.flatMap(({ id: source }) =>
  //           outgoers.map(({ id: target }) => ({
  //             id: `${source}->${target}`,
  //             source,
  //             target,
  //           })),
  //         );
  //         return [...remainingEdges, ...createdEdges];
  //       }, edges),
  //     );
  //   },
  //   [nodes, edges],
  // );

  const onAdd = useCallback(() => {
    yPos.current += 50;
    if (yPos.current > 400) {
      yPos.current = 50;
      xPos.current += 150;
    }
    instance
      .post('/nodes/new-node')
      .then((res) => {
        const editorId = res.data;
        const newNode = {
          id: nodeId.current.toString(),
          data: {
            label: 'Untitle',
            toolbarPosition: Position.Right,
            openStyleBar: (id) => {
              openStyleBar(id);
            },
            onLabelChange: (id, event) => {
              onLabelChange(id, event);
            },
            editLabel: (id, label) => {
              setChangeLabelId({ id, label });
            },
            onLabelEdit: (id) => {
              setNodeIsEditing(id);
            },
            onLabelStopEdit: () => {
              setNodeIsEditing(null);
            },
          },
          type: 'CustomNode',
          position: { x: xPos.current, y: yPos.current },
          style: defaultNodeStyle,
          class: 'Node',
          editorId: editorId,
        };
        // webSocket
        flowWebSocket.addComponent(newNode, 'node');
        // nodeId.current++;
      })
      .catch((e) => console.log(e));
  }, [setNodes, flowWebSocket]);

  const handleNodeBarOpen = () => {
    setIsNodeBarOpen(true);
  };
  const handleNodeBarClose = () => {
    setIsNodeBarOpen(false);
  };

  const backToHome = () => {
    setBack(true);
  };

  let { x, y, zoom } = useViewport();

  const onNodeDoubleClick = useCallback((event, node) => {
    //open editor by nodeID
    zoom = 2;
    setEditorId(node.editorId);
    // setLastSelectedNode(node.id);
    setNodeIsEditing(node.id);
    setLastSelectedEdge(null);
    setIsEdit(true);
  });

  const onNodeClick = useCallback((event, node) => {
    setLastSelectedNode(node.id);
  });

  const onPaneClick = useCallback((event, node) => {
    setLastSelectedNode(null);
    setNodeMenuOpen(null);
  });

  const canvasRef = useRef();

  useEffect(() => {
    if (flowWebSocket && flowWebSocket.self) {
      flowWebSocket.updateInfo({
        xPort: -x,
        yPort: -y,
        zoom: zoom,
      });
      Object.keys(flowWebSocket.mouseTracker).forEach((email) => {
        if (email !== convert(user.email)) {
          // 停滯不動的其他人，也需要刷新他們的位置
          console.log('刷新', email);
          flowWebSocket.receiveLocation(email);
        }
      });
    }
  }, [x, y, flowWebSocket]);

  useEffect(() => {
    if (changeLabelId.id && flowWebSocket) {
      const param = [
        {
          id: changeLabelId.id,
          type: 'title',
          label: changeLabelId.label,
        },
      ];
      flowWebSocket.editComponent(param, 'node');
    }
  }, [changeLabelId, flowWebSocket]);

  useEffect(() => {
    if (changeStyleContent && flowWebSocket) {
      const param = [
        {
          id: changeStyleId,
          type: 'style',
          style: changeStyleContent,
        },
      ];
      flowWebSocket.editComponent(param, 'node');
    }
  }, [changeStyleContent, flowWebSocket]);

  useEffect(() => {
    if (isEdit) {
      setIsNodeBarOpen(false);
    }
  }, [isEdit]);

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
          fitView={true}
          nodes={nodes}
          edges={edges}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={(event) => onPaneClick(event)}
          onNodesChange={(param) => {
            onNodesChange(param);
            setLastSelectedEdge(null);
            // setLastSelectedNode(param[0].id);
            flowWebSocket.editComponent(param, 'node');
          }}
          onEdgesChange={(param) => {
            setLastSelectedNode(null);
            setLastSelectedEdge(param[0].id);
            onEdgesChange(param);
            flowWebSocket.editComponent(param, 'edge');
          }}
          onEdgeUpdate={(param) => {
            onEdgeUpdate(param);
          }}
          onConnect={(param) => {
            onConnect(param);
            flowWebSocket.addComponent(
              { ...param, id: edgeId.current.toString() },
              'edge',
            );
          }}
          snapToGrid={true}
          onNodeDoubleClick={(event, node) => {
            onNodeDoubleClick(event, node);
          }}
          onNodeClick={(event, node) => {
            onNodeClick(event, node);
          }}
          nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
        >
          {isStyleBarOpen ? (
            <StyleBar
              handleStyleBarClose={handleStyleBarClose}
              nodes={nodes}
              nodeId={changeStyleId}
              nodeChangeStyle={(id, event, type) =>
                nodeChangeStyle(id, event, type)
              }
            />
          ) : null}
          {isNodeBarOpen && !isEdit ? (
            <NodeBar
              handleNodeBarClose={handleNodeBarClose}
              setDragNode={setDragNode}
            />
          ) : null}
          <ToolBar
            setTitle={setTitle}
            title={title}
            addNode={onAdd}
            backToHome={backToHome}
            handleNodeBarOpen={handleNodeBarOpen}
            changeBackground={(bgStyle) => {
              setBgVariant(bgStyle);
            }}
            isNodeSelected={lastSelectedNode}
            flowWebSocket={flowWebSocket}
            openNodeContextMenu={openNodeContextMenu}
            flowId={flowId}
            subRef={subRef}
            isEdit={isEdit}
          />
          {/* {isStyleBarOpen ? <StyleBar isOpen={isStyleBarOpen} /> : null} */}
          <MiniMap ref={miniRef} nodeStrokeWidth={10} zoomable pannable />
          <Controls />
          <Background color="#ccc" variant={bgVariant} />
        </ReactFlow>
      ) : (
        <Navigate to="/home" />
      )}
      {isEdit && (
        // <div className="EditorContainer">
        <Resizable
          // className="box"
          height={Infinity}
          width={nodeWidth}
          // width="400px"
          onResize={onResize}
          resizeHandles={['w']}
          minConstraints={[window.innerWidth * 0.37, Infinity]}
          maxConstraints={[window.innerWidth * 0.7, Infinity]}
        >
          <div
          // style={{ width: `${nodeWidth}px` }}
          >
            <Node
              nodeId={editorId}
              setNodeIsEditing={setNodeIsEditing}
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
