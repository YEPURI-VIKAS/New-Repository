import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "College Discovery Platform",
  description: "Modern college search and decision platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-600">
            © {new Date().getFullYear()} College Discovery Platform. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
