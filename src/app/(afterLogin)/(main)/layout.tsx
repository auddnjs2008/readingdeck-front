import TopNav from "@/widgets/top-nav/ui";

export default function MainLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <TopNav />
      <div className="pt-16">{children}</div>
      {modal}
    </>
  );
}
