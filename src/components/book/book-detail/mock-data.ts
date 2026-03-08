import type { BookDetailCardItem, BookDetailSidebarInfo } from "./types";

export const mockBook: BookDetailSidebarInfo = {
  title: "Atomic Habits",
  author: "James Clear",
  year: "2018",
  coverUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTukVqOV_ZOHJpCPERYcT7FMiaFADS38tfnjnCYDjhycFZNsnto5oEFAuwb1AnWu9UOWs-tvGrhVhcZ0TjGBS3WW8_nAiPZQL_R59KblMc0yZJegYUh93xpirNkNKzI7nVs_YF6yeNUI1dMGw9xWhVjBB6NsR0IZR4Mj6G11QUyWrXCgIOtH7QwcxOxvdO3FiNGW7JzkqG3rzjAIBJWG4sBvXRTN9hy2oMDoNvmvCFQmncUDHmCrIeXPxsQSvT628gamaANnYhYs8",
  statusLabel: "Finished",
  progressPercent: 100,
  readAt: "Read Oct 2023",
  rating: 4.8,
};

export const mockCards: BookDetailCardItem[] = [
  {
    id: 1,
    type: "insight",
    quote:
      "Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.",
    thought:
      "I want to make my morning cues more visible so the habit loop starts automatically.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtLox0o0T-8cxN8Zk6l40m7eV3i0m3L9q4qWlX9wFRl_HvGo1HkzI8xSxG0FVR6D8N-bc2Zb8v6tB2f6s0iE9BdYQ1B4t1wD5b6hbe6SxdgA9-pkn1S4T0M3xgYlM2I8n8E4s9q-1xM9mX2nT7Wj7pM2",
    pageStart: 15,
    pageEnd: 18,
  },
  {
    id: 2,
    type: "question",
    thought:
      "How does identity-based habit formation differ between creative work and administrative tasks?",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6tH1x7o3S3g4O-4c3n_0U8V1a47dWJrQx0-3mE3o4c4b3c9pZK9v3sCkT6o1n9p3s4b8XvGmO2VvZ8R9g2x5G2o6QvH6d2o5B2",
    pageStart: 42,
    pageEnd: null,
  },
  {
    id: 3,
    type: "change",
    quote: "If it takes less than two minutes, do it immediately.",
    thought:
      "I'm committing to the 2‑minute rule for my morning routine starting tomorrow.",
    pageStart: 120,
    pageEnd: 121,
  },
  {
    id: 4,
    type: "quote",
    quote:
      "You do not rise to the level of your goals. You fall to the level of your systems.",
    thought:
      "This is a reminder to build systems that survive motivation swings.",
    pageStart: null,
    pageEnd: null,
  },
];
