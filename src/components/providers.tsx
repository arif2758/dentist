"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, App as AntdApp } from "antd";

function AntdThemeBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#1668dc" : "#1677ff",
          borderRadius: 6,
          fontFamily:
            "var(--font-noto-sans-bengali), var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          colorText: isDark ? "rgba(255, 255, 255, 0.88)" : "rgba(0, 0, 0, 0.88)",
          colorBgContainer: isDark ? "#1f1f1f" : "#ffffff",
          colorBgLayout: isDark ? "#141414" : "#f5f5f5",
          colorBorder: isDark ? "#424242" : "#d9d9d9",
        },
      }}
    >
      <AntdApp className="min-h-full bg-transparent text-inherit">
        {children}
      </AntdApp>
    </ConfigProvider>
  );
}

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 5, // 5 seconds
            refetchInterval: 5000, // auto poll queue every 5s
          },
        },
      })
  );

  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <AntdRegistry>
            <AntdThemeBridge>{children}</AntdThemeBridge>
          </AntdRegistry>
        </QueryClientProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}

