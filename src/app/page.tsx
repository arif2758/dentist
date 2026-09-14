import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ClinicStandards } from "@/components/home/ClinicStandards";
import { Reviews } from "@/components/home/Reviews";
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Users 
} from "lucide-react";
import styles from "@/styles/styles.module.css";
import { clinicStore } from "@/lib/store";

export default function Home() {
  const queue = clinicStore.getQueue();
  const currentToken = queue.currentlyServingToken;
  const waitingCount = queue.activeQueueList.filter((a) => a.status === "WAITING").length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        
        {/* 1. Hero Section (Includes Mobile Live OPD Tracker) */}
        <Hero />

        {/* 2. Core Specialized Services Preview (Ant Design 3 Cards inside max-w-7xl container) */}
        <section className="py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-5 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-primary)]">
                    বিশেষায়িত ডেন্টাল কেয়ার
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--antd-text)]">
                    আমাদের প্রধান ক্লিনিক্যাল সেবাসমূহ
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)] max-w-xl">
                    ব্যথামুক্ত ডিজিটাল রুট ক্যানেল, স্কেলিং ও স্থায়ী ডেন্টাল ইমপ্ল্যান্টসহ সম্পূর্ণ আধুনিক চিকিৎসা।
                  </p>
                </div>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--antd-primary)] hover:underline self-start sm:self-auto"
                >
                  <span>সকল চিকিৎসা দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="antd-card antd-card-bordered p-5 space-y-2.5 hover:border-[var(--antd-primary-border)] transition-all bg-[var(--antd-bg-layout)]/50">
                  <span className="antd-tag antd-tag-blue py-0.5 px-2 text-[10px] font-bold">
                    ব্যথামুক্ত চিকিৎসা
                  </span>
                  <h3 className="text-base font-bold text-[var(--antd-text)]">ডিজিটাল রুট ক্যানেল থেরাপি</h3>
                  <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                    উন্নত রোটারি এন্ডোডন্টিক্স প্রযুক্তির সাহায্যে মাত্র ১-২ সেশনেই দাঁত ফেলে না দিয়ে স্থায়ীভাবে সুস্থ ও ব্যথামুক্ত রাখার নিশ্চয়তা।
                  </p>
                  <div className="pt-1 text-xs text-[var(--antd-primary)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ১০০% পেইনলেস লোকাল অ্যানেস্থেসিয়া
                  </div>
                </div>

                <div className="antd-card antd-card-bordered p-5 space-y-2.5 hover:border-[var(--antd-primary-border)] transition-all bg-[var(--antd-bg-layout)]/50">
                  <span className="antd-tag antd-tag-cyan py-0.5 px-2 text-[10px] font-bold">
                    মাড়ির সুরক্ষা
                  </span>
                  <h3 className="text-base font-bold text-[var(--antd-text)]">আল্ট্রাসনিক স্কেলিং ও পলিশিং</h3>
                  <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                    এনামেলের ক্ষতি না করে দাঁতের গোড়ার জমে থাকা পাথর ও নিকোটিনের দাগ দূর করে রক্ত পড়া ও মুখের দুর্গন্ধ থেকে মুক্তি।
                  </p>
                  <div className="pt-1 text-xs text-[var(--antd-primary)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> এনামেল-সেফ আল্ট্রাসনিক ভাইব্রেশন
                  </div>
                </div>

                <div className="antd-card antd-card-bordered p-5 space-y-2.5 hover:border-[var(--antd-primary-border)] transition-all bg-[var(--antd-bg-layout)]/50">
                  <span className="antd-tag antd-tag-purple py-0.5 px-2 text-[10px] font-bold">
                    স্থায়ী প্রতিস্থাপন
                  </span>
                  <h3 className="text-base font-bold text-[var(--antd-text)]">টাইটানিয়াম ডেন্টাল ইমপ্ল্যান্ট</h3>
                  <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                    হারিয়ে যাওয়া দাঁতের জায়গায় স্থায়ী টাইটানিয়াম রুট স্থাপন। পাশের সুস্থ দাঁত না কেটেই স্বাভাবিক দাঁতের মতো খাওয়ার শক্তি।
                  </p>
                  <div className="pt-1 text-xs text-[var(--antd-primary)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> আন্তর্জাতিক সার্টিফাইড ইমপ্ল্যান্ট
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 3. Patient History Banner (Contained within max-w-7xl) */}
        <section className="py-2 sm:py-3">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] rounded-2xl p-5 sm:p-7 text-[var(--antd-text)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0 px-2 text-[10px] font-bold">
                  <FileText className="w-3 h-3" /> ডিজিটাল ডেন্টাল রেকর্ড
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[var(--antd-text)]">
                  আপনি কি আমাদের পুরোনো রোগী?
                </h3>
                <p className="text-xs text-[var(--antd-text-secondary)] max-w-xl">
                  আপনার পূর্বের চিকিৎসা, প্রেসক্রিপশন ও ৬ মাসের ফলো-আপ তারিখ দেখতে আপনার মোবাইল নম্বর দিয়ে অনুসন্ধান করুন।
                </p>
              </div>

              <Link
                href="/patient-history"
                className="antd-btn antd-btn-primary antd-btn-lg font-bold text-xs sm:text-sm shadow-xs shrink-0 w-full sm:w-auto text-center"
              >
                রোগীর হিস্ট্রি পোর্টাল →
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Clinic Standards */}
        <ClinicStandards />

        {/* 5. Patient Reviews */}
        <Reviews />

        {/* 6. Compact Call to Action */}
        <section className="py-10 bg-[var(--antd-bg-layout)] text-center">
          <div className="max-w-xl mx-auto px-3 sm:px-6 space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-[var(--antd-text)]">
              দীর্ঘক্ষণ অপেক্ষা না করে নিজের সময়ে আসুন
            </h3>
            <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)]">
              অনলাইনে মাত্র ২ মিনিটে সিরিয়াল বুক করুন এবং ডিজিটাল টোকেন নিয়ে নির্দিষ্ট সময়ে চিকিৎসা গ্রহণ করুন।
            </p>
            <div className="pt-1">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 antd-btn antd-btn-primary antd-btn-lg w-full sm:w-auto px-8 font-bold shadow-xs active:scale-95 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>আজই সিরিয়াল বুকিং করুন</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
