import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import {
  ThemeInitScript,
  ThemeProvider,
} from "@/shared/theme/theme-provider";
import ReactQueryProvider from "@/app/providers/react-query-provider";
import { Toaster } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Widget } from "@/widgets/assistant-widget/ui";

const notoSans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://readingdeck.co"),
  openGraph: {
    title: "ReadingDeck",
    description: "책을 덮은 뒤, 생각을 펼치세요.",
    url: "https://readingdeck.co",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReadingDeck: 책을 덮은 뒤, 생각을 펼치세요.",
      },
    ],
  },
  title: {
    default: "ReadingDeck",
    template: "%s | ReadingDeck",
  },
  icons: {
    icon: "/favicon.svg",
  },
  description: "Build your personal reading graph and card archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeInitScript />
        </head>
        <ThemeProvider>
          <body
            className={`${notoSans.variable} ${notoSerif.variable} font-sans bg-background text-foreground antialiased transition-colors duration-200`}
            suppressHydrationWarning
          >
            <TooltipProvider>
              {children}
              <Toaster />
              <Widget />
            </TooltipProvider>
          </body>
        </ThemeProvider>
      </html>
    </ReactQueryProvider>
  );
}
