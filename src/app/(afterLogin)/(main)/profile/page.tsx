import type { Metadata } from "next";
import ProfilePageClient from "./page-client";

export const metadata: Metadata = {
  title: "Profile | ReadingDeck",
};

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <ProfilePageClient />
    </main>
  );
}
