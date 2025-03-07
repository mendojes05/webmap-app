import { Handle, Position} from '@xyflow/react';
 
// const Bubble = ({ data }) => {
//   return (
//     <>
//       <NodeResizer minWidth={100} minHeight={30} />
//       <Handle type="target" position={Position.Left} />
//       <div style={{ padding: 10 }}>{data.label}</div>
//       <Handle type="source" position={Position.Right} />
//     </>
//   );
// };
 
// export default function Bubble({data}){
//   return (
//     <div style={{ padding: 10, border: "1px solid black", background: "white", borderRadius: "5px" }}>
//       <p>{data.label}</p>
//       <Handle type="source" position={Position.Top} />
//       <Handle type="source" position={Position.Right} />
//       <Handle type="source" position={Position.Bottom} />
//       <Handle type="source" position={Position.Left} />
//       <Handle type="target" position={Position.Top} />
//       <Handle type="target" position={Position.Right} />
//       <Handle type="target" position={Position.Bottom} />
//       <Handle type="target" position={Position.Left} />
//     </div>
//   );
// };
export default function Bubble({ data }) {
  return (
    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 5, background: "white" }}>
      <Handle type="target" position={Position.top} style={{ background: "red" }} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.top} style={{ background: "blue" }} />
    </div>
  );
}
