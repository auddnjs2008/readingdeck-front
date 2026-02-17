import DeckEditorNav from "@/components/nav/deck-editor-nav";
import { DeckEditorControlsProvider } from "@/components/nav/deck-editor-controls-context";

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DeckEditorControlsProvider>
      <DeckEditorNav />
      {children}
    </DeckEditorControlsProvider>
  );
}
