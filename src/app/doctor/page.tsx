"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  GraduationCap,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { Tag, Button, Card, Row, Col, Typography, Space } from "antd";
import { DoctorProfile } from "@/types";

const { Title, Paragraph, Text } = Typography;

export default function DoctorProfilePage() {
  const { data } = useQuery<{ success: boolean; data: DoctorProfile }>({
    queryKey: ["doctorProfile"],
    queryFn: async () => {
      const res = await fetch("/api/doctor");
      return res.json();
    },
  });

  const doctor = data?.data;
  const scheduleDays = doctor?.schedule || [
    {
      day: "শনিবার",
      time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা",
      status: "নিয়মিত চেম্বার",
    },
    {
      day: "রবিবার",
      time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা",
      status: "নিয়মিত চেম্বার",
    },
    {
      day: "সোমবার",
      time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা",
      status: "নিয়মিত চেম্বার",
    },
    {
      day: "মঙ্গলবার",
      time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা",
      status: "নিয়মিত চেম্বার",
    },
    {
      day: "বুধবার",
      time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা",
      status: "নিয়মিত চেম্বার",
    },
    {
      day: "বৃহস্পতিবার",
      time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা",
      status: "নিয়মিত চেম্বার",
    },
    {
      day: "শুক্রবার",
      time: "সকাল ১০:০০ টা – দুপুর ১:০০ টা",
      status: "শুধু প্রি-বুকিং ও ইমার্জেন্সি",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--antd-bg-layout)]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* 1. Doctor Hero Profile Card */}
          <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Avatar & Quick Badges */}
              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[var(--antd-primary)] to-cyan-500 p-1.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-[var(--antd-bg-container)] flex items-center justify-center overflow-hidden border-2 border-white/20">
                      <Stethoscope className="w-20 h-20 text-[var(--antd-primary)]" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                    <BadgeCheck className="w-5 h-5" />
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[var(--antd-text)]">
                    {doctor?.name || "ডা. মো. আসিফুল হক"}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--antd-primary)] mt-1">
                    {doctor?.title || "সিনিয়র ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জন ও ডেন্টিস্ট"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>BMDC Reg. No: {doctor?.bmdcRegNo || "A-54920"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <Tag
                    color="cyan"
                    className="px-2.5 py-0.5 font-semibold text-xs"
                  >
                    {doctor?.experienceYears || 30}+ বছর অভিজ্ঞতা
                  </Tag>
                  <Tag
                    color="blue"
                    className="px-2.5 py-0.5 font-semibold text-xs"
                  >
                    ২৫,০০০+ সফল রোগী
                  </Tag>
                  <Tag
                    color="purple"
                    className="px-2.5 py-0.5 font-semibold text-xs"
                  >
                    আন্তর্জাতিক সার্টিফাইড
                  </Tag>
                </div>
              </div>

              {/* Right Column: Bio & Credentials */}
              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--antd-primary)]">
                    চিকিৎসক পরিচিতি
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--antd-text)]">
                    আধুনিক ও ব্যথামুক্ত ডেন্টাল চিকিৎসার অঙ্গীকার
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--antd-text-secondary)] leading-relaxed">
                    {doctor?.bio ||
                      "ডা. মো. আসিফুল হক বিগত ৩০ বছর ধরে সততা, দক্ষতা ও আধুনিক প্রযুক্তির সমন্বয়ে হাজার হাজার রোগীর সফল দন্তচিকিৎসা সেবা প্রদান করে আসছেন। আন্তর্জাতিক মানের ইউরোপিয়ান ক্লাস-বি অটোক্লেভ ও শতভাগ ব্যথামুক্ত অ্যানাস্থেসিয়া নিশ্চিত করাই ওনার চেম্বারের মূল লক্ষ্য।"}
                  </p>
                </div>

                {/* Qualification Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] space-y-1">
                    <div className="flex items-center gap-2 text-[var(--antd-primary)] font-bold text-xs">
                      <GraduationCap className="w-4 h-4" />
                      <span>শিক্ষাগত যোগ্যতা ও ডিগ্রি</span>
                    </div>
                    <ul className="text-xs text-[var(--antd-text-secondary)] space-y-1 list-disc list-inside">
                      {(doctor?.degrees || [
                        "BDS (ঢাকা বিশ্ববিদ্যালয়, ডেন্টাল কলেজ)",
                        "FCPS (ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জারি)",
                        "FICD (ইউএসএ) - ফেলো, ইন্টারন্যাশনাল কলেজ অফ ডেন্টিস্টস",
                        "অ্যাডভান্সড ইমপ্ল্যান্টোলজি ট্রেনিং (জার্মানি ও থাইল্যান্ড)",
                      ]).map((deg, degIdx) => (
                        <li key={degIdx}>{deg}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <Award className="w-4 h-4" />
                      <span>ক্লিনিক্যাল বিশেষত্ব (Specialties)</span>
                    </div>
                    <ul className="text-xs text-[var(--antd-text-secondary)] space-y-1 list-disc list-inside">
                      {(doctor?.specialties || [
                        "ব্যথামুক্ত রোটারি রুট ক্যানেল (Rotary RCT)",
                        "টাইটানিয়াম ডেন্টাল ইমপ্ল্যান্ট সার্জারি",
                        "কম্পোজিট কসমেটিক লেজার ফিলিং",
                        "ইমপ্যাক্টেড আক্কেল দাঁতের ওটি (Wisdom Tooth Surgery)",
                        "মাড়ির রোগ ও পিরিওডন্টাল চিকিৎসা",
                      ]).map((spc, spcIdx) => (
                        <li key={spcIdx}>{spc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href="/book"
                    className="antd-btn antd-btn-primary px-5 py-2 rounded-lg font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>অনলাইন সিরিয়াল বুক করুন</span>
                  </Link>

                  <a
                    href="https://wa.me/8801700000000?text=আসসালামু%20আলাইকুম,%20আমি%20ডক্টরের%20পরামর্শ%20নিতে%20চাই।"
                    target="_blank"
                    rel="noreferrer"
                    className="antd-btn antd-btn-default px-4 py-2 rounded-lg font-bold text-xs sm:text-sm inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp-এ সরাসরি কথা বলুন</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Chamber Schedule & Visit Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chamber Timing Table */}
            <div className="lg:col-span-7 bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--antd-border-split)]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--antd-text)] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--antd-primary)]" />
                    <span>সাপ্তাহিক চেম্বার সময়সূচি</span>
                  </h3>
                  <p className="text-xs text-[var(--antd-text-secondary)]">
                    রোগীদের সুবিধার জন্য ডিজিটাল সিরিয়াল পদ্ধতিতে সিরিয়াল
                    অনুযায়ী রোগী দেখা হয়।
                  </p>
                </div>
                <Tag color="success" className="font-bold text-xs">
                  আজ চেম্বার খোলা
                </Tag>
              </div>

              <div className="space-y-2">
                {scheduleDays.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--antd-bg-layout)] hover:bg-[var(--antd-bg-layout)]/80 transition-colors text-xs"
                  >
                    <span className="font-bold text-[var(--antd-text)] w-24">
                      {item.day}
                    </span>
                    <span className="text-[var(--antd-text-secondary)] font-medium">
                      {item.time}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--antd-primary)] hidden sm:inline">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/15 text-xs text-[var(--antd-text-secondary)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[var(--antd-primary)] shrink-0 mt-0.5" />
                <span>
                  <strong>পরামর্শ:</strong> ভিড় এড়াতে আসার পূর্বে অনলাইনে
                  সিরিয়াল সংগ্রহ করার অনুরোধ করা যাচ্ছে। লাইভ সিরিয়াল পেজে আপনার
                  টোকেন অগ্রগতি দেখতে পারবেন।
                </span>
              </div>
            </div>

            {/* Chamber Location & Directions */}
            <div className="lg:col-span-5 bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-[var(--antd-text)] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span>চেম্বারের অবস্থান ও যোগাযোগ</span>
                </h3>

                <div className="space-y-2 text-xs text-[var(--antd-text-secondary)]">
                  <p className="font-bold text-sm text-[var(--antd-text)]">
                    ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার
                  </p>
                  <p>
                    🏢 রুম #৪০২ (৪র্থ তলা), সিটি সেন্টার প্লাজা,
                    <br />
                    রোড #৭/এ, ধানমন্ডি, ঢাকা - ১২০৯।
                  </p>
                  <p className="flex items-center gap-2 pt-1 font-semibold text-[var(--antd-text)]">
                    <Phone className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                    <span>সিরিয়াল ও জরুরি হেল্পলাইন: +880 1700-000000</span>
                  </p>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> ১০০% সার্বক্ষণিক এসি ও
                    আধুনিক লিফট সুবিধা
                  </p>
                  <p className="text-[11px] opacity-90">
                    ভবনের নিচে রোগীদের জন্য পর্যাপ্ত পার্কিং এর সুব্যবস্থা
                    রয়েছে।
                  </p>
                </div>
              </div>

              <Link
                href="/live-queue"
                className="w-full text-center py-2.5 rounded-xl bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] border border-[var(--antd-primary-border)] font-bold text-xs hover:bg-[var(--antd-primary)] hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <span>আজকের লাইভ কিউ মনিটর দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
