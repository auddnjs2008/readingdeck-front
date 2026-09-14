"use client";

import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

import { Skeleton } from "@/shared/ui/skeleton";
import { getDeckHref } from "@/entities/deck/api/getDeckHref";
import { useDecksQuery } from "@/entities/deck/model/queries/useDecksQuery";
import { useMyLibraryStatsQuery } from "@/entities/me/model/queries/useMyLibraryStatsQuery";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const formatUpdatedAt = (updatedAt: string) => dayjs(updatedAt).fromNow();

function ActiveDraftsSkeleton() {
  return (
    <div className="hide-scrollbar grid auto-cols-[minmax(240px,1fr)] grid-flow-col overflow-x-auto border-b border-[#d8d4cc] dark:border-[#4b4842]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="min-w-0 border-r border-[#d8d4cc] px-4 py-4 first:pl-0 dark:border-[#4b4842]"
        >
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function ActiveDraftsSection() {
  const libraryStatsQuery = useMyLibraryStatsQuery();
  const activeDraftsQuery = useDecksQuery({
    query: {
      take: 8,
      status: "draft",
      sort: "latest",
    },
  });

  const noBooksInLibrary =
    libraryStatsQuery.isSuccess && libraryStatsQuery.data.bookCount === 0;

  const activeDrafts = activeDraftsQuery.data?.items ?? [];
  const draftCount = activeDraftsQuery.data?.meta.total ?? null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[#77726b] dark:text-[#aaa49b]">
          이어 쓰기
        </h2>
        <p className="text-xs text-[#77726b] dark:text-[#aaa49b]">
          {draftCount === null ? "—" : `${draftCount}개의 초안`}
        </p>
      </div>

      {activeDraftsQuery.isPending ? (
        <ActiveDraftsSkeleton />
      ) : activeDraftsQuery.isLoadingError ? (
        <div className="border-b border-[#d8d4cc] py-4 text-sm text-[#77726b] dark:border-[#4b4842] dark:text-[#aaa49b]">
          <p>초안 목록을 불러오지 못했습니다.</p>
        </div>
      ) : activeDrafts.length > 0 ? (
        <div className="grid auto-cols-[minmax(240px,1fr)] grid-flow-col overflow-x-auto border-b border-[#d8d4cc] dark:border-[#4b4842]">
          {activeDrafts.map((deck) => (
            <Link
              key={deck.id}
              href={getDeckHref(deck)}
              className="min-w-0 border-r border-[#d8d4cc] px-4 py-4 first:pl-0 dark:border-[#4b4842]"
            >
              <h3 className="truncate font-serif text-base font-semibold">
                {deck.name}
              </h3>
              <p className="mt-1 text-xs text-[#77726b] dark:text-[#aaa49b]">
                {deck.nodeCount}개 노드 · {formatUpdatedAt(deck.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-b border-[#d8d4cc] py-4 text-sm text-[#77726b] dark:border-[#4b4842] dark:text-[#aaa49b]">
          {noBooksInLibrary ? (
            <p>
              덱을 만들 책을 먼저 서재에 추가해 주세요. {" "}
              <Link className="font-medium text-foreground underline" href="/books">
                책 추가하러 가기
              </Link>{" "}
              <Link
                className="font-medium text-foreground underline"
                href="/decks/create"
              >
                편집 화면만 열기
              </Link>
            </p>
          ) : (
            <p>현재 작성 중인 덱이 없습니다.</p>
          )}
        </div>
      )}
    </section>
  );
}
