"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { ResGetBookDetail } from "@/entities/book/api/getBookDetail";
import { useBookDeleteMutation } from "@/entities/book/model/queries/useBookDeleteMutation";
import { useBookUpdateMutation } from "@/entities/book/model/queries/useBookUpdateMutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { NativeSelect } from "@/shared/ui/native-select";

type BookStatus = ResGetBookDetail["status"];

const BOOK_STATUS_OPTIONS = [
  { value: "reading", label: "읽는 중" },
  { value: "finished", label: "완독" },
  { value: "paused", label: "중단" },
] as const;

type BookDetailActionsProps = {
  bookId: number;
  book: Pick<
    ResGetBookDetail,
    "status" | "currentPage" | "totalPages" | "updatedAt"
  >;
};

export function BookDetailActions({ bookId, book }: BookDetailActionsProps) {
  const router = useRouter();
  const deleteBookMutation = useBookDeleteMutation();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDeleteBook = async () => {
    try {
      await deleteBookMutation.mutateAsync({
        path: { bookId },
      });
      toast.success("책을 삭제했습니다.");
      router.replace("/books/library");
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "책을 삭제하지 못했습니다."
        : "책을 삭제하지 못했습니다.";
      toast.error(message);
    }
  };

  return (
    <>
      <BookReadingControl
        key={`${bookId}-${book.updatedAt}`}
        bookId={bookId}
        initialStatus={book.status}
        initialCurrentPage={book.currentPage}
        initialTotalPages={book.totalPages}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-auto justify-start px-0 text-destructive hover:bg-transparent hover:text-destructive/80"
        onClick={() => setShowDeleteAlert(true)}
      >
        책 삭제
      </Button>
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
              <AlertDialogCancel className="h-10 px-4">취소</AlertDialogCancel>
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
    </>
  );
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
  const router = useRouter();
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
      router.refresh();
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
