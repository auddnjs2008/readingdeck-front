import type { Metadata } from "next";

import CardDetailScene from "@/entities/card/ui/card-detail-scene";

export const metadata: Metadata = {
  title: "카드 상세",
};

export default function CardDetailPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[900px] px-4 py-8 md:px-8 md:py-10">
      <div className="w-full">
        <CardDetailScene />
      </div>
    </main>
  );
}
