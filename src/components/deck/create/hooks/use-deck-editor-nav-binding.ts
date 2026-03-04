"use client";

import { useEffect } from "react";
import {
  type DeckEditorSaveState,
  useDeckEditorControls,
} from "@/components/nav/deck-editor-controls-context";

type UseDeckEditorNavBindingParams = {
  editorMode: "graph" | "deck";
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  title: string;
  isDirty: boolean;
  canSave: boolean;
  canPublish: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  saveState: DeckEditorSaveState;
  lastSavedAt: number | null;
  onSave: () => void;
  onPublish: () => void;
  onTitleCommit: (title: string) => void;
};

export function useDeckEditorNavBinding({
  editorMode,
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
  onSave,
  onPublish,
  onTitleCommit,
}: UseDeckEditorNavBindingParams) {
  const { registerActions, registerAvailability, registerDeck } =
    useDeckEditorControls();

  useEffect(() => {
    registerActions({ undo, redo });
    return () => registerActions(null);
  }, [redo, registerActions, undo]);

  useEffect(() => {
    registerAvailability({ canUndo, canRedo });
  }, [canRedo, canUndo, registerAvailability]);

  useEffect(() => {
    registerDeck({
      editorMode,
      title,
      isDirty,
      canSave,
      canPublish,
      isSaving,
      isPublishing,
      saveState,
      lastSavedAt,
      onSave,
      onPublish,
      onTitleCommit,
    });
  }, [
    canPublish,
    canSave,
    editorMode,
    isDirty,
    isPublishing,
    isSaving,
    lastSavedAt,
    onPublish,
    onSave,
    onTitleCommit,
    registerDeck,
    saveState,
    title,
  ]);

  useEffect(() => {
    return () => registerDeck(null);
  }, [registerDeck]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const withModifier = event.metaKey || event.ctrlKey;
      if (!withModifier) return;

      const key = event.key.toLowerCase();
      if (key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }
      if ((key === "z" && event.shiftKey) || key === "y") {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [redo, undo]);
}
