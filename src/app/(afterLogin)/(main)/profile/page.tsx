import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen, Layers2 } from "lucide-react";

import { AccountSupportSection } from "@/features/me/delete-account/ui";
import { getMyLibraryStatsServer } from "@/entities/me/api/getMyLibraryStats.server";
import { getMyProfileServer } from "@/entities/me/api/getMyProfile.server";
import { ProfileEditDialog } from "@/entities/me/ui/profile-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export const metadata: Metadata = {
  title: "Profile | ReadingDeck",
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}

async function ProfileContent() {
  const [myProfile, libraryStats] = await Promise.all([
    getMyProfileServer(),
    getMyLibraryStatsServer(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-12 md:px-10 xl:px-12">
      <section className="flex flex-col items-center border-b border-border/70 pb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
          Profile
        </p>

        <Avatar className="mt-8 h-32 w-32 border border-border/80 shadow-[0_18px_48px_rgba(63,54,49,0.12)]">
          <AvatarImage src={myProfile.profile ?? undefined} alt={myProfile.name} />
          <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
            {getInitials(myProfile.name)}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-8 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          {myProfile.name}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground md:text-base">
          댓글과 공유 덱에 보여지는 프로필입니다.
        </p>

        <ProfileEditDialog profile={myProfile} />
      </section>

      <section className="grid gap-4 py-12 md:grid-cols-2">
        <article className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-3xl font-semibold">{libraryStats.bookCount}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.26em] text-muted-foreground">
            Books
          </p>
        </article>

        <article className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Layers2 className="h-5 w-5" />
          </div>
          <p className="text-3xl font-semibold">{libraryStats.cardCount}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.26em] text-muted-foreground">
            Cards
          </p>
        </article>
      </section>

      <AccountSupportSection />
    </div>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-12 md:px-10 xl:px-12">
      <section className="flex flex-col items-center border-b border-border/70 pb-12 text-center">
        <div className="h-3 w-24 rounded-full bg-muted" />
        <div className="mt-8 h-32 w-32 rounded-full border border-border/80 bg-muted" />
        <div className="mt-8 h-12 w-56 rounded-full bg-muted" />
        <div className="mt-4 h-5 w-72 rounded-full bg-muted" />
        <div className="mt-8 h-11 w-32 rounded-full bg-muted" />
      </section>

      <section className="grid gap-4 py-12 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={index}
            className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]"
          >
            <div className="mb-5 h-11 w-11 rounded-2xl bg-muted" />
            <div className="h-9 w-16 rounded-full bg-muted" />
            <div className="mt-2 h-4 w-20 rounded-full bg-muted" />
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]">
        <div className="h-4 w-40 rounded-full bg-muted" />
        <div className="mt-4 h-8 w-48 rounded-full bg-muted" />
        <div className="mt-4 h-5 w-full max-w-xl rounded-full bg-muted" />
      </section>
    </div>
  );
}
