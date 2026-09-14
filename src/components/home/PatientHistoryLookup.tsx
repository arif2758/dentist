"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity,
  AlertTriangle, 
  ArrowLeft,
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download,
  FileCheck, 
  FileText, 
  Heart, 
  Info,
  Phone, 
  Pill, 
  Printer, 
  Search, 
  ShieldAlert, 
  ShieldCheck,
  Sparkles,
  Stethoscope, 
  User 
} from "lucide-react";
import styles from "@/styles/styles.module.css";
import { PatientRecord } from "@/lib/types";

export function PatientHistoryLookup() {
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState<PatientRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/patients?phone=${encodeURIComponent(phoneInput.trim())}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPatientData(json.data);
      } else {
        setPatientData(null);
        setErrorMsg("এই মোবাইল নম্বরে কোনো পূর্ববর্তী চিকিৎসার রেকর্ড পাওয়া যায়নি। নতুন সিরিয়াল বুক করতে সিরিয়াল বুকিং পেজে যান।");
      }
    } catch {
      setErrorMsg("সার্ভার ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSearch = (demoPhone: string) => {
    setPhoneInput(demoPhone);
    setLoading(true);
    setErrorMsg(null);
    fetch(`/api/patients?phone=${demoPhone}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setPatientData(json.data);
        } else {
          setErrorMsg("রেকর্ড পাওয়া যায়নি।");
        }
      })
      .catch(() => {
        setErrorMsg("সার্ভার ত্রুটি।");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-5">
      
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
              রোগীর ডিজিটাল হেলথ পোর্টাল
            </h1>
            <p className="text-[10px] text-[var(--antd-text-tertiary)] truncate">
              প্রেসক্রিপশন ও পূর্ববর্তী হিস্ট্রি
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 antd-tag antd-tag-blue py-0.5 px-2 text-[10px] font-bold shrink-0">
          <ShieldCheck className="w-3 h-3 text-[var(--antd-primary)]" />
          <span>ই-প্রেসক্রিপশন</span>
        </span>
      </div>

      {/* Desktop Subheader (>= sm) */}
      <div className="hidden sm:flex items-center justify-between pb-3 border-b border-[var(--antd-border-split)]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--antd-text-secondary)] mb-1">
            <Link href="/" className="hover:text-[var(--antd-primary)] transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> হোম
            </Link>
            <span>/</span>
            <span className="text-[var(--antd-text)] font-medium">পেশেন্ট রেকর্ড</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[var(--antd-text)]">
            রোগীর ডিজিটাল হেলথ পোর্টাল
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 antd-tag antd-tag-blue py-1 px-2.5 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
            <span>ই-প্রেসক্রিপশন ভেরিফাইড</span>
          </span>
          <Link
            href="/book"
            className="antd-btn antd-btn-primary h-8 px-3 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>নতুন সিরিয়াল</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Search & Quick Access Bar */}
      <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-bold text-[var(--antd-text)] flex items-center gap-1.5">
            <Search className="w-4 h-4 text-[var(--antd-primary)] shrink-0" />
            <span>মোবাইল নম্বর দিয়ে রেকর্ড খুঁজুন</span>
          </h2>
          <p className="text-[11px] text-[var(--antd-text-secondary)]">
            চেম্বারে সিরিয়াল বুকিংয়ের সময় ব্যবহৃত ১১ ডিজিটের মোবাইল নম্বরটি লিখুন
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="tel"
              placeholder="যেমন: 01712345678"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="antd-input h-10 px-3 text-xs sm:text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="antd-btn antd-btn-primary h-10 px-4 font-bold text-xs sm:text-sm shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? "খোঁজা হচ্ছে..." : "রেকর্ড দেখুন"}</span>
          </button>
        </form>

        {/* Quick Demo Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-[var(--antd-text-tertiary)] shrink-0">ডেমো টেস্ট:</span>
          <button
            type="button"
            onClick={() => handleQuickDemoSearch("01712345678")}
            className="px-2 py-0.5 rounded-md bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] hover:text-[var(--antd-primary)] text-[11px] font-semibold text-[var(--antd-text-secondary)] transition-colors"
          >
            #১ জামিল (রুট ক্যানেল • ওভারডিউ)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoSearch("01823456789")}
            className="px-2 py-0.5 rounded-md bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] hover:text-[var(--antd-primary)] text-[11px] font-semibold text-[var(--antd-text-secondary)] transition-colors"
          >
            #২ শাহনাজ (স্কেলিং • ফলোআপ)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[var(--antd-warning-bg)] border border-[var(--antd-warning-border)] text-xs text-[var(--antd-warning)] text-center font-medium">
            {errorMsg}
          </div>
        )}

      </div>

      {/* 3. Pre-Search Value Proposition Teaser (Displayed when no record is loaded) */}
      {!patientData && (
        <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--antd-primary)]">
              স্মার্ট ডিজিটাল হেলথ পাস
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[var(--antd-text)]">
              রোগীর পোর্টালে আপনার জন্য যা যা সংরক্ষিত থাকে
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] space-y-1 text-left">
              <div className="w-7 h-7 rounded-lg bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] flex items-center justify-center font-bold text-xs mb-1">
                <Pill className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[var(--antd-text)]">ডিজিটাল ই-প্রেসক্রিপশন</h4>
              <p className="text-[11px] text-[var(--antd-text-secondary)] leading-relaxed">
                ডাক্তারের দেওয়া ঔষধের নাম, সঠিক ডোজ ও সেবনবিধি যেকোনো সময় অনলাইনে দেখুন।
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] space-y-1 text-left">
              <div className="w-7 h-7 rounded-lg bg-[var(--antd-warning-bg)] text-[var(--antd-warning)] flex items-center justify-center font-bold text-xs mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[var(--antd-text)]">৬ মাসের ফলো-আপ রিমাইন্ডার</h4>
              <p className="text-[11px] text-[var(--antd-text-secondary)] leading-relaxed">
                দাঁতের ফিলিং, ক্যাপ বা মাড়ির স্কেলিং পরবর্তী চেকআপ ওভারডিউ হলে নোটিফিকেশন।
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] space-y-1 text-left">
              <div className="w-7 h-7 rounded-lg bg-[var(--antd-success-bg)] text-[var(--antd-success)] flex items-center justify-center font-bold text-xs mb-1">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[var(--antd-text)]">টুথ চার্ট ও ডায়াগনোসিস</h4>
              <p className="text-[11px] text-[var(--antd-text-secondary)] leading-relaxed">
                কোন দাঁতে কী চিকিৎসা করা হয়েছে তার টুথ নম্বরসহ নিখুঁত ক্লিনিক্যাল ইতিহাস।
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => handleQuickDemoSearch("01712345678")}
              className="antd-btn antd-btn-default text-xs font-bold py-1.5 px-4 rounded-lg inline-flex items-center gap-1 text-[var(--antd-primary)] border-[var(--antd-primary)]/30 hover:border-[var(--antd-primary)]"
            >
              <span>একটি ডেমো প্রেসক্রিপশন ও রেকর্ড দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Loaded State: World-Class Digital Medical Passport Card */}
      {patientData && (
        <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 space-y-0">
          
          {/* Top Patient Profile Header */}
          <div className="bg-[var(--antd-primary-bg)] border-b border-[var(--antd-primary-border)] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-3">
                {/* Avatar with initial */}
                <div className="w-12 h-12 rounded-xl bg-[var(--antd-primary)] text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                  {patientData.patientName.slice(0, 2)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="antd-tag antd-tag-blue text-[10px] font-bold py-0 px-1.5">
                      আইডি: #{patientData.id}
                    </span>
                    <span className="antd-tag antd-tag-red text-[10px] font-bold py-0 px-1.5">
                      রক্তের গ্রুপ: {patientData.bloodGroup}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-[var(--antd-text)]">
                    {patientData.patientName}
                  </h2>
                </div>
              </div>

              {/* Recall Status Badge */}
              <div className="self-start sm:self-auto">
                {patientData.recallStatus === "OVERDUE" ? (
                  <div className="px-3 py-1.5 rounded-xl bg-[var(--antd-warning-bg)] border border-[var(--antd-warning-border)] text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--antd-warning)] shrink-0" />
                    <div>
                      <p className="font-bold text-[var(--antd-warning)] text-[11px] leading-tight">
                        ফলো-আপ ওভারডিউ!
                      </p>
                      <p className="text-[10px] text-[var(--antd-text-secondary)]">
                        নির্ধারিত ছিল: {patientData.nextRecallDate}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] text-xs">
                    <p className="text-[10px] font-semibold text-[var(--antd-primary)]">পরবর্তী চেকআপ:</p>
                    <p className="text-xs font-bold text-[var(--antd-text)]">{patientData.nextRecallDate}</p>
                  </div>
                )}
              </div>

            </div>

            {/* Quick Meta Row */}
            <div className="mt-3 pt-2.5 border-t border-[var(--antd-primary-border)]/60 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-1.5 rounded-lg bg-[var(--antd-bg-container)]/80">
                <span className="text-[10px] text-[var(--antd-text-tertiary)] block">বয়স</span>
                <span className="font-bold text-[var(--antd-text)] text-xs">{patientData.age} বছর</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--antd-bg-container)]/80">
                <span className="text-[10px] text-[var(--antd-text-tertiary)] block">মোবাইল</span>
                <span className="font-bold text-[var(--antd-text)] text-xs truncate block">{patientData.phone}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--antd-bg-container)]/80">
                <span className="text-[10px] text-[var(--antd-text-tertiary)] block">সর্বশেষ চিকিৎসা</span>
                <span className="font-bold text-[var(--antd-text)] text-xs">{patientData.lastVisitDate}</span>
              </div>
            </div>
          </div>

          {/* Medical Doctor Alert (if any) */}
          {patientData.medicalAlerts.length > 0 && (
            <div className="bg-[var(--antd-error-bg)] border-b border-[var(--antd-error-border)] px-4 py-2 flex items-center gap-2 text-xs text-[var(--antd-error)] font-bold">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>ডাক্তার সতর্কতা: {patientData.medicalAlerts.join(", ")}</span>
            </div>
          )}

          {/* Visits & Prescriptions Timeline */}
          <div className="p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--antd-border-split)]">
              <h3 className="text-xs sm:text-sm font-bold text-[var(--antd-text)] flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                পূর্ববর্তী চিকিৎসা ও প্রেসক্রিপশন লগ ({patientData.visits.length} টি ভিজিট)
              </h3>
              <span className="text-[10px] text-[var(--antd-text-tertiary)]">
                ভেরিফাইড ডাটা
              </span>
            </div>

            <div className="space-y-3">
              {patientData.visits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3.5 sm:p-4 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[var(--antd-border-split)]">
                    <div>
                      <span className="text-[10px] text-[var(--antd-primary)] font-bold block">
                        তারিখ: {visit.date}
                      </span>
                      <h4 className="text-sm font-bold text-[var(--antd-text)]">
                        {visit.treatmentName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {visit.toothNumbers.map((tooth, idx) => (
                        <span
                          key={idx}
                          className="antd-tag antd-tag-blue text-[10px] font-semibold py-0 px-1.5"
                        >
                          দাঁত নং: {tooth}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="font-bold text-[var(--antd-text)] block">ডায়াগনোসিস:</span>
                        <p className="text-[var(--antd-text-secondary)] leading-relaxed">
                          {visit.diagnosis}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-[var(--antd-text)] block">ডাক্তারের পরামর্শ:</span>
                        <p className="text-[var(--antd-text-secondary)] leading-relaxed">
                          {visit.doctorNotes}
                        </p>
                      </div>
                    </div>

                    {/* Prescription Pills Box */}
                    <div className="p-2.5 rounded-lg bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] space-y-1">
                      <span className="font-bold text-[var(--antd-text)] flex items-center gap-1 text-[11px]">
                        <Pill className="w-3 h-3 text-[var(--antd-primary)]" /> প্রেসক্রিপশনকৃত ঔষধ ও নিয়মাবলী:
                      </span>
                      <ul className="space-y-1 text-[11px] text-[var(--antd-text-secondary)] pl-1">
                        {visit.prescription.map((rx, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[var(--antd-primary)] font-bold text-xs">•</span>
                            <span>{rx}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overdue Action Banner (If recall is overdue) */}
            {patientData.recallStatus === "OVERDUE" && (
              <div className="p-3 rounded-xl bg-[var(--antd-warning-bg)]/60 border border-[var(--antd-warning-border)] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <Info className="w-4 h-4 text-[var(--antd-warning)] shrink-0" />
                  <span className="text-[11px] text-[var(--antd-text)]">
                    আপনার দাঁতের ফলো-আপ বাকি আছে। জটিলতা এড়াতে এখনই চেকআপের সিরিয়াল নিন।
                  </span>
                </div>
                <Link
                  href="/book"
                  className="antd-btn antd-btn-primary h-8 px-3 text-xs font-bold shrink-0 shadow-xs flex items-center gap-1"
                >
                  <span>ফলো-আপ সিরিয়াল নিন</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-[var(--antd-border-split)] grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => window.print()}
                className="antd-btn antd-btn-default h-9 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                <span>স্লিপ প্রিন্ট</span>
              </button>

              <Link
                href="/live-queue"
                className="antd-btn antd-btn-default h-9 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Activity className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                <span>লাইভ কিউ</span>
              </Link>

              <Link
                href="/book"
                className="col-span-2 sm:col-span-1 antd-btn antd-btn-primary h-9 text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
              >
                <span>নতুন সিরিয়াল বুকিং</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
