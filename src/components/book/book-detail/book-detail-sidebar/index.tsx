"use client";

import dayjs from "dayjs";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useBookDeleteMutation } from "@/hooks/book/react-query/useBookDeleteMutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBookDetailQuery } from "@/hooks/book/react-query/useBookDetailQuery";
import type { BookDetailSidebarInfo } from "../types";
import type { ResGetBookDetail } from "@/service/book/getBookDetail";
import BookDetailBackLink from "../book-detail-back-link";
import BookDetailCover from "../book-detail-cover";
import BookDetailMeta from "../book-detail-meta";
import BookDetailProgress from "../book-detail-progress";

function mapBookDetailToSidebarInfo(
  data: ResGetBookDetail
): BookDetailSidebarInfo {
  return {
    title: data.title,
    author: data.author,
    coverUrl: data.backgroundImage ?? undefined,
    year: data.createdAt
      ? dayjs(data.createdAt).format("YYYY-MM-DD")
      : undefined,
    statusLabel: undefined,
    progressPercent: undefined,
    readAt: data.updatedAt
      ? dayjs(data.updatedAt).format("YYYY-MM-DD")
      : undefined,
    rating: undefined,
  };
}

export default function BookDetailSidebar() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const id = Number(bookId);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { data, isPending, isError } = useBookDetailQuery({
    path: { bookId: id },
  });
  const deleteBookMutation = useBookDeleteMutation();

  const book: BookDetailSidebarInfo | null = data
    ? mapBookDetailToSidebarInfo(data)
    : null;

  const handleDeleteBook = async () => {
    try {
      await deleteBookMutation.mutateAsync({
        path: { bookId: id },
      });
      toast.success("책을 삭제했습니다.");
      router.replace("/books/library");
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "책을 삭제하지 못했습니다."
        : "책을 삭제하지 못했습니다.";
      toast.error(message);
    }
  };

  if (isPending || isError || !book) {
    return (
      <aside className="w-full shrink-0 lg:w-[320px]" data-book-id={bookId}>
        <div className="sticky top-24 flex flex-col gap-8">
          <div className="aspect-2/3 w-full animate-pulse rounded-xl bg-muted" />
          <div className="flex flex-col gap-2">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-30 animate-pulse rounded-xl bg-muted" />
          <BookDetailBackLink />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full shrink-0 lg:w-[320px]" data-book-id={bookId}>
      <div className="sticky top-24 flex flex-col gap-8">
        <BookDetailCover coverUrl={book.coverUrl} title={book.title} />
        <BookDetailMeta
          title={book.title}
          author={book.author}
          year={book.year}
          rating={book.rating}
        />
        {/* <BookDetailProgress
          statusLabel={book.statusLabel}
          progressPercent={book.progressPercent}
          readAt={book.readAt}
        /> */}
        <div className="flex flex-col gap-5">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto justify-start px-0 text-destructive hover:bg-transparent hover:text-destructive/80"
            onClick={() => setShowDeleteAlert(true)}
          >
            책 삭제
          </Button>
          <BookDetailBackLink />
        </div>
      </div>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="border-border bg-popover p-6 sm:rounded-xl">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              이 책을 삭제할까요?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              삭제한 책은 복구할 수 없습니다. 연결된 카드가 있으면 삭제가
              거부됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex w-full items-center justify-between sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <AlertDialogCancel className="h-10 px-4">
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                className="h-10 bg-destructive px-4 text-destructive-foreground hover:bg-destructive/90"
                onClick={(event) => {
                  event.preventDefault();
                  void handleDeleteBook();
                }}
                disabled={deleteBookMutation.isPending}
              >
                {deleteBookMutation.isPending ? "삭제 중..." : "삭제하기"}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
