"use client";

import { CheckCheck, Edit3, LibraryBig, Save, Undo2 } from "lucide-react";

export default function DeckCreateHeader() {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <LibraryBig className="h-5 w-5 text-primary" />
        <span className="text-base font-bold font-serif">제목 없는 덱</span>
        <button
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="제목 수정"
        >
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-full border border-border/70 bg-muted/30 p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          aria-label="실행 취소"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          className="rounded-full border border-border/70 bg-muted/30 p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          aria-label="저장"
        >
          <Save className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-primary/20">
          <CheckCheck className="h-4 w-4" />
          덱 생성
        </button>
      </div>
    </div>
  );
}

