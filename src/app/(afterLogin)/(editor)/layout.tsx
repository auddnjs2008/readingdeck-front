import DeckEditorNav from "@/components/nav/deck-editor-nav";

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DeckEditorNav />
      {children}
    </>
  );
}

