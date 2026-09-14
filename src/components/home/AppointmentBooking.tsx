"use client";

import React, { useState, useMemo } from "react";
import Form from "next/form";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  Phone,
  Printer,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Stethoscope,
  FileText,
} from "lucide-react";
import { createAppointmentAction } from "@/actions/appointmentActions";
import { toast } from "sonner";
import { Appointment } from "@/lib/types";

const TIME_SLOTS = [
  { value: "05:00 PM - 05:30 PM", timeLabel: "৫:০০ PM", rangeLabel: "৫:০০ - ৫:৩০" },
  { value: "05:30 PM - 06:00 PM", timeLabel: "৫:৩০ PM", rangeLabel: "৫:৩০ - ৬:০০" },
  { value: "06:00 PM - 06:30 PM", timeLabel: "৬:০০ PM", rangeLabel: "৬:০০ - ৬:৩০" },
  { value: "06:30 PM - 07:00 PM", timeLabel: "৬:৩০ PM", rangeLabel: "৬:৩০ - ৭:০০" },
  { value: "07:00 PM - 07:30 PM", timeLabel: "৭:০০ PM", rangeLabel: "৭:০০ - ৭:৩০" },
  { value: "07:30 PM - 08:00 PM", timeLabel: "৭:৩০ PM", rangeLabel: "৭:৩০ - ৮:০০" },
  { value: "08:00 PM - 08:30 PM", timeLabel: "৮:০০ PM", rangeLabel: "৮:০০ - ৮:৩০" },
  { value: "08:30 PM - 09:00 PM", timeLabel: "৮:৩০ PM", rangeLabel: "৮:৩০ - ৯:০০" },
  { value: "09:00 PM - 09:30 PM", timeLabel: "৯:০০ PM", rangeLabel: "৯:০০ - ৯:৩০" },
];

const SERVICE_OPTIONS = [
  "রুট ক্যানেল থেরাপি (RCT)",
  "আল্ট্রাসনিক স্কেলিং ও পলিশিং",
  "কম্পোজিট লেজার ফিলিং",
  "দাঁত তোলা (Painless Extraction)",
  "ডেন্টাল ইমপ্ল্যান্ট কনসাল্টেশন",
  "অর্থোডন্টিক ব্রেসেস পরামর্শ",
  "টিথ হোয়াইটেনিং ও স্মাইল মেকওভার",
  "শিশুদের ডেন্টাল ট্রিটমেন্ট",
  "সাধারণ দাঁত ও মাড়ি চেকআপ",
];

const QUICK_COMPLAINTS = [
  "দাঁতে তীব্র ব্যথা",
  "মাড়ি ফোলা ও রক্ত পড়া",
  "দাঁতের পাথর পরিষ্কার",
  "ভাঙা দাঁতে ফিলিং",
  "রুটিন মাউথ চেকআপ",
];

