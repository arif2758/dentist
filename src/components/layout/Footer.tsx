import React from "react";
import Link from "next/link";
import {
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--antd-bg-container)] text-[var(--antd-text)] pt-10 pb-8 border-t border-[var(--antd-border-split)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[var(--antd-border-split)]">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[var(--antd-radius)] bg-[var(--antd-primary)] flex items-center justify-center text-white font-black shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[var(--antd-text)]">
                ডেন্টাল
              </span>
            </div>
            <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
              ৩০ বছরের অবিচল অভিজ্ঞতা ও আধুনিক ইউরোপিয়ান ডেন্টাল টেকনোলজির
              সমন্বয়ে আপনার সুস্থ ও সুন্দর হাসির নির্ভরযোগ্য ঠিকানা।
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--antd-primary)] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>১০০% অটোক্লেভ জীবাণুমুক্ত ও ব্যথামুক্ত চিকিৎসা</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--antd-text)]">
              জরুরি সেবাসমূহ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--antd-text-secondary)]">
              <li>
                <Link
                  href="/live-queue"
                  className="hover:text-[var(--antd-primary)] transition-colors flex items-center gap-2"
                >
                  <span>•</span> লাইভ সিরিয়াল ও অপেক্ষার সময়
                </Link>
              </li>
              <li>
                <Link
                  href="/doctor"
                  className="hover:text-[var(--antd-primary)] transition-colors flex items-center gap-2"
                >
                  <span>•</span> ডক্টর পরিচিতি ও চেম্বার শিডিউল
                </Link>
              </li>
              <li>
                <Link
                  href="/after-care"
                  className="hover:text-[var(--antd-primary)] transition-colors flex items-center gap-2"
                >
                  <span>•</span> চিকিৎসা পরবর্তী যত্ন (Aftercare)
                </Link>
              </li>
              <li>
                <Link
                  href="/emergency"
                  className="hover:text-[var(--antd-primary)] transition-colors flex items-center gap-2"
                >
                  <span>•</span> জরুরি ফার্স্ট এইড ও সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[var(--antd-primary)] transition-colors flex items-center gap-2"
                >
                  <span>•</span> ডেন্টাল চিকিৎসাসমূহ ও পদ্ধতি
                </Link>
              </li>
              <li>
                <Link
                  href="/patient-history"
                  className="hover:text-[var(--antd-primary)] transition-colors flex items-center gap-2"
                >
                  <span>•</span> পুরোনো রোগীর হিস্ট্রি ও প্রেসক্রিপশন
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Chamber Schedule */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--antd-text)]">
              চেম্বার সময়সূচি
            </h4>
            <div className="space-y-2 text-sm text-[var(--antd-text-secondary)]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[var(--antd-primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[var(--antd-text)]">
                    শনিবার থেকে বৃহস্পতিবার
                  </p>
                  <p className="text-xs text-[var(--antd-text-secondary)]">
                    বিকাল ৫:০০ টা – রাত ৯:৩০ টা
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-2">
                <HeartHandshake className="w-4 h-4 text-[var(--antd-warning)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[var(--antd-text)]">
                    শুক্রবার
                  </p>
                  <p className="text-xs text-[var(--antd-text-secondary)]">
                    সকাল ১০:০০ টা – দুপুর ১২:৩০ টা (পূর্বে অ্যাপয়েন্টমেন্ট
                    সাপেক্ষে)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Chamber Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--antd-text)]">
              যোগাযোগ ও চেম্বার
            </h4>
            <div className="space-y-3 text-sm text-[var(--antd-text-secondary)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--antd-primary)] mt-0.5 shrink-0" />
                <span className="text-xs text-[var(--antd-text-secondary)]">
                  বাড়ি #১২, রোড #০৪, ধানমন্ডি (ল্যাবএইড সংলগ্ন), ঢাকা - ১২০৫
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--antd-primary)] shrink-0" />
                <span className="text-xs text-[var(--antd-text-secondary)]">
                  +৮৮০ ১৭০০-০০০০০১, ০১৮০০-০০০০০২
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--antd-primary)] shrink-0" />
                <span className="text-xs text-[var(--antd-text-secondary)]">
                  chamber@drarifdental.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--antd-text-tertiary)] gap-3">
          <p>
            © {new Date().getFullYear()} ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড
            ইমপ্ল্যান্ট সেন্টার। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/display"
              target="_blank"
              className="hover:text-[var(--antd-primary)] transition-colors"
            >
              টিভি ডিসপ্লে স্ক্রিন
            </Link>
            <Link
              href="/admin"
              className="hover:text-[var(--antd-primary)] transition-colors"
            >
              অ্যাডমিন পোর্টাল
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
