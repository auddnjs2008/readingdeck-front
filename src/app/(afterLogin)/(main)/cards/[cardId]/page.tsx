import type { Metadata } from "next";

import CardDetailPageClient from "./page-client";

export const metadata: Metadata = {
  title: "카드 상세",
};

export default function CardDetailPage() {
  return <CardDetailPageClient />;
}
