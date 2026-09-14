import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PatientHistoryLookup } from "@/components/home/PatientHistoryLookup";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "রোগীর হিস্ট্রি ও ই-প্রেসক্রিপশন পোর্টাল | Dr. Arif Dental Clinic",
  description: "মোবাইল নম্বর দিয়ে আপনার পূর্ববর্তী ডেন্টাল ভিজিট, প্রেসক্রিপশন এবং ৬ মাসের ফলো-আপ রেকর্ড অনুসন্ধান করুন।",
};

export default function PatientHistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />
      <main className="flex-1 pb-10">
        <PatientHistoryLookup />
      </main>
      <Footer />
    </div>
  );
}
