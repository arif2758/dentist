import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveQueueMonitor } from "@/components/home/LiveQueueMonitor";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "লাইভ ওপিডি সিরিয়াল মনিটর | Dr. Arif Dental Clinic",
  description: "চেম্বারের বর্তমান রানিং সিরিয়াল নম্বর ও আপনার আনুমানিক অপেক্ষার সময় সরাসরি ট্র্যাক করুন।",
};

export default function LiveQueuePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />
      <main className="flex-1 pb-8">
        <LiveQueueMonitor />
      </main>
      <Footer />
    </div>
  );
}
