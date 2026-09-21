import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import type { BookInformation } from "../../model/book-information";
import { BookInformationBack } from "./navigation";

export function BookInformationView({
  book,
  action,
}: {
  book: BookInformation;
  action: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
      <BookInformationBack />
      <div className="mt-12 grid gap-10 md:grid-cols-[200px_minmax(0,1fr)] md:gap-14">
        <div className="mx-auto w-40 md:w-full">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={`${book.title} 표지`}
              className="w-full object-contain"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center bg-muted">
              <BookOpen
                className="size-12 text-muted-foreground"
                aria-label="표지 없음"
              />
            </div>
          )}
        </div>
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <p className="mb-3 text-xs font-medium text-primary">책 정보</p>
          <h1 className="font-serif text-3xl font-semibold leading-snug">
            {book.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {book.authors.join(" · ") || "저자 정보 없음"}
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            {book.publisher && (
              <div className="flex gap-4">
                <dt className="shrink-0 text-muted-foreground">출판사</dt>
                <dd>{book.publisher}</dd>
              </div>
            )}
            {book.publishedAt && (
              <div className="flex gap-4">
                <dt className="shrink-0 text-muted-foreground">출간일</dt>
                <dd>{book.publishedAt.slice(0, 10)}</dd>
              </div>
            )}
            {book.isbn && (
              <div className="flex gap-4">
                <dt className="shrink-0 text-muted-foreground">ISBN</dt>
                <dd>{book.isbn}</dd>
              </div>
            )}
          </dl>
          <div className="mt-8">{action}</div>
          <section className="mt-12 max-w-3xl border-t border-border/60 pt-8">
            <h2 className="font-serif text-2xl font-semibold">책 소개</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-8">
              {book.description || "등록된 책 소개가 없어요."}
            </p>
            {book.isbn && (
              <p className="mt-6 text-xs text-muted-foreground">
                도서 정보 제공: 카카오 책 검색
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
