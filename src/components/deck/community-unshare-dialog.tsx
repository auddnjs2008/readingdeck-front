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
} from "@/components/ui/alert-dialog";

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>커뮤니티 공유를 취소할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            이 덱은 커뮤니티 피드와 상세에서 내려가며, 작성된 댓글도 함께
            보이지 않게 됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>닫기</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? "취소 중..." : "공유 취소"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
