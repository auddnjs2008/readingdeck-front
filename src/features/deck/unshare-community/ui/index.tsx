"use client";

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

type CommunityUnshareDialogProps = {
  open: boolean;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function CommunityUnshareDialog({
  open,
  isPending = false,
  onOpenChange,
  onConfirm,
}: CommunityUnshareDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => { if (!isPending) onOpenChange(nextOpen); }}>
      <AlertDialogContent className="w-[calc(100%-2rem)]! rounded-[8px]! border-border p-6 sm:p-8">
        <AlertDialogHeader className="text-left!">
          <AlertDialogTitle className="font-serif text-2xl! font-normal! leading-snug">공유를 취소할까요?</AlertDialogTitle>
          <AlertDialogDescription className="pt-2 leading-7">
            이 덱은 공개 덱 목록과 상세 화면에서 내려가며, 작성된 댓글도 함께
            보이지 않게 됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="mt-0! rounded-[6px]! border-0! bg-transparent! shadow-none!" disabled={isPending}>닫기</AlertDialogCancel>
          <AlertDialogAction className="rounded-[6px]!" onClick={(event) => { event.preventDefault(); onConfirm(); }} disabled={isPending}>
            {isPending ? "취소 중..." : "공유 취소"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
