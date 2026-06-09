import { getCommunityPostServer } from "@/entities/community/api/getCommunityPost.server";
import { CommunityPostReader } from "@/entities/community/ui/community-post-reader";
import { getMyProfileServer } from "@/entities/me/api/getMyProfile.server";

type CommunityPostDetailProps = {
  postId: number;
};

export async function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  if (!Number.isFinite(postId) || postId <= 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        잘못된 공유 주소입니다.
      </div>
    );
  }

  const [post, myProfile] = await Promise.all([
    getCommunityPostServer({ path: { postId } }),
    getMyProfileServer(),
  ]);

  return <CommunityPostReader post={post} currentUserId={myProfile.id} />;
}

export function CommunityPostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-8 px-6 py-10 md:px-10 xl:px-16">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-24 rounded-full bg-muted" />
          <div className="h-8 w-24 rounded-full bg-muted" />
        </div>

        <section className="overflow-hidden rounded-[34px] border border-border/80 bg-card shadow-[0_22px_48px_rgba(63,54,49,0.08)]">
          <div className="border-b border-border/70 px-6 py-7 md:px-8 md:py-8">
            <div className="mb-4 flex gap-2">
              <div className="h-6 w-28 rounded-full bg-muted" />
              <div className="h-6 w-36 rounded-full bg-muted" />
            </div>
            <div className="h-12 w-full max-w-xl rounded-full bg-muted" />
            <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-muted" />
            <div className="mt-6 h-12 w-56 rounded-full bg-muted" />
          </div>
          <div className="px-6 py-8 md:px-8">
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-border bg-background px-5 py-5 md:px-6 md:py-6"
                >
                  <div className="mb-4 flex gap-3">
                    <div className="h-6 w-12 rounded-full bg-muted" />
                    <div className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-full rounded-full bg-muted" />
                  <div className="mt-3 h-5 w-2/3 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-border/80 bg-card p-6 shadow-[0_14px_34px_rgba(63,54,49,0.06)]">
          <div className="h-6 w-32 rounded-full bg-muted" />
          <div className="mt-5 h-32 rounded-[24px] bg-muted" />
        </section>
      </main>
    </div>
  );
}
