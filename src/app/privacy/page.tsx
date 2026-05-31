import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "ReadingDeck 개인정보처리방침",
};

const sections = [
  {
    title: "1. 개요",
    body: [
      "ReadingDeck은 사용자가 읽은 책을 정리하고, 책에 연결된 카드와 생각을 저장하고 다시 꺼내볼 수 있도록 돕는 서비스입니다.",
      "이 개인정보처리방침은 ReadingDeck 웹 서비스와 ReadingDeck ChatGPT 앱 이용 과정에서 어떤 정보를 수집하고 어떻게 사용하는지 설명합니다.",
    ],
  },
  {
    title: "2. 수집하는 정보",
    body: [
      "계정 및 인증 정보: 로그인과 계정 연결에 필요한 식별 정보, OAuth 연동 정보, 로그인 제공자 정보",
      "사용자 콘텐츠: 사용자가 저장한 책, 카드, 인용문, 생각, 페이지 정보, 검색 요청",
      "기술 및 운영 정보: 요청 로그, 오류 로그, 보안과 안정성 확보를 위한 최소한의 운영 로그",
      "도서 메타데이터 및 이미지 정보: 책 제목, 저자, 출판사, 책 표지 URL 또는 업로드 자산 참조값",
    ],
  },
  {
    title: "3. 정보를 사용하는 목적",
    body: [
      "계정 인증과 세션 유지",
      "사용자가 저장한 책과 카드를 조회, 검색, 생성, 수정하기 위한 서비스 제공",
      "실제 도서 검색 결과를 제공하기 위한 외부 도서 검색 연동",
      "오류 대응, 서비스 안정성 개선, 악용 방지",
    ],
  },
  {
    title: "4. 제3자 서비스 및 처리자",
    body: [
      "ReadingDeck은 서비스 운영을 위해 OpenAI, Cloudflare, Railway, Amazon S3 또는 CloudFront, Kakao 도서 검색과 같은 외부 서비스를 사용할 수 있습니다.",
      "이들 서비스는 각자의 역할 범위 안에서만 데이터를 처리합니다.",
    ],
  },
  {
    title: "5. 보관 및 삭제",
    body: [
      "계정 연결 정보는 계정 삭제 또는 연동 해제 시까지 보관될 수 있습니다.",
      "책과 카드는 사용자가 삭제하거나 계정을 삭제할 때까지 보관될 수 있습니다.",
      "운영 로그는 보안과 안정성 확보를 위해 일정 기간 보관 후 삭제될 수 있습니다.",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: [
      "이용자는 자신의 개인정보와 저장된 콘텐츠에 대해 열람, 정정, 삭제를 요청할 수 있습니다.",
      "개인정보 또는 서비스 이용 문의는 아래 연락처로 요청할 수 있습니다.",
    ],
  },
  {
    title: "7. 문의처",
    body: ["이메일: auddnjs2008@gmail.com"],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <div className="space-y-4 border-b border-border pb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          ReadingDeck
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">개인정보처리방침</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          최종 업데이트: 2026년 5월 31일
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
            <div className="space-y-3 text-sm leading-7 text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
