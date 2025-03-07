import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TextUpdaterNode from "./TextUpdaterNode";
import Bubble from "./Bubble";

const nodeTypes = { textUpdater: TextUpdaterNode, bubble: Bubble };

const initialNodes = [];

const initialEdges = [];

export default function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState(3);
  const [nodeName, setNodeName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [newInfo, setNewInfo] = useState("");

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, eds));

    // Increase size of connected node
    setNodes((nds) =>
      nds.map((node) =>
        node.id === params.target
          ? {
              ...node,
              data: { ...node.data, size: node.data.size + 10 },
              style: { width: node.data.size + 70, height: node.data.size + 10 },
            }
          : node
      )
    );
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const getIncomingConnections = (nodeId) => {
    return edges.filter((edge) => edge.target === nodeId).length;
  };
  
  const exportGraph = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = "graph.json";
    downloadAnchor.click();
  };

  const importGraph = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { nodes, edges } = JSON.parse(e.target.result);
      setNodes(nodes);
      setEdges(edges);
    };
    fileReader.readAsText(event.target.files[0]);
  };


  // Function to add a new node
  const addNode = () => {
    if (!nodeName.trim()) return;

    const newNode = {
      id: `${nodeCount}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: nodeName, info: [], size: 40 },
      style: { width: 100, height: 40 },
      // type: 'bubble'
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCount((count) => count + 1);
    setNodeName("");
  };

  // Function to handle node selection
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  // Function to add info to selected node
  const addInfoToNode = () => {
    if (!newInfo.trim() || !selectedNode) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, info: [...node.data.info, newInfo] } }
          : node
      )
    );

    setNewInfo(""); // Clear input field
  };

  // Function to delete a specific info entry
  const deleteInfoItem = (index) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, info: node.data.info.filter((_, i) => i !== index) } }
          : node
      )
    );
  };

  // Function to delete a node
  const deleteNode = () => {
    
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
  };

  // Function to delete an edge
  const onEdgeClick = (event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === edge.target
          ? {
              ...node,
              data: { ...node.data, size: node.data.size - 10 },
              style: { width: (node.style.width || 100) - 10, height: (node.style.height || 40) - 10 },
            }
          : node
      )
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Input for adding nodes */}
      <div style={{ position: "absolute", zIndex: 10, top: 10, left: 10, display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Enter author name"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <button
          onClick={addNode}
          style={{ padding: "5px 10px", background: "blue", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}
        >
          Add Author
        </button>
        <button onClick={exportGraph}>Save</button>
        <input type="file" onChange={importGraph} />
      </div>

      {/* Info panel */}
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 10,
            right: 10,
            padding: "10px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "250px",
          }}
        >
          <h3>Author Info</h3>
          <p><strong>Name:</strong> {selectedNode.data.label}</p>
          <p><strong>Times Referenced:</strong> {getIncomingConnections(selectedNode.id)}</p>

          {/* Editable List */}
          <h4>Works:</h4>
          <ul>
            {selectedNode.data.info.map((item, index) => (
              <li key={index}>
                {item}{" "}
                <button onClick={() => deleteInfoItem(index)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
                  ✖
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Add works"
            value={newInfo}
            onChange={(e) => setNewInfo(e.target.value)}
            style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
          />
          <button onClick={addInfoToNode} style={{ width: "100%", padding: "5px", marginBottom: "5px" }}>
            Add Info
          </button>

          {/* Delete Node Button */}
          <button onClick={deleteNode} style={{ width: "100%", padding: "5px", background: "red", color: "white" }}>
            Delete Author
          </button>

          <button onClick={() => setSelectedNode(null)} style={{ width: "100%", padding: "5px", marginTop: "5px" }}>
            Close
          </button>
        </div>
      )}

      {/* React Flow Component */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        {/* <Background variant="dots" gap={12} size={1} /> */}
      </ReactFlow>
    </div>
  );
}

export function CustomNode({ data }) {
  return (
    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 5, background: "white" }}>
      <Handle type="target" position="top" style={{ background: "red" }} />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" style={{ background: "blue" }} />
    </div>
  );
}
