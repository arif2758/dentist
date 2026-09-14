"use client";

import React, { useState, useRef } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  ConfigProvider,
  Layout,
  theme,
  Button,
  Tag,
  Dropdown,
  Avatar,
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DesktopOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
  MenuOutlined,
  AppstoreOutlined,
  MonitorOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const authUser = session?.user;
  const userRole = authUser?.role || "doctor";
  const roleBadge =
    userRole === "doctor"
      ? { label: "ডক্টর", color: "blue" }
      : userRole === "admin"
      ? { label: "অ্যাডমিন", color: "purple" }
      : { label: "সহকারী", color: "cyan" };

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const navTabs = [
    {
      key: "/admin",
      label: "সিরিয়াল কন্ট্রোল ডেস্ক",
      icon: <AppstoreOutlined className="text-sm" />,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      key: "/admin/recalls",
      label: "ফলো-আপ ও রিকল",
      icon: <BellOutlined className="text-sm" />,
      href: "/admin/recalls",
      active: pathname === "/admin/recalls",
    },
    {
      key: "/admin/patients",
      label: "রোগীর ডিজিটাল রেকর্ড (EHR)",
      icon: <UserOutlined className="text-sm" />,
      href: "/admin/patients",
      active: pathname.startsWith("/admin/patients"),
    },
    {
      key: "/display",
      label: "টিভি ডিসপ্লে স্ক্রিন",
      icon: <MonitorOutlined className="text-sm" />,
      href: "/display",
      target: "_blank",
      active: false,
    },
    {
      key: "/",
      label: "পাবলিক ওয়েবসাইট",
      icon: <HomeOutlined className="text-sm" />,
      href: "/",
      target: "_blank",
      active: false,
    },
  ];

  const scrollNav = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 180;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-header",
      label: (
        <div className="py-1 px-1">
          <div className="font-bold text-xs text-[var(--antd-text)]">
            {authUser?.name || "ডা. মো. আসিফুল হক"}
          </div>
          <div className="text-[11px] text-[var(--antd-text-secondary)]">
            {authUser?.email || authUser?.phone || "dr.arif@dentalclinic.com"}
          </div>
          <div className="mt-1">
            <Tag color={roleBadge.color} className="text-[10px] m-0">
              {roleBadge.label}
            </Tag>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "live-desk",
      icon: <DesktopOutlined />,
      label: <Link href="/admin">সিরিয়াল কন্ট্রোল ডেস্ক</Link>,
    },
    {
      key: "recalls",
      icon: <BellOutlined />,
      label: <Link href="/admin/recalls">ফলো-আপ ও রিকল</Link>,
    },
    {
      key: "patients",
      icon: <UserOutlined />,
      label: <Link href="/admin/patients">রোগীর রেকর্ড (EHR)</Link>,
    },
    {
      key: "display",
      icon: <MonitorOutlined />,
      label: (
        <Link href="/display" target="_blank">
          টিভি ডিসপ্লে মোড
        </Link>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "লগআউট",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 8,
            fontFamily:
              "var(--font-noto-sans-bengali), var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          },
        }}
      >
        <Layout
          style={{
            minHeight: "100vh",
            backgroundColor: "var(--antd-bg-layout)",
          }}
          className="min-h-screen flex flex-col w-full text-[var(--antd-text)]"
        >
          {/* ======================================================== */}
          {/* LAYER 1: Top Brand & System Utilities Bar (Slim/Minimal) */}
          {/* ======================================================== */}
          <header className="w-full bg-[var(--antd-bg-container)] border-b border-[var(--antd-border-split)] sticky top-0 z-40 transition-colors">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-11 sm:h-12 flex items-center justify-between gap-2 sm:gap-3">
              {/* Left Brand / Logo */}
              <Link
                href="/admin"
                className="flex items-center gap-2 min-w-0 group"
              >
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs font-black text-xs shrink-0">
                  <MedicineBoxOutlined className="text-sm" />
                </div>
                <div className="truncate leading-tight">
                  <span className="font-extrabold text-xs sm:text-sm text-[var(--antd-text)] block tracking-tight group-hover:text-[var(--antd-primary)] transition-colors">
                    ডা. আসিফ ডেন্টাল
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[var(--antd-text-secondary)] hidden sm:block">
                    কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার
                  </span>
                </div>
              </Link>

              {/* Center Quick Navigation (Desktop >= md) */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href="/"
                  className="admin-nav-link text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <HomeOutlined />
                  <span>হোম</span>
                </Link>
                <Link
                  href="/live-queue"
                  className="admin-nav-link text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <DesktopOutlined />
                  <span>লাইভ কিউ</span>
                </Link>
                <Link
                  href="/doctor"
                  className="admin-nav-link text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <UserOutlined />
                  <span>চেম্বার শিডিউল</span>
                </Link>
                <Link
                  href="/display"
                  target="_blank"
                  className="admin-tv-link text-xs font-semibold px-2 py-1 rounded-md transition-all flex items-center gap-1"
                >
                  <MonitorOutlined />
                  <span>টিভি স্ক্রিন ↗</span>
                </Link>
              </nav>

              {/* Right User & Tools Section */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <ThemeToggle />

                {/* User Profile Avatar with Online Dot */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <button
                    type="button"
                    className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[var(--antd-bg-layout)] transition-all cursor-pointer border border-transparent hover:border-[var(--antd-border-split)]"
                  >
                    <div className="relative">
                      <Avatar
                        size={28}
                        className="bg-blue-600 text-white font-bold text-xs"
                      >
                        {authUser?.name
                          ? authUser.name.slice(0, 1)
                          : "ডা"}
                      </Avatar>
                      {/* Active Online Indicator */}
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[var(--antd-bg-container)] absolute bottom-0 right-0" />
                    </div>

                    <div className="hidden sm:block text-left leading-tight">
                      <span className="text-xs font-bold text-[var(--antd-text)] block leading-none">
                        {authUser?.name || "ডা. মো. আসিফুল হক"}
                      </span>
                      <span className="text-[9px] text-[var(--antd-text-secondary)]">
                        {roleBadge.label}
                      </span>
                    </div>
                  </button>
                </Dropdown>

                {/* Mobile Drawer Toggle (< md) */}
                <div className="md:hidden">
                  <Button
                    className="flex items-center justify-center h-8 w-8 p-0"
                    icon={<MenuOutlined />}
                    size="small"
                    onClick={() => setMobileDrawerOpen(true)}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/* HEADER BANNER & LAYER 2: Horizontal Capsule Subnav Bar  */}
          {/* ======================================================== */}
          <section className="w-full bg-transparent pt-3 pb-1.5 sm:pt-4 sm:pb-2 transition-colors">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-2 sm:space-y-3">
              {/* Dashboard Title & Subtitle */}
              <div className="text-center space-y-0.5">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[var(--antd-text)] tracking-tight m-0">
                  আমার ড্যাশবোর্ড
                </h1>
                <p className="text-[11px] sm:text-xs text-[var(--antd-text-secondary)] m-0">
                  আপনার কেন্দ্রীয় ডেন্টাল ক্লিনিক ও ওপিডি চেম্বারের সমন্বিত নিয়ন্ত্রণ
                </p>
              </div>

              {/* Layer 2 Tag Navigation Strip (No outer box border, standalone tag pills) */}
              <div className="relative flex items-center gap-1.5 sm:gap-2 w-full">
                {/* Mobile Left Scroll Arrow */}
                <button
                  type="button"
                  onClick={() => scrollNav("left")}
                  className="md:hidden w-7 h-7 rounded-full border border-[var(--antd-border-split)] bg-transparent flex items-center justify-center text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:border-[var(--antd-border)] shadow-xs shrink-0 transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <LeftOutlined className="text-[10px]" />
                </button>

                {/* Scrollable Tag Pills Strip */}
                <div
                  ref={scrollRef}
                  className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-0.5 justify-start sm:justify-center"
                >
                  {navTabs.map((tab) => {
                    const isActive = tab.active;
                    return (
                      <Link
                        key={tab.key}
                        href={tab.href}
                        target={tab.target}
                        className={`admin-tab-pill whitespace-nowrap px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Right Scroll Arrow */}
                <button
                  type="button"
                  onClick={() => scrollNav("right")}
                  className="md:hidden w-8 h-8 rounded-full border border-[var(--antd-border-split)] bg-transparent flex items-center justify-center text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)] hover:border-[var(--antd-border)] shadow-xs shrink-0 transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <RightOutlined className="text-xs" />
                </button>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* MAIN CONTENT AREA: max-w-7xl as requested               */}
          {/* ======================================================== */}
          <Content className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1">
            {children}
          </Content>

          {/* Mobile Navigation Drawer (< md) */}
          <Drawer
            title={
              <div className="flex items-center gap-2">
                <MedicineBoxOutlined className="text-blue-600 text-base" />
                <span className="font-bold text-sm">ডক্টরস মেনু</span>
              </div>
            }
            placement="right"
            onClose={() => setMobileDrawerOpen(false)}
            open={mobileDrawerOpen}
            size="default"
          >
            <div className="space-y-4 text-xs">
              {/* User Header */}
              <div className="p-3 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] flex items-center gap-3">
                <Avatar size={36} className="bg-blue-600 text-white font-bold">
                  {authUser?.name ? authUser.name.slice(0, 1) : "ডা"}
                </Avatar>
                <div>
                  <div className="font-bold text-sm text-[var(--antd-text)]">
                    {authUser?.name || "ডা. মো. আসিফুল হক"}
                  </div>
                  <Tag color={roleBadge.color} className="text-[10px] mt-0.5">
                    {roleBadge.label}
                  </Tag>
                </div>
              </div>

              {/* Drawer Navigation Links */}
              <div className="space-y-1">
                {navTabs.map((tab) => (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    target={tab.target}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`admin-drawer-link flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                      tab.active ? "active" : ""
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Link>
                ))}
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t border-[var(--antd-border-split)]">
                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  লগআউট
                </Button>
              </div>
            </div>
          </Drawer>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  );
}
