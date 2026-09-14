"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Tag, Button, Space, Spin, Empty, App } from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  PhoneOutlined,
  MessageOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { PatientRecord } from "@/lib/types";
import { ToothChart, ToothCondition } from "@/components/dental/ToothChart";
import { RecallScheduleModal } from "@/components/dental/RecallScheduleModal";

export default function AdminPatientDetailPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;

  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [isSavingRecall, setIsSavingRecall] = useState(false);

  const { data, isLoading, error } = useQuery<{
    success: boolean;
    data: PatientRecord;
  }>({
    queryKey: ["adminPatientDetail", patientId],
    queryFn: async () => {
      const res = await fetch(
        `/api/patients?id=${encodeURIComponent(patientId)}`,
      );
      return res.json();
    },
    enabled: !!patientId,
  });

  const patient = data?.data;

  const handleSaveRecall = async (payload: {
    patientId: string;
    nextRecallDate: string;
    note: string;
    status: "SCHEDULED" | "OVERDUE" | "CONTACTED" | "PENDING";
  }) => {
    try {
      setIsSavingRecall(true);
      const res = await fetch("/api/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        message.success("ফলো-আপ শিডিউল সফলভাবে আপডেট করা হয়েছে!");
        queryClient.invalidateQueries({ queryKey: ["adminPatientDetail", patientId] });
        queryClient.invalidateQueries({ queryKey: ["allPatients"] });
        queryClient.invalidateQueries({ queryKey: ["overdueRecalls"] });
        setIsRecallModalOpen(false);
      } else {
        message.error(json.message || "শিডিউল আপডেট ব্যর্থ হয়েছে");
      }
    } catch {
      message.error("সার্ভার ত্রুটি");
    } finally {
      setIsSavingRecall(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!patient) return;
    const lastVisit = patient.visits[0];
    const treatment = lastVisit ? lastVisit.treatmentName : "ডেন্টাল চিকিৎসা";
    const msg = `আসসালামু আলাইকুম ${patient.patientName} সাহেব/ম্যাডাম, ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার থেকে আপনার ডিজিটাল স্বাস্থ্য রেকর্ড ও ফলো-আপের তথ্য পাঠাচ্ছি। চিকিৎসার ধরন: ${treatment}। প্রয়োজনে কল করুন: +8801700000000। ধন্যবাদ।`;
    const url = `https://wa.me/88${patient.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spin size="large" />
        <span className="text-xs text-[var(--antd-text-secondary)] font-medium">
          রোগীর ডিজিটাল রেকর্ড লোড হচ্ছে...
        </span>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <Empty description="রোগীর কোনো রেকর্ড পাওয়া যায়নি অথবা আইডিটি সঠিক নয়।" />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/admin/patients")}
          className="mt-4"
        >
          রোগীদের তালিকায় ফিরে যান
        </Button>
      </div>
    );
  }

  const isOverdue = patient.recallStatus === "OVERDUE";

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12 w-full overflow-hidden">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--antd-border-split)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push("/admin/patients")}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] text-[var(--antd-text-secondary)] hover:text-[var(--antd-primary)] hover:border-[var(--antd-primary)] transition-colors active:scale-95 shrink-0"
            aria-label="তালিকায় ফিরে যান"
          >
            <ArrowLeftOutlined style={{ fontSize: 13 }} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[var(--antd-text)] m-0 leading-tight">
                {patient.patientName}
              </h1>
              <Tag
                color="blue"
                style={{ margin: 0, fontSize: 11, fontWeight: "bold" }}
              >
                {patient.id}
              </Tag>
            </div>
            <p className="text-[11px] text-[var(--antd-text-secondary)] mt-0.5">
              ইলেকট্রনিক হেলথ রেকর্ড (EHR) ও চিকিৎসা ইতিহাস
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            icon={<PrinterOutlined />}
            size="middle"
            onClick={() => window.print()}
            className="text-xs font-semibold"
          >
            প্রিন্ট
          </Button>

          <Button
            icon={<MessageOutlined />}
            size="middle"
            onClick={handleSendWhatsApp}
            className="text-xs font-semibold"
            style={{ color: "#25D366", borderColor: "#25D366" }}
          >
            WhatsApp
          </Button>

          <Button
            type="primary"
            icon={<PhoneOutlined />}
            href={`tel:${patient.phone}`}
            size="middle"
            className="text-xs font-bold"
            style={{ background: "#1677ff" }}
          >
            কল দিন
          </Button>
        </div>
      </div>

      {/* 2. Top Profile & Medical Passport Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] shadow-xs space-y-4">
        {/* Main Demographics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1677ff] to-[#0958d9] text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
              {patient.patientName.slice(0, 2)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-xl font-extrabold text-[var(--antd-text)]">
                  {patient.patientName}
                </span>
                <Tag
                  color="red"
                  style={{ margin: 0, fontWeight: "bold", fontSize: 11 }}
                >
                  রক্তের গ্রুপ: {patient.bloodGroup}
                </Tag>
                {isOverdue ? (
                  <Tag
                    color="error"
                    style={{ margin: 0, fontWeight: "bold", fontSize: 11 }}
                  >
                    ফলো-আপ ওভারডিউ
                  </Tag>
                ) : (
                  <Tag
                    color="success"
                    style={{ margin: 0, fontWeight: "bold", fontSize: 11 }}
                  >
                    ফলো-আপ শিডিউলড
                  </Tag>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--antd-text-secondary)] flex-wrap">
                <span>
                  বয়স:{" "}
                  <strong className="text-[var(--antd-text)]">
                    {patient.age} বছর
                  </strong>
                </span>
                <span>•</span>
                <span>
                  লিঙ্গ:{" "}
                  <strong className="text-[var(--antd-text)]">
                    {patient.gender === "Male"
                      ? "পুরুষ"
                      : patient.gender === "Female"
                        ? "মহিলা"
                        : patient.gender}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  মোবাইল:{" "}
                  <a
                    href={`tel:${patient.phone}`}
                    className="text-[var(--antd-primary)] font-bold"
                  >
                    {patient.phone}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Recall Status Box */}
          <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] sm:text-right min-w-[220px] shrink-0 space-y-1.5">
            <span className="text-[11px] text-[var(--antd-text-tertiary)] block">
              পরবর্তী ফলো-আপ / রিকল শিডিউল
            </span>
            <span className="text-sm font-extrabold text-[var(--antd-text)] flex items-center sm:justify-end gap-1.5">
              <CalendarOutlined
                style={{ color: isOverdue ? "#ff4d4f" : "#1677ff" }}
              />
              {patient.nextRecallDate || "নির্ধারিত নেই"}
            </span>
            {patient.recallNotes && (
              <span className="text-[11px] text-[var(--antd-text-secondary)] block truncate max-w-[210px]">
                নোট: {patient.recallNotes}
              </span>
            )}
            <span className="text-[11px] text-[var(--antd-text-tertiary)] block">
              সর্বশেষ চিকিৎসা: {patient.lastVisitDate}
            </span>
            <div className="pt-1">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{ background: "#1677ff", fontSize: 11 }}
                onClick={() => setIsRecallModalOpen(true)}
              >
                ফলো-আপ শিডিউল নির্ধারণ
              </Button>
            </div>
          </div>
        </div>

        {/* Medical Doctor Alerts Bar */}
        {patient.medicalAlerts.length > 0 ? (
          <div className="p-3 rounded-xl bg-[var(--antd-error-bg)]/80 border border-[var(--antd-error-border)] flex items-start gap-2 text-xs">
            <WarningOutlined
              style={{ color: "#ff4d4f", fontSize: 14, marginTop: 1 }}
            />
            <div>
              <strong className="text-[var(--antd-error)] block">
                মেডিক্যাল অ্যালার্ট ও সতর্কতা:
              </strong>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {patient.medicalAlerts.map((alert, idx) => (
                  <Tag
                    color="volcano"
                    key={idx}
                    style={{ margin: 0, fontSize: 11, fontWeight: 600 }}
                  >
                    ⚠️ {alert}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] flex items-center gap-2 text-xs text-[var(--antd-text-secondary)]">
            <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
            <span>
              রোগীর কোনো বিশেষ স্বাস্থ্য ঝুঁকি বা মেডিকেল অ্যালার্ট নেই।
            </span>
          </div>
        )}
      </div>

      {/* 2.5 Interactive Dental Tooth Chart */}
      <div className="space-y-2">
        <ToothChart
          initialConditions={(() => {
            const conds: Record<number, { condition: ToothCondition; note?: string }> = {};
            patient.visits.forEach((v) => {
              v.toothNumbers.forEach((tStr) => {
                const num = parseInt(tStr.replace(/[^0-9]/g, ""), 10);
                if (!isNaN(num) && num >= 11 && num <= 48) {
                  let cond: ToothCondition = "CARIES";
                  if (v.treatmentName.includes("রুট ক্যানেল") || v.treatmentName.includes("RCT")) cond = "RCT";
                  else if (v.treatmentName.includes("ক্যাপ") || v.treatmentName.includes("ক্রাউন")) cond = "CROWN";
                  else if (v.treatmentName.includes("তোলা") || v.treatmentName.includes("Extraction")) cond = "MISSING";
                  conds[num] = {
                    condition: cond,
                    note: `${v.treatmentName} (${v.date})`,
                  };
                }
              });
            });
            return conds;
          })()}
        />
      </div>

      {/* 3. Clinical Timeline & Prescription History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[var(--antd-text)] m-0 flex items-center gap-1.5">
              <MedicineBoxOutlined style={{ color: "#1677ff" }} />
              পূর্ববর্তী চিকিৎসা ও প্রেসক্রিপশন হিস্ট্রি
            </h2>
            <span className="text-xs text-[var(--antd-text-tertiary)] font-semibold">
              ({patient.visits.length} টি ভিজিট)
            </span>
          </div>
        </div>

        {patient.visits.length === 0 ? (
          <div className="p-8 text-center bg-[var(--antd-bg-container)] rounded-2xl border border-[var(--antd-border-split)] text-xs text-[var(--antd-text-secondary)]">
            কোনো পূর্ববর্তী চিকিৎসা রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="space-y-3">
            {patient.visits.map((visit, index) => (
              <div
                key={visit.id}
                className="p-4 sm:p-5 rounded-2xl border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] shadow-xs space-y-3.5 transition-all hover:border-[var(--antd-primary)]/40"
              >
                {/* Visit Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--antd-border-split)] gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] font-black text-xs flex items-center justify-center border border-[var(--antd-primary-border)] shrink-0">
                      #{patient.visits.length - index}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-[var(--antd-text)] m-0">
                          {visit.treatmentName}
                        </h3>
                        <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>
                          চিকিৎসা সম্পন্ন
                        </Tag>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--antd-text-secondary)] mt-0.5">
                        <ClockCircleOutlined style={{ fontSize: 10 }} />
                        <span>
                          ভিজিটের তারিখ:{" "}
                          <strong className="text-[var(--antd-text)]">
                            {visit.date}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tooth Numbers Badge */}
                  <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
                    <span className="text-[11px] text-[var(--antd-text-tertiary)] font-medium">
                      আক্রান্ত দাঁত:
                    </span>
                    {visit.toothNumbers.map((t, idx) => (
                      <Tag
                        key={idx}
                        color="blue"
                        style={{ margin: 0, fontWeight: "bold", fontSize: 11 }}
                      >
                        দাঁত #{t}
                      </Tag>
                    ))}
                  </div>
                </div>

                {/* Clinical Notes & Diagnosis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] space-y-1">
                    <span className="font-bold text-[var(--antd-text)] flex items-center gap-1.5 text-[11px]">
                      <FileTextOutlined style={{ color: "#1677ff" }} />{" "}
                      ডায়াগনোসিস
                    </span>
                    <p className="text-[12px] text-[var(--antd-text-secondary)] leading-relaxed m-0">
                      {visit.diagnosis}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] space-y-1">
                    <span className="font-bold text-[var(--antd-text)] flex items-center gap-1.5 text-[11px]">
                      <UserOutlined style={{ color: "#52c41a" }} /> ডাক্তারের
                      পর্যবেক্ষণ ও নোট
                    </span>
                    <p className="text-[12px] text-[var(--antd-text-secondary)] leading-relaxed m-0">
                      {visit.doctorNotes}
                    </p>
                  </div>
                </div>

                {/* Prescription Box */}
                {visit.prescription.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[var(--antd-text)] flex items-center gap-1.5">
                        <MedicineBoxOutlined style={{ color: "#1677ff" }} />
                        প্রেসক্রিপশনকৃত ঔষধ ও নির্দেশনা
                      </span>
                      <span className="text-[10px] text-[var(--antd-text-tertiary)] font-semibold">
                        ডিজিটাল ই-প্রেসক্রিপশন
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {visit.prescription.map((rx, rxIdx) => (
                        <div
                          key={rxIdx}
                          className="p-2.5 rounded-lg bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] flex items-start gap-2 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {rxIdx + 1}
                          </span>
                          <span className="text-[var(--antd-text)] font-medium leading-tight">
                            {rx}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {patient && (
        <RecallScheduleModal
          open={isRecallModalOpen}
          onClose={() => setIsRecallModalOpen(false)}
          patientId={patient.id}
          patientName={patient.patientName}
          currentRecallDate={patient.nextRecallDate}
          currentRecallNotes={patient.recallNotes}
          onSave={handleSaveRecall}
          loading={isSavingRecall}
        />
      )}
    </div>
  );
}
