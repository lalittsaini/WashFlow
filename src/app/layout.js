import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WashFlow | Laundry Management",
  description: "A modern laundry management system.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-screen flex bg-neutral-950 text-neutral-50 overflow-hidden print:overflow-visible print:h-auto print:bg-white print:text-black">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-neutral-950 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
