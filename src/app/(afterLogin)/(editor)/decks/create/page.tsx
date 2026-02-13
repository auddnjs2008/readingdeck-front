"use client";

import { useCallback, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeckCreateCanvas from "@/components/deck/create/deck-create-canvas";
import DeckCreateSidebar from "@/components/deck/create/deck-create-sidebar";
import { initialEdges, initialNodes, libraryItems } from "@/components/deck/create/mock-data";
import type { DeckFlowEdge, DeckFlowNode } from "@/components/deck/create/types";

export default function DeckCreatePage() {
  const [nodes, setNodes] = useState<DeckFlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<DeckFlowEdge[]>(initialEdges);
  const [flowInstance, setFlowInstance] = useState<
    ReactFlowInstance<DeckFlowNode, DeckFlowEdge> | null
  >(null);

  const onNodesChange = useCallback<OnNodesChange<DeckFlowNode>>((changes) => {
    setNodes((snapshot) => applyNodeChanges(changes, snapshot));
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange<DeckFlowEdge>>((changes) => {
    setEdges((snapshot) => applyEdgeChanges(changes, snapshot));
  }, []);

  const onConnect = useCallback<OnConnect>((connection) => {
    setEdges((snapshot) =>
      addEdge(
        {
          ...connection,
          type: "smoothstep",
          style: { stroke: "var(--primary)", strokeWidth: 2 },
        },
        snapshot
      )
    );
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] min-h-[680px] overflow-hidden bg-background">
      <div className="flex h-full">
        <DeckCreateCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          setFlowInstance={setFlowInstance}
          flowInstance={flowInstance}
        />
        <DeckCreateSidebar items={libraryItems} />
      </div>
    </div>
  );
}
