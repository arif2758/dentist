"use client";

import React, { useState } from "react";
import { Tag, Badge, Tooltip, Button, Space, Modal, Select, App } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export type ToothCondition =
  | "HEALTHY"
  | "CARIES"
  | "RCT"
  | "CROWN"
  | "MISSING"
  | "EXTRACT_NEEDED";

export interface ToothData {
  number: number;
  nameBn: string;
  nameEn: string;
  quadrant: 1 | 2 | 3 | 4;
  condition?: ToothCondition;
  note?: string;
}

const TOOTH_CONDITIONS: Record<
  ToothCondition,
  { label: string; color: string; bg: string; icon: React.ReactNode; border: string }
> = {
  HEALTHY: {
    label: "সুস্থ ও স্বাভাবিক",
    color: "#52c41a",
    bg: "rgba(82, 196, 26, 0.1)",
    border: "#b7eb8f",
    icon: <CheckCircleOutlined className="text-green-500" />,
  },
  CARIES: {
    label: "ক্যারিজ / গর্ত",
    color: "#fa8c16",
    bg: "rgba(250, 140, 22, 0.15)",
    border: "#ffd591",
    icon: <ExclamationCircleOutlined className="text-amber-500" />,
  },
  RCT: {
    label: "রুট ক্যানেল চলছে/সম্পন্ন",
    color: "#1890ff",
    bg: "rgba(24, 144, 255, 0.15)",
    border: "#91d5ff",
    icon: <ThunderboltOutlined className="text-blue-500" />,
  },
  CROWN: {
    label: "ক্যাপ / ক্রাউন",
    color: "#722ed1",
    bg: "rgba(114, 46, 209, 0.15)",
    border: "#d3adf7",
    icon: <CrownOutlined className="text-purple-500" />,
  },
  EXTRACT_NEEDED: {
    label: "দাঁত তোলা প্রয়োজন",
    color: "#f5222d",
    bg: "rgba(245, 34, 45, 0.15)",
    border: "#ffa39e",
    icon: <CloseCircleOutlined className="text-red-500" />,
  },
  MISSING: {
    label: "অনুপস্থিত / পূর্বেই তোলা",
    color: "#8c8c8c",
    bg: "rgba(140, 140, 140, 0.12)",
    border: "#d9d9d9",
    icon: <CloseCircleOutlined className="text-gray-400" />,
  },
};

// Adult FDI Teeth Matrix
const UPPER_RIGHT_TEETH: ToothData[] = [
  { number: 18, nameBn: "আক্কেল দাঁত (UR 8)", nameEn: "Upper Right 3rd Molar", quadrant: 1 },
  { number: 17, nameBn: "২য় মোলার (UR 7)", nameEn: "Upper Right 2nd Molar", quadrant: 1 },
  { number: 16, nameBn: "১ম মোলার (UR 6)", nameEn: "Upper Right 1st Molar", quadrant: 1 },
  { number: 15, nameBn: "২য় প্রিমোলার (UR 5)", nameEn: "Upper Right 2nd Premolar", quadrant: 1 },
  { number: 14, nameBn: "১ম প্রিমোলার (UR 4)", nameEn: "Upper Right 1st Premolar", quadrant: 1 },
  { number: 13, nameBn: "ক্যানাইন (UR 3)", nameEn: "Upper Right Canine", quadrant: 1 },
  { number: 12, nameBn: "ল্যাটারাল (UR 2)", nameEn: "Upper Right Lateral Incisor", quadrant: 1 },
  { number: 11, nameBn: "সেন্ট্রাল (UR 1)", nameEn: "Upper Right Central Incisor", quadrant: 1 },
];

