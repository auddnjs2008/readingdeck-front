import { getMyLibraryStatsServer } from "@/entities/me/api/getMyLibraryStats.server";

export default async function LibraryPageHeader() {
  const stats = await getMyLibraryStatsServer();
  const bookCount = stats.bookCount;
  const cardCount = stats.cardCount;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-serif">
        내 서재
      </h1>
      <p className="text-sm text-muted-foreground">
        총 {bookCount}권의 책과 {cardCount.toLocaleString()}장의 카드가 있습니다.
      </p>
    </div>
  );
}
