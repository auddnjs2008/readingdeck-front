import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center">
      <h1 className="font-serif text-2xl">책 정보를 찾을 수 없어요.</h1>
      <p className="mt-4 text-muted-foreground">
        ISBN을 확인하거나 읽던 덱으로 돌아가 주세요.
      </p>
      <Link
        className="mt-6 inline-block text-primary underline"
        href="/community"
      >
        공개 덱 보기
      </Link>
    </main>
  );
}
