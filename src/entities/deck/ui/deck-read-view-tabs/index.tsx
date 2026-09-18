import type { ReadView } from "@/entities/deck/lib/deck-read-viewer";

type DeckReadViewTabsProps = {
  activeView: ReadView;
  onViewChange: (view: ReadView) => void;
};

export function DeckReadViewTabs({
  activeView,
  onViewChange,
}: DeckReadViewTabsProps) {
  return (
    <div className="border-b border-border/70">
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => onViewChange("graph")}
          aria-pressed={activeView === "graph"}
          className={`border-b-2 py-4 text-sm font-medium transition-colors ${
            activeView === "graph"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          그래프로 보기
        </button>
        <button
          type="button"
          onClick={() => onViewChange("list")}
          aria-pressed={activeView === "list"}
          className={`border-b-2 py-4 text-sm font-medium transition-colors ${
            activeView === "list"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          목록으로 읽기
        </button>
      </div>
    </div>
  );
}
