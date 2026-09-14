"use client";

import React, { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowLeft,
  ShieldCheck,
  User,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Stethoscope,
  Briefcase,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { DEMO_USERS } from "@/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন");
      return;
    }

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
          callbackUrl,
        });

        if (res?.error) {
          setErrorMessage("ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।");
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        setErrorMessage("লগইন করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--antd-bg-layout)] text-[var(--antd-text)] relative">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-radial from-blue-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="antd-card antd-card-bordered shadow-sm overflow-hidden border border-[var(--antd-border-split)]">
          {/* Card Header */}
          <div className="p-6 sm:p-8 text-center border-b border-[var(--antd-border-split)] bg-[var(--antd-bg-container)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--antd-primary)] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--antd-text)]">
              ক্লিনিক অ্যাডমিন ও ডক্টরস পোর্টাল
            </h1>
            <p className="text-xs text-[var(--antd-text-secondary)] mt-1">
              সিরিয়াল পরিচালনা ও রোগী ব্যবস্থাপনায় নিরাপদ লগইন
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[var(--antd-bg-container)] space-y-6">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="antd-alert antd-alert-error flex items-center gap-2 p-3 text-xs rounded-[var(--antd-radius)]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[var(--antd-text)] mb-1.5"
                >
                  ইমেইল অ্যাড্রেস
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--antd-text-tertiary)] z-10">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@dentist.com"
                    className="antd-input antd-input-has-prefix h-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[var(--antd-text)] mb-1.5"
                >
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--antd-text-tertiary)] z-10">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="antd-input antd-input-has-prefix antd-input-has-suffix h-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--antd-text-tertiary)] hover:text-[var(--antd-text)] cursor-pointer z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full antd-btn antd-btn-primary antd-btn-lg font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>{isPending ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}</span>
              </button>
            </form>

            {/* Quick Demo Fill Section */}
            <div className="pt-4 border-t border-[var(--antd-border-split)]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-[var(--antd-text-secondary)] uppercase tracking-wider">
                  এক-ক্লিকে টেস্ট ডেমো অ্যাকাউন্ট:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill("doctor@dentist.com", "doctor123")
                  }
                  className="antd-btn antd-btn-default flex items-center justify-center gap-1.5 text-xs py-2 h-auto"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                  <div className="text-left">
                    <div className="font-semibold leading-tight">ডক্টর</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill("staff@dentist.com", "staff123")
                  }
                  className="antd-btn antd-btn-default flex items-center justify-center gap-1.5 text-xs py-2 h-auto"
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  <div className="text-left">
                    <div className="font-semibold leading-tight">সহকারী</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill("admin@dentist.com", "admin123")
                  }
                  className="antd-btn antd-btn-default flex items-center justify-center gap-1.5 text-xs py-2 h-auto"
                >
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-semibold leading-tight">অ্যাডমিন</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Assurance Footer */}
        <div className="mt-6 text-center text-xs text-[var(--antd-text-tertiary)] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>২৫৬-বিট অ্যান্ড-টু-অ্যান্ড সিকিউরড ও রোল-বেসড অ্যাক্সেস</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--antd-bg-layout)] text-[var(--antd-text)]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[var(--antd-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[var(--antd-text-secondary)]">লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
