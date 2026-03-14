"use client";

import { useParams } from "next/navigation";

import CardDetailScene from "@/components/card/card-detail-scene";

export default function CardDetailPageClient() {
  const params = useParams<{ cardId: string }>();
  const cardId = Number(params?.cardId);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[900px] px-4 py-8 md:px-8 md:py-10">
      <div className="w-full">
        <CardDetailScene cardId={cardId} />
      </div>
    </main>
  );
}
