import type { Metadata } from "next";
import DeckCreateClient from "@/widgets/deck-editor/deck-create-client";

export const metadata: Metadata = {
  title: "덱 생성",
};

export default function DeckCreatePage() {
  return <DeckCreateClient />;
}
