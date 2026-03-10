import type { Metadata } from "next";

import DeckDetailPageClient from "./page-client";

export const metadata: Metadata = {
  title: "덱 편집",
};

export default function DeckDetailPage() {
  return <DeckDetailPageClient />;
}
