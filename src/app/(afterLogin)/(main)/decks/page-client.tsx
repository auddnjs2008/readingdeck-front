"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { ActiveDraftsSection } from "@/widgets/deck-list/active-drafts";
import { SavedDecksSection } from "@/widgets/deck-list/saved-decks";

export default function DecksPageClient() {
  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] transition-colors dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
        <header className="flex flex-col gap-5 border-b border-[#d8d4cc] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#4b4842]">
          <div>
            <h1 className="font-serif text-3xl font-semibold">나의 덱</h1>
            <p className="mt-2 text-sm text-[#77726b] dark:text-[#aaa49b]">
              책과 생각을 연결해 만든 독서 기록
            </p>
          </div>
          <Link
            href="/decks/create"
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[4px] bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            새 덱 만들기
          </Link>
        </header>
        <div className="space-y-14 pt-8 md:space-y-20">
          <ActiveDraftsSection />
          <SavedDecksSection />
        </div>
      </main>
    </div>
  );
}
