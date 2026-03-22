"use client";

import dayjs from "dayjs";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useBookDeleteMutation } from "@/hooks/book/react-query/useBookDeleteMutation";
import { useBookUpdateMutation } from "@/hooks/book/react-query/useBookUpdateMutation";
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
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

type BookStatus = "reading" | "finished" | "paused";

const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  reading: "읽는 중",
  finished: "완독",
  paused: "중단",
};

const BOOK_STATUS_OPTIONS = [
  { value: "reading", label: "읽는 중" },
  { value: "finished", label: "완독" },
  { value: "paused", label: "중단" },
] as const;

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
    status: data.status,
    statusLabel: BOOK_STATUS_LABEL[data.status],
    progressPercent: data.progressPercent,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    startedAt: data.startedAt
      ? dayjs(data.startedAt).format("YYYY-MM-DD")
      : null,
    finishedAt: data.finishedAt
      ? dayjs(data.finishedAt).format("YYYY-MM-DD")
      : null,
    rating: undefined,
  };
}

function BookReadingControl({
  bookId,
  initialStatus,
  initialCurrentPage,
  initialTotalPages,
}: {
  bookId: number;
  initialStatus: BookStatus;
  initialCurrentPage: number | null;
  initialTotalPages: number | null;
}) {
  const updateBookMutation = useBookUpdateMutation();
  const [status, setStatus] = useState<BookStatus>(initialStatus);
  const [currentPage, setCurrentPage] = useState(
    initialCurrentPage != null ? String(initialCurrentPage) : ""
  );
  const [totalPages, setTotalPages] = useState(
    initialTotalPages != null ? String(initialTotalPages) : ""
  );

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setCurrentPage(initialCurrentPage != null ? String(initialCurrentPage) : "");
  }, [initialCurrentPage]);

  useEffect(() => {
    setTotalPages(initialTotalPages != null ? String(initialTotalPages) : "");
  }, [initialTotalPages]);

  const handleUpdateBook = async () => {
    const nextCurrentPage =
      currentPage.trim() === "" ? null : Number(currentPage);
    const nextTotalPages = totalPages.trim() === "" ? null : Number(totalPages);

    if (
      nextCurrentPage != null &&
      (!Number.isInteger(nextCurrentPage) || nextCurrentPage < 0)
    ) {
      toast.error("현재 페이지는 0 이상의 숫자여야 합니다.");
      return;
    }

    if (
      nextTotalPages != null &&
      (!Number.isInteger(nextTotalPages) || nextTotalPages < 1)
    ) {
      toast.error("총 페이지는 1 이상의 숫자여야 합니다.");
      return;
    }

    if (
      nextCurrentPage != null &&
      nextTotalPages != null &&
      nextCurrentPage > nextTotalPages
    ) {
      toast.error("현재 페이지는 총 페이지를 넘을 수 없습니다.");
      return;
    }

    try {
      await updateBookMutation.mutateAsync({
        path: { bookId },
        body: {
          status,
          currentPage: nextCurrentPage,
          totalPages: nextTotalPages,
        },
      });
      toast.success("독서 진행 상태를 저장했습니다.");
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "독서 진행 상태를 저장하지 못했습니다."
        : "독서 진행 상태를 저장하지 못했습니다.";
      toast.error(message);
    }
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Reading Control
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`reading-status-${bookId}`}
            className="text-xs font-medium text-muted-foreground"
          >
            상태
          </label>
          <NativeSelect
            id={`reading-status-${bookId}`}
            value={status}
            options={[...BOOK_STATUS_OPTIONS]}
            onValueChange={(value) => setStatus(value as BookStatus)}
            tone="muted"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`currentPage-${bookId}`}
            className="text-xs font-medium text-muted-foreground"
          >
            현재 페이지
          </label>
          <Input
            id={`currentPage-${bookId}`}
            type="number"
            min={0}
            value={currentPage}
            onChange={(event) => setCurrentPage(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`totalPages-${bookId}`}
            className="text-xs font-medium text-muted-foreground"
          >
            총 페이지
          </label>
          <Input
            id={`totalPages-${bookId}`}
            type="number"
            min={1}
            value={totalPages}
            onChange={(event) => setTotalPages(event.target.value)}
          />
        </div>
        <Button
          type="button"
          onClick={() => void handleUpdateBook()}
          disabled={updateBookMutation.isPending}
        >
          {updateBookMutation.isPending ? "저장 중..." : "진행 상태 저장"}
        </Button>
      </div>
    </div>
  );
}

export default function BookDetailSidebar() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const id = Number(bookId);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { data, isPending, isError, refetch } = useBookDetailQuery({
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

  if (isError) {
    return (
      <aside className="w-full shrink-0 lg:w-[320px]" data-book-id={bookId}>
        <div className="sticky top-24 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/30 p-6">
            <p className="text-sm text-destructive">
              책 정보를 불러오지 못했습니다.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => refetch()}
            >
              다시 시도
            </Button>
          </div>
          <BookDetailBackLink />
        </div>
      </aside>
    );
  }

  if (isPending || !book) {
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
        <BookDetailProgress
          statusLabel={book.statusLabel}
          progressPercent={book.progressPercent}
          currentPage={book.currentPage}
          totalPages={book.totalPages}
          startedAt={book.startedAt}
          finishedAt={book.finishedAt}
        />
        <BookReadingControl
          key={`${id}-${data?.updatedAt ?? "initial"}`}
          bookId={id}
          initialStatus={book.status ?? "reading"}
          initialCurrentPage={book.currentPage ?? null}
          initialTotalPages={book.totalPages ?? null}
        />
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
