import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rugumaho.com"),
  title: {
    default: "Rugumaho — A Journal of Life, Motherhood & Discovery",
    template: "%s | Rugumaho"
  },
  description: "Reflections on lifestyle, motherhood, travel, and personal growth. Thoughtful stories crafted for readers who seek depth, presence, and meaningful connection.",
  keywords: ["Rugumaho", "Ariane Rugumaho", "Lifestyle", "Motherhood", "Travel", "Wellbeing", "Slow Living", "Personal Growth", "Rwanda Journal"],
  authors: [{ name: "Rugumaho", url: "https://rugumaho.com" }],
  creator: "Rugumaho",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rugumaho.com",
    siteName: "Rugumaho",
    title: "Rugumaho — A Journal of Life, Motherhood & Discovery",
    description: "Reflections on lifestyle, motherhood, travel, and personal growth. Thoughtful stories crafted for readers who seek depth, presence, and meaningful connection.",
    images: [
      {
        url: "/profile.png",
        width: 1200,
        height: 630,
        alt: "Rugumaho — A Journal of Life, Motherhood & Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rugumaho — A Journal of Life, Motherhood & Discovery",
    description: "Reflections on lifestyle, motherhood, travel, and personal growth. Thoughtful stories crafted for readers who seek depth, presence, and meaningful connection.",
    images: ["/profile.png"],
    creator: "@rugumaho",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 font-display transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
