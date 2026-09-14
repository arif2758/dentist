"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  HeartPulse,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Tag, Button, Tabs } from "antd";

interface CareGuide {
  id: string;
  title: string;
  shortDesc: string;
  dos: string[];
  donts: string[];
  warnings: string[];
  recoveryTime: string;
}

const AFTER_CARE_DATA: CareGuide[] = [
  {
    id: "extraction",
    title: "দাঁত তোলার পর করণীয় ও বর্জনীয় (Extraction)",
    shortDesc: "দাঁত তোলার পরবর্তী ২৪ থেকে ৪৮ ঘণ্টা রক্তপাত বন্ধ রাখা ও দ্রুত ক্ষত শুকানোর জন্য সতর্ক থাকা জরুরি।",
    recoveryTime: "৩ থেকে ৫ দিন",
    dos: [
      "চিকিৎসক যে গজ বা তুলার বল দিয়েছেন, তা অন্তত ১ ঘণ্টা শক্তভাবে কামড়ে ধরে রাখুন।",
      "তুলা ফেলার পর ঠান্ডা পানি, আইসক্রিম বা ঠান্ডা নরম খাবার খান।",
      "২৪ ঘণ্টা পর কুসুম গরম পানিতে সামান্য লবণ দিয়ে দিনে ৩-৪ বার আলতো করে কুলকুচি করুন।",
      "ডাক্তারের প্রেসক্রিপশন অনুযায়ী ব্যথানাশক ও অ্যান্টিবায়োটিক সঠিক সময়ে সেবন করুন।",
      "ঘুমানোর সময় মাথার নিচে একটু উঁচু বালিশ ব্যবহার করুন যাতে রক্ত চলাচল স্বাভাবিক থাকে।",
    ],
    donts: [
      "তুলা ফেলার পর বারবার থুতু ফেলবেন না; মুখের লালা বা রক্ত স্বাভাবিকভাবে গিলে ফেলুন।",
      "স্ট্র (Straw) দিয়ে কোনো পানীয় পান করবেন না, এতে জমে থাকা রক্তের ক্লট সরে গিয়ে রক্তপাত হতে পারে।",
      "গরম, ঝাল বা শক্ত কোনো খাবার প্রথম ২৪ ঘণ্টা একদমই খাবেন না।",
      "ধূমপান, জর্দা বা গুল ব্যবহার থেকে অন্তত ৭২ ঘণ্টা সম্পূর্ণ বিরত থাকুন।",
      "ক্ষতের জায়গায় জিহ্বা, আঙুল বা টুথপিক দিয়ে বারবার স্পর্শ করবেন না।",
    ],
    warnings: [
      "যদি ৩-৪ ঘণ্টা পরও অতিরিক্ত তাজা রক্তপাত বন্ধ না হয়।",
      "যদি ওষুধ খাওয়ার পরও অসহ্য তীব্র ব্যথা বা গাল অতিরিক্ত ফুলে যায়।",
      "যদি উচ্চমাত্রায় জ্বর আসে বা মুখে দুর্গন্ধ অনুভূত হয়।",
    ],
  },
  {
    id: "rct",
    title: "রুট ক্যানেল থেরাপির পর যত্ন (Root Canal / RCT)",
    shortDesc: "রুট ক্যানেল সম্পন্ন হওয়া বা সেশন চলাকালীন দাঁতের ভেতরে ওষুধ থাকে, তাই ক্যাপ না লাগানো পর্যন্ত বিশেষ সতর্কতা প্রয়োজন।",
    recoveryTime: "২ থেকে ৪ দিন (পেইন সাবসাইড)",
    dos: [
      "অ্যানেস্থেসিয়ার অবশ ভাব সম্পূর্ণ না কাটা পর্যন্ত কোনো খাবার চিবিয়ে খাবেন না।",
      "স্থায়ী ক্যাপ বা ক্রাউন (Crown) না লাগানো পর্যন্ত বিপরীত পাশের দাঁত দিয়ে নরম খাবার চিবিয়ে খান।",
      "চিকিৎসাধীন দাঁতটি নিয়মিত স্বাভাবিকভাবে ব্রাশ ও ফ্লস করুন।",
      "ডাক্তারের দেওয়া নির্ধারিত সেশনের তারিখে অবশ্যই চেম্বারে উপস্থিত হোন।",
      "রুট ক্যানেল শেষ হওয়ার পর যত দ্রুত সম্ভব ক্যাপ বা ক্রাউন স্থাপন করুন যাতে দাঁত ভেঙে না যায়।",
    ],
    donts: [
      "রুট ক্যানেল করা দাঁত দিয়ে সুপারি, বরফ, হাড় বা শক্ত কোনো খাবার কামড়াবেন না।",
      "অস্থায়ী ফিলিং উঠে যাওয়ার ভয়ে ব্রাশ করা বন্ধ রাখবেন না, আলতো করে ব্রাশ করুন।",
      "ব্যথা কমে গেছে ভেবে পরবর্তী সেশনে আসা বা ক্যাপ লাগানো বাদ দেবেন না।",
    ],
    warnings: [
      "যদি সাময়িক ফিলিং সম্পূর্ণ উঠে যায় বা দাঁত থেকে ওষুধ বের হয়ে আসে।",
      "যদি দাঁতে চিবানোর সময় তীব্র ব্যথা হয় অথবা মাড়িতে পুঁজ ফোড়ার মতো ফুলে যায়।",
    ],
  },
  {
    id: "scaling",
    title: "স্কেলিং ও পলিশিংয়ের পর যত্ন (Scaling & Polishing)",
    shortDesc: "স্কেলিংয়ের পর দাঁতের গোড়ার জমে থাকা পাথর দূর হওয়ায় সাময়িক সামান্য শিরশিরানি হওয়া স্বাভাবিক।",
    recoveryTime: "১ থেকে ২ দিন",
    dos: [
      "স্কেলিংয়ের পর ১-২ দিন অতিরিক্ত গরম বা খুব বেশি ঠান্ডা খাবার এড়িয়ে চলুন।",
      "সামান্য শিরশিরানি থাকলে চিকিৎসকের পরামর্শমতো ডেসেনসিটাইজিং টুথপেস্ট ব্যবহার করুন।",
      "প্রতিদিন দুই বেলা (সকালে নাস্তার পর ও রাতে ঘুমানোর আগে) সঠিক নিয়মে ২ মিনিট ব্রাশ করুন।",
      "মাড়ির সুস্থতায় প্রতিদিন ডেন্টাল ফ্লস (Floss) দিয়ে দাঁতের ফাঁক পরিষ্কার রাখুন।",
      "প্রতি ৬ মাস পরপর নিয়মিত ডেন্টাল চেক-আপ ও স্কেলিং করান।",
    ],
    donts: [
      "খাবার পর দাঁতের ফাঁকে টুথপিক, সেফটিপিন বা কোনো শক্ত কাঠি ব্যবহার করবেন না।",
      "চা, কফি, পান বা ধূমপান স্কেলিংয়ের পর অন্তত ২৪ ঘণ্টা বর্জন করুন যাতে নতুন দাগ না পড়ে।",
      "শক্ত ব্রিসলের টুথব্রাশ দিয়ে জোরে জোরে ঘষে ব্রাশ করবেন না; নরম ব্রাশ ব্যবহার করুন।",
    ],
    warnings: [
      "যদি স্কেলিংয়ের ২ দিন পরও মাড়ি থেকে রক্ত পড়া বন্ধ না হয়।",
      "যদি মাড়িতে তীব্র ব্যথা বা প্রদাহ সৃষ্টি হয়।",
    ],
  },
  {
    id: "filling",
    title: "লেজার ফিলিং ও ক্যাপের যত্ন (Filling & Crown)",
    shortDesc: "লেজার কম্পোজিট ফিলিং তাৎক্ষণিক শক্ত হলেও ক্যাপ বা ফিলিং দীর্ঘস্থায়ী রাখতে কিছু নিয়ম মেনে চলা উচিত।",
    recoveryTime: "তাৎক্ষণিক স্বাভাবিক",
    dos: [
      "লেজার ফিলিং করার পরপরই খাওয়া যায়, তবে অ্যানেস্থেসিয়া দেওয়া থাকলে অবশ না কাটা পর্যন্ত অপেক্ষা করুন।",
      "ক্যাপ বা ক্রাউনের চারপাশের মাড়ি ফ্লস দিয়ে পরিষ্কার রাখুন যাতে মাড়িতে ব্যাকটেরিয়া না জমে।",
      "কামড়ানোর সময় যদি কোনো উঁচু ভাব (High spot) অনুভূত হয়, তবে চেম্বারে এসে সামান্য অ্যাডজাস্ট করিয়ে নিন।",
    ],
    donts: [
      "ফিলিং বা ক্যাপ করা দাঁত দিয়ে শক্ত বোতলের ক্যাপ খোলা বা সুতা কাটার মতো কাজ করবেন না।",
      "অতিরিক্ত আঠালো খাবার (যেমন চুইংগাম, ক্যারামেল) অতিরিক্ত চিবানো থেকে বিরত থাকুন।",
    ],
    warnings: [
      "যদি ক্যাপটি আলগা হয়ে যায় বা খুলে পড়ে যায়।",
      "যদি চিবানোর সময় ফিলিংয়ে খচখচ করে বা উঁচু লাগে।",
    ],
  },
  {
    id: "braces",
    title: "ব্রেসেস ও আঁকাবাঁকা দাঁতের যত্ন (Braces Care)",
    shortDesc: "ব্রেসেস লাগানোর পর দাঁতে তার ও ব্র্যাকেট থাকায় খাদ্যকণা বেশি জমে, তাই পরিচ্ছন্নতা অত্যন্ত গুরুত্বপূর্ণ।",
    recoveryTime: "সমন্বয় সময়: ৩-৭ দিন",
    dos: [
      "অর্থোডন্টিক বিশেষ টুথব্রাশ ও ইন্টারডেন্টাল ব্রাশ দিয়ে প্রতিটি ব্র্যাকেটের চারপাশ পরিষ্কার করুন।",
      "ব্র্যাকেটের খোঁচা থেকে গাল বা ঠোঁট বাঁচাতে অর্থোডন্টিক ওয়াক্স (Wax) ব্যবহার করুন।",
      "প্রতি মাসে ডক্টরের দেওয়া শিডিউল অনুযায়ী তার (Wire) টাইট দিতে চেম্বারে আসুন।",
    ],
    donts: [
      "আস্ত আপেল, পেয়ারা, গাজর বা মাংসের হাড় সামনের দাঁতে কামড় দিয়ে খাবেন না (ছোট টুকরো করে খান)।",
      "আঠালো চকলেট বা শক্ত বাদাম একদমই চিবাবেন না, এতে ব্র্যাকেট ভেঙে যেতে পারে।",
    ],
    warnings: [
      "যদি কোনো ব্র্যাকেট দাঁত থেকে ছুটে যায় বা তারের খোঁচায় ক্ষত সৃষ্টি হয়।",
    ],
  },
];

