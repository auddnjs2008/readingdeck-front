"use client";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import { Minus, Plus, Scan } from "lucide-react";
import type { Dispatch, DragEventHandler, SetStateAction } from "react";
import { deckCreateNodeTypes } from "./node-types";
import type { DeckFlowEdge, DeckFlowNode } from "./types";

type Props = {
  nodes: DeckFlowNode[];
  edges: DeckFlowEdge[];
  onNodesChange: OnNodesChange<DeckFlowNode>;
  onEdgesChange: OnEdgesChange<DeckFlowEdge>;
  onConnect: OnConnect;
  onNodeClick: NodeMouseHandler<DeckFlowNode>;
  onCanvasDragOver: DragEventHandler<HTMLElement>;
  onCanvasDrop: DragEventHandler<HTMLElement>;
  setFlowInstance: Dispatch<
    SetStateAction<ReactFlowInstance<DeckFlowNode, DeckFlowEdge> | null>
  >;
  flowInstance: ReactFlowInstance<DeckFlowNode, DeckFlowEdge> | null;
};

export default function DeckCreateCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onCanvasDragOver,
  onCanvasDrop,
  setFlowInstance,
  flowInstance,
}: Props) {
  return (
    <section
      className="relative flex-1 overflow-hidden"
      onDragOver={onCanvasDragOver}
      onDrop={onCanvasDrop}
    >
      <ReactFlow<DeckFlowNode, DeckFlowEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={deckCreateNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onInit={setFlowInstance}
        fitView
        fitViewOptions={{ padding: 0.24 }}
        minZoom={0.5}
        maxZoom={1.8}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="var(--border)"
        />
      </ReactFlow>

      <div className="absolute bottom-5 left-5 z-10 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <button
          className="p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.zoomIn()}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.zoomOut()}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.fitView({ padding: 0.24 })}
          aria-label="Fit view"
        >
          <Scan className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
