"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Calendar, ShieldCheck, UserCheck, Menu, X, Activity } from "lucide-react";
import styles from "@/styles/styles.module.css";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/live-queue", label: "লাইভ সিরিয়াল", hasLiveDot: true },
  { href: "/doctor", label: "ডক্টর ও সময়সূচি" },
  { href: "/services", label: "সেবাসমূহ" },
  { href: "/after-care", label: "আফটার-কেয়ার" },
  { href: "/emergency", label: "জরুরি সহায়তা" },
  { href: "/patient-history", label: "রোগীর হিস্ট্রি" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--antd-bg-container)]/95 border-b border-[var(--antd-border-split)] transition-colors">
      {/* Sleek, Ultra-Slim Main Navbar (h-11 sm:h-12) */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-11 sm:h-12 flex items-center justify-between">
        
        {/* Brand Logo & Name: Just 'ডেন্টাল' */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-[var(--antd-radius)] bg-[var(--antd-primary)] flex items-center justify-center text-white shadow-xs group-hover:opacity-90 transition-opacity">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-[var(--antd-text)] group-hover:text-[var(--antd-primary)] transition-colors">
            ডেন্টাল
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-[var(--antd-radius)] text-xs lg:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] font-semibold"
                    : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)]"
                }`}
              >
                <span>{link.label}</span>
                {link.hasLiveDot && <span className={styles.livePulseDot} />}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Ultra-compact */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <ThemeToggle />

          {/* Quick Doctor Login Link */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[var(--antd-text-tertiary)] hover:text-[var(--antd-primary)] px-2 py-1 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>ডক্টরস ওপিডি</span>
          </Link>

          {/* Primary Booking CTA */}
          <Link
            href="/book"
            className="antd-btn antd-btn-primary antd-btn-sm px-3 rounded-[var(--antd-radius)] font-semibold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>সিরিয়াল বুক</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-[var(--antd-radius)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)]"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Compact Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] px-3 py-2 space-y-1 animate-in fade-in slide-in-from-top-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full px-3 py-2 rounded-[var(--antd-radius)] text-xs font-medium flex items-center justify-between ${
                  isActive
                    ? "bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] font-semibold"
                    : "text-[var(--antd-text)] hover:bg-[var(--antd-bg-layout)]"
                }`}
              >
                <span>{link.label}</span>
                {link.hasLiveDot && <span className={styles.livePulseDot} />}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[var(--antd-border-split)] flex items-center justify-between text-xs px-1">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-[var(--antd-primary)] font-semibold flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> ডক্টরস অ্যাডমিন
            </Link>
            <Link
              href="/display"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
            >
              টিভি মনিটর ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
