import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "English Phrase Reviewer",
  description: "Review English phrases with spaced repetition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable + " " + geistMono.variable + " antialiased min-h-screen bg-gray-50"}>
        <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/phrases" className="text-lg font-bold text-blue-700 hover:text-blue-800">
              Phrase Reviewer
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/phrases" className="text-gray-600 hover:text-blue-600">Phrases</Link>
              <Link href="/review" className="text-gray-600 hover:text-blue-600">Review</Link>
              <Link href="/weak" className="text-gray-600 hover:text-blue-600">Weak</Link>
              <Link href="/stats" className="text-gray-600 hover:text-blue-600">Stats</Link>
              <Link href="/history" className="text-gray-600 hover:text-blue-600">History</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
