"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import styles from "@/styles/styles.module.css";
import { QueueState } from "@/lib/types";

export default function WaitingRoomDisplay() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [prevToken, setPrevToken] = useState<number | null>(null);

  const { data } = useQuery<{ success: boolean; data: QueueState }>({
    queryKey: ["displayQueue"],
    queryFn: async () => {
      const res = await fetch("/api/queue");
      return res.json();
    },
    refetchInterval: 3000, // rapid 3s refresh for TV
  });

  const queue = data?.data;
  const currentToken = queue?.currentlyServingToken ?? 4;
  const activeList = queue?.activeQueueList ?? [];
  const servingPatient = activeList.find((a) => a.tokenNumber === currentToken);
  const waitingPatients = activeList.filter(
    (a) => a.status === "WAITING" && a.tokenNumber > currentToken,
  );

  // Play browser beep/chime on token change
  useEffect(() => {
    if (prevToken !== null && prevToken !== currentToken && soundEnabled) {
      try {
        const audioCtx = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.6,
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // Audio policy
      }
    }
    setPrevToken(currentToken);
  }, [currentToken, prevToken, soundEnabled]);

  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top TV Bar */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার
            </h1>
            <p className="text-sm text-sky-400 font-semibold">
              ওপিডি রোগী সিরিয়াল ডিসপ্লে মনিটর
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
              soundEnabled
                ? "bg-blue-600/30 border-blue-500 text-sky-300"
                : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span>{soundEnabled ? "টোকেন বেল অন" : "বেল মিউট"}</span>
          </button>

          <div className="text-right">
            <span className="text-2xl font-black text-white block tracking-wider">
              {currentTime}
            </span>
            <span className="text-xs text-slate-400">
              তারিখ: {new Date().toLocaleDateString("bn-BD")}
            </span>
          </div>
        </div>
      </header>

      {/* Main Massive Token Calling Screen */}
      <main className="my-auto py-6">
        {/* Break Announcement Banner on TV Display */}
        {queue?.breakInfo?.isOnBreak && (
          <div className="w-full mb-6 p-6 rounded-3xl bg-gradient-to-r from-amber-950/90 via-amber-900/70 to-amber-950/90 border-2 border-amber-500 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-amber-500/20">
            <div className="flex items-center gap-4">
              <span className="text-5xl">☕</span>
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                    চেম্বার সাময়িক বিরতি
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300">
                    {queue.breakInfo.reasonText || "ডাক্তার সাহেব সাময়িক বিরতিতে আছেন"}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  রোগীদের অবগতির জন্য জানানো যাচ্ছে যে সাময়িক বিরতি চলছে। নির্ধারিত সময়ে পরবর্তী সিরিয়াল ডাকা হবে।
                </p>
              </div>
            </div>
            <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-amber-500/40 pt-3 md:pt-0 md:pl-6 shrink-0">
              <span className="text-xs uppercase font-bold text-amber-400 block tracking-wider">
                পুনরায় শুরু হওয়ার সম্ভাব্য সময়
              </span>
              <span className="text-3xl font-black text-white block mt-0.5">
                {queue.breakInfo.expectedResumeTime || "শীঘ্রই"}
              </span>
              <span className="text-xs text-amber-200">
                (স্থায়িত্ব: ~{queue.breakInfo.durationMinutes} মিনিট)
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 7 cols: Big Serving Token */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border-2 border-blue-600 p-8 sm:p-12 text-center shadow-2xl shadow-blue-500/10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-blue-500/20 text-sky-300 border border-blue-500/40">
            <span className={styles.livePulseDot} />
            <span>এখন চেম্বারে প্রবেশ করুন (Serving Now)</span>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-400 block">
              টোকেন সিরিয়াল নম্বর
            </span>
            <div className="text-8xl sm:text-9xl font-black text-sky-400 tracking-tighter my-2 animate-pulse">
              #{currentToken}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-1">
            <p className="text-xl sm:text-2xl font-extrabold text-white">
              {servingPatient
                ? servingPatient.patientName
                : "রোগী ডাক হচ্ছে..."}
            </p>
            <p className="text-sm text-sky-300 font-medium">
              রুম নং #০১ • ডা. মো. আসিফুল হক (সিনিয়র ডেন্টিস্ট)
            </p>
          </div>
        </div>

        {/* Right 5 cols: Next in Queue List */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> অপেক্ষমাণ পরবর্তী সিরিয়াল
            </span>
            <span className="text-xs text-slate-400">প্রস্তুত থাকুন</span>
          </div>

          <div className="space-y-3">
            {waitingPatients.slice(0, 4).map((apt, idx) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xl flex items-center justify-center">
                    #{apt.tokenNumber}
                  </span>
                  <div>
                    <p className="text-base font-bold text-white">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-slate-400">{apt.serviceType}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-900">
                  {idx === 0 ? "পরবর্তী" : `সিরিয়াল ${idx + 1}`}
                </span>
              </div>
            ))}

            {waitingPatients.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-sm">
                বর্তমানে কোনো অপেক্ষমাণ রোগী নেই।
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-sky-200 leading-relaxed flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
            <span>
              আপনার সিরিয়ালের ৫ মিনিট পূর্বে দরজার পাশের ওয়েটিং সিটে বসার অনুরোধ
              করা হচ্ছে।
            </span>
          </div>
        </div>
        </div>
      </main>

      {/* TV Footer announcement */}
      <footer className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-sky-400" />
          <span>
            অনলাইনে সিরিয়াল চেক করতে ভিজিট করুন:{" "}
            <strong className="text-white">www.drarifdental.com</strong>
          </span>
        </div>
        <div>
          <span>
            ওয়াইফাই: <strong className="text-white">DrArif-Guest</strong> •
            পাসওয়ার্ড: <strong className="text-white">smile123</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}
