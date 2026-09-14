"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  AlertOctagon,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  HeartCrack,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Tag, Collapse } from "antd";

interface EmergencyTip {
  title: string;
  badge: string;
  icon: string;
  urgentAction: string;
  steps: string[];
  warning: string;
}

const EMERGENCY_TIPS: EmergencyTip[] = [
  {
    title: "দাঁতে হঠাৎ তীব্র অসহ্য ব্যথা",
    badge: "সবচেয়ে সাধারণ",
    icon: "⚡",
    urgentAction: "কুসুম গরম পানিতে সামান্য লবণ দিয়ে হালকা কুলকুচি করুন এবং কোনো শক্ত খাবার চিবানো বন্ধ রাখুন।",
    steps: [
      "দাঁতের ফাঁকে কোনো খাদ্যকণা আটকে আছে কি না তা ডেন্টাল ফ্লস দিয়ে সাবধানে বের করুন।",
      "ব্যথা কমাতে চিকিৎসকের অনুমোদিত প্যারাসিটামল বা সাধারণ ব্যথানাশক সেবন করতে পারেন।",
      "চোয়ালের বাইরে থেকে একটি কাপড়ে বরফ পেঁচিয়ে ১৫ মিনিট কোল্ড কমপ্রেস (ঠান্ডা সেঁক) দিন।",
    ],
    warning: "সরাসরি দাঁতের মাড়িতে বা গর্তে কখনো অ্যাসপিরিন ট্যাবলেট চেপে ধরবেন না, এতে মাড়ি পুড়ে ঘা হতে পারে!",
  },
  {
    title: "আঘাত লেগে দাঁত সম্পূর্ণ খুলে পড়ে যাওয়া (Knocked-out Tooth)",
    badge: "জরুরি সময়: ৩০-৬০ মিনিট",
    icon: "🦷",
    urgentAction: "পড়ে যাওয়া দাঁতের গোড়া (Root) না ছুঁয়ে শুধুমাত্র ওপরের সাদা অংশ (Crown) ধরে সাবধানে তুলুন।",
    steps: [
      "যদি দাঁত নোংরা হয়, তবে খুব হালকাভাবে পরিষ্কার পানি দিয়ে ধুয়ে নিন (ঘষবেন না)।",
      "দাঁতটিকে এক কাপ খাঁটি তরল দুধ অথবা নরমাল স্যালাইনে ডুবিয়ে রাখুন (শুকনো রাখবেন না)।",
      "৩০ থেকে ৬০ মিনিটের মধ্যে দাঁতসহ দ্রুত ডেন্টাল সার্জনের কাছে পৌঁছান—দাঁতটি পুনরায় স্থাপন করা সম্ভব!",
    ],
    warning: "দাঁতটি টিস্যু বা কাপড়ে মুড়িয়ে শুকিয়ে ফেলবেন না; তরল মাধ্যমে রাখা আবশ্যক।",
  },
  {
    title: "দাঁত থেকে বা মাড়ি থেকে রক্তপাত বন্ধ না হওয়া",
    badge: "রক্তপাত নিয়ন্ত্রণ",
    icon: "🩸",
    urgentAction: "একটি পরিষ্কার গজ বা তুলা ক্ষতের ওপর রেখে অন্তত ৩০-৪৫ মিনিট শক্তভাবে কামড়ে চেপে ধরে রাখুন।",
    steps: [
      "মাথা একটু উঁচু রেখে শান্ত হয়ে বসুন, অস্থির হবেন না।",
      "একটি ভেজা টি-ব্যাগ (Tea Bag) গজ এর বদলে ক্ষতের ওপর কামড়ে ধরতে পারেন; চা-পাতার ট্যানিক অ্যাসিড রক্ত জমাট বাঁধতে সাহায্য করে।",
      "বারবার থুতু ফেলা বা কুলি করা থেকে বিরত থাকুন।",
    ],
    warning: "যদি ১ ঘণ্টা চেপে রাখার পরও অতিরিক্ত ফিনকি দিয়ে রক্ত পড়ে, তবে সাথে সাথে ইমার্জেন্সি চেম্বারে আসুন।",
  },
  {
    title: "মাড়ি বা মুখমণ্ডল অস্বাভাবিক ফুলে যাওয়া (Abscess)",
    badge: "সংক্রমণ সতর্কতা",
    icon: "⚠️",
    urgentAction: "এটি ডেন্টাল ইনফেকশন বা পুঁজ জমার লক্ষণ; যত দ্রুত সম্ভব অ্যান্টিবায়োটিক ও ড্রেনেজ চিকিৎসা প্রয়োজন।",
    steps: [
      "হালকা লবণ পানিতে বারবার মুখ ধুয়ে নিন যাতে ব্যাকটেরিয়া কমে।",
      "ফোলা জায়গায় কোনো গরম সেঁক দেবেন না, প্রয়োজনে হালকা বরফ বাইরে থেকে লাগাতে পারেন।",
      "নিজ থেকে পুঁজ ফাটানোর বা সূঁচ দিয়ে ফুটো করার চেষ্টা কখনো করবেন না।",
    ],
    warning: "ফোলা যদি চোখের দিকে ছড়িয়ে যায় বা শ্বাস নিতে/ঢোক গিলতে কষ্ট হয়, তবে দ্রুত জরুরি হাসপাতালে যান।",
  },
  {
    title: "দাঁত বা ফিলিং হঠাৎ ভেঙে যাওয়া (Broken / Chipped Tooth)",
    badge: "দাঁত সংরক্ষণ",
    icon: "🛡️",
    urgentAction: "মুখ হালকা গরম পানি দিয়ে ধুয়ে ফেলুন এবং ভাঙা অংশটি খুঁজে পেলে পরিষ্কার করে সাথে রাখুন।",
    steps: [
      "ভাঙা দাঁতের ধারালো অংশ যদি জিহ্বায় লাগে, তবে সেখানে সাময়িকভাবে সুগার-ফ্রি চুইংগাম বা মোম আটকে রাখতে পারেন।",
      "খুব ঠান্ডা বা গরম পানীয় খাওয়া এড়িয়ে চলুন।",
      "যত দ্রুত সম্ভব কম্পোজিট রিস্টোরেশন বা ক্যাপ করানোর জন্য অ্যাপয়েন্টমেন্ট নিন।",
    ],
    warning: "ভাঙা দাঁত ফেলে রাখলে জীবাণু ঢুকে পরবর্তীতে রুট ক্যানেল করার প্রয়োজন হতে পারে।",
  },
];

