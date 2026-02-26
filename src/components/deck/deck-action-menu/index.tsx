"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeckDeleteMutation } from "@/hooks/deck/react-query/useDeckDeleteMutation";

interface DeckActionMenuProps {
  deckId: number;
  deckName: string;
}

export function DeckActionMenu({ deckId, deckName }: DeckActionMenuProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const deleteDeckMutation = useDeckDeleteMutation();

  const handleDelete = () => {
    deleteDeckMutation.mutate({ path: { deckId } });
    setShowDeleteAlert(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteAlert(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent
          onClick={(e) => e.stopPropagation()}
          className="border-border bg-[#151c27] p-6 sm:rounded-xl"
        >
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              정말 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{deckName}</span>{" "}
              덱을 삭제하면 복구할 수 없습니다. 계속 진행하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex w-full items-center justify-between sm:justify-between">
            <div className="hidden items-center text-xs text-muted-foreground sm:flex">
              <span className="mr-1.5 rounded border border-border/50 bg-background/50 px-1.5 py-0.5 font-mono text-[10px]">
                Esc
              </span>
              닫기
            </div>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <AlertDialogCancel
                onClick={(e) => e.stopPropagation()}
                className="h-10 border-0 bg-transparent px-4 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="h-10 bg-blue-600 px-6 text-sm font-medium hover:bg-blue-700"
              >
                삭제
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
