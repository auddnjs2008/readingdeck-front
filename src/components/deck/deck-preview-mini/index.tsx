import type { DeckPreview } from "@/service/deck/getDecks";

type PreviewProps = {
  preview: DeckPreview | null;
};

export function DeckPreviewMini({ preview }: PreviewProps) {
  if (!preview) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
    );
  }

  if (preview.kind === "list") {
    if (preview.items.length === 0) {
      return (
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
      );
    }

    const visibleItems = preview.items.slice(0, 3);

    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-15" />
        {visibleItems.map((item, index) => {
          const offset = index * 7;
          const top = 14 + index * 2;

          return (
            <div
              key={`list-preview-${index}`}
              className="absolute left-4 right-4 rounded-md border border-border/70 bg-card/90 p-2"
              style={{
                top: `${top}px`,
                transform: `translateX(${offset}px)`,
                zIndex: 10 - index,
              }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="rounded border border-border bg-background px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.t}
                </span>
              </div>
              <p className="line-clamp-1 text-[10px] font-medium text-foreground">
                {item.title}
              </p>
              {item.book ? (
                <p className="mt-0.5 line-clamp-1 text-[9px] text-muted-foreground">
                  {item.book}
                </p>
              ) : null}
            </div>
          );
        })}
        <div className="absolute bottom-2 right-3 text-[10px] font-semibold text-muted-foreground">
          {preview.itemCount} cards
        </div>
      </div>
    );
  }

  if (preview.nodes.length === 0 && preview.edges.length === 0) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
    );
  }

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="url(#deck-grid)"
        opacity="0.28"
      />
      <defs>
        <pattern
          id="deck-grid"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.45" fill="var(--color-muted-foreground)" />
        </pattern>
      </defs>
      {preview.edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1={edge.sx * 100}
          y1={edge.sy * 100}
          x2={edge.tx * 100}
          y2={edge.ty * 100}
          stroke="var(--color-muted-foreground)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}
      {preview.nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x * 100}
          cy={node.y * 100}
          r={node.t === "book" ? 2.2 : 2}
          fill={node.t === "book" ? "var(--color-primary)" : "var(--color-foreground)"}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}
