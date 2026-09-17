"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      <section className="py-12">
        <p className="text-xs font-semibold text-primary">ACCOUNT & SUPPORT</p>
        <h2 className="mt-3 font-serif text-2xl font-medium">계정과 지원</h2>

        <nav className="mt-8 border-t border-border" aria-label="계정과 지원 메뉴">
          {[
            ["고객지원", "/support"],
            ["개인정보처리방침", "/privacy"],
            ["이용약관", "/terms"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-14 items-center justify-between border-b border-border text-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span>{label}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ))}

          <button
            type="button"
            className="flex min-h-14 w-full cursor-pointer items-center justify-between border-b border-border text-left text-sm text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            onClick={() => setDeleteOpen(true)}
          >
            <span>회원 탈퇴</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[520px] rounded-md px-6 py-6 sm:px-8">
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
