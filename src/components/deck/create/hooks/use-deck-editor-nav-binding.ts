"use client";

import { useEffect } from "react";
import { useDeckEditorControls } from "@/components/nav/deck-editor-controls-context";

type UseDeckEditorNavBindingParams = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function useDeckEditorNavBinding({
  undo,
  redo,
  canUndo,
  canRedo,
}: UseDeckEditorNavBindingParams) {
  const { registerActions, registerAvailability } = useDeckEditorControls();

  useEffect(() => {
    registerActions({ undo, redo });
    return () => registerActions(null);
  }, [redo, registerActions, undo]);

  useEffect(() => {
    registerAvailability({ canUndo, canRedo });
  }, [canRedo, canUndo, registerAvailability]);

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

