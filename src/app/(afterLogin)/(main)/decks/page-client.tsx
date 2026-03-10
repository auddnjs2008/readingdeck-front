"use client";

import { ActiveDraftsSection } from "@/components/deck/sections/active-drafts";
import { SavedDecksSection } from "@/components/deck/sections/saved-decks";

export default function DecksPageClient() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "24px 24px",
          backgroundImage: "radial-gradient(#334155 1.5px, transparent 1.5px)",
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1400px] space-y-10 px-6 py-10 md:px-10 xl:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight font-serif">나의 덱</h1>
            <p className="text-sm text-muted-foreground">
              나만의 독서 흐름과 지식 그래프를 관리하세요.
            </p>
          </div>
        </div>

        <ActiveDraftsSection />
        <SavedDecksSection />
      </main>
    </div>
  );
}
