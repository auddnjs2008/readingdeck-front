import DeckEditorNav from "@/widgets/deck-editor/ui/deck-editor-nav";
import { DeckEditorControlsProvider } from "@/widgets/deck-editor/model/deck-editor-controls-context";

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
