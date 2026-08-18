import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sora-social.example"),
  title: "SORA — 今日の空を、みんなと。",
  description: "天気と日常の小さな発見を共有する、空のSNS。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "SORA — 今日の空を、みんなと。", description: "天気と日常の小さな発見を共有する、空のSNS。", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "SORA", description: "今日の空を、みんなと。", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
