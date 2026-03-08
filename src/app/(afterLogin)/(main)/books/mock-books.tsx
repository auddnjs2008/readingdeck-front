import type { Book } from "@/type/book";
import type { Card } from "@/type/card";

export const mockDailyStack: Card[] = [
  {
    id: 101,
    type: "insight",
    quote: null,
    thought: "Small habits compound into remarkable results.",
    book: {
      id: 1,
      cardCount: 10,
      title: "Atomic Habits",
      author: "James Clear",
      publisher: "Avery",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXsQz0NCmNRvMG1iXWsh-Vi1OgrA7ln-2BsvM7xYO8NmgNAqGlGuVQdQmGIrQ4T4elR69wkToQAcwnxZ1dX7q9WYMXStnTUOlu4J4o2vPbqwODy7DOvlmB5WCmeikLUvJP1eCXilzitgzKkqx4VDv0Xfye6G1iIT2n8Qgwr8RlMYuSz5bv1Mr_KQwSdwuBP6aNGBC0uWyf1xV-8cdRy5GNpAjxOVFHoQvsBYK_6HmKV4rzi9mDumjWJA0tmcaIwTdExU4kXGz6xDg",
    },
  },
  {
    id: 102,
    type: "action",
    quote: null,
    thought: "Block a 90-minute focus session.",
    book: {
      id: 2,
      cardCount: 10,
      title: "Deep Work",
      author: "Cal Newport",
      publisher: "Grand Central Publishing",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBUVw9AmRX0yJY9Ya4nSIvnUgPw_E-yVULOPRoV4ZDjKSHJaEf_uSA05Gos_ghWFDsoF5E-S28WaIupTkG8IIilIuJ8NfOpn6FRFa9DSbDEe1Yj42STD5D9D2pt6Y3cHab_6fnnFkD2eiI_kYb-tnLLgahfAvFAQI4AO8t85X2eE6JCFFZ2V5jXPPoPBsb9RPUDVagcFWXyErHg6Vn603Ma0u02KAPjMVC39IEmtrK8ibm5Gm5mZpXUseNCr9HbJUO9m8bXniAn59s",
    },
  },
  {
    id: 103,
    type: "question",
    quote: "And, when you want something, all the universe conspires.",
    thought: "Stay focused on the journey.",
    book: {
      id: 3,
      cardCount: 10,
      title: "The Alchemist",
      author: "Paulo Coelho",
      publisher: "HarperOne",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCmo_fpMXOmlRZUqprPDQ8rtHUE4D6PFJgPdY1SYQRAK2S1sFciYFM3DDi8QM3gnbAEdpfdbB7gD0RzSbscXLtsTIiGUcA3YuO-YLwhxq9XYhjf72-wv9HU339v-1kA9gi1lGigtC0n1gKYX7rGnSq_VfT--CSwhXsfXss_cW3qK9y6_-GO-3UiP8aGm4972LanmIM2sW5DGxLm2zBBo44cDvg-VpzTBk8tLF1fjvazt0hqCeOAG8decdXi3stxjN5rNRzmeUbtRZ0",
    },
  },
];

export const mockJumpBackIn: Book[] = [
  {
    id: 11,
    title: "Project Hail Mary",
    author: "Andy Weir",
    publisher: "Ballantine Books",
    cardCount: 0,
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHDgbNqtpolmKeWtibjXILFQ4YLSfjb7pT2XWzcbhCeiLaiyQsJOK9N9adPydveAD8P7V2JeEx-NVGpmrYAN-qBbUOVBnzQw_6peYeojHNARMOBvPVrNZOw90w_v2nEZfEVrZ3HQL9RqEK9yBDyjmPZA5AoKDdxTSfCAhQXQrfxaEeZw8HDWbasWf2_fIWCxpFaSz3_N8ra0Z7i4RXt-mqa4qwpvWmr3GOmBqgNB3XJyTlr8DwBYqCBubKpBXz69cOvbyy36gAOE",
  },
  {
    id: 12,
    title: "Dune",
    author: "Frank Herbert",
    publisher: "Chilton Books",
    cardCount: 0,
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9j82OTHVVyR6dPEvyS2CF8efwZRtYxyNhmIbD_b0cGajmW27x2g9sT8FGvprbpK4iHEPMX8clIXLWqIpGhkUlBcaQH4XbmaipTFhrrk2S9_q4sSUx6k8cbYowHMGQmZkgx0jh_6GpIUQxyIiEFagXVEO9V4Dv8fAyOibfZHYwe-A39dfZPeMuVTS8A5g4ImVR93SjCEmAwg1iHYPMuux69rGuDFqcx4dl5DYa04lqd_XBkPBBnhRL_8POZR0PhO1XXOmJkhkO15Q",
  },
  {
    id: 13,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    publisher: "Harriman House",
    cardCount: 0,
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoaikXri4Bp0HkMe1C1f1APCFI_L79EB5VRmMuFdKEBVJGaLpodD9RQnI_KTvXlKVwLLu2OuA-JXeMtI4hoIkKcn3zv9QZ1Xv6S11Ao44hfdWE5rZInb5rYMP0AnUaJulM1t5xVvIudfFzT3UrqW88gDkP6QHC9Be7HSSJNduQ_tisG1k6lWETwKmRl4G7NCnv6HeKXdG8-V_Hvy209S00vOvas-H8tkjsiCK69_oLuePSy5tDn3PmsmP5Zv6r9X2D_FrP5JZ59jk",
  },
  {
    id: 14,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    publisher: "Farrar, Straus and Giroux",
    cardCount: 0,
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1uNjjoECwZtl5x1I5RQA77QD0C8SEnny4uH3_SZENoqDXVdOGz0X3kwTg3dvVM_8V7pX0xaAZEnhDh8FUyfFgJGj7FsUNSa6jY0r4dzqcyKFtV4CcRUu_23PSbuojdF_yTt99LNdBzcteRaYdvReBZi5qAW-cAt5z4DWZrLiqJERLvZpyNmgiKJ_F5JBbFvPYXLx-lRrT8FhYlRv5NqAjx79M9f99Alpo8GQ6r0RF9u833BhsVG7hKWYyTpHWJC6X5TouPbvxJJY",
  },
];
