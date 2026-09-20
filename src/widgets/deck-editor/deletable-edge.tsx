import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex items-center gap-2"
        >
          {label && <span className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground">{label}</span>}
          <button
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground border border-border"
            onClick={(event) => {
              event.stopPropagation();
              onEdgeClick();
            }}
            aria-label="연결선 삭제"
            title="연결선 삭제"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
