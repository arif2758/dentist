"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Lightbulb, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope 
} from "lucide-react";
import styles from "@/styles/styles.module.css";

interface SymptomOption {
  id: string;
  icon: string;
  symptomTitle: string;
  symptomDesc: string;
  likelyIssue: string;
  doctorRecommendation: string;
  treatmentName: string;
  urgency: "তাত্ক্ষণিক প্রয়োজন" | "পরিমিত সময়" | "নিয়মিত সেবা";
  urgencyColor: string;
}

const SYMPTOMS: SymptomOption[] = [
  {
    id: "night_pain",
    icon: "⚡",
    symptomTitle: "রাতে শোয়ার পর তীব্র টনটনে ব্যথা ও ঘুমানো যায় না",
    symptomDesc: "দাঁতে হঠাৎ স্পন্দনশীল ব্যথা, যা মাথার দিকে ছড়িয়ে পড়ে এবং রাতে শোয়ার পর বেড়ে যায়।",
    likelyIssue: "পাল্প নেক্রোসিস বা তীব্র মজ্জার প্রদাহ (Acute Irreversible Pulpitis)",
    doctorRecommendation: "দাঁতের মজ্জা (Pulp) ইনফেকশনে আক্রান্ত হয়েছে। দাঁতটি না ফেলে রুট ক্যানেল থেরাপি (RCT) করে সহজেই প্রাকৃতিক দাঁতটি রক্ষা করা সম্ভব।",
    treatmentName: "রুট ক্যানেল থেরাপি (RCT)",
    urgency: "তাত্ক্ষণিক প্রয়োজন",
    urgencyColor: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200",
  },
  {
    id: "sensitivity",
    icon: "❄️",
    symptomTitle: "ঠাণ্ডা পানি বা মিষ্টি খেলে প্রচণ্ড শিরশিরানি লাগে",
    symptomDesc: "আইসক্রিম, ঠাণ্ডা পানি বা টক খেলে দাঁতে হালকা থেকে তীব্র কারেন্টের মতো ঝাঁকুনি দেয়।",
    likelyIssue: "দাঁতের এনামেল ক্ষয় বা প্রাথমিক ডেন্টাল ক্যারিজ (Cavity)",
    doctorRecommendation: "ক্ষয়ের প্রাথমিক পর্যায়ে আধুনিক কম্পোজিট লেজার ফিলিং দিয়ে দাঁতের স্নায়ু সুরক্ষিত রাখা যায়।",
    treatmentName: "কম্পোজিট লেজার ফিলিং",
    urgency: "পরিমিত সময়",
    urgencyColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-sky-300 border-blue-200",
  },
  {
    id: "bleeding_gums",
    icon: "🩸",
    symptomTitle: "ব্রাশ করার সময় মাড়ি দিয়ে রক্ত পড়ে ও মুখে দুর্গন্ধ",
    symptomDesc: "মাড়ি লালচে ও ফোলাভাব, সকালে ব্রাশের পেস্টে রক্তের দাগ এবং মুখে অস্বস্তিকর গন্ধ।",
    likelyIssue: "টারটার/ক্যালকুলাস জমে মাড়ির প্রদাহ (Gingivitis)",
    doctorRecommendation: "আল্ট্রাসনিক স্কেলিং ও পলিশিংয়ের মাধ্যমে দাঁতের গোড়ার পাথর অপসারণ করলে মাড়ি সুস্থ ও রক্ত পড়া সম্পূর্ণ বন্ধ হবে।",
    treatmentName: "আল্ট্রাসনিক স্কেলিং ও পলিশিং",
    urgency: "নিয়মিত সেবা",
    urgencyColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
  },
  {
    id: "chipped_tooth",
    icon: "✨",
    symptomTitle: "সামনের দাঁতের কোণা ভেঙে গেছে বা দাঁতের মাঝে ফাঁকা",
    symptomDesc: "হাসলে বা কথা বললে সামনের দাঁতের ত্রুটি চোখে পড়ে, আত্মবিশ্বাসে টান পড়ে।",
    likelyIssue: "ইনসিসাল ফ্র্যাকচার বা মিডলাইন ডায়াস্টেমা (Cosmetic Defect)",
    doctorRecommendation: "১টি সেশনেই ন্যানো-কম্পোজিট ভিনিয়ারিং বা স্মাইল ডিজাইনের মাধ্যমে অবিকল প্রাকৃতিক দাঁতের রূপ দেওয়া যায়।",
    treatmentName: "স্মাইল মেকওভার ও ভিনিয়ার্স",
    urgency: "নিয়মিত সেবা",
    urgencyColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200",
  },
  {
    id: "missing_tooth",
    icon: "🦷",
    symptomTitle: "দাঁত পড়ে গেছে / খাবার চিবিয়ে খেতে সমস্যা হয়",
    symptomDesc: "একটি বা একাধিক দাঁত তোলার পর খালি জায়গায় পাশের দাঁত হেলে পড়ছে ও খাবার চিবানো যায় না।",
    likelyIssue: "পার্শিয়াল এডেনচুলিজম (Missing Tooth Loss)",
    doctorRecommendation: "স্থায়ী ও আজীবন টেকসই ডেন্টাল ইমপ্ল্যান্ট অথবা ফিক্সড ব্রিজ করে পাশের দাঁত না কেটেই নতুন দাঁত প্রতিস্থাপন।",
    treatmentName: "ডেন্টাল ইমপ্ল্যান্ট পরামর্শ",
    urgency: "পরিমিত সময়",
    urgencyColor: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200",
  },
];

