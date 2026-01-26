export type BookRecord = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  backgroundImage?: string;
  cardsCount: number;
  status: "Reading" | "Completed" | "Paused";
  recentInsight?: string;
};

export const mockBooks: BookRecord[] = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    publisher: "Avery",
    cardsCount: 12,
    status: "Completed",
    recentInsight:
      "You do not rise to the level of your goals. You fall to the level of your systems.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTukVqOV_ZOHJpCPERYcT7FMiaFADS38tfnjnCYDjhycFZNsnto5oEFAuwb1AnWu9UOWs-tvGrhVhcZ0TjGBS3WW8_nAiPZQL_R59KblMc0yZJegYUh93xpirNkNKzI7nVs_YF6yeNUI1dMGw9xWhVjBB6NsR0IZR4Mj6G11QUyWrXCgIOtH7QwcxOxvdO3FiNGW7JzkqG3rzjAIBJWG4sBvXRTN9hy2oMDoNvmvCFQmncUDHmCrIeXPxsQSvT628gamaANnYhYs8",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    publisher: "Grand Central",
    cardsCount: 8,
    status: "Reading",
    recentInsight:
      "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUVw9AmRX0yJY9Ya4nSIvnUgPw_E-yVULOPRoV4ZDjKSHJaEf_uSA05Gos_ghWFDsoF5E-S28WaIupTkG8IIilIuJ8NfOpn6FRFa9DSbDEe1Yj42STD5D9D2pt6Y3cHab_6fnnFkD2eiI_kYb-tnLLgahfAvFAQI4AO8t85X2eE6JCFFZ2V5jXPPoPBsb9RPUDVagcFWXyErHg6Vn603Ma0u02KAPjMVC39IEmtrK8ibm5Gm5mZpXUseNCr9HbJUO9m8bXniAn59s",
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    publisher: "HarperOne",
    cardsCount: 4,
    status: "Completed",
    recentInsight:
      "When you want something, all the universe conspires in helping you to achieve it.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmo_fpMXOmlRZUqprPDQ8rtHUE4D6PFJgPdY1SYQRAK2S1sFciYFM3DDi8QM3gnbAEdpfdbB7gD0RzSbscXLtsTIiGUcA3YuO-YLwhxq9XYhjf72-wv9HU339v-1kA9gi1lGigtC0n1gKYX7rGnSq_VfT--CSwhXsfXss_cW3qK9y6_-GO-3UiP8aGm4972LanmIM2sW5DGxLm2zBBo44cDvg-VpzTBk8tLF1fjvazt0hqCeOAG8decdXi3stxjN5rNRzmeUbtRZ0",
  },
  {
    id: 4,
    title: "Dune",
    author: "Frank Herbert",
    publisher: "Ace",
    cardsCount: 15,
    status: "Reading",
    recentInsight:
      "I must not fear. Fear is the mind-killer. Fear is the little-death that brings obliteration.",
  },
  {
    id: 5,
    title: "Project Hail Mary",
    author: "Andy Weir",
    publisher: "Ballantine",
    cardsCount: 9,
    status: "Reading",
    recentInsight:
      "In the face of overwhelming odds, I'm left with only one option, I'm gonna have to science the sh*t out of this.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHDgbNqtpolmKeWtibjXILFQ4YLSfjb7pT2XWzcbhCeiLaiyQsJOK9N9adPydveAD8P7V2JeEx-NVGpmrYAN-qBbUOVBnzQw_6peYeojHNARMOBvPVrNZOw90w_v2nEZfEVrZ3HQL9RqEK9yBDyjmPZA5AoKDdxTSfCAhQXQrfxaEeZw8HDWbasWf2_fIWCxpFaSz3_N8ra0Z7i4RXt-mqa4qwpvWmr3GOmBqgNB3XJyTlr8DwBYqCBubKpBXz69cOvbyy36gAOE",
  },
  {
    id: 6,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    publisher: "Farrar, Straus and Giroux",
    cardsCount: 6,
    status: "Paused",
    recentInsight:
      "Digital minimalists are all around us. They’re the calm, happy people who can hold long conversations without furtive glances at their phones.",
  },
];
