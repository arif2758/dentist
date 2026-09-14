"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2, 
  Clock, 
  Heart, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Smile, 
  Zap 
} from "lucide-react";
import styles from "@/styles/styles.module.css";

const SERVICES = [
  {
    id: "rct",
    category: "surgery",
    title: "ডিজিটাল রুট ক্যানেল থেরাপি (Single-Visit RCT)",
    badge: "ব্যথামুক্ত পদ্ধতি",
    desc: "উন্নত রোটারি এন্ডোডন্টিক্স এবং ডিজিটাল এপেক্স লোকেটার প্রযুক্তির সাহায্যে ব্যথা ছাড়া মাত্র ১-২ সেশনেই সম্পূর্ণ দাঁত সংরক্ষণ।",
    duration: "৩০-৪৫ মিনিট",
    features: ["লোকাল অ্যানেস্থেসিয়ায় সম্পূর্ণ ব্যথামুক্ত", "কম্পিউটারাইজড রুট মেজারমেন্ট", "জিরকোনিয়া বা পোরসেলিন ক্যাপ সুবিধা"],
    badgeClass: "antd-tag antd-tag-blue",
  },
  {
    id: "scaling",
    category: "gum",
    title: "আল্ট্রাসনিক স্কেলিং ও এয়ার পলিশিং",
    badge: "মাড়ির সুরক্ষা",
    desc: "দাঁতের এনামেলের ক্ষতি ছাড়া আল্ট্রাসনিক ভাইব্রেশনে পাথর, দাগ ও নিকোটিন স্টেইন সম্পূর্ণ দূর করে মাড়ির রক্ত পড়া রোধ।",
    duration: "২৫-৩৫ মিনিট",
    features: ["এনামেল-সেফ ফ্রিকোয়েন্সি ভাইব্রেশন", "জিঞ্জিভাইটিস ও মুখের দুর্গন্ধ দূর", "স্মুথ এয়ার-পলিশ ফিনিশ"],
    badgeClass: "antd-tag antd-tag-green",
  },
  {
    id: "implant",
    category: "implant",
    title: "অসিত্ত-ইন্টিগ্রেটেড ডেন্টাল ইমপ্ল্যান্ট",
    badge: "স্থায়ী দাঁত প্রতিস্থাপন",
    desc: "হারিয়ে যাওয়া দাঁতের জায়গায় আন্তর্জাতিক মানের টাইটানিয়াম ইমপ্ল্যান্ট। আজীবন স্বাভাবিক দাঁতের মতো চিবিয়ে খাওয়ার নিশ্চয়তা।",
    duration: "পরামর্শ ও ১ দিন রুটিন",
    features: ["আজীবন টেকসই গ্যারান্টি", "পাশের সুস্থ দাঁতের কোনো ক্ষতি নেই", "ন্যাচারাল লুক ও ফিল"],
    badgeClass: "antd-tag antd-tag-blue",
  },
  {
    id: "whitening",
    category: "cosmetic",
    title: "লেজার টিথ হোয়াইটেনিং ও স্মাইল মেকওভার",
    badge: "উজ্জ্বল শুভ্র হাসি",
    desc: "হলুদাভ বা বিবর্ণ দাঁতকে লেজার টেকনোলজি দিয়ে মাত্র ১ ঘণ্টার সেশনে ৩-৪ শেড পর্যন্ত আকর্ষণীয় ও উজ্জ্বল শুভ্র করে তোলা হয়।",
    duration: "৪৫-৬০ মিনিট",
    features: ["তাৎক্ষণিক ফলাফল দৃশ্যমান", "সংবেদনশীলতা মুক্ত জেল ফর্মুলা", "বিয়ে ও ইভেন্টের জন্য আদর্শ"],
    badgeClass: "antd-tag antd-tag-orange",
  },
  {
    id: "braces",
    category: "cosmetic",
    title: "অর্থোডন্টিক ব্রেসেস ও ইনভিজিবল অ্যালাইনার্স",
    badge: "সুন্দর ও সমান দাঁত",
    desc: "আঁকাবাঁকা, ফাঁকা বা অসমান দাঁত সুন্দর ও নিখুঁত করার জন্য মেটাল ব্রেসেস, সিরামিক ব্রেসেস এবং চোখ ধাঁধানো অদৃশ্য ইনভিসালাইন।",
    duration: "মাসিক ফলো-আপ",
    features: ["কম্পিউটারাইজড 3D প্ল্যানিং", "সেলফ-লাইগেটিং স্পিড ব্রেসেস", "অদৃশ্যমান ক্লিয়ার অ্যালাইনার অপশন"],
    badgeClass: "antd-tag antd-tag-blue",
  },
  {
    id: "pediatric",
    category: "pediatric",
    title: "পেডিয়াট্রিক ডেন্টিস্ট্রি (শিশুদের যত্ন)",
    badge: "ভয়মুক্ত পরিবেশ",
    desc: "শিশুদের দাঁতের ক্ষয়রোধ, ফ্লোরাইড থেরাপি, পিট ও ফিশার সিল্যান্ট এবং শিশুসুলভ আনন্দদায়ক ও ভয়মুক্ত পরিবেশে চিকিৎসা।",
    duration: "২০-৩০ মিনিট",
    features: ["ফ্রেন্ডলি ডক্টর ও নার্সিং স্টাফ", "পেইনলেস অ্যানাস্থেসিয়া স্প্রে", "দাঁতের দীর্ঘস্থায়ী সুরক্ষা"],
    badgeClass: "antd-tag antd-tag-green",
  },
];

