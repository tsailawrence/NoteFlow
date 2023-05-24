import ReactFlow, { MiniMap } from "reactflow";
import "./FlowEditor.scss";
import { useFlowStorage } from "../../storage/Storage";


export default function MiniFlow ({flow}){
  // const flow = useFlowStorage((state) => state.flows);
  // console.log(flow)
  return (
    <div style={{ backgroundColor:'black', width: 500, height:200 }}>
      <ReactFlow
        defaultNodes={flow.nodes}
        defaultEdges={flow.edges}
      >
        <MiniMap  nodeStrokeWidth={3}/>
      </ReactFlow>
    </div>
  );
};


