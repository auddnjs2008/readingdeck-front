import type { Metadata } from "next";

import DeckReadPageClient from "./page-client";

export const metadata: Metadata = {
  title: "덱 상세",
};

export default function DeckReadPage() {
  return <DeckReadPageClient />;
}
