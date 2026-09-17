import type { Metadata } from "next";

import HomePageClient from "./page-client";

export const metadata: Metadata = {
  title: "ReadingDeck",
  description: "마음에 남은 문장과 생각을 기록하고 연결하는 독서 기록.",
};

export default function LandingPage() {
  return <HomePageClient />;
}
