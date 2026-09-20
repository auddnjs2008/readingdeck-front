"use client";

import { CreateBookModal } from "@/entities/book/ui/create-book-modal";

const COMING_SOON = [
  {
    title: "오늘의 카드",
    description: "카드가 쌓이면 오래 보지 않은 카드부터 복습할 수 있어요.",
  },
  {
    title: "지금 읽는 책",
    description: "책 상세에서 진행 상태를 바꾸면 이곳에서 이어서 관리해요.",
  },
  {
    title: "최근 기록한 책",
    description: "카드를 남기면 최근 활동이 있었던 책이 모여요.",
  },
];

export function BooksColdStartHero() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pb-4">
      <div className="border-y border-[#d8d4cc] py-12 text-left md:py-16 dark:border-[#4b4842]">
        <p className="mb-3 text-[10px] font-medium text-[#77726b] dark:text-[#aaa49b]">
          START YOUR LIBRARY
        </p>
        <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
          책 한 권이면 시작할 수 있어요
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#77726b] dark:text-[#aaa49b]">
          서재에 책을 추가하고 카드를 남기면, 복습 스택과 읽기 현황이 자동으로
          채워져요.
        </p>
        <div className="mt-8">
          <CreateBookModal
            triggerLabel="첫 책 추가하기"
            triggerClassName="h-11 rounded-[4px] bg-[#a45138] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#8e432f] dark:bg-[#d77b5e] dark:hover:bg-[#c66e53]"
          />
        </div>
      </div>

      <div className="w-full pt-10">
        <p className="mb-4 text-[10px] font-medium text-[#77726b] dark:text-[#aaa49b]">
          나중에 이 자리에
        </p>
        <ul className="border-t border-[#d8d4cc] dark:border-[#4b4842]">
          {COMING_SOON.map(({ title, description }) => (
            <li
              key={title}
              className="grid gap-1 border-b border-[#d8d4cc] py-5 sm:grid-cols-[180px_1fr] sm:gap-6 dark:border-[#4b4842]"
            >
              <p className="font-serif text-sm font-semibold">{title}</p>
              <p className="text-xs leading-relaxed text-[#77726b] dark:text-[#aaa49b]">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
