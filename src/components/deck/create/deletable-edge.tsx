"use client";

import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { X } from "lucide-react";

type DeletableEdgeData = {
  onDeleteEdge?: (edgeId: string) => void;
};

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeData = (data ?? {}) as DeletableEdgeData;
  const active = selected || hovered;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: active ? 3 : (style?.strokeWidth as number | undefined) ?? 2,
          opacity: active ? 1 : 0.9,
        }}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        className="cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {active ? (
        <EdgeLabelRenderer>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              edgeData.onDeleteEdge?.(id);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="pointer-events-auto absolute rounded-full border border-border bg-card p-1 text-muted-foreground shadow-md transition-colors hover:bg-destructive hover:text-destructive-foreground"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            aria-label="Delete edge"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
