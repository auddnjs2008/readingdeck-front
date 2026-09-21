"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/entities/book/api/getBookDetail";
import { RQbookQueryKey } from "@/entities/book/model/queries/RQbookQueryKey";
import { BookInformationView } from "@/entities/book/ui/book-information";
import { Button } from "@/shared/ui/button";
import { QueryError } from "@/shared/ui/query-error";
export default function Page() {
  const id = Number(useParams<{ id: string }>().id);
  const query = useQuery({
    queryKey: RQbookQueryKey.detail(id),
    queryFn: () => getBookDetail({ path: { bookId: id } }),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
  if (!Number.isSafeInteger(id) || id <= 0)
    return <p className="p-10">잘못된 책 주소입니다.</p>;
  if (query.isError) return <QueryError onRetry={() => void query.refetch()} />;
  if (query.isPending)
    return (
      <p role="status" className="p-10">
        책 정보를 불러오는 중…
      </p>
    );
  const book = query.data;
  return (
    <BookInformationView
      book={{
        isbn: null,
        title: book.title,
        authors: [book.author],
        publisher: book.publisher,
        description: book.contents,
        coverUrl: book.backgroundImage,
        publishedAt: null,
      }}
      action={
        <div className="flex flex-wrap gap-3">
          <Button as={Link} href={`/books/${id}`}>
            내 기록 보기
          </Button>
          {book.isbn && (
            <Button
              variant="outline"
              as={Link}
              href={`/book-info/${book.isbn}`}
            >
              최신 책 정보 보기
            </Button>
          )}
        </div>
      }
    />
  );
}
