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

type DeckEditorControlsContextValue = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  registerActions: (payload: RegisterActionsPayload | null) => void;
  registerAvailability: (payload: RegisterAvailabilityPayload) => void;
};

const noop = () => {};

const DeckEditorControlsContext = createContext<DeckEditorControlsContextValue>({
  undo: noop,
  redo: noop,
  canUndo: false,
  canRedo: false,
  registerActions: noop,
  registerAvailability: noop,
});

export function DeckEditorControlsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const undoRef = useRef<() => void>(noop);
  const redoRef = useRef<() => void>(noop);
  const [availability, setAvailability] = useState<RegisterAvailabilityPayload>({
    canUndo: false,
    canRedo: false,
  });

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

  const value = useMemo<DeckEditorControlsContextValue>(
    () => ({
      undo,
      redo,
      canUndo: availability.canUndo,
      canRedo: availability.canRedo,
      registerActions,
      registerAvailability,
    }),
    [availability.canRedo, availability.canUndo, redo, registerActions, registerAvailability, undo]
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

