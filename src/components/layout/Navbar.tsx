"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Calendar,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Home,
  Activity,
  User,
  Stethoscope,
  HeartPulse,
  PhoneCall,
  History,
  Monitor,
} from "lucide-react";
import styles from "@/styles/styles.module.css";

const NAV_LINKS = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/live-queue", label: "লাইভ সিরিয়াল", icon: Activity, hasLiveDot: true },
  { href: "/doctor", label: "ডক্টর ও সময়সূচি", icon: User },
  { href: "/services", label: "সেবাসমূহ", icon: Stethoscope },
  { href: "/after-care", label: "আফটার-কেয়ার", icon: HeartPulse },
  { href: "/emergency", label: "জরুরি সহায়তা", icon: PhoneCall },
  { href: "/patient-history", label: "রোগীর হিস্ট্রি", icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--antd-bg-container)]/95 border-b border-[var(--antd-border-split)] transition-colors">
      {/* Sleek, Ultra-Slim Main Navbar (h-11 sm:h-12) */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-11 sm:h-12 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name: Just 'ডেন্টাল' */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-[var(--antd-radius)] bg-[var(--antd-primary)] flex items-center justify-center text-white shadow-xs group-hover:opacity-90 transition-opacity">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--antd-text)] group-hover:text-[var(--antd-primary)] transition-colors whitespace-nowrap">
            ডেন্টাল
          </span>
        </Link>

        {/* Full Desktop Navigation Links (Visible on >= 1280px) */}
        <div className="hidden xl:flex items-center gap-1 shrink-0">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1 rounded-[var(--antd-radius)] text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "!bg-[var(--antd-primary-bg)] !text-[var(--antd-primary)]"
                    : "!text-[var(--antd-text-secondary)] hover:!text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)]"
                }`}
              >
                <span>{link.label}</span>
                {link.hasLiveDot && <span className={styles.livePulseDot} />}
              </Link>
            );
          })}
        </div>

        {/* Middle Devices Quick Shortcut (768px to 1279px) */}
        <div className="hidden md:flex xl:hidden items-center gap-1.5 shrink-0">
          <Link
            href="/live-queue"
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border transition-all ${
              pathname === "/live-queue"
                ? "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400"
                : "border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>লাইভ কিউ</span>
            <span className={styles.livePulseDot} />
          </Link>
          <Link
            href="/doctor"
            className={`hidden lg:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap items-center gap-1.5 border transition-all ${
              pathname === "/doctor"
                ? "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400"
                : "border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ডক্টর শিডিউল</span>
          </Link>
        </div>

        {/* Right Actions: Ultra-compact */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Doctor / Admin Portal Link on Desktop & Tablet */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[var(--antd-radius)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] hover:bg-[var(--antd-bg-layout)] border border-transparent hover:border-[var(--antd-border-split)] transition-all whitespace-nowrap shrink-0"
          >
            <UserCheck className="w-3.5 h-3.5 text-[var(--antd-primary)]" />
            <span>অ্যাডমিন</span>
          </Link>

          {/* Primary Booking CTA - Placed to the left of ThemeToggle */}
          <Link
            href="/book"
            className="antd-btn antd-btn-primary antd-btn-sm px-2.5 sm:px-3 rounded-[var(--antd-radius)] font-semibold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>সিরিয়াল বুক</span>
          </Link>

          <ThemeToggle />

          {/* Mobile & Tablet Hamburger Toggle (Visible on < 1280px) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-8 h-8 rounded-full border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] flex items-center justify-center text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)] transition-all cursor-pointer shrink-0 shadow-2xs"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Slide-Down Mobile & Tablet Drawer (< 1280px) */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] px-3 sm:px-6 py-3 space-y-1 animate-in fade-in slide-in-from-top-1 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pb-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? "!bg-[var(--antd-primary-bg)] !text-[var(--antd-primary)] font-bold"
                      : "!text-[var(--antd-text-secondary)] hover:!text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.hasLiveDot && <span className={styles.livePulseDot} />}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[var(--antd-border-split)] flex items-center justify-between text-xs px-1">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-[var(--antd-primary)] font-bold flex items-center gap-1.5 hover:underline"
            >
              <UserCheck className="w-4 h-4" /> ডক্টরস অ্যাডমিন
            </Link>
            <Link
              href="/display"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] flex items-center gap-1"
            >
              <Monitor className="w-3.5 h-3.5" /> টিভি মনিটর ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
