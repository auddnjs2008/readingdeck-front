import type { Metadata } from "next";

import {
  DeckReadDetail,
} from "@/entities/deck/ui/deck-read-detail";

export const metadata: Metadata = {
  title: "덱 상세",
};

export default function DeckReadPage() {
  return <DeckReadDetail />;
}
