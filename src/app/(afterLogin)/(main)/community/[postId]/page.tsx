import type { Metadata } from "next";

import CommunityDetailPageClient from "./page-client";

export const metadata: Metadata = {
  title: "공유된 덱",
};

export default function CommunityDetailPage() {
  return <CommunityDetailPageClient />;
}
