import type { Metadata } from "next";

import CardDetailScene from "@/widgets/card-detail";

export const metadata: Metadata = {
  title: "카드 상세",
};

export default function CardDetailPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f9f8f4] text-[#292724] transition-colors dark:bg-[#242320] dark:text-[#ebe7df]">
      <div className="mx-auto w-full max-w-[900px] px-4 py-10 md:px-8 md:py-14">
        <CardDetailScene />
      </div>
    </main>
  );
}
