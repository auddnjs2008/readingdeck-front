import TopNav from "@/widgets/top-nav/ui";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="bg-background pt-16 text-foreground">{children}</div>
    </>
  );
}
