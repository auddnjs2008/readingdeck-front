import type { Metadata } from "next";
import TopNav from "@/widgets/top-nav/ui";
import { FeedbackForm } from "@/features/feedback/create-feedback/ui";

export const metadata: Metadata = {
  title: "의견 보내기",
  description: "ReadingDeck을 쓰면서 불편했던 점이나 바라는 기능을 알려주세요.",
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const { from } = await searchParams;
  const sourcePath =
    typeof from === "string" &&
    from.length <= 255 &&
    /^\/(?!\/)[^?#\\\s]*$/.test(from)
      ? from
      : "/feedback";

  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-background px-5 pt-28 pb-24 text-foreground md:px-8 md:pt-32">
        <div className="mx-auto max-w-[640px]">
          <header className="mb-12">
            <h1 className="font-serif text-3xl font-semibold">의견 보내기</h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              쓰면서 불편했던 점이나 바라는 기능을 알려주세요.
            </p>
          </header>
          <FeedbackForm sourcePath={sourcePath} />
        </div>
      </main>
    </>
  );
}