const CATEGORIES = [
  { key: "all", label: "সকল চিকিৎসা" },
  { key: "surgery", label: "রুট ক্যানেল ও সার্জারি" },
  { key: "gum", label: "স্কেলিং ও মাড়ির যত্ন" },
  { key: "implant", label: "ডেন্টাল ইমপ্ল্যান্ট" },
  { key: "cosmetic", label: "স্মাইল মেকওভার" },
  { key: "pediatric", label: "শিশুদের ডেন্টিস্ট্রি" },
];

export function Services() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return SERVICES;
    return SERVICES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
      
      {/* 1. Mobile-First Streamlined Subheader */}
      {/* Mobile Subheader (< sm) */}
      <div className="flex sm:hidden items-center justify-between py-0.5 pb-2 border-b border-[var(--antd-border-split)]">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/"
            className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] hover:bg-[var(--antd-fill-quaternary)] active:scale-95 transition-all shrink-0"
            aria-label="হোম পেজে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-[var(--antd-text)] truncate leading-tight">
              ক্লিনিক্যাল ডেন্টাল সেবাসমূহ
            </h1>
            <p className="text-[10px] text-[var(--antd-text-tertiary)] truncate">
              বিশেষায়িত চিকিৎসা ও স্মাইল কেয়ার
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 antd-tag antd-tag-blue py-0.5 px-2 text-[10px] font-semibold shrink-0">
          <Sparkles className="w-3 h-3 text-[var(--antd-primary)]" />
          <span>ডিজিটাল</span>
        </span>
      </div>

      {/* Desktop & Middle Devices Subheader (>= sm) */}
      <div className="hidden sm:flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-3 border-b border-[var(--antd-border-split)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[var(--antd-text-secondary)] mb-1">
            <Link href="/" className="hover:text-[var(--antd-primary)] transition-colors inline-flex items-center gap-1 shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" /> হোম
            </Link>
            <span>/</span>
            <span className="text-[var(--antd-text)] font-medium truncate">ক্লিনিক্যাল সেবাসমূহ</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--antd-text)] whitespace-nowrap">
              বিশেষায়িত ডেন্টাল চিকিৎসা ও সেবা
            </h1>
            <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0.5 px-2 text-[11px] font-semibold whitespace-nowrap shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
              <span>ডিজিটাল টেকনোলজি</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/book"
            className="antd-btn antd-btn-primary h-8 px-3 text-xs font-bold flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>সিরিয়াল বুক করুন</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg shrink-0 border transition-all ${
                isActive
                  ? "bg-[var(--antd-primary)] text-white border-[var(--antd-primary)] shadow-xs"
                  : "bg-[var(--antd-bg-container)] border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:border-[var(--antd-border)]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Services Grid (Ant Design Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredServices.map((srv) => (
          <article
            key={srv.id}
            className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] hover:border-[var(--antd-primary-border)] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Badge and Duration */}
              <div className="flex items-center justify-between">
                <span className={`${srv.badgeClass} text-[10px] font-bold py-0.5 px-2`}>
                  {srv.badge}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[var(--antd-text-secondary)] font-medium">
                  <Clock className="w-3 h-3 text-[var(--antd-primary)]" /> {srv.duration}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-[var(--antd-text)] hover:text-[var(--antd-primary)] transition-colors leading-snug">
                {srv.title}
              </h2>

              {/* Description */}
              <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                {srv.desc}
              </p>

              {/* Clinical Highlights */}
              <div className="pt-2 border-t border-[var(--antd-border-split)] space-y-1.5">
                {srv.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[var(--antd-text)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-success)] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Booking Link */}
            <div className="pt-4 mt-4 border-t border-[var(--antd-border-split)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--antd-text-tertiary)]">
                পেইনলেস অ্যানাস্থেসিয়া
              </span>
              <Link
                href="/book"
                className="antd-btn antd-btn-primary antd-btn-sm text-xs font-bold inline-flex items-center gap-1 shadow-xs"
              >
                <span>সিরিয়াল নিন</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
