import TopNav from "@/widgets/top-nav/ui";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <div className="pt-16">{children}</div>
    </>
  );
}