const FAQS = [
  {
    q: "স্কেলিং করালে কি দাঁত পাতলা বা দাঁতের মাঝে ফাঁকা হয়ে যায়?",
    a: "না, এটি একটি সম্পূর্ণ ভুল ধারণা। আধুনিক আল্ট্রাসনিক স্কেলার শুধুমাত্র দাঁতের গোড়ার শক্ত পাথর (Tartar/Calculus) ও ব্যাকটেরিয়া পরিষ্কার করে, দাঁতের এনামেল কাটেনা। পাথর জমে মাড়ি নেমে যাওয়ার কারণে পাথর সরানোর পর ফাঁকা অনুভূত হয়, যা স্কেলিং না করালে মাড়ির হাড়ের আরও বড় ক্ষতি করত।",
  },
  {
    q: "রুট ক্যানেল থেরাপিতে কি খুব বেশি ব্যথা হয়?",
    a: "একদমই না! আধুনিক লোকাল অ্যানেস্থেসিয়া ও রোটারি সিস্টেমের কারণে রুট ক্যানেল চিকিৎসা ১০০% ব্যথামুক্তভাবে সম্পন্ন করা হয়। বরং দাঁতের তীব্র ব্যথা স্থায়ীভাবে দূর করতেই রুট ক্যানেল করা হয়।",
  },
  {
    q: "রুট ক্যানেল করার পর কি ক্যাপ (Crown) লাগানো বাধ্যতামূলক?",
    a: "হ্যাঁ, বিশেষ করে পেছনের চিবানোর দাঁতগুলোতে ক্যাপ লাগানো অত্যন্ত জরুরি। রুট ক্যানেলের পর দাঁতটি নির্জীব ও ভঙ্গুর হয়ে যায়। শক্ত খাবারে যেন দাঁতটি ভেঙে না যায়, সে জন্য ক্যাপ দাঁতটিকে প্রটেক্টিভ শিল্ড হিসেবে আজীবন সুরক্ষা দেয়।",
  },
  {
    q: "গর্ভাবস্থায় (Pregnancy) ডেন্টাল চিকিৎসা নেওয়া কি নিরাপদ?",
    a: "হ্যাঁ, বিশেষ করে গর্ভাবস্থার দ্বিতীয় ট্রাইমেস্টারে (৪র্থ থেকে ৬ষ্ঠ মাস) স্কেলিং, ফিলিং বা জরুরি দাঁতের চিকিৎসা নেওয়া সম্পূর্ণ নিরাপদ। প্রেগন্যান্সিতে হরমোনের কারণে মাড়ি ফোলা ও রক্ত পড়ার সমস্যা বাড়ে, তাই মাড়ির যত্ন নেওয়া আরও জরুরি।",
  },
  {
    q: "দাঁত তোলার চেয়ে রুট ক্যানেল করে দাঁত বাঁচানো কেন ভালো?",
    a: "প্রাকৃতিক দাঁতের কোনো বিকল্প নেই। দাঁত ফেলে দিলে পাশের দাঁতগুলো হেলে পড়ে, চিবানোর ভারসাম্য নষ্ট হয় এবং কৃত্রিম দাঁত বসাতে অতিরিক্ত খরচের প্রয়োজন হয়। রুট ক্যানেল করলে নিজের দাঁতটিই আজীবন ব্যবহার করা যায়।",
  },
  {
    q: "কত ঘন ঘন ডেন্টাল চেক-আপ ও টুথব্রাশ পরিবর্তন করা উচিত?",
    a: "প্রতি ৬ মাস পরপর অন্তত একবার নিয়মিত ডেন্টাল চেক-আপ ও স্কেলিং করানো উচিত। আর টুথব্রাশ প্রতি ৩ মাস পরপর অথবা ব্রাশের ব্রিসল বেঁকে গেলেই পরিবর্তন করা নিয়ম।",
  },
  {
    q: "ডেন্টাল ইমপ্ল্যান্টের স্থায়িত্ব কত দিন?",
    a: "সঠিক যত্ন, নিয়মিত ওরাল হাইজিন ও ডায়াবেটিস নিয়ন্ত্রণে রাখলে টাইটানিয়াম ডেন্টাল ইমপ্ল্যান্ট আজীবন (Lifetime) স্থায়ী হতে পারে।",
  },
];

