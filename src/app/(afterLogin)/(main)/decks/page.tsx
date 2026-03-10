import type { Metadata } from "next";

import DecksPageClient from "./page-client";

export const metadata: Metadata = {
  title: "덱",
};

export default function DecksPage() {
  return <DecksPageClient />;
}