const UPPER_LEFT_TEETH: ToothData[] = [
  { number: 21, nameBn: "সেন্ট্রাল (UL 1)", nameEn: "Upper Left Central Incisor", quadrant: 2 },
  { number: 22, nameBn: "ল্যাটারাল (UL 2)", nameEn: "Upper Left Lateral Incisor", quadrant: 2 },
  { number: 23, nameBn: "ক্যানাইন (UL 3)", nameEn: "Upper Left Canine", quadrant: 2 },
  { number: 24, nameBn: "১ম প্রিমোলার (UL 4)", nameEn: "Upper Left 1st Premolar", quadrant: 2 },
  { number: 25, nameBn: "২য় প্রিমোলার (UL 5)", nameEn: "Upper Left 2nd Premolar", quadrant: 2 },
  { number: 26, nameBn: "১ম মোলার (UL 6)", nameEn: "Upper Left 1st Molar", quadrant: 2 },
  { number: 27, nameBn: "২য় মোলার (UL 7)", nameEn: "Upper Left 2nd Molar", quadrant: 2 },
  { number: 28, nameBn: "আক্কেল দাঁত (UL 8)", nameEn: "Upper Left 3rd Molar", quadrant: 2 },
];

const LOWER_RIGHT_TEETH: ToothData[] = [
  { number: 48, nameBn: "আক্কেল দাঁত (LR 8)", nameEn: "Lower Right 3rd Molar", quadrant: 4 },
  { number: 47, nameBn: "২য় মোলার (LR 7)", nameEn: "Lower Right 2nd Molar", quadrant: 4 },
  { number: 46, nameBn: "১ম মোলার (LR 6)", nameEn: "Lower Right 1st Molar", quadrant: 4 },
  { number: 45, nameBn: "২য় প্রিমোলার (LR 5)", nameEn: "Lower Right 2nd Premolar", quadrant: 4 },
  { number: 44, nameBn: "১ম প্রিমোলার (LR 4)", nameEn: "Lower Right 1st Premolar", quadrant: 4 },
  { number: 43, nameBn: "ক্যানাইন (LR 3)", nameEn: "Lower Right Canine", quadrant: 4 },
  { number: 42, nameBn: "ল্যাটারাল (LR 2)", nameEn: "Lower Right Lateral Incisor", quadrant: 4 },
  { number: 41, nameBn: "সেন্ট্রাল (LR 1)", nameEn: "Lower Right Central Incisor", quadrant: 4 },
];

const LOWER_LEFT_TEETH: ToothData[] = [
  { number: 31, nameBn: "সেন্ট্রাল (LL 1)", nameEn: "Lower Left Central Incisor", quadrant: 3 },
  { number: 32, nameBn: "ল্যাটারাল (LL 2)", nameEn: "Lower Left Lateral Incisor", quadrant: 3 },
  { number: 33, nameBn: "ক্যানাইন (LL 3)", nameEn: "Lower Left Canine", quadrant: 3 },
  { number: 34, nameBn: "১ম প্রিমোলার (LL 4)", nameEn: "Lower Left 1st Premolar", quadrant: 3 },
  { number: 35, nameBn: "২য় প্রিমোলার (LL 5)", nameEn: "Lower Left 2nd Premolar", quadrant: 3 },
  { number: 36, nameBn: "১ম মোলার (LL 6)", nameEn: "Lower Left 1st Molar", quadrant: 3 },
  { number: 37, nameBn: "২য় মোলার (LL 7)", nameEn: "Lower Left 2nd Molar", quadrant: 3 },
  { number: 38, nameBn: "আক্কেল দাঁত (LL 8)", nameEn: "Lower Left 3rd Molar", quadrant: 3 },
];

interface ToothChartProps {
  initialConditions?: Record<number, { condition: ToothCondition; note?: string }>;
  readOnly?: boolean;
  onToothUpdate?: (toothNumber: number, condition: ToothCondition, note?: string) => void;
}

