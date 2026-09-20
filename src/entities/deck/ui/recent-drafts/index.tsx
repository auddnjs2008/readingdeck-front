"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDeckHref } from "@/entities/deck/api/getDeckHref";
import { useDecksQuery } from "@/entities/deck/model/queries/useDecksQuery";
import { Button } from "@/shared/ui/button";

export default function RecentDrafts() {
  const drafts = useDecksQuery({ query: { status: "draft", sort: "latest", take: 3 } });

  return (
    <section className="min-w-0">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold leading-tight">작성 중인 덱</h2>
          <p className="mt-1 text-sm text-muted-foreground">정리하던 생각을 이어서 연결하세요.</p>
        </div>
        <Link href="/decks" className="shrink-0 py-1 text-sm font-medium text-primary underline-offset-4 hover:underline">전체 보기</Link>
      </div>
      <div>
        {drafts.isPending && <p role="status" className="py-6 text-sm text-muted-foreground">덱을 불러오는 중…</p>}
        {drafts.isError && <div className="space-y-3 py-6"><p className="text-sm text-muted-foreground">작성 중인 덱을 불러오지 못했어요.</p><Button variant="outline" onClick={() => void drafts.refetch()}>다시 불러오기</Button></div>}
        {drafts.data?.items.map(deck => (
          <Link key={deck.id} href={getDeckHref(deck)} className="group flex items-center justify-between gap-4 border-b border-border/60 px-4 py-5 transition-colors hover:bg-muted/40">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{deck.mode === "graph" ? "그래프 덱" : "리스트 덱"} · 초안</p>
              <h3 className="mt-2 break-words font-medium">{deck.name}</h3>
            </div>
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        ))}
        {drafts.data?.items.length === 0 && <div className="space-y-4 py-8"><p className="text-sm text-muted-foreground">작성 중인 덱이 없어요. 남긴 카드를 하나의 덱으로 묶어보세요.</p><Button as={Link} href="/decks/create" variant="outline">덱 만들기</Button></div>}
      </div>
    </section>
  );
}
