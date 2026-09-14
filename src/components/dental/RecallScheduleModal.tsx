"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Radio,
  InputNumber,
  DatePicker,
  Input,
  Button,
  Tag,
  Typography,
  Space,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Text } = Typography;

export interface RecallScheduleModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  currentRecallDate?: string;
  currentRecallNotes?: string;
  onSave: (data: {
    patientId: string;
    nextRecallDate: string;
    note: string;
    status: "SCHEDULED" | "OVERDUE" | "CONTACTED" | "PENDING";
  }) => Promise<void> | void;
  loading?: boolean;
}

type PresetType = "3_DAYS" | "7_DAYS" | "15_DAYS" | "1_MONTH" | "3_MONTHS" | "6_MONTHS" | "CUSTOM_DAYS" | "CUSTOM_DATE";

export const RecallScheduleModal: React.FC<RecallScheduleModalProps> = ({
  open,
  onClose,
  patientId,
  patientName,
  currentRecallDate,
  currentRecallNotes,
  onSave,
  loading = false,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>("7_DAYS");
  const [customDays, setCustomDays] = useState<number>(7);
  const [customDate, setCustomDate] = useState<Dayjs | null>(null);
  const [note, setNote] = useState<string>("");
  const [calculatedDate, setCalculatedDate] = useState<string>("");

  useEffect(() => {
    if (open) {
      setNote(currentRecallNotes || "");
      if (currentRecallDate && dayjs(currentRecallDate).isValid()) {
        const diffDays = dayjs(currentRecallDate).diff(dayjs(), "day");
        if (diffDays === 3) setSelectedPreset("3_DAYS");
        else if (diffDays === 7) setSelectedPreset("7_DAYS");
        else if (diffDays === 15) setSelectedPreset("15_DAYS");
        else if (diffDays === 30) setSelectedPreset("1_MONTH");
        else if (diffDays === 90) setSelectedPreset("3_MONTHS");
        else if (diffDays === 180) setSelectedPreset("6_MONTHS");
        else {
          setSelectedPreset("CUSTOM_DATE");
          setCustomDate(dayjs(currentRecallDate));
        }
      } else {
        setSelectedPreset("7_DAYS");
      }
    }
  }, [open, currentRecallDate, currentRecallNotes]);

  // Recalculate target date whenever preset or custom changes
  useEffect(() => {
    const today = dayjs();
    let target = today;

    switch (selectedPreset) {
      case "3_DAYS":
        target = today.add(3, "day");
        break;
      case "7_DAYS":
        target = today.add(7, "day");
        break;
      case "15_DAYS":
        target = today.add(15, "day");
        break;
      case "1_MONTH":
        target = today.add(1, "month");
        break;
      case "3_MONTHS":
        target = today.add(3, "month");
        break;
      case "6_MONTHS":
        target = today.add(6, "month");
        break;
      case "CUSTOM_DAYS":
        target = today.add(customDays || 1, "day");
        break;
      case "CUSTOM_DATE":
        if (customDate && customDate.isValid()) {
          target = customDate;
        } else {
          target = today.add(7, "day");
        }
        break;
    }

    setCalculatedDate(target.format("YYYY-MM-DD"));
  }, [selectedPreset, customDays, customDate]);

  const handlePresetChange = (val: PresetType) => {
    setSelectedPreset(val);
    if (val === "3_DAYS") setNote("৩ দিন পর পোস্ট-অপ ড্রেসিং ও পর্যবেক্ষণ");
    else if (val === "7_DAYS") setNote("৭ দিন পর সেলাই কাটা ও আরোগ্য মূল্যায়ন");
    else if (val === "15_DAYS") setNote("১৫ দিন পর রুট ক্যানেল ২য় সেশন / ক্যাপ ট্রায়াল");
    else if (val === "1_MONTH") setNote("১ মাস পর ফিলিং / স্থায়ী ক্যাপ স্থায়িত্ব চেক");
    else if (val === "3_MONTHS") setNote("৩ মাস পর ইমপ্ল্যান্ট ইন্টিগ্রেশন / অর্থো টাইটিং");
    else if (val === "6_MONTHS") setNote("৬ মাস পর নিয়মিত রুটিন চেকআপ ও ডিপ স্কেলিং");
  };

  const handleConfirm = () => {
    onSave({
      patientId,
      nextRecallDate: calculatedDate,
      note: note || "ফলো-আপের জন্য ডাকা হয়েছে।",
      status: "SCHEDULED",
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[var(--antd-text)]">
          <CalendarOutlined style={{ color: "#1677ff" }} />
          <span>পরবর্তী ফলো-আপ / রিকল শিডিউল নির্ধারণ</span>
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          বাতিল
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<CheckCircleOutlined />}
          loading={loading}
          onClick={handleConfirm}
          style={{ background: "#1677ff" }}
        >
          শিডিউল সংরক্ষণ করুন
        </Button>,
      ]}
      centered
      width={540}
    >
      <div className="py-2 space-y-4 text-xs">
        {/* Patient identity strip */}
        <div className="p-3 rounded-xl bg-[var(--antd-primary-bg)] border border-[var(--antd-primary-border)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--antd-text-secondary)] block">রোগীর নাম:</span>
            <Text strong className="text-sm text-[var(--antd-text)]">{patientName}</Text>
          </div>
          <Tag color="blue" className="font-mono font-bold text-xs">{patientId}</Tag>
        </div>

        {/* Preset Selector */}
        <div className="space-y-2">
          <label className="font-bold text-[var(--antd-text)] block">
            ডাক্তারের সিদ্ধান্ত অনুযায়ী ফলো-আপের সময় নির্বাচন করুন:
          </label>
          <Radio.Group
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <Radio value="3_DAYS" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>৩ দিন পর</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">ড্রেসিং / জরুরি পর্যবেক্ষণ</span>
              </div>
            </Radio>

            <Radio value="7_DAYS" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>৭ দিন পর (১ সপ্তাহ)</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">সেলাই কাটা / ওষুধ চেক</span>
              </div>
            </Radio>

            <Radio value="15_DAYS" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>১৫ দিন পর (২ সপ্তাহ)</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">RCT সেশন ২ / ক্যাপ ট্রায়াল</span>
              </div>
            </Radio>

            <Radio value="1_MONTH" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>১ মাস পর</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">ক্যাপ ফিক্সিং / ফিলিং চেক</span>
              </div>
            </Radio>

            <Radio value="3_MONTHS" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>৩ মাস পর</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">ইমপ্ল্যান্ট বা ব্রেসেস ফলো-আপ</span>
              </div>
            </Radio>

            <Radio value="6_MONTHS" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>৬ মাস পর</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">রুটিন স্কেলিং ও ফুল মাউথ ওপিডি</span>
              </div>
            </Radio>

            <Radio value="CUSTOM_DAYS" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>কাস্টম দিন লিখুন</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">ডাক্তার নির্দিষ্ট দিন বসাবেন</span>
              </div>
            </Radio>

            <Radio value="CUSTOM_DATE" className="p-2.5 rounded-lg border border-[var(--antd-border-split)] hover:border-[var(--antd-primary)] transition-all">
              <div>
                <strong>নির্দিষ্ট ক্যালেন্ডার তারিখ</strong>
                <span className="block text-[11px] text-[var(--antd-text-tertiary)]">ক্যালেন্ডার থেকে বাছাই</span>
              </div>
            </Radio>
          </Radio.Group>
        </div>

        {/* Custom Days Input */}
        {selectedPreset === "CUSTOM_DAYS" && (
          <div className="p-3 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] flex items-center justify-between">
            <div>
              <span className="font-bold text-[var(--antd-text)] block">কত দিন পর আসবেন?</span>
              <span className="text-[11px] text-[var(--antd-text-secondary)]">আজকের পর থেকে দিন গণনা হবে</span>
            </div>
            <div className="flex items-center gap-1.5">
              <InputNumber
                min={1}
                max={730}
                value={customDays}
                onChange={(val) => setCustomDays(val || 1)}
                className="w-24 font-bold"
              />
              <span className="font-semibold text-[var(--antd-text-secondary)]">দিন</span>
            </div>
          </div>
        )}

        {/* Custom Date Picker */}
        {selectedPreset === "CUSTOM_DATE" && (
          <div className="p-3 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] space-y-1.5">
            <span className="font-bold text-[var(--antd-text)] block">ক্যালেন্ডার থেকে দিন নির্বাচন করুন:</span>
            <DatePicker
              value={customDate}
              onChange={(val) => setCustomDate(val)}
              disabledDate={(current) => current && current < dayjs().endOf("day")}
              className="w-full"
              placeholder="তারিখ নির্বাচন করুন"
            />
          </div>
        )}

        {/* Follow-up Note */}
        <div className="space-y-1.5">
          <label className="font-semibold text-[var(--antd-text)] block">
            ফলো-আপের কারণ বা ডাক্তারের নির্দেশনা (নোট):
          </label>
          <Input
            placeholder="যেমন: ক্যাপের মাপ নেওয়া হবে, সেলাই কাটা হবে ইত্যাদি"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Live Date Preview Box */}
        <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)]/80 border border-[var(--antd-border-split)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--antd-text-secondary)] block">নির্ধারিত ফলো-আপ তারিখ:</span>
            <span className="text-sm font-extrabold text-[var(--antd-primary)] flex items-center gap-1 mt-0.5">
              <ClockCircleOutlined />
              {calculatedDate}
            </span>
          </div>
          <Tag color="cyan" className="font-bold text-xs py-0.5 px-2">
            {dayjs(calculatedDate).diff(dayjs(), "day")} দিন বাকি
          </Tag>
        </div>
      </div>
    </Modal>
  );
};
