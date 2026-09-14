"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Hourglass,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import styles from "@/styles/styles.module.css";
import { Appointment, QueueState } from "@/lib/types";

export function LiveQueueMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedToken, setSearchedToken] = useState<
    Appointment | null | "not_found"
  >(null);
  const [filterTab, setFilterTab] = useState<"ALL" | "WAITING" | "COMPLETED">(
    "ALL",
  );

  // Real-time polling queue every 5 seconds
  const { data, isFetching, refetch } = useQuery<{
    success: boolean;
    data: QueueState;
  }>({
    queryKey: ["liveQueue"],
    queryFn: async () => {
      const res = await fetch("/api/queue");
      if (!res.ok) throw new Error("Failed to fetch queue");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const queue = data?.data;
  const servingToken = queue?.currentlyServingToken ?? 4;
  const activeList = queue?.activeQueueList ?? [];
  const waitingPatients = activeList.filter((a) => a.status === "WAITING");
  const completedPatients = activeList.filter((a) => a.status === "COMPLETED");
  const servingPatient = activeList.find(
    (a) => a.tokenNumber === servingToken && a.status === "SERVING",
  );
  const nextPatient = waitingPatients.find((a) => a.tokenNumber > servingToken);
  const avgTime = queue?.avgMinutesPerPatient ?? 18;

  // Search logic for patient's own token
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = activeList.find((a) => {
      const matchToken =
        a.tokenNumber.toString() === query ||
        `token-${a.tokenNumber}` === query;
      const matchPhone = a.phone.includes(query);
      const matchName = a.patientName.toLowerCase().includes(query);
      return matchToken || matchPhone || matchName;
    });

    setSearchedToken(found || "not_found");
  };

  const handleQuickChipSelect = (tokenNum: number) => {
    setSearchQuery(tokenNum.toString());
    const found = activeList.find((a) => a.tokenNumber === tokenNum);
    setSearchedToken(found || "not_found");
  };

  const calculateWaitInfo = (tokenNum: number) => {
    if (tokenNum === servingToken) {
      return {
        ahead: 0,
        estimatedMinutes: 0,
        step: 3,
        statusText: "বর্তমানে চিকিৎসাধীন",
        message:
          "আপনার সিরিয়াল এখন চলছে! অনুগ্রহ করে চেম্বার রুমে প্রবেশ করুন।",
        color: "antd-tag-green",
      };
    }

    if (tokenNum < servingToken) {
      return {
        ahead: 0,
        estimatedMinutes: 0,
        step: 4,
        statusText: "চিকিৎসা সম্পন্ন",
        message:
          "আপনার সিরিয়াল ইতিমধ্যে সম্পন্ন হয়েছে অথবা আপনি সময়মতো উপস্থিত ছিলেন না।",
        color:
          "bg-[var(--antd-bg-layout)] border-[var(--antd-border)] text-[var(--antd-text-secondary)]",
      };
    }

    const patientsAhead = activeList.filter(
      (a) =>
        a.tokenNumber >= servingToken &&
        a.tokenNumber < tokenNum &&
        (a.status === "WAITING" || a.status === "SERVING"),
    ).length;

    const waitMins = patientsAhead * avgTime;

    if (patientsAhead === 1) {
      return {
        ahead: 1,
        estimatedMinutes: waitMins,
        step: 2,
        statusText: "পরবর্তী রোগী (প্রস্তুত থাকুন)",
        message: `আপনার সিরিয়াল খুব কাছাকাছি! চেম্বারের ওয়েটিং রুমে প্রস্তুত থাকুন (আনুমানিক ~${waitMins} মিনিট)।`,
        color: "antd-tag-orange",
      };
    }

    return {
      ahead: patientsAhead,
      estimatedMinutes: waitMins,
      step: 1,
      statusText: `সিরিয়াল কিউতে আছেন (${patientsAhead} জন পূর্বে)`,
      message: `আপনার আগে ${patientsAhead} জন রোগী চিকিৎসাধীন ও অপেক্ষমাণ আছেন। আনুমানিক অপেক্ষা: ~${waitMins} মিনিট।`,
      color: "antd-tag-blue",
    };
  };

  // Filtered queue table & cards (Reversed order: latest & current serials first)
  const filteredQueue = useMemo(() => {
    let list = activeList;
    if (filterTab === "WAITING") {
      list = activeList.filter(
        (a) => a.status === "WAITING" || a.status === "SERVING",
      );
    } else if (filterTab === "COMPLETED") {
      list = activeList.filter((a) => a.status === "COMPLETED");
    }
    return [...list].reverse();
  }, [activeList, filterTab]);

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
              লাইভ ওপিডি সিরিয়াল
            </h1>
            <p className="text-[10px] text-[var(--antd-text-tertiary)] truncate">
              রিয়েল-টাইম ডেন্টাল কিউ সিঙ্ক
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0.5 px-2 text-[10px] font-bold">
            <span className={styles.livePulseDot} />
            <span>লাইভ</span>
          </div>
          <button
            onClick={() => refetch()}
            title="রিফ্রেশ করুন"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] hover:bg-[var(--antd-fill-quaternary)] active:scale-95 transition-all"
            aria-label="রিফ্রেশ"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[var(--antd-primary)]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Desktop Subheader (>= sm) */}
      <div className="hidden sm:flex items-center justify-between pb-3 border-b border-[var(--antd-border-split)]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--antd-text-secondary)] mb-1">
            <Link
              href="/"
              className="hover:text-[var(--antd-primary)] transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> হোম
            </Link>
            <span>/</span>
            <span className="text-[var(--antd-text)] font-medium">
              লাইভ ওপিডি সিরিয়াল
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[var(--antd-text)]">
              লাইভ ওপিডি সিরিয়াল মনিটর
            </h1>
            <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0.5 px-2 text-[11px] font-semibold">
              <span className={styles.livePulseDot} />
              <span>লাইভ সিঙ্ক {isFetching && "..."}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-[var(--antd-text)]">
              ডা. মো. আসিফুল হক
            </p>
            <p className="text-[11px] text-[var(--antd-text-secondary)]">
              চেম্বার রুম #০১ • রাত ৯:৩০ পর্যন্ত
            </p>
          </div>

          <button
            onClick={() => refetch()}
            title="রিফ্রেশ করুন"
            className="antd-btn antd-btn-default h-8 px-2.5 text-xs flex items-center gap-1 font-medium"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[var(--antd-primary)]" : ""}`}
            />
            <span>রিফ্রেশ</span>
          </button>

          <Link
            href="/book"
            className="antd-btn antd-btn-primary h-8 px-3 text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>নতুন সিরিয়াল</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Live Chamber Display (High-End Hospital Board Card) */}
      <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--antd-border-split)] text-xs text-[var(--antd-text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--antd-text)]">
              রুম #০১: ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জারি
            </span>
            <span className="hidden sm:inline text-[var(--antd-border)]">
              |
            </span>
            <span className="hidden sm:inline text-[var(--antd-primary)] font-medium">
              ডাক্তার উপস্থিত আছেন
            </span>
          </div>
          <span className="text-[11px] text-[var(--antd-text-tertiary)]">
            গড় পরামর্শ সময়: ~{avgTime} মি./রোগী
          </span>
        </div>

        {/* 3 Columns Live Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Col 1: Currently In Consultation (Hero Stage) */}
          <div className="lg:col-span-5 antd-card antd-card-bordered p-4 sm:p-5 rounded-xl relative overflow-hidden border-2 border-[var(--antd-primary)] bg-[var(--antd-primary-bg)]/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--antd-primary-border)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-primary)] flex items-center gap-1.5">
                  <span className={styles.livePulseDot} />
                  বর্তমানে চিকিৎসাধীন
                </span>
                <span className="antd-tag antd-tag-green font-bold text-[10px] py-0.5 px-2">
                  চেম্বারে উপস্থিত
                </span>
              </div>

              <div className="py-4 text-center">
                <span className="text-[11px] text-[var(--antd-text-tertiary)] uppercase tracking-wider font-semibold block">
                  রানিং সিরিয়াল নম্বর
                </span>
                <span className="text-5xl sm:text-6xl font-black text-[var(--antd-primary)] tracking-tight inline-block my-1">
                  #{servingToken}
                </span>

                <div className="mt-1 text-xs">
                  {servingPatient ? (
                    <div>
                      <span className="font-bold text-sm text-[var(--antd-text)] block">
                        {servingPatient.patientName}
                      </span>
                      <span className="text-[var(--antd-text-secondary)] text-xs">
                        {servingPatient.serviceType}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[var(--antd-text-secondary)]">
                      চিকিৎসা প্রায় সম্পন্ন
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--antd-primary-border)] flex items-center justify-between text-xs text-[var(--antd-text-secondary)]">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                স্লট: {servingPatient?.timeSlot || "চলমান"}
              </span>
              <span className="text-[var(--antd-primary)] font-bold text-[11px]">
                কনসাল্টেশন রানিং
              </span>
            </div>
          </div>

          {/* Col 2: Next Patient in Line */}
          <div className="lg:col-span-4 antd-card antd-card-bordered p-4 sm:p-5 rounded-xl flex flex-col justify-between bg-[var(--antd-bg-layout)]/50">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--antd-border-split)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-warning)] flex items-center gap-1.5">
                  <Hourglass className="w-3.5 h-3.5" /> পরবর্তী রোগী
                </span>
                <span className="antd-tag antd-tag-orange font-bold text-[10px] py-0.5 px-2">
                  প্রস্তুত থাকুন
                </span>
              </div>

              <div className="py-4 text-center">
                <span className="text-[11px] text-[var(--antd-text-tertiary)] uppercase tracking-wider font-semibold block">
                  পরবর্তী টোকেন
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold text-[var(--antd-warning)] tracking-tight inline-block my-1">
                  {nextPatient
                    ? `#${nextPatient.tokenNumber}`
                    : `#${servingToken + 1}`}
                </span>

                <div className="mt-1 text-xs">
                  {nextPatient ? (
                    <div>
                      <span className="font-bold text-sm text-[var(--antd-text)] block">
                        {nextPatient.patientName}
                      </span>
                      <span className="text-[var(--antd-text-secondary)] text-xs">
                        {nextPatient.serviceType}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[var(--antd-text-secondary)]">
                      পরবর্তী রোগী প্রস্তুত হচ্ছেন
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--antd-border-split)] text-center text-xs">
              <p className="text-[var(--antd-warning)] font-medium text-[11px]">
                পরবর্তী রোগীর চেম্বার দরজার সামনে ওয়েটিং রুমে বসার অনুরোধ।
              </p>
            </div>
          </div>

          {/* Col 3: Real-Time OPD Queue Statistics */}
          <div className="lg:col-span-3 antd-card antd-card-bordered p-4 sm:p-5 rounded-xl flex flex-col justify-between bg-[var(--antd-bg-layout)]/50">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--antd-border-split)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-text-secondary)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[var(--antd-primary)]" />{" "}
                  আজকের কিউ
                </span>
                <span className="text-[11px] text-[var(--antd-text-tertiary)]">
                  তারিখ: আজ
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 py-3">
                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] text-center">
                  <span className="text-xl font-extrabold text-[var(--antd-text)]">
                    {queue?.totalTokensToday ?? 8}
                  </span>
                  <p className="text-[10px] text-[var(--antd-text-secondary)] font-medium">
                    মোট সিরিয়াল
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] text-center">
                  <span className="text-xl font-extrabold text-[var(--antd-primary)]">
                    {waitingPatients.length}
                  </span>
                  <p className="text-[10px] text-[var(--antd-primary)] font-medium">
                    অপেক্ষমাণ
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] text-center">
                  <span className="text-xl font-extrabold text-[var(--antd-success)]">
                    {completedPatients.length}
                  </span>
                  <p className="text-[10px] text-[var(--antd-text-secondary)] font-medium">
                    সম্পন্ন সেবা
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] text-center">
                  <span className="text-xl font-extrabold text-[var(--antd-text)]">
                    ~{waitingPatients.length * avgTime} মি.
                  </span>
                  <p className="text-[10px] text-[var(--antd-text-secondary)] font-medium">
                    মোট ওয়েটিং
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--antd-border-split)] text-[11px] text-[var(--antd-text-secondary)] flex items-center justify-between">
              <span>সিরিয়াল বুকিং: খোলা</span>
              <span className="text-[var(--antd-primary)] font-semibold">
                চেম্বার অন-টাইম
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Patient Token Fast-Track Tracker (Visual Stepper & Countdown) */}
      <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-3.5">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[var(--antd-text)] flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4 text-[var(--antd-primary)]" />
              আপনার সিরিয়ালের বর্তমান অবস্থান চেক করুন
            </h2>
            <p className="text-xs text-[var(--antd-text-secondary)]">
              বুকিংয়ের সময় প্রাপ্ত টোকেন নম্বর বা আপনার মোবাইল নম্বর দিন:
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="যেমন: 4, 5 বা 01711..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="antd-input h-10 px-3.5 text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="antd-btn antd-btn-primary h-10 px-5 font-bold text-xs sm:text-sm shrink-0 shadow-xs"
            >
              অনুসন্ধান
            </button>
          </form>

          {/* Quick Token Selection Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs pt-1">
            <span className="text-[11px] text-[var(--antd-text-tertiary)]">
              ক্লিক করে অবস্থান দেখুন:
            </span>
            {[...activeList]
              .reverse()
              .slice(0, 6)
              .map((apt) => (
                <button
                  key={apt.id}
                  type="button"
                  onClick={() => handleQuickChipSelect(apt.tokenNumber)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    apt.tokenNumber === servingToken
                      ? "bg-[var(--antd-green-1)] border-[var(--antd-green-3)] text-[var(--antd-green-6)]"
                      : "bg-[var(--antd-bg-layout)] border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] hover:border-[var(--antd-primary)]"
                  }`}
                >
                  #{apt.tokenNumber}{" "}
                  {apt.tokenNumber === servingToken ? "(চলমান)" : ""}
                </button>
              ))}
          </div>

          {/* Searched Patient Status Output Card */}
          {searchedToken && searchedToken !== "not_found" && (
            <div className="mt-4 p-4 rounded-xl border border-[var(--antd-border-split)] bg-[var(--antd-bg-layout)]/60 space-y-3.5 animate-in fade-in slide-in-from-top-2">
              {(() => {
                const waitInfo = calculateWaitInfo(searchedToken.tokenNumber);
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--antd-border-split)]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[var(--antd-primary)] text-white font-black flex items-center justify-center text-sm shadow-xs">
                          #{searchedToken.tokenNumber}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[var(--antd-text)]">
                            {searchedToken.patientName}
                          </p>
                          <p className="text-xs text-[var(--antd-text-secondary)]">
                            {searchedToken.serviceType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="antd-tag antd-tag-blue text-xs font-semibold">
                          স্লট: {searchedToken.timeSlot}
                        </span>
                      </div>
                    </div>

                    {/* Visual Stepper / Timeline */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-[var(--antd-success)] text-white flex items-center justify-center font-bold text-[10px] mb-1">
                          ✓
                        </div>
                        <span className="text-[var(--antd-text-secondary)]">
                          বুকিং সম্পন্ন
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                            waitInfo.step >= 1
                              ? "bg-[var(--antd-success)] text-white"
                              : "bg-[var(--antd-border)] text-[var(--antd-text-tertiary)]"
                          }`}
                        >
                          {waitInfo.step > 1 ? "✓" : "২"}
                        </div>
                        <span className="text-[var(--antd-text-secondary)]">
                          কিউতে অন্তর্ভুক্তি
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                            waitInfo.step === 3
                              ? "bg-[var(--antd-primary)] text-white animate-pulse"
                              : waitInfo.step > 3
                                ? "bg-[var(--antd-success)] text-white"
                                : "bg-[var(--antd-warning)] text-white"
                          }`}
                        >
                          {waitInfo.step > 3 ? "✓" : "৩"}
                        </div>
                        <span className="font-semibold text-[var(--antd-text)]">
                          {waitInfo.step === 3 ? "চিকিৎসাধীন" : "ওয়েটিং রুম"}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                            waitInfo.step === 4
                              ? "bg-[var(--antd-success)] text-white"
                              : "bg-[var(--antd-border)] text-[var(--antd-text-tertiary)]"
                          }`}
                        >
                          ৪
                        </div>
                        <span className="text-[var(--antd-text-secondary)]">
                          পরামর্শ সমাপ্ত
                        </span>
                      </div>
                    </div>

                    {/* Status Message Box */}
                    <div
                      className={`p-3 rounded-lg border text-xs sm:text-sm font-medium leading-relaxed ${waitInfo.color}`}
                    >
                      {waitInfo.message}
                    </div>

                    {waitInfo.ahead > 0 && (
                      <div className="grid grid-cols-2 gap-3 text-xs text-center">
                        <div className="p-2.5 rounded-lg bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)]">
                          <span className="text-[var(--antd-text-secondary)] block text-[11px]">
                            আপনার পূর্বে চিকিৎসাপ্রার্থী
                          </span>
                          <span className="text-base font-extrabold text-[var(--antd-text)]">
                            {waitInfo.ahead} জন রোগী
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)]">
                          <span className="text-[var(--antd-primary)] block text-[11px]">
                            আনুমানিক অপেক্ষার সময়
                          </span>
                          <span className="text-base font-extrabold text-[var(--antd-primary)]">
                            ~{waitInfo.estimatedMinutes} মিনিট
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {searchedToken === "not_found" && (
            <div className="mt-3 p-3 rounded-lg bg-[var(--antd-error-bg)] border border-[var(--antd-error-border)] text-xs text-[var(--antd-error)] text-center">
              দুঃখিত, এই নম্বর বা টোকেন দিয়ে আজকের তালিকায় কোনো সিরিয়াল পাওয়া
              যায়নি।
            </div>
          )}
        </div>
      </div>

      {/* 4. Live Chamber Queue Board (Real-Time Transparency Table) */}
      <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Table Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--antd-border-split)]">
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-[var(--antd-text)]">
              আজকের সকল সিরিয়ালের সরাসরি তালিকা
            </h2>
            <p className="text-[11px] text-[var(--antd-text-secondary)]">
              রোগীর গোপনীয়তার স্বার্থে নামের অংশবিশেষ সুরক্ষিত রাখা হয়েছে
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-[var(--antd-bg-layout)] p-0.5 rounded-lg border border-[var(--antd-border-split)] text-xs font-semibold">
            <button
              onClick={() => setFilterTab("ALL")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterTab === "ALL"
                  ? "bg-[var(--antd-bg-container)] text-[var(--antd-primary)] shadow-xs"
                  : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
              }`}
            >
              সব ({activeList.length})
            </button>
            <button
              onClick={() => setFilterTab("WAITING")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterTab === "WAITING"
                  ? "bg-[var(--antd-bg-container)] text-[var(--antd-primary)] shadow-xs"
                  : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
              }`}
            >
              অপেক্ষমাণ ({waitingPatients.length + (servingPatient ? 1 : 0)})
            </button>
            <button
              onClick={() => setFilterTab("COMPLETED")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterTab === "COMPLETED"
                  ? "bg-[var(--antd-bg-container)] text-[var(--antd-primary)] shadow-xs"
                  : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
              }`}
            >
              সম্পন্ন ({completedPatients.length})
            </button>
          </div>
        </div>

        {/* Mobile View: Premium Minimal Card List (< sm) */}
        <div className="sm:hidden space-y-2">
          {filteredQueue.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--antd-text-tertiary)] bg-[var(--antd-bg-layout)]/30 rounded-xl border border-dashed border-[var(--antd-border-split)]">
              এই ক্যাটাগরিতে কোনো সিরিয়াল নেই
            </div>
          ) : (
            filteredQueue.map((item) => {
              const isCurrent =
                item.tokenNumber === servingToken && item.status === "SERVING";
              const isCompleted = item.status === "COMPLETED";

              return (
                <div
                  key={item.id}
                  onClick={() => handleQuickChipSelect(item.tokenNumber)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                    isCurrent
                      ? "bg-[var(--antd-color-success-bg)]/60 border-[var(--antd-color-success-border)] shadow-xs"
                      : isCompleted
                        ? "bg-[var(--antd-bg-layout)]/30 border-[var(--antd-border-split)] opacity-75"
                        : "bg-[var(--antd-bg-layout)]/50 border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] hover:bg-[var(--antd-bg-container)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    {/* Left: Token Pill + Patient & Service */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                          isCurrent
                            ? "bg-[var(--antd-color-success)] text-white"
                            : isCompleted
                              ? "bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] text-[var(--antd-text-tertiary)]"
                              : "bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] text-[var(--antd-primary)]"
                        }`}
                      >
                        #{item.tokenNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[var(--antd-text)] truncate">
                            {item.patientName.replace(/(?<=.{3}).(?=.*)/g, "*")}
                          </p>
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--antd-color-success)] animate-ping shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--antd-text-secondary)] truncate">
                          {item.serviceType}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status Pill & Time Slot */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      {item.status === "SERVING" ? (
                        <span className="antd-tag antd-tag-green font-bold text-[10px] py-0.5 px-2 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--antd-color-success)] animate-pulse" />
                          <span>চিকিৎসাধীন</span>
                        </span>
                      ) : item.status === "COMPLETED" ? (
                        <span className="antd-tag text-[10px] py-0.5 px-2 rounded-full text-[var(--antd-text-tertiary)]">
                          সম্পন্ন
                        </span>
                      ) : (
                        <span className="antd-tag antd-tag-blue font-bold text-[10px] py-0.5 px-2 rounded-full">
                          অপেক্ষমাণ
                        </span>
                      )}

                      <span className="text-[10px] text-[var(--antd-text-tertiary)] flex items-center gap-1 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{item.timeSlot}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Transparent Clean Table (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] font-semibold text-[11px]">
                <th className="py-2.5 px-3">টোকেন</th>
                <th className="py-2.5 px-3">রোগীর নাম</th>
                <th className="py-2.5 px-3">সেবার ধরন</th>
                <th className="py-2.5 px-3">স্লট</th>
                <th className="py-2.5 px-3 text-right">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--antd-border-split)]">
              {filteredQueue.map((item) => {
                const isCurrent =
                  item.tokenNumber === servingToken &&
                  item.status === "SERVING";
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-[var(--antd-primary-bg)]/50 font-semibold"
                        : "hover:bg-[var(--antd-bg-layout)]/50"
                    }`}
                    onClick={() => handleQuickChipSelect(item.tokenNumber)}
                  >
                    <td className="py-2.5 px-3 font-bold text-[var(--antd-primary)]">
                      <span className="inline-flex items-center gap-1">
                        #{item.tokenNumber}
                        {isCurrent && <span className={styles.livePulseDot} />}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--antd-text)] font-medium">
                      {item.patientName.replace(/(?<=.{3}).(?=.*)/g, "*")}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--antd-text-secondary)]">
                      {item.serviceType}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--antd-text-secondary)] text-[11px]">
                      {item.timeSlot}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.status === "SERVING" ? (
                        <span className="antd-tag antd-tag-green font-bold text-[10px] py-0.5 px-2">
                          চিকিৎসাধীন
                        </span>
                      ) : item.status === "COMPLETED" ? (
                        <span className="antd-tag text-[10px] py-0.5 px-2 text-[var(--antd-text-tertiary)]">
                          সম্পন্ন
                        </span>
                      ) : (
                        <span className="antd-tag antd-tag-blue font-bold text-[10px] py-0.5 px-2">
                          অপেক্ষমাণ
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
