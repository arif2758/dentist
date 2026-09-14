"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  ShieldCheck,
  Users,
  Activity,
  ArrowRight,
} from "lucide-react";
import styles from "@/styles/styles.module.css";

export function Hero() {
  return (
    <section
      id="hero"
      className={`relative overflow-hidden py-8 sm:py-12 lg:py-16 bg-[var(--antd-bg-layout)] ${styles.heroBackgroundPattern}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Headlines & Action (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            {/* Ant Design Tag Badge */}
            <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0.5 px-2.5 text-xs font-semibold">
              <span className={styles.livePulseDot} />
              <span>লাইভ ওপিডি ট্র্যাকার সক্রিয় • ৩০ বছরের অভিজ্ঞতা</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--antd-text)] leading-tight">
              চেম্বারে ঘণ্টার পর ঘণ্টা অপেক্ষা নয়,{" "}
              <br className="hidden sm:inline" />
              <span className="text-[var(--antd-primary)]">
                ঘরে বসেই ট্র্যাক করুন আপনার ডেন্টাল সিরিয়াল
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[var(--antd-text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              বর্তমান রানিং টোকেন কত চলছে জেনে নিজের আনুমানিক সময়ে চেম্বারে
              আসুন। আধুনিক ব্যথামুক্ত ডেন্টাল ট্রিটমেন্ট এবং সম্পূর্ণ নিরাপদ
              হাইজিন সেবা।
            </p>

            {/* Mobile-first Live Token Quick Strip */}
            <div className="p-3 sm:p-4 rounded-[var(--antd-radius-lg)] bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] shadow-xs flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--antd-radius)] bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] flex items-center justify-center text-[var(--antd-primary)] font-black text-base sm:text-xl shrink-0">
                  #৪
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--antd-primary)]">
                      বর্তমানে চিকিৎসাধীন
                    </span>
                    <span className="antd-tag antd-tag-green py-0 px-1 text-[10px] leading-tight">
                      সক্রিয়
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--antd-text)] mt-0.5">
                    টোকেন #৪ • অপেক্ষমাণ আছেন ৫ জন রোগী
                  </p>
                </div>
              </div>

              <Link
                href="/live-queue"
                className="antd-btn antd-btn-primary antd-btn-sm font-bold text-xs shrink-0 flex items-center gap-1"
              >
                <span>অবস্থান দেখুন</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Ant Design Action Buttons - Mobile thumb-friendly */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 pt-1">
              <Link
                href="/live-queue"
                className="antd-btn antd-btn-primary antd-btn-lg flex items-center justify-center gap-1.5 font-bold shadow-xs text-xs sm:text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>লাইভ সিরিয়াল</span>
              </Link>

              <Link
                href="/book"
                className="antd-btn antd-btn-default antd-btn-lg flex items-center justify-center gap-1.5 font-semibold shadow-xs text-xs sm:text-sm"
              >
                <Calendar className="w-4 h-4 text-[var(--antd-primary)]" />
                <span>সিরিয়াল নিন</span>
              </Link>

              <Link
                href="/patient-history"
                className="col-span-2 sm:col-auto text-xs font-semibold text-[var(--antd-primary)] hover:underline py-1 text-center"
              >
                পুরোনো প্রেসক্রিপশন পোর্টাল →
              </Link>
            </div>

            {/* Clean Feature Highlights: No heavy borders */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-1 text-xs text-[var(--antd-text-secondary)] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-primary)]" />{" "}
                রিয়েল-টাইম সিরিয়াল
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-primary)]" />{" "}
                ডিজিটাল প্রেসক্রিপশন
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-primary)]" />{" "}
                ব্যথামুক্ত চিকিৎসা
              </span>
            </div>
          </div>

          {/* Right Column: Doctor Profile Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="antd-card antd-card-bordered p-5 sm:p-6 shadow-xs">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-[var(--antd-border-split)]">
                <div className="w-12 h-12 rounded-[var(--antd-radius)] bg-[var(--antd-primary)] flex items-center justify-center text-white text-lg font-black shadow-xs shrink-0">
                  ডা.
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--antd-text)]">
                    ডা. মো. আসিফুল হক
                  </h3>
                  <p className="text-xs text-[var(--antd-primary)] font-semibold mt-0.5">
                    BDS (DU), FCPS (Oral Surgery), FICD (USA)
                  </p>
                  <p className="text-[11px] text-[var(--antd-text-secondary)] mt-0.5">
                    সিনিয়র ওরাল সার্জন ও ডেন্টিস্ট (৩০ বছরের ক্লিনিক্যাল
                    অভিজ্ঞতা)
                  </p>
                </div>
              </div>

              {/* Stats: 3 simple clean columns */}
              <div className="grid grid-cols-3 gap-2 py-3.5 text-center">
                <div className="p-2 rounded-[var(--antd-radius)] bg-[var(--antd-bg-layout)]">
                  <p className="text-base sm:text-lg font-extrabold text-[var(--antd-text)]">
                    ৩০+
                  </p>
                  <p className="text-[10px] text-[var(--antd-text-secondary)] font-medium">
                    বছর অভিজ্ঞতা
                  </p>
                </div>
                <div className="p-2 rounded-[var(--antd-radius)] bg-[var(--antd-bg-layout)]">
                  <p className="text-base sm:text-lg font-extrabold text-[var(--antd-primary)]">
                    ২৫,০০০+
                  </p>
                  <p className="text-[10px] text-[var(--antd-text-secondary)] font-medium">
                    সফল রোগী
                  </p>
                </div>
                <div className="p-2 rounded-[var(--antd-radius)] bg-[var(--antd-bg-layout)]">
                  <p className="text-base sm:text-lg font-extrabold text-[var(--antd-success)]">
                    ৯৯.৪%
                  </p>
                  <p className="text-[10px] text-[var(--antd-text-secondary)] font-medium">
                    পেইনলেস রেটিং
                  </p>
                </div>
              </div>

              {/* Chamber Info Strip */}
              <div className="p-3 rounded-[var(--antd-radius)] bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-[var(--antd-primary)] flex items-center gap-1.5">
                    <span className={styles.livePulseDot} /> চেম্বার সময়
                  </span>
                  <p className="text-[11px] text-[var(--antd-text-secondary)]">
                    প্রতিদিন বিকাল ৫:০০ - রাত ৯:৩০
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[var(--antd-text-tertiary)] block">
                    গড় সময়
                  </span>
                  <span className="font-bold text-[var(--antd-text)] text-xs">
                    ১৫-২০ মি./রোগী
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