export function AppointmentBooking() {
  const quickDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const monthsBn = [
      "জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে",
    ];
    const toBanglaNum = (n: number) =>
      n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]);

    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const title = i === 0 ? "আজ" : i === 1 ? "আগামীকাল" : "পরশু";
      const dayNum = toBanglaNum(d.getDate());
      const month = monthsBn[d.getMonth()];
      dates.push({
        iso,
        title,
        sub: `${dayNum} ${month}`,
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(quickDates[0].iso);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1].value);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [notes, setNotes] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClientSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.set("appointmentDate", selectedDate);
    formData.set("timeSlot", selectedSlot);
    formData.set("gender", gender);
    formData.set("notes", notes);

    // Instant 0ms visual feedback so the patient never feels delayed or confused
    const toastId = toast.loading("সিরিয়াল বুকিং প্রসেস করা হচ্ছে...", {
      description: "দয়া করে এক মুহূর্ত অপেক্ষা করুন...",
    });

    try {
      const result = await createAppointmentAction(null, formData);
      if (result.success && result.data) {
        setConfirmedAppointment(result.data);
        toast.success(result.message, {
          id: toastId,
          description: `টোকেন #${result.data.tokenNumber} সফলভাবে নিশ্চিত হয়েছে।`,
        });
      } else {
        toast.error(result.error || "সিরিয়াল বুকিং করা সম্ভব হয়নি।", {
          id: toastId,
        });
      }
    } catch {
      toast.error("সার্ভার সমস্যা। অনুগ্রহ করে পুনরায় চেষ্টা করুন।", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const appendComplaint = (complaint: string) => {
    if (notes.includes(complaint)) return;
    setNotes((prev) => (prev ? `${prev}, ${complaint}` : complaint));
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-4 sm:space-y-6">
      {/* 1. Clean Responsive Breadcrumb & Header */}
      {/* Mobile Subheader (< sm) */}
      <div className="flex sm:hidden items-center justify-between py-1 pb-2 border-b border-[var(--antd-border-split)]">
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
              ডেন্টাল সিরিয়াল বুকিং
            </h1>
            <p className="text-[10px] text-[var(--antd-text-tertiary)] truncate">
              সহজ ২টি ধাপে ইনস্ট্যান্ট টোকেন
            </p>
          </div>
        </div>

        <Link
          href="/live-queue"
          className="antd-btn antd-btn-default h-7 px-2.5 text-[11px] font-semibold flex items-center gap-1 shadow-xs"
        >
          <Clock className="w-3 h-3 text-[var(--antd-primary)]" />
          <span>লাইভ কিউ</span>
        </Link>
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
            <span className="text-[var(--antd-text)] font-medium">সিরিয়াল বুকিং</span>
          </div>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[var(--antd-text)]">
              অনলাইন সিরিয়াল বুকিং ও ডিজিটাল টোকেন
            </h1>
            <div className="inline-flex items-center gap-1.5 antd-tag antd-tag-blue py-0.5 px-2 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
              <span>১০০% ফ্রি অনলাইন সিরিয়াল</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/live-queue"
            className="antd-btn antd-btn-default h-8 px-3 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
            <span>লাইভ কিউ মনিটর</span>
          </Link>
          <a
            href="tel:+8801700000000"
            className="antd-btn antd-btn-default h-8 px-2.5 text-xs font-medium flex items-center gap-1 text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>হেল্পলাইন</span>
          </a>
        </div>
      </div>

      {/* 2. Confirmed State: Digital Medical Boarding Pass Slip */}
      {confirmedAppointment ? (
        <div className="max-w-2xl mx-auto py-2 sm:py-6 animate-in zoom-in-95 duration-200">
          <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl shadow-lg overflow-hidden">
            {/* Header Strip of Slip */}
            <div className="bg-[var(--antd-primary-bg)] border-b border-[var(--antd-primary-border)] p-4 sm:p-6 text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[var(--antd-primary)] text-white mx-auto flex items-center justify-center shadow-xs mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--antd-primary)] block">
                অফিসিয়াল সিরিয়াল কনফার্মেশন স্লিপ
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--antd-text)]">
                আপনার সিরিয়াল সফলভাবে নিশ্চিত হয়েছে!
              </h2>
              <p className="text-xs text-[var(--antd-text-secondary)]">
                এই ডিজিটাল টোকেন স্লিপটি সংরক্ষণ করুন অথবা স্ক্রিনশট নিয়ে রাখুন।
              </p>
            </div>

            {/* Token Highlight Ticket Section */}
            <div className="p-5 sm:p-8 space-y-5">
              <div className="bg-[var(--antd-bg-layout)] border-2 border-dashed border-[var(--antd-border)] rounded-xl p-5 text-center relative">
                <span className="text-[11px] uppercase font-bold text-[var(--antd-text-tertiary)] tracking-wider block mb-1">
                  আজকের সিরিয়াল টোকেন নম্বর
                </span>
                <span className="text-6xl sm:text-7xl font-black text-[var(--antd-primary)] tracking-tight block">
                  #{confirmedAppointment.tokenNumber}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 mt-3 border-t border-[var(--antd-border-split)] text-left text-xs">
                  <div>
                    <span className="text-[11px] text-[var(--antd-text-tertiary)] block">
                      রোগীর নাম
                    </span>
                    <span className="font-bold text-[var(--antd-text)]">
                      {confirmedAppointment.patientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--antd-text-tertiary)] block">
                      পছন্দের সময়
                    </span>
                    <span className="font-bold text-[var(--antd-text)]">
                      {confirmedAppointment.timeSlot}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-[var(--antd-text-tertiary)] block">
                      চিকিৎসা
                    </span>
                    <span className="font-bold text-[var(--antd-text)] truncate block">
                      {confirmedAppointment.serviceType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinic & Chamber Instructions */}
              <div className="p-4 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] text-xs text-[var(--antd-text-secondary)] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[var(--antd-text)]">
                  <Info className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                  <span>জরুরি নির্দেশনা ও পৌঁছানোর সময়:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                  <li>
                    আপনার নির্বাচিত সময় স্লটের অন্তত{" "}
                    <strong>১৫ মিনিট পূর্বে</strong> চেম্বারে উপস্থিত থাকুন।
                  </li>
                  <li>
                    <strong>লাইভ ওপিডি সিরিয়াল মনিটর</strong> থেকে যে কোনো সময়
                    চলমান সিরিয়াল নম্বর দেখতে পারবেন।
                  </li>
                  <li>
                    চেম্বার লোকেশন: বাড়ি #১২, রোড #০৪, ধানমন্ডি (ল্যাবএইড
                    সংলগ্ন), ঢাকা।
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <Link
                  href="/live-queue"
                  className="antd-btn antd-btn-primary h-10 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>লাইভ কিউতে দেখুন</span>
                </Link>

                <button
                  onClick={() => window.print()}
                  className="antd-btn antd-btn-default h-10 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                  <span>স্লিপ প্রিন্ট করুন</span>
                </button>

                <button
                  onClick={() => setConfirmedAppointment(null)}
                  className="antd-btn antd-btn-default h-10 text-xs font-medium flex items-center justify-center gap-1"
                >
                  <span>আরেকটি সিরিয়াল নিন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Modern, High-UX Segmented Booking Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Smart Segmented Booking Form (8 Cols) */}
          <div className="lg:col-span-8">
            <Form
              action={handleClientSubmit}
              className="space-y-4 sm:space-y-5"
            >
              {/* SECTION 1: APPOINTMENT SCHEDULE & SERVICE */}
              <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--antd-border-split)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] font-black text-xs flex items-center justify-center border border-[var(--antd-primary-border)]">
                      ১
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--antd-text)]">
                      তারিখ, সময় ও চিকিৎসা নির্বাচন
                    </h2>
                  </div>
                  <span className="text-[11px] font-medium text-[var(--antd-text-tertiary)]">
                    ধাপ ১/২
                  </span>
                </div>

                {/* 1A. Quick Date Pills + Custom Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--antd-text)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                      <span>অ্যাপয়েন্টমেন্টের তারিখ *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomDate(!showCustomDate)}
                      className="text-[11px] font-semibold text-[var(--antd-primary)] hover:underline"
                    >
                      {showCustomDate ? "কুইক অপশন দেখুন" : "অন্য দিন ক্যালেন্ডার 📅"}
                    </button>
                  </div>

                  {/* 1-Tap Quick Date Chips */}
                  <div className="grid grid-cols-3 gap-2">
                    {quickDates.map((item) => {
                      const isSelected = selectedDate === item.iso && !showCustomDate;
                      return (
                        <button
                          key={item.iso}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.iso);
                            setShowCustomDate(false);
                          }}
                          className={`py-2 px-2 sm:px-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? "bg-[var(--antd-primary-bg)] border-[var(--antd-primary)] text-[var(--antd-primary)] font-bold shadow-xs ring-1 ring-[var(--antd-primary)]"
                              : "bg-[var(--antd-bg-layout)]/60 border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:border-[var(--antd-border)]"
                          }`}
                        >
                          <span className="block text-xs font-bold">{item.title}</span>
                          <span className="block text-[10px] text-[var(--antd-text-tertiary)] mt-0.5">
                            {item.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Custom Date Field */}
                  {showCustomDate && (
                    <div className="pt-1 animate-in fade-in duration-200">
                      <input
                        type="date"
                        name="appointmentDate"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="antd-input h-10 text-xs sm:text-sm px-3"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  )}
                </div>

                {/* 1B. Compact & Sleek Time Slot Grid (3 cols on mobile!) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--antd-text)] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                      <span>পছন্দের সময় স্লট *</span>
                    </label>
                    <span className="text-[10px] text-[var(--antd-text-tertiary)]">
                      প্রতিটি স্লট ৩০ মিনিট
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot, idx) => {
                      const isSelected = selectedSlot === slot.value;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot.value)}
                          className={`py-2 px-2 rounded-lg text-center border transition-all ${
                            isSelected
                              ? "bg-[var(--antd-primary-bg)] border-[var(--antd-primary)] text-[var(--antd-primary)] font-bold shadow-xs ring-1 ring-[var(--antd-primary)]"
                              : "bg-[var(--antd-bg-layout)]/60 border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:border-[var(--antd-border)]"
                          }`}
                        >
                          <span className="block text-xs font-bold tracking-tight">
                            {slot.timeLabel}
                          </span>
                          <span className="block text-[9px] text-[var(--antd-text-tertiary)] mt-0.5 hidden xs:block">
                            {slot.rangeLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1C. Service Type Dropdown */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-[var(--antd-text)] flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
                    <span>চিকিৎসার ধরন / সেবার বিষয় *</span>
                  </label>
                  <select
                    name="serviceType"
                    required
                    className="antd-input h-10 text-xs sm:text-sm px-3"
                  >
                    {SERVICE_OPTIONS.map((srv, idx) => (
                      <option key={idx} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 2: PATIENT PERSONAL INFORMATION */}
              <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--antd-border-split)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] font-black text-xs flex items-center justify-center border border-[var(--antd-primary-border)]">
                      ২
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--antd-text)]">
                      রোগীর ব্যক্তিগত তথ্য
                    </h2>
                  </div>
                  <span className="text-[11px] font-medium text-[var(--antd-text-tertiary)]">
                    ধাপ ২/২
                  </span>
                </div>

                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--antd-text)] flex items-center gap-1">
                      <User className="w-3 h-3 text-[var(--antd-primary)]" />
                      <span>রোগীর পুরো নাম *</span>
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      required
                      placeholder="যেমন: কামরুল হাসান"
                      className="antd-input h-10 text-xs sm:text-sm px-3"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--antd-text)] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[var(--antd-primary)]" />
                      <span>মোবাইল নম্বর *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="যেমন: 01700000000"
                      className="antd-input h-10 text-xs sm:text-sm px-3"
                    />
                  </div>
                </div>

                {/* Row 2: Age and Gender side-by-side in 1 clean row! */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Age */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--antd-text)]">
                      বয়স *
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      defaultValue={28}
                      min={1}
                      max={110}
                      className="antd-input h-10 text-xs sm:text-sm px-3"
                    />
                  </div>

                  {/* Gender Pill Toggle */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--antd-text)]">
                      লিঙ্গ *
                    </label>
                    <div className="grid grid-cols-3 gap-1 h-10 p-1 rounded-[var(--antd-radius)] bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)]">
                      <button
                        type="button"
                        onClick={() => setGender("Male")}
                        className={`text-xs font-bold rounded flex items-center justify-center transition-all ${
                          gender === "Male"
                            ? "bg-[var(--antd-bg-container)] text-[var(--antd-primary)] shadow-xs"
                            : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
                        }`}
                      >
                        পুরুষ
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("Female")}
                        className={`text-xs font-bold rounded flex items-center justify-center transition-all ${
                          gender === "Female"
                            ? "bg-[var(--antd-bg-container)] text-[var(--antd-primary)] shadow-xs"
                            : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
                        }`}
                      >
                        মহিলা
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("Other")}
                        className={`text-xs font-bold rounded flex items-center justify-center transition-all ${
                          gender === "Other"
                            ? "bg-[var(--antd-bg-container)] text-[var(--antd-primary)] shadow-xs"
                            : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
                        }`}
                      >
                        অন্যান্য
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional Symptoms / Quick Chips */}
                <div className="space-y-2 pt-2 border-t border-[var(--antd-border-split)]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--antd-text)] flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[var(--antd-primary)]" />
                      <span>দাঁতের সমস্যা বা উপসর্গ (ঐচ্ছিক)</span>
                    </label>
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_COMPLAINTS.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => appendComplaint(c)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--antd-border-split)] bg-[var(--antd-bg-layout)]/80 text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] hover:border-[var(--antd-primary)] active:scale-95 transition-all"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="আপনার কোনো নির্দিষ্ট উপসর্গ বা সমস্যা থাকলে সংক্ষেপে লিখুন..."
                    className="antd-input text-xs sm:text-sm p-3 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button & Reassurance */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full antd-btn antd-btn-primary h-12 font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? "সিরিয়াল কনফার্ম করা হচ্ছে..."
                      : "সিরিয়াল নিশ্চিত করুন ও ইনস্ট্যান্ট টোকেন নিন"}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-3 pt-2.5 text-[11px] text-[var(--antd-text-tertiary)]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--antd-success)]" />
                    কোনো আগাম পেমেন্ট নেই
                  </span>
                  <span>•</span>
                  <span>ইনস্ট্যান্ট ডিজিটাল টোকেন স্লিপ</span>
                </div>
              </div>
            </Form>
          </div>

          {/* Right Column: Intelligent Sidebar & Clinic Profile (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Doctor Chamber Card */}
            <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] flex items-center justify-center text-[var(--antd-primary)] font-bold text-sm shadow-xs">
                  ডা.
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--antd-text)]">
                    ডা. মো. আসিফুল হক
                  </h3>
                  <p className="text-[11px] text-[var(--antd-primary)] font-semibold mt-0.5">
                    BDS (DU), FCPS (Oral Surgery)
                  </p>
                  <p className="text-[10px] text-[var(--antd-text-tertiary)]">
                    ৩০ বছরের অভিজ্ঞ ওরাল সার্জন
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--antd-border-split)] space-y-2 text-xs text-[var(--antd-text-secondary)]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--antd-primary)] shrink-0 mt-0.5" />
                  <span>
                    চেম্বার রুম #০১, ডেন্টাল সার্জারি ইউনিট, ধানমন্ডি, ঢাকা
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--antd-primary)] shrink-0" />
                  <span>বিকাল ৫:০০ - রাত ৯:৩০ (প্রতিদিন)</span>
                </div>
              </div>
            </div>

            {/* Live Queue Synergy Card */}
            <div className="bg-[var(--antd-primary-bg)]/50 border border-[var(--antd-primary-border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--antd-primary)] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  লাইভ ওপিডি ট্র্যাকার
                </span>
                <span className="antd-tag antd-tag-green font-bold text-[10px] py-0.5 px-2">
                  রানিং
                </span>
              </div>
              <p className="text-xs text-[var(--antd-text-secondary)] leading-relaxed">
                সিরিয়াল নেওয়ার পর চেম্বারে এসে দীর্ঘ সময় অপেক্ষা করার প্রয়োজন নেই।
                লাইভ ট্র্যাকার দেখে নিজের সময়ে আসুন।
              </p>
              <Link
                href="/live-queue"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--antd-primary)] hover:underline pt-1"
              >
                <span>আজকের রানিং সিরিয়াল চেক করুন</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quality Standards Card */}
            <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5 text-xs text-[var(--antd-text-secondary)]">
              <span className="font-bold text-[var(--antd-text)] block">
                ক্লিনিক্যাল নিশ্চয়তা:
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-success)] shrink-0" />
                  <span>ক্লাস-বি অটোকেভ ১০০% স্টেরিলাইজেশন</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-success)] shrink-0" />
                  <span>ব্যথামুক্ত আধুনিক ডেন্টাল অ্যানাস্থেসিয়া</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--antd-success)] shrink-0" />
                  <span>ডিজিটাল প্রেসক্রিপশন ও ফলো-আপ ট্র্যাকিং</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
