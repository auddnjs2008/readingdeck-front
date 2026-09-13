import Link from "next/link";

export default function CommunityNotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">공유된 덱을 찾을 수 없습니다.</h1>
      <Link href="/community" className="mt-6 inline-block underline">커뮤니티로</Link>
    </main>
  );
}
