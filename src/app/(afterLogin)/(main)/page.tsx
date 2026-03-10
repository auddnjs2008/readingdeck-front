import type { Metadata } from "next";

import HomePageClient from "./page-client";

export const metadata: Metadata = {
  title: "홈",
};

export default function HomePage() {
  return <HomePageClient />;
}
