import type { Metadata } from "next";

import HomePageClient from "./page-client";

export const metadata: Metadata = {
  title: "ReadingDeck",
};

export default function LandingPage() {
  return <HomePageClient />;
}
