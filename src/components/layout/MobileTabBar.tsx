"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Clock, FileText, Home, Phone } from "lucide-react";
import styles from "@/styles/styles.module.css";

export function MobileTabBar() {
  const pathname = usePathname();

  // Do not show on display TV or admin screens
  if (pathname.startsWith("/admin") || pathname.startsWith("/display")) {
    return null;
  }

  const navItems = [
    {
      label: "হোম",
      href: "/",
      icon: Home,
    },
    {
      label: "লাইভ কিউ",
      href: "/live-queue",
      icon: Clock,
      hasPulse: true,
    },
    {
      label: "সিরিয়াল বুক",
      href: "/book",
      icon: Calendar,
      isPrimary: true,
    },
    {
      label: "হিস্ট্রি",
      href: "/patient-history",
      icon: FileText,
    },
    {
      label: "কল",
      href: "tel:+8801700000000",
      icon: Phone,
      isExternal: true,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--antd-bg-container)]/95 backdrop-blur-md border-t border-[var(--antd-border-split)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-pb"
    >
      <div className="max-w-7xl mx-auto px-2 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3 px-3 py-1 text-center group"
              >
                <div className="w-11 h-11 rounded-full bg-[var(--antd-primary)] text-white shadow-md flex items-center justify-center transition-transform active:scale-95">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--antd-primary)] mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.isExternal) {
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center py-1 px-2 text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] transition-colors active:scale-95"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-colors active:scale-95 ${
                isActive
                  ? "text-[var(--antd-primary)] font-bold"
                  : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.hasPulse && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--antd-primary)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--antd-primary)]" />
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
