import React from "react";
import { 
  CheckCheck, 
  Flame, 
  Microscope, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from "lucide-react";
import styles from "@/styles/styles.module.css";

const STANDARDS = [
  {
    icon: Flame,
    title: "ইউরোপীয়ান ক্লাস-বি অটোক্লেভ স্টেরিলাইজেশন",
    desc: "প্রতিটি যন্ত্র সর্বোচ্চ ১৩৪° সেলসিয়াস তাপমাত্রায় ভ্যাকুয়াম অটোক্লেভ দ্বারা ১০০% জীবাণুমুক্ত করা হয়। কোনো ক্রস-ইনফেকশনের ঝুঁকি নেই।",
  },
  {
    icon: Microscope,
    title: "ডিজিটাল আরভিজি (RVG) লো-রেডিয়েশন এক্স-রে",
    desc: "উচ্চ রেজুলিউশনের ডিজিটাল সেন্সর যা স্বাভাবিকের চেয়ে ৮০% কম রেডিয়েশনে সেকেন্ডের মধ্যে দাঁতের অভ্যন্তরীণ অবস্থা স্পষ্ট দেখায়।",
  },
  {
    icon: Zap,
    title: "কম্পিউটার নিয়ন্ত্রিত ব্যথামুক্ত লোকাল অ্যানেস্থেসিয়া",
    desc: "ব্যথাহীন অ্যানেস্থেসিয়া ডেলিভারি সিস্টেম, যা সুইয়ের কোনো অস্বস্তি ছাড়াই দাঁত ও মাড়িকে নির্দিষ্ট সময়ের জন্য সম্পূর্ণ অবশ করে তোলে।",
  },
  {
    icon: ShieldCheck,
    title: "বায়ো-কম্প্যাটিবল জিরকোনিয়া ও ই-ম্যাক্স ম্যাটেরিয়াল",
    desc: "আমরা শুধুমাত্র FDA ও CE সার্টিফাইড জার্মানি ও সুইজারল্যান্ডের বায়ো-কম্প্যাটিবল ডেন্টাল সিরামিক ও টাইটানিয়াম ইমপ্ল্যান্ট ব্যবহার করি।",
  },
];

export function ClinicStandards() {
  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-6 sm:p-10 shadow-xs">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 antd-tag antd-tag-blue py-1 px-3 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>নিরাপত্তা ও হাইজিন স্ট্যান্ডার্ড</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[var(--antd-text)]">
              কেন আমাদের ক্লিনিক সর্বাধিক নিরাপদ?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)]">
              আপনার ও আপনার পরিবারের সুস্থতার জন্য আমরা আন্তর্জাতিক হাসপাতাল গ্রেডের হাইজিন ও আধুনিক প্রযুক্তি কঠোরভাবে বজায় রাখি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STANDARDS.map((std, idx) => {
              const Icon = std.icon;
              return (
                <div
                  key={idx}
                  className="antd-card antd-card-bordered p-5 space-y-3 hover:border-[var(--antd-primary-border)] transition-all shadow-xs bg-[var(--antd-bg-layout)]/50"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] flex items-center justify-center text-[var(--antd-primary)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--antd-text)] leading-snug">
                    {std.title}
                  </h3>
                  <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
