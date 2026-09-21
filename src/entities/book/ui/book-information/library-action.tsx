"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";
import { useBookCreateMutation } from "@/entities/book/model/queries/useBookCreateMutation";
import { getBooks } from "@/entities/book/api/getBooks";
import { RQbookQueryKey } from "@/entities/book/model/queries/RQbookQueryKey";
import { Button } from "@/shared/ui/button";
import type { BookInformation } from "../../model/book-information";

export function BookInformationLibraryAction({
  book,
}: {
  book: BookInformation;
}) {
  const profile = useMyProfileQuery({ retry: false });
  const router = useRouter();
  const create = useBookCreateMutation();
  const request = { query: { isbn: book.isbn!, take: 1 } };
  const existing = useQuery({
    queryKey: RQbookQueryKey.list(request),
    queryFn: () => getBooks(request),
    enabled: !!profile.data && !!book.isbn,
  });
  if (profile.isPending)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        서재 확인 중…
      </p>
    );
  if (!profile.data)
    return (
      <Button as={Link} href="/login">
        로그인하고 서재에 추가
      </Button>
    );
  if (existing.isPending)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        서재 확인 중…
      </p>
    );
  if (existing.isError)
    return (
      <Button variant="outline" onClick={() => void existing.refetch()}>
        서재 다시 확인
      </Button>
    );
  const owned = existing.data.items[0];
  if (owned)
    return (
      <Button as={Link} href={`/books/${owned.id}`}>
        내 기록 보기
      </Button>
    );
  return (
    <div className="space-y-3">
      <Button
        disabled={create.isPending}
        onClick={() =>
          create.mutate(
            {
              body: {
                isbn: book.isbn!,
                title: book.title,
                author: book.authors.join(", "),
                publisher: book.publisher,
                contents: book.description ?? undefined,
                imageUrl: book.coverUrl ?? undefined,
              },
            },
            { onSuccess: (saved) => router.push(`/books/${saved.id}`) },
          )
        }
      >
        {create.isPending ? "추가 중…" : "내 서재에 추가"}
      </Button>
      {create.isError && (
        <p role="alert" className="text-sm text-destructive">
          책을 추가하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
