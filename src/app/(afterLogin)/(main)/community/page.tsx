import type { Metadata } from "next";

import CommunityPageClient from "./page-client";

export const metadata: Metadata = {
  title: "커뮤니티",
};

export default function CommunityPage() {
  return <CommunityPageClient />;
}
