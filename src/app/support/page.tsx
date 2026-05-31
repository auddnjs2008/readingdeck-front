import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "고객지원",
  description: "ReadingDeck 고객지원 및 문의 안내",
};

export default function SupportPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <div className="space-y-4 border-b border-border pb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          ReadingDeck
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">고객지원</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          로그인, 책/카드 데이터, ChatGPT 앱 연결, 기타 이용 문의는 아래 채널로 연락해 주세요.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">문의 방법</h2>
          <p>
            이메일: <a className="underline underline-offset-4" href="mailto:auddnjs2008@gmail.com">auddnjs2008@gmail.com</a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">문의 시 함께 보내주시면 좋은 정보</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>문제가 발생한 화면 또는 기능 이름</li>
            <li>발생 시각과 재현 방법</li>
            <li>오류 문구 또는 스크린샷</li>
            <li>ChatGPT 앱 관련 문제라면 사용한 요청 문장</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">정책 문서</h2>
          <p>
            개인정보 처리와 관련된 자세한 내용은 <Link href="/privacy" className="underline underline-offset-4">개인정보처리방침</Link>에서 확인할 수 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
