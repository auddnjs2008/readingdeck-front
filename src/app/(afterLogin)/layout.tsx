import TopNav from "@/components/nav/top-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNav />
      <div className="pt-16">{children}</div>
    </>
  );
}
