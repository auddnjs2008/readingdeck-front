"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCheck,
  CheckCircle2,
  Edit3,
  LibraryBig,
  Loader2,
  OctagonAlert,
  Redo2,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";
import { useDeckDeleteMutation } from "@/hooks/deck/react-query/useDeckDeleteMutation";
import { useDeckEditorControls } from "./deck-editor-controls-context";

const formatRelativeSavedAt = (timestamp: number) => {
  const diffMs = Date.now() - timestamp;
  if (diffMs < 10_000) return "just now";

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};

export default function DeckEditorNav() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
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
  } = useDeckEditorControls();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [timeTick, setTimeTick] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
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
        text: "Saving...",
        icon: (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ),
      };
    }
    if (saveState === "error") {
      return {
        text: "Save failed",
        icon: <OctagonAlert className="h-3.5 w-3.5 text-destructive" />,
      };
    }
    if (isDirty) {
      return {
        text: "Unsaved changes",
        icon: <span className="h-2 w-2 rounded-full bg-amber-500" />,
      };
    }

    const relativeSavedAt = lastSavedAt
      ? formatRelativeSavedAt(lastSavedAt)
      : null;
    return {
      text: relativeSavedAt ? `Saved ${relativeSavedAt}` : "Saved",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    };
  }, [isDirty, isSaving, lastSavedAt, saveState, timeTick]);

  const applyTitle = () => {
    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      setDraftTitle(title);
      setIsEditingTitle(false);
      return;
    }
    commitTitle(nextTitle);
    setIsEditingTitle(false);
  };

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

  return (
    <header className="h-16 shrink-0 border-b border-border bg-card px-4 shadow-md">
      <div className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="mr-2 flex items-center gap-2 text-primary">
            <LibraryBig className="h-7 w-7" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              DeckBuilder
            </span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              href="/"
            >
              Home
            </Link>
            <Link
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              href="/books"
            >
              Books
            </Link>
            <Link
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              href="/decks"
            >
              Decks
            </Link>
          </nav>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
          <LibraryBig className="h-5 w-5 text-primary" />
          {isEditingTitle ? (
            <Input
              autoFocus
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onBlur={applyTitle}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyTitle();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setDraftTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="h-8 w-[260px]"
              maxLength={255}
            />
          ) : (
            <>
              <h1 className="max-w-[280px] truncate text-base font-semibold tracking-wide text-foreground">
                {title}
              </h1>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                onClick={() => {
                  setDraftTitle(title);
                  setIsEditingTitle(true);
                }}
                aria-label="Edit deck name"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 px-2 text-xs text-muted-foreground lg:flex">
            {saveStatus.icon}
            <span>{saveStatus.text}</span>
          </div>
          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Save"
            disabled={!canSave || isSaving || isPublishing}
            onClick={save}
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canPublish || isSaving || isPublishing}
            onClick={publish}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            {isPublishing ? "생성 중..." : "덱 생성"}
          </button>

          {/* Delete Button */}
          {deckId && (
            <AlertDialog
              open={showDeleteAlert}
              onOpenChange={setShowDeleteAlert}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="ml-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete deck"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-popover p-6 sm:rounded-xl">
                <AlertDialogHeader className="space-y-3">
                  <AlertDialogTitle className="text-lg font-bold text-foreground">
                    정말 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {title}
                    </span>
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
                      className="h-10 bg-blue-600 px-6 text-sm font-medium hover:bg-blue-700"
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
    </header>
  );
}