export default function EmergencyFaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>জরুরি সাহায্য ও সচেতনতা</span>
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--antd-text)]">
              ইমার্জেন্সি ডেন্টাল ফার্স্ট এইড ও FAQ
            </h1>
            <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)]">
              আকস্মিক দাঁতের তীব্র ব্যথা বা দুর্ঘটনায় তাৎক্ষণিক করণীয় এবং দাঁতের স্বাস্থ্য সম্পর্কিত সাধারণ জিজ্ঞাসার সঠিক উত্তর।
            </p>
          </div>

          {/* Emergency Hotline Alert Banner */}
          <div className="bg-gradient-to-r from-red-500/15 via-rose-500/10 to-amber-500/15 border border-red-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>২৪/৭ ইমার্জেন্সি ডেন্টাল সাপোর্ট ও পরামর্শ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--antd-text)]">
                অসহ্য দাঁতে ব্যথা বা আঘাত? অবিলম্বে যোগাযোগ করুন!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)] max-w-xl">
                জরুরি ক্ষেত্রে রোগীকে প্রাথমিক পরামর্শ প্রদান এবং অন-কল ডক্টরস সহায়তা দেওয়া হয়।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="tel:+8801700000000"
                className="antd-btn antd-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md bg-red-600 hover:bg-red-700 border-red-600 text-white"
              >
                <PhoneCall className="w-4 h-4" />
                <span>কল: +880 1700-000000</span>
              </a>

              <a
                href="https://wa.me/8801700000000?text=জরুরি%20ডেন্টাল%20পরামর্শ%20প্রয়োজন"
                target="_blank"
                rel="noreferrer"
                className="antd-btn antd-btn-default px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 text-emerald-600 hover:border-emerald-500 bg-[var(--antd-bg-container)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp জরুরি চ্যাট</span>
              </a>
            </div>
          </div>

          {/* Emergency First Aid Tips Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--antd-text)] flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                <span>জরুরি পরিস্থিতিতে তাৎক্ষণিক ফার্স্ট এইড গাইড</span>
              </h3>
              <Tag color="red" className="font-semibold text-xs">জরুরি গাইডলাইন</Tag>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {EMERGENCY_TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-[var(--antd-primary-border)] transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{tip.icon}</span>
                      <Tag color="volcano" className="text-[10px] font-bold">
                        {tip.badge}
                      </Tag>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-[var(--antd-text)]">
                      {tip.title}
                    </h4>

                    <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15 text-xs text-[var(--antd-text)] font-medium">
                      ⚡ <strong>তাৎক্ষণিক করণীয়:</strong> {tip.urgentAction}
                    </div>

                    <ul className="text-xs text-[var(--antd-text-secondary)] space-y-1.5 list-disc list-inside pt-1">
                      {tip.steps.map((s, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 font-medium">
                    ⚠️ <strong>সতর্কতা:</strong> {tip.warning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dental FAQ Accordion Section */}
          <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--antd-text)] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[var(--antd-primary)]" />
                <span>সাধারণ জিজ্ঞাসা ও উত্তর (Dental FAQs)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)]">
                ডেন্টাল চিকিৎসা সম্পর্কিত বহুল প্রচলিত প্রশ্নগুলোর বিশেষজ্ঞ মতামত।
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all ${
                      isOpen
                        ? "border-[var(--antd-primary)] bg-[var(--antd-primary-bg)]/30"
                        : "border-[var(--antd-border-split)] bg-[var(--antd-bg-layout)]/50 hover:border-[var(--antd-border)]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[var(--antd-text)]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[var(--antd-primary)]/10 text-[var(--antd-primary)] text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[var(--antd-primary)] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--antd-text-secondary)] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--antd-text-secondary)] leading-relaxed border-t border-[var(--antd-border-split)]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 text-center">
              <p className="text-xs text-[var(--antd-text-secondary)]">
                অন্য কোনো প্রশ্ন বা চিকিৎসা সংক্রান্ত পরামর্শের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।
              </p>
              <div className="mt-3 inline-flex items-center gap-3">
                <Link
                  href="/book"
                  className="antd-btn antd-btn-primary px-4 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>সিরিয়াল বুক করুন</span>
                </Link>
                <Link
                  href="/doctor"
                  className="antd-btn antd-btn-default px-4 py-1.5 rounded-lg text-xs font-semibold"
                >
                  ডক্টরের সময়সূচি দেখুন
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
