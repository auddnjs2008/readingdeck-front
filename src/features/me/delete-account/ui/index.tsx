"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useMyAccountDeleteMutation } from "@/entities/me/model/queries/useMyAccountDeleteMutation";
import { useState } from "react";

export function AccountSupportSection() {
  const deleteAccountMutation = useMyAccountDeleteMutation();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <section className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Account & Support
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">계정 및 지원</h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              개인정보처리방침과 고객지원 문서를 확인하거나, 원할 경우 계정을 삭제할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                개인정보처리방침
              </Link>
              <Link href="/support" className="underline underline-offset-4 hover:text-foreground">
                고객지원
              </Link>
              <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
                이용약관
              </Link>
            </div>
          </div>

          <div className="w-full border-t border-border/70 pt-6 md:max-w-sm md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">회원 탈퇴</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  계정을 삭제하면 저장된 책과 카드, 연결된 데이터가 함께 삭제될 수 있습니다. 이 작업은 되돌릴 수 없습니다.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  회원 탈퇴
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[520px] rounded-[28px] px-6 py-6 sm:px-8">
          <div className="mb-2 flex items-start justify-between gap-4">
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className="font-serif text-2xl font-semibold">회원 탈퇴</DialogTitle>
              <DialogDescription className="text-sm leading-7 text-muted-foreground">
                회원 탈퇴를 진행하면 ReadingDeck 계정과 저장된 책, 카드, 연결된 데이터가 삭제될 수 있습니다. 이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogCloseButton />
          </div>

          <DialogFooter className="items-center gap-3 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={deleteAccountMutation.isPending}
              onClick={async () => {
                try {
                  await deleteAccountMutation.mutateAsync();
                  toast.success("회원 탈퇴가 완료되었습니다.");
                  window.location.href = "/login";
                } catch {
                  toast.error("회원 탈퇴에 실패했습니다.");
                }
              }}
            >
              {deleteAccountMutation.isPending ? "탈퇴 처리 중..." : "회원 탈퇴"}
            </Button>
            <p className="text-sm text-muted-foreground">
              계속하면 계정 삭제에 동의하는 것으로 간주됩니다.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
