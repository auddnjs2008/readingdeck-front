"use client";

import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";

import { CommunityFeedCard } from "@/components/community/community-feed-card";
import { useCommunityPostsQuery } from "@/hooks/community/react-query/useCommunityPostsQuery";

export default function CommunityPageClient() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCommunityPostsQuery({
    query: {
      take: 18,
      sort: "latest",
    },
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  const latestDate = posts[0]?.createdAt
    ? dayjs(posts[0].createdAt).format("YYYY.MM.DD HH:mm")
    : null;

  const total = data?.pages[0]?.meta.total ?? 0;

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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,92,61,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(193,92,61,0.08),transparent_24%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "24px 24px",
          backgroundImage: "radial-gradient(#6b5f58 1.2px, transparent 1.2px)",
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1380px] px-6 py-10 md:px-10 xl:px-16">
        <section className="flex flex-col gap-6 border-b border-border/70 pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
              Community
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              공유된 덱을 읽고 문장과 연결을 따라가 보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-end">
            <span>
              <span className="font-semibold text-foreground">{total}</span>{" "}
              shared decks
            </span>
            <span className="hidden text-border lg:inline">·</span>
            <span>
              Latest update{" "}
              <span className="font-medium text-foreground">
                {latestDate ?? "아직 없음"}
              </span>
            </span>
          </div>
        </section>

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
          ) : posts.length ? (
            <>
              <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
                {posts.map((post, index) => (
                  <CommunityFeedCard key={post.id} post={post} index={index} />
                ))}
              </div>

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
