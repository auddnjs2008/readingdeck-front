"use client";

import { AccountSupportSection } from "@/features/me/delete-account/ui";
import { useMyLibraryStatsQuery } from "@/entities/me/model/queries/useMyLibraryStatsQuery";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";
import { ProfileEditDialog } from "@/entities/me/ui/profile-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { QueryError } from "@/shared/ui/query-error";

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

export default function ProfilePageClient() {
  const profile = useMyProfileQuery();
  const stats = useMyLibraryStatsQuery();

  if (profile.isError || stats.isError) {
    return (
      <QueryError
        onRetry={() => {
          void profile.refetch();
          void stats.refetch();
        }}
        isRetrying={profile.isFetching || stats.isFetching}
      />
    );
  }

  if (profile.isPending || stats.isPending) return <ProfilePageSkeleton />;

  const myProfile = profile.data;
  const libraryStats = stats.data;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-12 md:px-10 md:py-16 xl:px-12">
      <header>
        <p className="text-xs font-semibold text-primary">MY PROFILE</p>
        <h1 className="mt-3 font-serif text-4xl font-medium md:text-5xl">나의 기록</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
          ReadingDeck에서 쌓아온 독서 기록과 계정을 관리합니다.
        </p>
      </header>

      <section className="mt-12 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 shrink-0 border border-border sm:h-24 sm:w-24">
          <AvatarImage src={myProfile.profile ?? undefined} alt={myProfile.name} />
          <AvatarFallback className="bg-primary/10 font-serif text-2xl text-primary">
            {getInitials(myProfile.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-2xl font-medium md:text-3xl">
            {myProfile.name}
          </h2>
          <p className="mt-2 break-all text-sm text-muted-foreground">
            {myProfile.email}
          </p>
        </div>

        <ProfileEditDialog profile={myProfile} />
      </section>

      <section className="grid border-b border-border sm:grid-cols-2">
        <article className="py-10 sm:pr-10">
          <p className="font-serif text-5xl font-medium tabular-nums">
            {libraryStats.bookCount}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">서재에 담긴 책</p>
        </article>
        <article className="border-t border-border py-10 sm:border-t-0 sm:border-l sm:pl-10">
          <p className="font-serif text-5xl font-medium tabular-nums">
            {libraryStats.cardCount}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">남긴 생각 카드</p>
        </article>
      </section>

      <AccountSupportSection />
    </div>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-12 md:px-10 md:py-16 xl:px-12">
      <header>
        <div className="h-3 w-20 bg-muted" />
        <div className="mt-4 h-12 w-48 bg-muted" />
        <div className="mt-4 h-5 w-full max-w-md bg-muted" />
      </header>

      <section className="mt-12 flex items-center gap-6 border-b border-border pb-10">
        <div className="h-20 w-20 shrink-0 rounded-full bg-muted sm:h-24 sm:w-24" />
        <div className="min-w-0 flex-1">
          <div className="h-8 w-40 bg-muted" />
          <div className="mt-3 h-4 w-56 max-w-full bg-muted" />
        </div>
        <div className="hidden h-10 w-24 bg-muted sm:block" />
      </section>

      <section className="grid border-b border-border sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={index}
            className={`py-10 ${index === 0 ? "sm:pr-10" : "border-t border-border sm:border-t-0 sm:border-l sm:pl-10"}`}
          >
            <div className="h-12 w-16 bg-muted" />
            <div className="mt-3 h-4 w-28 bg-muted" />
          </article>
        ))}
      </section>

      <section className="py-12">
        <div className="h-8 w-36 bg-muted" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="mt-6 h-11 w-full border-t border-border bg-muted/35" />
        ))}
      </section>
    </div>
  );
}
