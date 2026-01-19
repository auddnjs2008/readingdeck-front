import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const dailyStack = [
  {
    title: "Atomic Habits",
    subtitle: "James Clear • 2 cards due",
    badge: "Review",
    badgeClass: "bg-[#137fec]/90",
    cta: "Review Now",
    ctaIcon: "→",
    ctaMeta: "Review Now",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXsQz0NCmNRvMG1iXWsh-Vi1OgrA7ln-2BsvM7xYO8NmgNAqGlGuVQdQmGIrQ4T4elR69wkToQAcwnxZ1dX7q9WYMXStnTUOlu4J4o2vPbqwODy7DOvlmB5WCmeikLUvJP1eCXilzitgzKkqx4VDv0Xfye6G1iIT2n8Qgwr8RlMYuSz5bv1Mr_KQwSdwuBP6aNGBC0uWyf1xV-8cdRy5GNpAjxOVFHoQvsBYK_6HmKV4rzi9mDumjWJA0tmcaIwTdExU4kXGz6xDg",
    footerLeft: (
      <div className="flex -space-x-2">
        <div className="h-2 w-2 rounded-full bg-red-400"></div>
        <div className="ml-1 h-2 w-2 rounded-full bg-yellow-400"></div>
      </div>
    ),
  },
  {
    title: "Deep Work",
    subtitle: "Cal Newport • Chapter 4 Summary",
    badge: "Insight",
    badgeClass: "bg-purple-500/90",
    cta: "Read",
    ctaIcon: "👁",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUVw9AmRX0yJY9Ya4nSIvnUgPw_E-yVULOPRoV4ZDjKSHJaEf_uSA05Gos_ghWFDsoF5E-S28WaIupTkG8IIilIuJ8NfOpn6FRFa9DSbDEe1Yj42STD5D9D2pt6Y3cHab_6fnnFkD2eiI_kYb-tnLLgahfAvFAQI4AO8t85X2eE6JCFFZ2V5jXPPoPBsb9RPUDVagcFWXyErHg6Vn603Ma0u02KAPjMVC39IEmtrK8ibm5Gm5mZpXUseNCr9HbJUO9m8bXniAn59s",
    footerLeft: (
      <span className="text-xs text-[#637588] dark:text-[#92adc9]">
        Added today
      </span>
    ),
  },
  {
    title: "The Alchemist",
    subtitle: "&quot;And, when you want something...&quot;",
    badge: "Quote",
    badgeClass: "bg-teal-500/90",
    cta: "Share",
    ctaIcon: "↗",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmo_fpMXOmlRZUqprPDQ8rtHUE4D6PFJgPdY1SYQRAK2S1sFciYFM3DDi8QM3gnbAEdpfdbB7gD0RzSbscXLtsTIiGUcA3YuO-YLwhxq9XYhjf72-wv9HU339v-1kA9gi1lGigtC0n1gKYX7rGnSq_VfT--CSwhXsfXss_cW3qK9y6_-GO-3UiP8aGm4972LanmIM2sW5DGxLm2zBBo44cDvg-VpzTBk8tLF1fjvazt0hqCeOAG8decdXi3stxjN5rNRzmeUbtRZ0",
    footerLeft: (
      <span className="text-xs text-[#637588] dark:text-[#92adc9]">
        Daily Inspiration
      </span>
    ),
  },
];

