"use client";

import { BookMarked, BookOpen, Layers2, Sparkles } from "lucide-react";

import { CreateBookModal } from "@/components/book/create-book-modal";

const COMING_SOON = [
  {
    icon: BookOpen,
    title: "오늘의 카드 스택",
    description: "카드가 쌓이면 오래 보지 않은 카드부터 복습할 수 있어요.",
  },
  {
    icon: BookMarked,
    title: "지금 읽는 책",
    description: "책 상세에서 진행 상태를 바꾸면 이곳에서 이어서 관리해요.",
  },
  {
    icon: Layers2,
    title: "최근 기록한 책",
    description: "카드를 남기면 최근 활동이 있었던 책이 모여요.",
  },
];

export function BooksColdStartHero() {
  return (
    <div className="flex flex-col gap-12 pb-4">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl border border-border/40 bg-card/30 px-6 py-10 text-center md:px-10 md:py-12">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Sparkles className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-foreground md:text-[28px]">
          책 한 권이면 시작할 수 있어요
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          서재에 책을 추가하고 카드를 남기면, 복습 스택과 읽기 현황이 자동으로
          채워져요.
        </p>
        <div className="mt-8 w-full max-w-xs sm:max-w-sm">
          <CreateBookModal
            triggerLabel="첫 책 추가하기"
            triggerClassName="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/75">
          나중에 이 자리에
        </p>
        <ul className="flex flex-col gap-6">
          {COMING_SOON.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="border-l-2 border-primary/25 pl-4 text-left md:pl-5"
            >
              <div className="flex gap-2.5">
                <Icon
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
