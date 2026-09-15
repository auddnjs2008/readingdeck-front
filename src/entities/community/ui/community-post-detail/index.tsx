import { getCommunityPostServer } from "@/entities/community/api/getCommunityPost.server";
import { CommunityPostReader } from "@/entities/community/ui/community-post-reader";

type CommunityPostDetailProps = {
  postId: number;
};

export async function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  const post = await getCommunityPostServer({ path: { postId } });

  return <CommunityPostReader post={post} />;
}

export function CommunityPostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-10 px-5 py-10 md:px-8 md:py-14">
        <header className="mx-auto w-full max-w-4xl border-b border-[#d8d4cc] pb-10 dark:border-[#4b4842]">
          <div className="h-4 w-24 rounded-sm bg-muted" />

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded-sm bg-muted" />
              <div className="h-3 w-16 rounded-sm bg-muted" />
            </div>
            <div className="h-4 w-40 rounded-sm bg-muted" />
          </div>

          <div className="mt-10 space-y-4">
            <div className="h-8 w-full max-w-2xl rounded-sm bg-muted" />
            <div className="h-8 w-4/5 max-w-xl rounded-sm bg-muted" />
            <div className="mt-7 h-4 w-full rounded-sm bg-muted" />
            <div className="h-4 w-3/4 rounded-sm bg-muted" />
          </div>

          <div className="mt-9 border-t border-[#d8d4cc] pt-5 dark:border-[#4b4842]">
            <div className="h-5 w-40 rounded-sm bg-muted" />
            <div className="mt-2 h-3 w-24 rounded-sm bg-muted" />
          </div>
        </header>

        <section className="border-y border-[#d8d4cc] py-8 dark:border-[#4b4842]">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-b border-border/70 pb-6 last:border-b-0 last:pb-0">
                <div className="h-4 w-20 rounded-sm bg-muted" />
                <div className="mt-3 h-4 w-full rounded-sm bg-muted" />
                <div className="mt-2 h-4 w-2/3 rounded-sm bg-muted" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl border-t border-border/80 pt-8">
          <div className="h-5 w-16 rounded-sm bg-muted" />
          <div className="mt-5 h-24 w-full rounded-sm bg-muted" />
          <div className="mt-6 space-y-4 border-y border-border/70 py-6">
            <div className="h-4 w-32 rounded-sm bg-muted" />
            <div className="h-4 w-3/4 rounded-sm bg-muted" />
          </div>
        </section>
      </main>
    </div>
  );
}
