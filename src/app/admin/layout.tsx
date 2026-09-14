"use client";

import React, { useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, Layout, Menu, theme, Button, Tag } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DesktopOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/admin",
      icon: <DesktopOutlined />,
      label: <Link href="/admin">সিরিয়াল কন্ট্রোল ডেস্ক</Link>,
    },
    {
      key: "/admin/recalls",
      icon: <BellOutlined />,
      label: (
        <Link
          href="/admin/recalls"
          className="flex items-center justify-between"
        >
          <span>৬-মাস রিকল সেন্টার</span>
          <Tag color="error" style={{ marginLeft: 4 }}>
            ওভারডিউ
          </Tag>
        </Link>
      ),
    },
    {
      key: "/admin/patients",
      icon: <UserOutlined />,
      label: <Link href="/admin/patients">রোগীর ডিজিটাল রেকর্ড</Link>,
    },
  ];

  const { resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // During SSR or before mount, check if html already has .dark or default to true/false gracefully
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 6,
            fontFamily:
              "var(--font-noto-sans-bengali), var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          },
        }}
      >
        <Layout
          style={{
            minHeight: "100vh",
            overflowX: "hidden",
            maxWidth: "100vw",
            backgroundColor: "var(--antd-bg-layout)",
          }}
        >
          {/* Desktop Sider (Hidden on Mobile & Tablet, visible on >= lg) */}
          <div className="hidden lg:block">
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
              theme="dark"
              width={240}
              style={{
                background: isDark ? "#141414" : "#001529",
                minHeight: "100vh",
              }}
            >
              <div
                style={{
                  padding: "16px 12px",
                  borderBottom: `1px solid ${isDark ? "#303030" : "#002140"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "#1677ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <MedicineBoxOutlined style={{ fontSize: 18 }} />
                  </div>
                  {!collapsed && (
                    <div>
                      <h4
                        style={{
                          color: "#fff",
                          margin: 0,
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        ডক্টরস চেম্বার
                      </h4>
                      <span style={{ color: "#8c8c8c", fontSize: 11 }}>
                        অ্যাডমিন প্যানেল
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
                items={menuItems}
                style={{
                  background: isDark ? "#141414" : "#001529",
                  marginTop: 8,
                }}
              />

              {!collapsed && (
                <div style={{ padding: 16, marginTop: 40 }}>
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <Button
                      icon={<HomeOutlined />}
                      block
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderColor: "#334155",
                        color: "#94a3b8",
                        fontSize: 12,
                      }}
                    >
                      পাবলিক ওয়েবসাইট দেখুন
                    </Button>
                  </Link>
                </div>
              )}
            </Sider>
          </div>

          <Layout
            style={{
              minHeight: "100vh",
              overflowX: "hidden",
              maxWidth: "100vw",
            }}
          >
            {/* Unified Responsive Header */}
            <Header
              style={{
                padding: "0 12px",
                background: "var(--antd-bg-container)",
                borderBottom: "1px solid var(--antd-border-split)",
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 30,
                maxWidth: "100vw",
                overflowX: "hidden",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* Left Brand: Mobile & Desktop */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <div
                  className="lg:hidden"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: "#1677ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <MedicineBoxOutlined style={{ fontSize: 14 }} />
                </div>
                <div className="truncate">
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--antd-text)",
                      display: "inline-block",
                    }}
                  >
                    <span className="hidden sm:inline">
                      ডা. আসিফ ডেন্টাল •{" "}
                    </span>
                    ওপিডি অ্যাডমিন
                  </span>
                  <Tag
                    color="success"
                    style={{ marginLeft: 4, fontSize: 10, padding: "0 4px" }}
                  >
                    সক্রিয়
                  </Tag>
                </div>
              </div>

              {/* Right Tools */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <ThemeToggle />
                <Link
                  href="/display"
                  target="_blank"
                  className="hidden sm:inline-block"
                >
                  <Button type="dashed" size="small" style={{ fontSize: 11 }}>
                    টিভি স্ক্রিন ↗
                  </Button>
                </Link>
                <div
                  className="hidden md:block"
                  style={{ textAlign: "right", lineHeight: "1.2" }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "var(--antd-text)",
                      display: "block",
                    }}
                  >
                    ডা. মো. আসিফুল হক
                  </span>
                  <span
                    style={{ fontSize: 10, color: "var(--antd-text-tertiary)" }}
                  >
                    সিনিয়র ডেন্টিস্ট
                  </span>
                </div>
                <Link href="/" className="lg:hidden">
                  <Button
                    size="small"
                    icon={<HomeOutlined />}
                    style={{ fontSize: 11, padding: "0 8px" }}
                  >
                    সাইট
                  </Button>
                </Link>
              </div>
            </Header>

            {/* Content Container */}
            <Content className="p-3 sm:p-5 md:p-6 pb-24 lg:pb-6 max-w-7xl w-full mx-auto overflow-x-hidden">
              {children}
            </Content>

            {/* Mobile Bottom Command Dock (< lg) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--antd-bg-container)]/95 backdrop-blur-md border-t border-[var(--antd-border-split)] px-2 py-1.5 flex items-center justify-around shadow-lg">
              <Link
                href="/admin"
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all ${
                  pathname === "/admin"
                    ? "text-[var(--antd-primary)] bg-[var(--antd-primary-bg)]"
                    : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
                }`}
              >
                <DesktopOutlined style={{ fontSize: 16 }} />
                <span>সিরিয়াল ডেস্ক</span>
              </Link>

              <Link
                href="/admin/recalls"
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all relative ${
                  pathname === "/admin/recalls"
                    ? "text-[var(--antd-primary)] bg-[var(--antd-primary-bg)]"
                    : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
                }`}
              >
                <BellOutlined style={{ fontSize: 16 }} />
                <span>রিকল সেন্টার</span>
                <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-[var(--antd-color-error)]" />
              </Link>

              <Link
                href="/admin/patients"
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all ${
                  pathname === "/admin/patients"
                    ? "text-[var(--antd-primary)] bg-[var(--antd-primary-bg)]"
                    : "text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
                }`}
              >
                <UserOutlined style={{ fontSize: 16 }} />
                <span>রোগীর রেকর্ড</span>
              </Link>

              <Link
                href="/"
                className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-semibold text-[var(--antd-text-secondary)] hover:text-[var(--antd-text)]"
              >
                <HomeOutlined style={{ fontSize: 16 }} />
                <span>পাবলিক</span>
              </Link>
            </div>
          </Layout>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  );
}
