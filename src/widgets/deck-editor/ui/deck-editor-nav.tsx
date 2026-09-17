"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  CheckCircle2,
  Edit3,
  Loader2,
  OctagonAlert,
  Redo2,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import DeckMetaPanel from "@/widgets/deck-editor/deck-meta-panel";
import { useDeckDeleteMutation } from "@/entities/deck/model/queries/useDeckDeleteMutation";
import { useDeckEditorControls } from "@/widgets/deck-editor/model/deck-editor-controls-context";

const formatRelativeSavedAt = (timestamp: number, nowMs = Date.now()) => {
  const diffMs = nowMs - timestamp;
  if (diffMs < 10_000) return "방금";

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}초 전`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
};

export default function DeckEditorNav() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    editorMode,
    deckStatus,
    title,
    isDirty,
    canSave,
    canPublish,
    isSaving,
    isPublishing,
    saveState,
    lastSavedAt,
    save,
    publish,
    commitTitle,
    description,
    commitDescription,
  } = useDeckEditorControls();
  const [timeTick, setTimeTick] = useState(() => Date.now());
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isMetaPanelOpen, setIsMetaPanelOpen] = useState(false);
  const deleteDeckMutation = useDeckDeleteMutation();
  const router = useRouter();
  const params = useParams<{ deckId: string }>();
  const deckId = Number(params?.deckId);

  useEffect(() => {
    if (!lastSavedAt) return;
    const timer = window.setInterval(() => {
      setTimeTick(Date.now());
    }, 15_000);

    return () => window.clearInterval(timer);
  }, [lastSavedAt]);

  const saveStatus = useMemo(() => {
    if (isSaving) {
      return {
        text: "저장 중...",
        icon: (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ),
      };
    }
    if (saveState === "error") {
      return {
        text: "저장 실패",
        icon: <OctagonAlert className="h-3.5 w-3.5 text-destructive" />,
      };
    }
    if (isDirty) {
      return {
        text: "저장되지 않은 변경",
        icon: <span className="h-2 w-2 rounded-full bg-amber-500" />,
      };
    }

    const relativeSavedAt = lastSavedAt
      ? formatRelativeSavedAt(lastSavedAt, timeTick)
      : null;
    return {
      text: relativeSavedAt ? `${relativeSavedAt} 저장됨` : "저장됨",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    };
  }, [isDirty, isSaving, lastSavedAt, saveState, timeTick]);

  const handleDelete = () => {
    if (!deckId) return;
    deleteDeckMutation.mutate(
      { path: { deckId } },
      {
        onSuccess: () => {
          router.push("/decks");
        },
      }
    );
  };

  const isPublishedDeck = deckStatus === "published";
  const primaryActionLabel = isPublishedDeck
    ? isSaving
      ? "반영 중..."
      : "변경사항 반영"
    : isPublishing
      ? "발행 중..."
      : "발행하기";
  const primaryActionDisabled = isPublishedDeck
    ? !canSave || isSaving || isPublishing
    : !canPublish || isSaving || isPublishing;
  const handlePrimaryAction = isPublishedDeck ? save : publish;

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background px-4">
      <div className="mx-auto flex h-full items-center gap-3">
        <Link href="/decks" title="나의 덱" aria-label="나의 덱" className="flex shrink-0 items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <div className="hidden items-center gap-2 sm:flex">
            <Image
              src="/favicon.svg"
              alt="ReadingDeck"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-md object-cover"
            />
            <span className="hidden text-sm font-semibold text-foreground xl:inline">
              ReadingDeck
            </span>
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-1 border-l border-border pl-3 sm:gap-2 sm:pl-5">
          <h1 className="truncate font-serif text-base text-foreground sm:text-lg">
            {title}
          </h1>
          <button
            type="button"
            className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            onClick={() => setIsMetaPanelOpen(true)}
            aria-label="덱 정보 편집"
            title="덱 정보 편집"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1.5 px-2 text-xs text-muted-foreground lg:flex">
            {saveStatus.icon}
            <span>{saveStatus.text}</span>
          </div>
          {editorMode === "graph" ? (
            <div className="hidden items-center border-l border-border pl-2 md:flex">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="실행 취소"
                title="실행 취소"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="다시 실행"
                title="다시 실행"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          {!isPublishedDeck ? (
            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="저장"
              aria-label="덱 저장"
              disabled={!canSave || isSaving || isPublishing}
              onClick={save}
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary px-2.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
            disabled={primaryActionDisabled}
            onClick={handlePrimaryAction}
          >
            {isPublishedDeck ? (
              isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )
            ) : isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            {primaryActionLabel}
          </button>

          {/* Delete Button */}
          {Number.isFinite(deckId) && (
            <AlertDialog
              open={showDeleteAlert}
              onOpenChange={setShowDeleteAlert}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="ml-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="덱 삭제"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-popover p-6 sm:rounded-md">
                <AlertDialogHeader className="space-y-3">
                  <AlertDialogTitle className="text-lg font-bold text-foreground">
                    정말 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {title}
                    </span>{" "}
                    덱을 삭제하면 복구할 수 없습니다.
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
                    <AlertDialogCancel className="h-10 border-0 bg-transparent px-4 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="h-10 bg-destructive px-6 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                    >
                      삭제
                    </AlertDialogAction>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <DeckMetaPanel
        open={isMetaPanelOpen}
        title={title}
        description={description}
        onClose={() => setIsMetaPanelOpen(false)}
        onApply={({ title: nextTitle, description: nextDescription }) => {
          commitTitle(nextTitle);
          commitDescription(nextDescription);
        }}
      />
    </header>
  );
}
