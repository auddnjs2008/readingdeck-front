"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RegisterActionsPayload = {
  undo: () => void;
  redo: () => void;
};

type RegisterAvailabilityPayload = {
  canUndo: boolean;
  canRedo: boolean;
};

export type DeckEditorSaveState = "idle" | "saving" | "saved" | "error";
export type DeckEditorMode = "graph" | "deck";
export type DeckEditorStatus = "draft" | "published";

type RegisterDeckPayload = {
  editorMode: DeckEditorMode;
  deckStatus: DeckEditorStatus;
  title: string;
  description: string;
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
  onDescriptionCommit: (description: string) => void;
};

type DeckEditorControlsContextValue = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  editorMode: DeckEditorMode;
  deckStatus: DeckEditorStatus;
  title: string;
  description: string;
  isDirty: boolean;
  canSave: boolean;
  canPublish: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  saveState: DeckEditorSaveState;
  lastSavedAt: number | null;
  save: () => void;
  publish: () => void;
  commitTitle: (title: string) => void;
  commitDescription: (description: string) => void;
  registerActions: (payload: RegisterActionsPayload | null) => void;
  registerAvailability: (payload: RegisterAvailabilityPayload) => void;
  registerDeck: (payload: RegisterDeckPayload | null) => void;
};

const noop = () => {};
const noopCommitTitle: (title: string) => void = () => {};
const noopCommitDescription: (description: string) => void = () => {};

const defaultDeckState = {
  editorMode: "graph" as DeckEditorMode,
  deckStatus: "draft" as DeckEditorStatus,
  title: "My Reading Flow",
  description: "",
  isDirty: false,
  canSave: false,
  canPublish: false,
  isSaving: false,
  isPublishing: false,
  saveState: "idle" as DeckEditorSaveState,
  lastSavedAt: null as number | null,
};

const DeckEditorControlsContext = createContext<DeckEditorControlsContextValue>({
  undo: noop,
  redo: noop,
  canUndo: false,
  canRedo: false,
  ...defaultDeckState,
  save: noop,
  publish: noop,
  commitTitle: noopCommitTitle,
  commitDescription: noopCommitDescription,
  registerActions: noop,
  registerAvailability: noop,
  registerDeck: noop,
});

export function DeckEditorControlsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const undoRef = useRef<() => void>(noop);
  const redoRef = useRef<() => void>(noop);
  const saveRef = useRef<() => void>(noop);
  const publishRef = useRef<() => void>(noop);
  const commitTitleRef = useRef<(title: string) => void>(noopCommitTitle);
  const commitDescriptionRef = useRef<(description: string) => void>(
    noopCommitDescription
  );
  const [availability, setAvailability] = useState<RegisterAvailabilityPayload>({
    canUndo: false,
    canRedo: false,
  });
  const [deckState, setDeckState] = useState(defaultDeckState);

  const undo = useCallback(() => {
    undoRef.current();
  }, []);

  const redo = useCallback(() => {
    redoRef.current();
  }, []);

  const registerActions = useCallback((payload: RegisterActionsPayload | null) => {
    undoRef.current = payload?.undo ?? noop;
    redoRef.current = payload?.redo ?? noop;
  }, []);

  const registerAvailability = useCallback(
    (payload: RegisterAvailabilityPayload) => {
      setAvailability((prev) => {
        if (
          prev.canUndo === payload.canUndo &&
          prev.canRedo === payload.canRedo
        ) {
          return prev;
        }
        return payload;
      });
    },
    []
  );

  const registerDeck = useCallback((payload: RegisterDeckPayload | null) => {
    saveRef.current = payload?.onSave ?? noop;
    publishRef.current = payload?.onPublish ?? noop;
    commitTitleRef.current = payload?.onTitleCommit ?? noopCommitTitle;
    commitDescriptionRef.current =
      payload?.onDescriptionCommit ?? noopCommitDescription;

    setDeckState((prev) => {
      const next = payload
        ? {
            editorMode: payload.editorMode,
            deckStatus: payload.deckStatus,
            title: payload.title,
            description: payload.description,
            isDirty: payload.isDirty,
            canSave: payload.canSave,
            canPublish: payload.canPublish,
            isSaving: payload.isSaving,
            isPublishing: payload.isPublishing,
            saveState: payload.saveState,
            lastSavedAt: payload.lastSavedAt,
          }
        : defaultDeckState;

      if (
        prev.editorMode === next.editorMode &&
        prev.deckStatus === next.deckStatus &&
        prev.title === next.title &&
        prev.description === next.description &&
        prev.isDirty === next.isDirty &&
        prev.canSave === next.canSave &&
        prev.canPublish === next.canPublish &&
        prev.isSaving === next.isSaving &&
        prev.isPublishing === next.isPublishing &&
        prev.saveState === next.saveState &&
        prev.lastSavedAt === next.lastSavedAt
      ) {
        return prev;
      }

      return next;
    });
  }, []);

  const save = useCallback(() => {
    saveRef.current();
  }, []);

  const publish = useCallback(() => {
    publishRef.current();
  }, []);

  const commitTitle = useCallback((title: string) => {
    commitTitleRef.current(title);
  }, []);

  const commitDescription = useCallback((description: string) => {
    commitDescriptionRef.current(description);
  }, []);

  const value = useMemo<DeckEditorControlsContextValue>(
    () => ({
      undo,
      redo,
      canUndo: availability.canUndo,
      canRedo: availability.canRedo,
      ...deckState,
      save,
      publish,
      commitTitle,
      commitDescription,
      registerActions,
      registerAvailability,
      registerDeck,
    }),
    [
      availability.canRedo,
      availability.canUndo,
      commitDescription,
      commitTitle,
      deckState,
      publish,
      redo,
      registerActions,
      registerAvailability,
      registerDeck,
      save,
      undo,
    ]
  );

  return (
    <DeckEditorControlsContext.Provider value={value}>
      {children}
    </DeckEditorControlsContext.Provider>
  );
}

export function useDeckEditorControls() {
  return useContext(DeckEditorControlsContext);
}
