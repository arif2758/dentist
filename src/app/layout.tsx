import type { Metadata } from "next";
import { Noto_Sans_Bengali, Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/antd.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ডেন্টাল কেয়ার ও ইমপ্ল্যান্ট সেন্টার | Dr. Arif Chamber & Live Queue",
  description: "৩০ বছরের অভিজ্ঞ ডেন্টিস্ট চেম্বার। লাইভ সিরিয়াল মনিটর, ডিজিটাল প্রেসক্রিপশন ও রোগীর হিস্ট্রি রেকর্ড।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${notoSansBengali.variable} ${geistSans.variable} ${geistMono.variable} ${notoSansBengali.className} h-full antialiased scroll-smooth`}
    >
      <body className={`${notoSansBengali.className} min-h-full flex flex-col bg-[var(--antd-bg-layout)] text-[var(--antd-text)] transition-colors duration-200`}>
        <Providers>
          <div className="w-full min-h-screen flex flex-col relative">
            {children}
            <Toaster position="top-right" richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}
