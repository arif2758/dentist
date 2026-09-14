import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Services } from "@/components/home/Services";
import { SymptomChecker } from "@/components/home/SymptomChecker";
import { SmileGallery } from "@/components/home/SmileGallery";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "ডেন্টাল চিকিৎসা ও সেবাসমূহ | Dr. Arif Dental Clinic",
  description: "রুট ক্যানেল, ডিজিটাল স্কেলিং, ইমপ্ল্যান্ট, স্মাইল মেকওভার ও ব্যথামুক্ত ডেন্টাল চিকিৎসার বিস্তারিত তথ্য।",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />
      <main className="flex-1 pb-10 space-y-6">
        <Services />
        <SymptomChecker />
        <SmileGallery />
      </main>
      <Footer />
    </div>
  );
}
