import type { ReadView } from "@/entities/community/lib/community-post-reader";

type CommunityPostViewTabsProps = {
  activeView: ReadView;
  onViewChange: (view: ReadView) => void;
};

export function CommunityPostViewTabs({
  activeView,
  onViewChange,
}: CommunityPostViewTabsProps) {
  return (
    <div className="border-b border-border/70 px-6 py-4 md:px-8">
      <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => onViewChange("graph")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeView === "graph"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          그래프 읽기
        </button>
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeView === "list"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          카드 목록
        </button>
      </div>
    </div>
  );
}