export function ToothChart({
  initialConditions = {},
  readOnly = false,
  onToothUpdate,
}: ToothChartProps) {
  const { message } = App.useApp();
  const [conditions, setConditions] = useState<
    Record<number, { condition: ToothCondition; note?: string }>
  >(initialConditions);

  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);
  const [tempCondition, setTempCondition] = useState<ToothCondition>("CARIES");
  const [tempNote, setTempNote] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleToothClick = (tooth: ToothData) => {
    if (readOnly) return;
    const current = conditions[tooth.number];
    setSelectedTooth(tooth);
    setTempCondition(current?.condition || "CARIES");
    setTempNote(current?.note || "");
    setModalOpen(true);
  };

  const handleSaveCondition = () => {
    if (!selectedTooth) return;
    const updated = {
      ...conditions,
      [selectedTooth.number]: {
        condition: tempCondition,
        note: tempNote,
      },
    };
    setConditions(updated);
    if (onToothUpdate) {
      onToothUpdate(selectedTooth.number, tempCondition, tempNote);
    }
    message.success(`দাঁত #${selectedTooth.number} এর স্ট্যাটাস আপডেট হয়েছে`);
    setModalOpen(false);
  };

  const renderTooth = (tooth: ToothData) => {
    const data = conditions[tooth.number];
    const condition = data?.condition || "HEALTHY";
    const config = TOOTH_CONDITIONS[condition];

    return (
      <Tooltip
        key={tooth.number}
        title={
          <div className="text-xs space-y-0.5 p-1">
            <p className="font-bold">দাঁত #{tooth.number}: {tooth.nameBn}</p>
            <p className="text-[11px] text-gray-300">{tooth.nameEn}</p>
            <p className="text-[11px] font-semibold text-emerald-300">
              অবস্থা: {config.label}
            </p>
            {data?.note && <p className="text-[10px] italic text-amber-200">নোট: {data.note}</p>}
            {!readOnly && <p className="text-[10px] text-blue-200 mt-1">ক্লিক করে স্ট্যাটাস পরিবর্তন করুন</p>}
          </div>
        }
      >
        <button
          type="button"
          onClick={() => handleToothClick(tooth)}
          className={`group relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg border transition-all duration-200 ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-105 active:scale-95"
          }`}
          style={{
            backgroundColor: config.bg,
            borderColor: data ? config.color : "var(--antd-border-split)",
            minWidth: "34px",
            minHeight: "44px",
          }}
        >
          {/* Tooth Visual Icon */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
            {condition === "HEALTHY" ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-500/80 stroke-emerald-600">
                <path d="M12 2C9 2 7 3.5 6 5.5C5 7.5 5 10 5.5 12C6 14.5 7 17 8 20C8.5 21.5 9.5 22 10.5 21.5C11.5 21 11.5 18 12 18C12.5 18 12.5 21 13.5 21.5C14.5 22 15.5 21.5 16 20C17 17 18 14.5 18.5 12C19 10 19 7.5 18 5.5C17 3.5 15 2 12 2Z" />
              </svg>
            ) : condition === "MISSING" ? (
              <span className="text-xs font-bold text-gray-400 opacity-60">✕</span>
            ) : condition === "CARIES" ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-500/90 stroke-amber-600">
                <path d="M12 2C9 2 7 3.5 6 5.5C5 7.5 5 10 5.5 12C6 14.5 7 17 8 20C8.5 21.5 9.5 22 10.5 21.5C11.5 21 11.5 18 12 18C12.5 18 12.5 21 13.5 21.5C14.5 22 15.5 21.5 16 20C17 17 18 14.5 18.5 12C19 10 19 7.5 18 5.5C17 3.5 15 2 12 2Z" />
                <circle cx="12" cy="10" r="3" className="fill-stone-900" />
              </svg>
            ) : condition === "RCT" ? (
              <ThunderboltOutlined style={{ color: "#1890ff", fontSize: 16 }} />
            ) : condition === "CROWN" ? (
              <CrownOutlined style={{ color: "#722ed1", fontSize: 16 }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#f5222d", fontSize: 16 }} />
            )}
          </div>

          {/* Tooth Number */}
          <span
            className="text-[10px] sm:text-[11px] font-bold mt-0.5"
            style={{ color: data ? config.color : "var(--antd-text)" }}
          >
            {tooth.number}
          </span>
        </button>
      </Tooltip>
    );
  };

  const treatedCount = Object.keys(conditions).filter(
    (k) => conditions[Number(k)]?.condition !== "HEALTHY"
  ).length;

  return (
    <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--antd-border-split)]">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm sm:text-base text-[var(--antd-text)]">
              ইন্টারেক্টিভ ডেন্টাল টুথ চার্ট (FDI 32 Teeth Chart)
            </h4>
            {treatedCount > 0 && (
              <Tag color="cyan" className="text-[11px]">
                চিহ্নিত দাঁত: {treatedCount} টি
              </Tag>
            )}
          </div>
          <p className="text-[11px] text-[var(--antd-text-secondary)]">
            দাঁতের অবস্থান ও চিকিৎসার অগ্রগতি ট্র্যাক করতে যে কোনো দাঁতে ক্লিক করুন।
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {Object.entries(TOOTH_CONDITIONS).map(([key, cfg]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border"
              style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
            >
              {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* Teeth Arch Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[580px] flex flex-col gap-4">
          {/* Upper Jaw (ম্যাক্সিলারি খিলান) */}
          <div className="space-y-1">
            <div className="flex justify-between px-2 text-[10px] font-bold text-[var(--antd-text-tertiary)] uppercase tracking-wider">
              <span>উপরের চোয়াল (ডান পাশ / UR 18-11)</span>
              <span>উপরের চোয়াল (বাম পাশ / UL 21-28)</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 bg-[var(--antd-bg-layout)]/60 p-2 sm:p-3 rounded-lg border border-[var(--antd-border-split)]">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {UPPER_RIGHT_TEETH.map(renderTooth)}
              </div>
              <div className="w-px h-10 bg-[var(--antd-primary)]/40 mx-1" />
              <div className="flex items-center gap-1 sm:gap-1.5">
                {UPPER_LEFT_TEETH.map(renderTooth)}
              </div>
            </div>
          </div>

          {/* Lower Jaw (ম্যান্ডিবুলার খিলান) */}
          <div className="space-y-1">
            <div className="flex justify-between px-2 text-[10px] font-bold text-[var(--antd-text-tertiary)] uppercase tracking-wider">
              <span>নিচের চোয়াল (ডান পাশ / LR 48-41)</span>
              <span>নিচের চোয়াল (বাম পাশ / LL 31-38)</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 bg-[var(--antd-bg-layout)]/60 p-2 sm:p-3 rounded-lg border border-[var(--antd-border-split)]">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {LOWER_RIGHT_TEETH.map(renderTooth)}
              </div>
              <div className="w-px h-10 bg-[var(--antd-primary)]/40 mx-1" />
              <div className="flex items-center gap-1 sm:gap-1.5">
                {LOWER_LEFT_TEETH.map(renderTooth)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tooth Modal */}
      <Modal
        title={
          selectedTooth ? (
            <span className="font-bold text-base text-[var(--antd-text)]">
              দাঁত #{selectedTooth.number} এর স্ট্যাটাস এন্ট্রি ({selectedTooth.nameBn})
            </span>
          ) : (
            "দাঁতের স্ট্যাটাস"
          )
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveCondition}
        okText="সংরক্ষণ করুন"
        cancelText="বাতিল"
        centered
      >
        {selectedTooth && (
          <div className="py-3 space-y-4">
            <div className="p-3 bg-[var(--antd-bg-layout)] rounded-lg text-xs space-y-1">
              <p className="font-semibold text-[var(--antd-text)]">
                অ্যানাটমিক্যাল নাম: {selectedTooth.nameEn}
              </p>
              <p className="text-[var(--antd-text-secondary)]">
                চোয়ালের অবস্থান: {selectedTooth.quadrant <= 2 ? "উপরের খিলান (Maxilla)" : "নিচের খিলান (Mandible)"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--antd-text)]">
                বর্তমান ক্লিনিক্যাল অবস্থা (Condition):
              </label>
              <Select
                value={tempCondition}
                onChange={(val) => setTempCondition(val)}
                className="w-full"
                options={Object.entries(TOOTH_CONDITIONS).map(([key, cfg]) => ({
                  value: key,
                  label: (
                    <div className="flex items-center gap-2">
                      {cfg.icon}
                      <span>{cfg.label}</span>
                    </div>
                  ),
                }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--antd-text)]">
                ডক্টরস ডায়াগনসিস ও নোট (ঐচ্ছিক):
              </label>
              <input
                type="text"
                placeholder="যেমন: ৩য় সেশন বাকি, ক্যাপের জন্য ইমপ্রেশন নেয়া প্রয়োজন"
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] text-[var(--antd-text)] focus:outline-none focus:border-[var(--antd-primary)]"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
