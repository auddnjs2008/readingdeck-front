import Link from "next/link";

export default function CommunityNotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center text-foreground">
      <h1 className="font-serif text-xl leading-relaxed">공유된 덱을 찾을 수 없습니다.</h1>
      <Link href="/community" className="mt-6 inline-block text-sm text-primary underline underline-offset-4">커뮤니티로</Link>
    </main>
  );
}