const jumpBackIn = [
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    progress: "45%",
    eta: "3h left",
    barColor: "bg-[#137fec]",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHDgbNqtpolmKeWtibjXILFQ4YLSfjb7pT2XWzcbhCeiLaiyQsJOK9N9adPydveAD8P7V2JeEx-NVGpmrYAN-qBbUOVBnzQw_6peYeojHNARMOBvPVrNZOw90w_v2nEZfEVrZ3HQL9RqEK9yBDyjmPZA5AoKDdxTSfCAhQXQrfxaEeZw8HDWbasWf2_fIWCxpFaSz3_N8ra0Z7i4RXt-mqa4qwpvWmr3GOmBqgNB3XJyTlr8DwBYqCBubKpBXz69cOvbyy36gAOE",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    progress: "12%",
    eta: "Just started",
    barColor: "bg-[#137fec]",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9j82OTHVVyR6dPEvyS2CF8efwZRtYxyNhmIbD_b0cGajmW27x2g9sT8FGvprbpK4iHEPMX8clIXLWqIpGhkUlBcaQH4XbmaipTFhrrk2S9_q4sSUx6k8cbYowHMGQmZkgx0jh_6GpIUQxyIiEFagXVEO9V4Dv8fAyOibfZHYwe-A39dfZPeMuVTS8A5g4ImVR93SjCEmAwg1iHYPMuux69rGuDFqcx4dl5DYa04lqd_XBkPBBnhRL_8POZR0PhO1XXOmJkhkO15Q",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    progress: "88%",
    eta: "Almost done",
    barColor: "bg-green-500",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoaikXri4Bp0HkMe1C1f1APCFI_L79EB5VRmMuFdKEBVJGaLpodD9RQnI_KTvXlKVwLLu2OuA-JXeMtI4hoIkKcn3zv9QZ1Xv6S11Ao44hfdWE5rZInb5rYMP0AnUaJulM1t5xVvIudfFzT3UrqW88gDkP6QHC9Be7HSSJNduQ_tisG1k6lWETwKmRl4G7NCnv6HeKXdG8-V_Hvy209S00vOvas-H8tkjsiCK69_oLuePSy5tDn3PmsmP5Zv6r9X2D_FrP5JZ59jk",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    progress: "2%",
    eta: "15h left",
    barColor: "bg-[#137fec]",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1uNjjoECwZtl5x1I5RQA77QD0C8SEnny4uH3_SZENoqDXVdOGz0X3kwTg3dvVM_8V7pX0xaAZEnhDh8FUyfFgJGj7FsUNSa6jY0r4dzqcyKFtV4CcRUu_23PSbuojdF_yTt99LNdBzcteRaYdvReBZi5qAW-cAt5z4DWZrLiqJERLvZpyNmgiKJ_F5JBbFvPYXLx-lRrT8FhYlRv5NqAjx79M9f99Alpo8GQ6r0RF9u833BhsVG7hKWYyTpHWJC6X5TouPbvxJJY",
  },
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-10">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[32px]">
                Your Daily Stack
              </h1>
              <Button size="sm" className="hidden h-10 sm:flex">
                <span className="text-base font-bold">＋</span>
                <span className="truncate">Create New Card</span>
              </Button>
            </div>
            <div className="hide-scrollbar -mx-4 flex overflow-x-auto pb-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex min-w-full items-stretch gap-4 md:gap-6">
                {dailyStack.map((card) => (
                  <Card
                    key={card.title}
                    className="group flex min-w-[280px] flex-1 flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 dark:border-transparent"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${card.imageUrl})` }}
                        aria-hidden="true"
                      ></div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <Badge className={`text-white ${card.badgeClass}`}>
                          {card.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4 p-5 pt-1">
                      <div>
                        <h3 className="mb-1 text-lg font-bold leading-tight text-foreground">
                          {card.title}
                        </h3>
                        <p className="text-sm font-normal leading-normal text-muted-foreground">
                          {card.subtitle}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {card.footerLeft}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-0 text-primary hover:bg-transparent"
                        >
                          {card.cta}
                          <span className="text-[16px]">{card.ctaIcon}</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 pt-4">
              <h2 className="text-[24px] font-bold leading-tight tracking-tight text-foreground">
                Jump Back In
              </h2>
              <Button variant="ghost" size="sm" className="px-0 text-primary">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
              {jumpBackIn.map((book) => (
                <Card
                  key={book.title}
                  className="group flex cursor-pointer flex-col gap-3 border-transparent bg-transparent shadow-none"
                >
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${book.imageUrl})` }}
                      aria-hidden="true"
                    ></div>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-muted">
                      <div
                        className={`h-full ${book.barColor}`}
                        style={{ width: book.progress }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="truncate text-base font-semibold leading-normal text-foreground">
                      {book.title}
                    </p>
                    <p className="truncate text-sm font-normal leading-normal text-muted-foreground">
                      {book.author}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">
                        {book.progress}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {book.eta}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Button className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full p-0 shadow-lg shadow-[#137fec]/40 sm:hidden">
        <span className="text-2xl font-bold">＋</span>
      </Button>
    </div>
  );
}
