export function BookInformationLink({
  isbn,
  children,
}: {
  isbn?: string | null;
  children: React.ReactNode;
}) {
  if (!isbn || !/^97[89]\d{10}$/.test(isbn)) return <>{children}</>;
  return (
    <a
      href={`/book-info/${isbn}`}
      className="underline decoration-border underline-offset-4 hover:text-primary"
    >
      {children}
    </a>
  );
}
