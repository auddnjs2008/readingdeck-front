"use client";

import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  type IsValidConnection,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowProps,
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
  isValidConnection: IsValidConnection<DeckFlowEdge>;
  onNodeClick: NodeMouseHandler<DeckFlowNode>;
  onNodeDragStart: NonNullable<
    ReactFlowProps<DeckFlowNode, DeckFlowEdge>["onNodeDragStart"]
  >;
  onNodeDragStop: NonNullable<
    ReactFlowProps<DeckFlowNode, DeckFlowEdge>["onNodeDragStop"]
  >;
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
  isValidConnection,
  onNodeClick,
  onNodeDragStart,
  onNodeDragStop,
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
        isValidConnection={isValidConnection}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onInit={setFlowInstance}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.35}
        maxZoom={2.2}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="var(--border)"
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          className="bg-card border border-border rounded-md"
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
          onClick={() => flowInstance?.fitView({ padding: 0.2 })}
          aria-label="Fit view"
        >
          <Scan className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
