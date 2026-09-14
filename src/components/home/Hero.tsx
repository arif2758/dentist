"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
import { QueueState } from "@/types";

export function Hero() {
  const { data } = useQuery<{ success: boolean; data: QueueState }>({
    queryKey: ["liveQueue"],
    queryFn: async () => {
      const res = await fetch("/api/queue");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const queue = data?.data;
  const currentToken = queue?.currentlyServingToken ?? 1;
  const waitingCount =
    queue?.activeQueueList?.filter((a) => a.status === "WAITING")?.length ?? 0;
  const isOnBreak = queue?.breakInfo?.isOnBreak ?? false;
  const breakReasonText = queue?.breakInfo?.reasonText || "বিরতি চলছে";

  return (
    <section
      id="hero"
      className={`relative overflow-hidden py-8 sm:py-12 lg:py-16 bg-[var(--antd-bg-layout)] ${styles.heroBackgroundPattern}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Headlines & Action (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Real-time Badge */}
            <div className="inline-flex items-center gap-2 antd-tag antd-tag-blue py-1 px-3.5 text-xs font-semibold rounded-full shadow-xs">
              <span className={styles.livePulseDot} />
              <span>লাইভ ওপিডি ট্র্যাকার সক্রিয় • ৩০ বছরের অভিজ্ঞতা</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-[var(--antd-text)] leading-snug sm:leading-tight">
              চেম্বারে দীর্ঘ অপেক্ষা নয়,{" "}
              <br className="hidden sm:inline" />
              <span className="text-[var(--antd-primary)]">
                ঘরে বসেই ট্র্যাক করুন ডেন্টাল সিরিয়াল
              </span>
            </h1>

            {/* Subtitle - concise and airy */}
            <p className="text-xs sm:text-base text-[var(--antd-text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              বর্তমান রানিং টোকেন দেখে নিজের সুবিধাজনক সময়ে চেম্বারে আসুন। 
              সম্পূর্ণ আধুনিক, হাইজিনিক ও ব্যথামুক্ত ডেন্টাল সেবা।
            </p>

            {/* Mobile-first Live Token Quick Strip - Clean & Clickable */}
            <Link
              href="/live-queue"
              className="group block p-3 sm:p-4 rounded-[var(--antd-radius-lg)] bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] shadow-xs transition-all text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[var(--antd-radius)] bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] flex items-center justify-center text-[var(--antd-primary)] font-black text-lg sm:text-xl shrink-0 group-hover:scale-105 transition-transform">
                    #{currentToken}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] sm:text-xs font-bold text-[var(--antd-primary)]">
                        {isOnBreak ? "চেম্বার বিরতি" : "বর্তমানে চিকিৎসাধীন"}
                      </span>
                      {isOnBreak ? (
                        <span className="antd-tag antd-tag-orange py-0 px-1 text-[10px] leading-tight">
                          ☕ {breakReasonText}
                        </span>
                      ) : (
                        <span className="antd-tag antd-tag-green py-0 px-1 text-[10px] leading-tight">
                          সক্রিয়
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--antd-text)] mt-0.5 truncate">
                      টোকেন #{currentToken} • অপেক্ষমাণ {waitingCount} জন রোগী
                    </p>
                  </div>
                </div>

                <div className="antd-btn antd-btn-default antd-btn-sm font-semibold text-xs shrink-0 flex items-center gap-1 group-hover:bg-[var(--antd-primary)] group-hover:text-white transition-colors">
                  <span className="hidden xs:inline sm:inline">অবস্থান দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Action Buttons - Clean & Spacious */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/book"
                className="antd-btn antd-btn-primary antd-btn-lg flex items-center justify-center gap-2 font-bold shadow-xs text-sm h-11"
              >
                <Calendar className="w-4 h-4" />
                <span>সিরিয়াল বুক করুন</span>
              </Link>

              <Link
                href="/live-queue"
                className="antd-btn antd-btn-default antd-btn-lg flex items-center justify-center gap-2 font-semibold shadow-xs text-sm h-11"
              >
                <Eye className="w-4 h-4 text-[var(--antd-primary)]" />
                <span>লাইভ কিউ দেখুন</span>
              </Link>
            </div>

            {/* Subtle Prescription Portal Link */}
            <div className="pt-0.5 text-center lg:text-left">
              <Link
                href="/patient-history"
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] transition-colors"
              >
                <span>পুরোনো প্রেসক্রিপশন বা রিপোর্ট খুঁজছেন?</span>
                <span className="text-[var(--antd-primary)] font-semibold underline underline-offset-2">এখানে দেখুন →</span>
              </Link>
            </div>

            {/* Clean Feature Highlights: Hidden on small mobile to reduce clutter, visible on sm+ */}
            <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-2 text-xs text-[var(--antd-text-secondary)] font-medium">
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
