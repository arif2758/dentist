import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppointmentBooking } from "@/components/home/AppointmentBooking";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "ডেন্টাল সিরিয়াল বুকিং ও ডিজিটাল টোকেন | Dr. Arif Dental Clinic",
  description: "অনলাইনে সহজেই আপনার পছন্দের তারিখ ও সময় অনুযায়ী সিরিয়াল নিন এবং ইনস্ট্যান্ট টোকেন স্লিপ সংগ্রহ করুন।",
};

export default function BookPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />
      <main className="flex-1 pb-8">
        <AppointmentBooking />
      </main>
      <Footer />
    </div>
  );
}
