export type CardType = "Insight" | "Question" | "Change" | "Quote";

export type CardRecord = {
  id: number;
  type: CardType;
  quote?: string;
  thought: string;
  backgroundImage?: string;
};

export const mockCards: CardRecord[] = [
  {
    id: 1,
    type: "Insight",
    quote:
      "Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.",
    thought:
      "I want to make my morning cues more visible so the habit loop starts automatically.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtLox0o0T-8cxN8Zk6l40m7eV3i0m3L9q4qWlX9wFRl_HvGo1HkzI8xSxG0FVR6D8N-bc2Zb8v6tB2f6s0iE9BdYQ1B4t1wD5b6hbe6SxdgA9-pkn1S4T0M3xgYlM2I8n8E4s9q-1xM9mX2nT7Wj7pM2",
  },
  {
    id: 2,
    type: "Question",
    thought:
      "How does identity-based habit formation differ between creative work and administrative tasks?",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6tH1x7o3S3g4O-4c3n_0U8V1a47dWJrQx0-3mE3o4c4b3c9pZK9v3sCkT6o1n9p3s4b8XvGmO2VvZ8R9g2x5G2o6QvH6d2o5B2",
  },
  {
    id: 3,
    type: "Change",
    quote: "If it takes less than two minutes, do it immediately.",
    thought:
      "I’m committing to the 2‑minute rule for my morning routine starting tomorrow.",
  },
  {
    id: 4,
    type: "Quote",
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    thought:
      "This is a reminder to build systems that survive motivation swings.",
  },
];
