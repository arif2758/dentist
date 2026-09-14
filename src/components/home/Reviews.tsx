import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import styles from "@/styles/styles.module.css";

const REVIEWS = [
  {
    name: "মো: আব্দুল মোমিন",
    role: "ব্যাংক কর্মকর্তা, ঢাকা",
    review: "লাইভ সিরিয়াল সিস্টেমটি অসাধারণ! আগে ডাক্তার দেখাতে গিয়ে ২-৩ ঘণ্টা বসে থাকা লাগতো। এখানে বাসা থেকে দেখে ঠিক ৩ জন বাকি থাকতে এসেছি, মাত্র ২০ মিনিটে সেবা পেয়ে গেছি।",
    service: "রুট ক্যানেল থেরাপি",
    rating: 5,
  },
  {
    name: "তাসলিমা আক্তার",
    role: "শিক্ষিকা, ধানমন্ডি",
    review: "৮ মাস পর আবার এসেছিলাম স্কেলিং করাতে। পুরোনো কোনো স্লিপ সাথে ছিল না, কিন্তু ডাক্তার ফোন নম্বর দিতেই আমার পুরো রেকর্ড ও পূর্বের সমস্যা দেখে ওষুধ দিলেন। দারুণ আধুনিক সিস্টেম।",
    service: "স্কেলিং ও পলিশিং",
    rating: 5,
  },
  {
    name: "সাব্বির রায়হান",
    role: "সফটওয়্যার ইঞ্জিনিয়ার",
    review: "ব্যথামুক্ত ডেন্টিস্ট্রির প্রতিশ্রুতি পেয়ে এসেছিলাম। সত্যিই কোনো ব্যথা পাইনি। আর ডিজিটাল টোকেনের সুবিধা দারুণ।",
    service: "লেজার ফিলিং ও ক্যাপ",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section className="py-8 sm:py-12 bg-[var(--antd-bg-layout)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 antd-tag antd-tag-blue py-1 px-3 text-xs font-semibold">
            <Quote className="w-3.5 h-3.5" />
            <span>সন্তুষ্ট রোগীদের অভিজ্ঞতা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--antd-text)]">
            আমাদের সেবায় রোগীরা যা বলেন
          </h2>
          <p className="text-sm sm:text-base text-[var(--antd-text-secondary)]">
            সুস্থ হাসি ফিরিয়ে দেওয়ার যাত্রায় আমাদের রোগীদের আন্তরিক মতামত ও ভালোবাসা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="antd-card antd-card-bordered p-6 flex flex-col justify-between hover:border-[var(--antd-primary-border)] transition-all shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex text-[var(--antd-warning)]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)] leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--antd-border-split)] flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--antd-text)]">{rev.name}</h4>
                  <p className="text-[11px] text-[var(--antd-text-tertiary)]">{rev.role}</p>
                </div>
                <span className="antd-tag antd-tag-blue py-0.5 px-2 text-[10px] font-semibold">
                  {rev.service}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