export default function AfterCarePage() {
  const [activeTab, setActiveTab] = useState<string>("extraction");

  const currentGuide = AFTER_CARE_DATA.find((g) => g.id === activeTab) || AFTER_CARE_DATA[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-primary)] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--antd-primary-bg)]">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>রোগীর পোস্ট-অপারেটিভ কেয়ার গাইড</span>
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--antd-text)]">
              চিকিৎসা পরবর্তী যত্ন ও নির্দেশিকা
            </h1>
            <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)]">
              ডেন্টাল চিকিৎসার পর বাড়ি ফিরে দ্রুত আরোগ্য লাভ করতে ও জটিলতা এড়াতে নিচের পরামর্শগুলো মনোযোগ দিয়ে মেনে চলুন।
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl shadow-xs">
              {AFTER_CARE_DATA.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--antd-primary)] text-white shadow-xs"
                      : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)]"
                  }`}
                >
                  {tab.title.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Guide Display Card */}
          <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none">
            
            {/* Guide Title & Recovery Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--antd-border-split)] gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--antd-text)]">
                  {currentGuide.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)] mt-1">
                  {currentGuide.shortDesc}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Tag color="blue" className="px-3 py-1 font-bold text-xs">
                  সুস্থ হওয়ার গড় সময়: {currentGuide.recoveryTime}
                </Tag>
                <button
                  onClick={handlePrint}
                  className="antd-btn antd-btn-default antd-btn-sm inline-flex items-center gap-1.5 text-xs font-semibold"
                  title="নির্দেশিকা প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">প্রিন্ট গাইড</span>
                </button>
              </div>
            </div>

            {/* Dos and Don'ts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Do's (যা যা করবেন) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>যা যা অবশ্যই করবেন (Do&apos;s)</span>
                </div>
                <ul className="space-y-3">
                  {currentGuide.dos.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-[var(--antd-text)] flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts (যা যা বর্জন করবেন) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-base">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>যা যা একদমই করবেন না (Don&apos;ts)</span>
                </div>
                <ul className="space-y-3">
                  {currentGuide.donts.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-[var(--antd-text)] flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        ✕
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Warning Section (কখন ডাক্তারের শরণাপন্ন হবেন) */}
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>কখন অতি দ্রুত চেম্বারে যোগাযোগ করবেন:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[var(--antd-text-secondary)]">
                {currentGuide.warnings.map((warn, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Contact Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--antd-primary)] text-white flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-[var(--antd-text)]">
                    কোনো বিষয়ে সন্দেহ বা জরুরি পরামর্শ প্রয়োজন?
                  </p>
                  <p className="text-xs text-[var(--antd-text-secondary)]">
                    চেম্বারের হটলাইনে ফোন করুন অথবা WhatsApp-এ মেসেজ দিন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="tel:+8801700000000"
                  className="flex-1 sm:flex-none antd-btn antd-btn-primary antd-btn-sm font-semibold text-xs px-4 py-1.5 text-center"
                >
                  কল করুন: +880 1700-000000
                </a>
                <Link
                  href="/emergency"
                  className="antd-btn antd-btn-default antd-btn-sm font-semibold text-xs px-3 py-1.5 text-center"
                >
                  ইমার্জেন্সি ফার্স্ট এইড
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
