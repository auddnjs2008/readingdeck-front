"use client";

import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";

import { CommunityFeedCard } from "@/entities/community/ui/community-feed-card";
import { useCommunityPostsQuery } from "@/entities/community/model/queries/useCommunityPostsQuery";
import { COMMUNITY_FEED_REQUEST } from "@/entities/community/model/queries/community-posts-options";

export default function CommunityPageClient() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCommunityPostsQuery(COMMUNITY_FEED_REQUEST);

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  const latestDate = posts[0]?.createdAt
    ? dayjs(posts[0].createdAt).format("YYYY.MM.DD HH:mm")
    : null;

  const total = data?.pages[0]?.meta.total ?? 0;
  const featuredPost = posts[0];

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        void fetchNextPage();
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] transition-colors dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
        <header className="flex flex-col gap-5 border-b border-[#d8d4cc] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#4b4842]">
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-semibold">커뮤니티</h1>
            <p className="mt-2 text-sm text-[#77726b] dark:text-[#aaa49b]">
              공유된 덱을 읽고 문장과 연결을 따라가 보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#77726b] dark:text-[#aaa49b] md:justify-end">
            <span>
              <span className="font-semibold text-[#292724] dark:text-[#ebe7df]">{total}</span>{" "}
              공유된 덱
            </span>
            <span className="hidden text-[#d8d4cc] md:inline dark:text-[#4b4842]">·</span>
            <span>
              최근 업데이트{" "}
              <span className="font-medium text-[#292724] dark:text-[#ebe7df]">
                {latestDate ?? "아직 없음"}
              </span>
            </span>
          </div>
        </header>

        <section className="mt-8">
          {isPending ? (
            <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              커뮤니티 피드를 불러오는 중입니다...
            </div>
          ) : isError ? (
            <div className="rounded-[28px] border border-destructive/20 bg-destructive/5 px-6 py-10 text-center text-sm text-destructive">
              커뮤니티 피드를 불러오지 못했습니다.
            </div>
          ) : featuredPost ? (
            <>
              <CommunityFeedCard post={featuredPost} featured />

              {posts.length > 1 ? (
                <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                  {posts.slice(1).map((post) => (
                    <CommunityFeedCard key={post.id} post={post} />
                  ))}
                </div>
              ) : null}

              <div ref={loadMoreRef} className="mt-8 flex min-h-10 items-center justify-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    더 많은 공유 덱을 불러오는 중입니다...
                  </div>
                ) : hasNextPage ? (
                  <span className="text-sm text-muted-foreground">
                    아래로 스크롤하면 더 불러옵니다.
                  </span>
                ) : posts.length > 18 ? (
                  <span className="text-sm text-muted-foreground">
                    마지막 공유 덱까지 모두 확인했습니다.
                  </span>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-[32px] border border-dashed border-border bg-card/70 px-6 py-16 text-center">
              <p className="text-lg font-semibold font-serif text-foreground">
                아직 공유된 덱이 없습니다.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                발행된 덱에서 커뮤니티 공유를 누르면 이 피드에 바로 나타납니다.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