export function SymptomChecker() {
  const [selectedId, setSelectedId] = useState<string>("night_pain");
  const activeSymptom = SYMPTOMS.find((s) => s.id === selectedId) || SYMPTOMS[0];

  return (
    <section id="symptom-checker" className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-5 sm:p-8 shadow-xs">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0.5 px-2.5 text-xs font-semibold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>ইন্টারেক্টিভ প্রাথমিক উপসর্গ বিশ্লেষক</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--antd-text)]">
              আপনার দাঁতে কী সমস্যা হচ্ছে?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)]">
              নিচের লক্ষণগুলোর মধ্য থেকে আপনার সমস্যাটি নির্বাচন করুন। ডক্টরস ক্লিনিক্যাল পরামর্শ অনুযায়ী সম্ভাব্য চিকিৎসা জেনে নিন।
            </p>
          </div>

        {/* Diagnostic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Symptoms Select List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {SYMPTOMS.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`antd-card antd-card-bordered p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--antd-primary)] shadow-md ring-1 ring-[var(--antd-primary)]/40 bg-[var(--antd-primary-bg)]"
                      : "hover:border-[var(--antd-primary-border)] hover:bg-[var(--antd-bg-container)]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl p-2 rounded-xl bg-[var(--antd-bg-layout)] shrink-0 border border-[var(--antd-border-split)]">
                      {item.icon}
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm sm:text-base font-bold ${isSelected ? "text-[var(--antd-primary)]" : "text-[var(--antd-text)]"}`}>
                          {item.symptomTitle}
                        </h4>
                        <span className={`antd-tag py-0.5 px-2 text-[10px] font-bold ${
                          item.urgency === "তাত্ক্ষণিক প্রয়োজন" ? "antd-tag-red" : item.urgency === "পরিমিত সময়" ? "antd-tag-blue" : "antd-tag-gold"
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                        {item.symptomDesc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Doctor Diagnostic Recommendation Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="antd-card antd-card-bordered p-6 sm:p-8 shadow-lg space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[var(--antd-border-split)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-primary)] flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" /> বিশেষজ্ঞ চিকিৎসকের পর্যবেক্ষণ
                </span>
                <span className="text-2xl">{activeSymptom.icon}</span>
              </div>

              {/* Likely Diagnosis */}
              <div className="space-y-1">
                <span className="text-xs text-[var(--antd-text-tertiary)] font-semibold block">সম্ভাব্য ক্লিনিক্যাল সমস্যা:</span>
                <p className="text-base font-extrabold text-[var(--antd-text)]">
                  {activeSymptom.likelyIssue}
                </p>
              </div>

              {/* Doctor Recommendation */}
              <div className="p-4 rounded-xl bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] space-y-2 text-xs leading-relaxed text-[var(--antd-text)]">
                <p className="font-bold text-[var(--antd-primary)] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> প্রস্তাবিত সমাধান:
                </p>
                <p className="text-[var(--antd-text-secondary)]">{activeSymptom.doctorRecommendation}</p>
              </div>

              {/* Recommended Procedure */}
              <div className="space-y-1 text-xs">
                <span className="text-[var(--antd-text-secondary)]">উপযুক্ত চিকিৎসা সেবা:</span>
                <div className="p-3 rounded-lg bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] font-bold text-[var(--antd-text)] flex items-center justify-between">
                  <span>{activeSymptom.treatmentName}</span>
                  <span className="text-[11px] text-[var(--antd-primary)] font-semibold">ব্যথামুক্ত পদ্ধতি</span>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <Link
                href="/book"
                className="w-full antd-btn antd-btn-primary antd-btn-lg flex items-center justify-center gap-2 font-bold text-sm shadow-md active:scale-95"
              >
                <span>এই চিকিৎসার জন্য সিরিয়াল বুক করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>

        </div>

        </div>
      </div>
    </section>
  );
}
