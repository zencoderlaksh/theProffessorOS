import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

const RelationshipEngine = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ai/graph');
        setNodes(response.data.nodes);
        setEdges(response.data.edges);
      } catch (error) {
        console.error('Error fetching graph', error);
      }
    };
    fetchGraph();
  }, []);

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-white mb-6">AI Relationship Engine</h1>
      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default RelationshipEngine;
