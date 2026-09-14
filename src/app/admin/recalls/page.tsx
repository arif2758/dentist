"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  App,
  Modal,
  Input,
  Alert,
  Segmented,
} from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { PatientRecord } from "@/lib/types";
import { RecallScheduleModal } from "@/components/dental/RecallScheduleModal";

const { Text } = Typography;
const { TextArea } = Input;

type ExtendedPatientRecord = PatientRecord & { diffDays?: number };

export default function AdminRecallCenter() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [selectedPatient, setSelectedPatient] = useState<ExtendedPatientRecord | null>(null);
  const [callNote, setCallNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reschedulePatient, setReschedulePatient] = useState<ExtendedPatientRecord | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const [tabFilter, setTabFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all scheduled recall patients
  const { data, isLoading, refetch, isFetching } = useQuery<{
    success: boolean;
    data: ExtendedPatientRecord[];
  }>({
    queryKey: ["allRecalls"],
    queryFn: async () => {
      const res = await fetch("/api/patients?recalls=true");
      return res.json();
    },
  });

  const allRecalls = data?.data || [];

  // Mutation to update recall status or reschedule
  const updateMutation = useMutation({
    mutationFn: async (payload: {
      patientId: string;
      status: string;
      note?: string;
      nextRecallDate?: string;
    }) => {
      const res = await fetch("/api/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allRecalls"] });
      queryClient.invalidateQueries({ queryKey: ["allPatients"] });
      message.success("ফলো-আপ তথ্য সফলভাবে আপডেট করা হয়েছে!");
      setIsModalOpen(false);
      setCallNote("");
    },
    onError: () => {
      message.error("আপডেট করা সম্ভব হয়নি।");
    },
  });

  const handleSendWhatsApp = (patient: ExtendedPatientRecord) => {
    const lastVisit = patient.visits[0];
    const treatment = lastVisit ? lastVisit.treatmentName : "ডেন্টাল";
    const diffDays = patient.diffDays ?? 0;

    let timingText = `আগামী ${patient.nextRecallDate} তারিখে (${diffDays} দিন পর)`;
    if (diffDays === 0) {
      timingText = "আজকে";
    } else if (diffDays < 0) {
      timingText = `নির্ধারিত তারিখের চেয়ে ${Math.abs(diffDays)} দিন পার হয়ে গেছে`;
    }

    const msg = `আসসালামু আলাইকুম ${patient.patientName} সাহেব/ম্যাডাম, ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার থেকে জানাচ্ছি। আপনার পূর্বে সম্পন্নকৃত "${treatment}" চিকিৎসার ফলো-আপের নির্ধারিত সময় ${timingText}। দাঁতের সুস্থতা ও দীর্ঘস্থায়ী সুরক্ষায় অনুগ্রহ করে চেম্বারে এসে ফলো-আপ চেকআপ সম্পন্ন করার অনুরোধ রইলো। প্রয়োজনে কল করুন: +8801700000000। ধন্যবাদ।`;

    const url = `https://wa.me/88${patient.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleOpenContactModal = (patient: ExtendedPatientRecord) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleSaveContactLog = () => {
    if (!selectedPatient) return;
    updateMutation.mutate({
      patientId: selectedPatient.id,
      status: "CONTACTED",
      note: callNote || "স্টাফ রোগীকে কল করে ফলো-আপের কথা মনে করিয়ে দিয়েছেন।",
    });
  };

  const handleSaveReschedule = async (payload: {
    patientId: string;
    nextRecallDate: string;
    note: string;
    status: "SCHEDULED" | "OVERDUE" | "CONTACTED" | "PENDING";
  }) => {
    updateMutation.mutate({
      patientId: payload.patientId,
      status: "SCHEDULED",
      note: payload.note,
      nextRecallDate: payload.nextRecallDate,
    });
    setIsRescheduleOpen(false);
  };

  // Counts for tabs
  const upcomingCount = allRecalls.filter((p) => (p.diffDays ?? 0) > 0).length;
  const todayCount = allRecalls.filter((p) => (p.diffDays ?? 0) === 0).length;
  const overdueCount = allRecalls.filter((p) => (p.diffDays ?? 0) < 0).length;

  // Filter list by tab & search
  const filteredList = allRecalls.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    if (q) {
      const matches =
        p.patientName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.id.toLowerCase().includes(q);
      if (!matches) return false;
    }

    const diff = p.diffDays ?? 0;
    if (tabFilter === "TODAY") return diff === 0;
    if (tabFilter === "UPCOMING") return diff > 0;
    if (tabFilter === "OVERDUE") return diff < 0;
    return true;
  });

  const columns = [
    {
      title: "রোগীর নাম ও মোবাইল",
      dataIndex: "patientName",
      key: "patientName",
      render: (name: string, record: ExtendedPatientRecord) => (
        <div>
          <div className="flex items-center gap-1.5">
            <Text strong style={{ fontSize: 13 }}>
              {name}
            </Text>
            <Tag color="blue" className="text-[10px] font-mono m-0">
              {record.id}
            </Tag>
          </div>
          <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 600 }}>
            📞 {record.phone}
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            রক্তের গ্রুপ: {record.bloodGroup} • বয়স: {record.age}
          </div>
        </div>
      ),
    },
    {
      title: "চিকিৎসা ও পর্যবেক্ষণ",
      key: "treatment",
      render: (_: any, record: ExtendedPatientRecord) => {
        const lastVisit = record.visits[0];
        return (
          <div>
            <Text strong style={{ fontSize: 12 }}>
              {lastVisit?.treatmentName || "ডেন্টাল ফলো-আপ"}
            </Text>
            {record.recallNotes && (
              <div style={{ fontSize: 11, color: "#1677ff", marginTop: 2 }}>
                নির্দেশনা: {record.recallNotes}
              </div>
            )}
            {lastVisit?.date && (
              <div style={{ fontSize: 11, color: "#64748b" }}>
                সর্বশেষ চিকিৎসা: {lastVisit.date}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "নির্ধারিত ফলো-আপ শিডিউল",
      dataIndex: "nextRecallDate",
      key: "nextRecallDate",
      render: (date: string, record: ExtendedPatientRecord) => {
        const diff = record.diffDays ?? 0;
        let badge = null;

        if (diff === 0) {
          badge = (
            <Tag color="gold" icon={<ClockCircleOutlined />} className="font-bold">
              আজকে আসার কথা
            </Tag>
          );
        } else if (diff > 0) {
          badge = (
            <Tag color="green" icon={<CalendarOutlined />} className="font-semibold">
              {diff} দিন বাকি (আসন্ন)
            </Tag>
          );
        } else {
          badge = (
            <Tag color="error" icon={<ExclamationCircleOutlined />} className="font-semibold">
              {Math.abs(diff)} দিন অতিক্রান্ত
            </Tag>
          );
        }

        return (
          <div>
            {badge}
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
              নির্ধারিত তারিখ: <strong>{date}</strong>
            </div>
          </div>
        );
      },
    },
    {
      title: "স্ট্যাটাস",
      dataIndex: "recallStatus",
      key: "recallStatus",
      render: (status: string) => (
        <div>
          {status === "CONTACTED" ? (
            <Tag color="cyan">যোগাযোগ সম্পন্ন</Tag>
          ) : status === "OVERDUE" ? (
            <Tag color="red">আসেননি (Overdue)</Tag>
          ) : (
            <Tag color="blue">শিডিউল সক্রিয়</Tag>
          )}
        </div>
      ),
    },
    {
      title: "অ্যাকশন",
      key: "actions",
      width: 250,
      render: (_: any, record: ExtendedPatientRecord) => (
        <Space orientation="vertical" size="small" style={{ width: "100%" }}>
          <Button
            type="primary"
            size="small"
            style={{ background: "#25D366", borderColor: "#25D366" }}
            icon={<MessageOutlined />}
            block
            onClick={() => handleSendWhatsApp(record)}
          >
            WhatsApp রিমাইন্ডার
          </Button>

          <Space size="small" wrap>
            <Button
              size="small"
              icon={<PhoneOutlined />}
              href={`tel:${record.phone}`}
            >
              কল
            </Button>
            <Button
              size="small"
              type="dashed"
              icon={<CheckCircleOutlined />}
              onClick={() => handleOpenContactModal(record)}
            >
              লগ
            </Button>
            <Button
              size="small"
              type="primary"
              style={{ background: "#1677ff" }}
              icon={<CalendarOutlined />}
              onClick={() => {
                setReschedulePatient(record);
                setIsRescheduleOpen(true);
              }}
            >
              নতুন তারিখ
            </Button>
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{ maxWidth: 1200, margin: "0 auto" }}
      className="w-full space-y-4"
    >
      {/* Explanation Banner */}
      <div className="mb-4 sm:mb-5">
        <Alert
          title="রোগীর ফলো-আপ ও রিকল সেন্টার"
          description="যেসব রোগীর জন্য ডাক্তার পরবর্তী ফলো-আপের শিডিউল নির্ধারণ করেছেন, তাদের তালিকা এখানে নিকটবর্তী তারিখ অনুযায়ী স্বয়ংক্রিয়ভাবে সাজানো রয়েছে (যার তারিখ যত কাছে তার নাম সবার উপরে)।"
          type="info"
          showIcon
          className="shadow-xs"
        />
      </div>

      {/* Top Filter & Search Bar */}
      <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Scrollable Segmented for mobile to prevent overflow */}
          <div className="overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0 -mx-1 px-1">
            <Segmented
              value={tabFilter}
              onChange={(val) => setTabFilter(val as string)}
              options={[
                { label: `সব শিডিউল (${allRecalls.length})`, value: "ALL" },
                { label: `আজকে (${todayCount})`, value: "TODAY" },
                { label: `আসন্ন (${upcomingCount})`, value: "UPCOMING" },
                { label: `সময় পার হয়েছে (${overdueCount})`, value: "OVERDUE" },
              ]}
              className="text-xs font-semibold whitespace-nowrap shrink-0"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
              prefix={<SearchOutlined style={{ color: "#1677ff" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="flex-1 sm:w-64 text-xs h-8"
            />
            <Button
              size="small"
              icon={<SyncOutlined spin={isFetching} />}
              onClick={() => refetch()}
              className="h-8 shrink-0 text-xs px-2.5"
            >
              রিফ্রেশ
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile View: High-Touch Cards (< lg) */}
      <div className="block lg:!hidden space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--antd-text-secondary)] bg-[var(--antd-bg-container)] rounded-xl border border-[var(--antd-border-split)]">
            কোনো ফলো-আপ শিডিউল পাওয়া যায়নি
          </div>
        ) : (
          filteredList.map((patient) => {
            const diff = patient.diffDays ?? 0;
            return (
              <div
                key={patient.id}
                className="p-3.5 rounded-xl border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] space-y-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Text strong style={{ fontSize: 14 }}>
                        {patient.patientName}
                      </Text>
                      <Tag color="blue" className="text-[10px] font-mono m-0">
                        {patient.id}
                      </Tag>
                    </div>
                    <div className="text-xs text-[var(--antd-primary)] font-bold mt-0.5">
                      📞 {patient.phone}
                    </div>
                  </div>

                  <div>
                    {diff === 0 ? (
                      <Tag color="gold" className="m-0 text-[10px] font-bold">
                        আজকে
                      </Tag>
                    ) : diff > 0 ? (
                      <Tag color="green" className="m-0 text-[10px] font-bold">
                        {diff} দিন বাকি
                      </Tag>
                    ) : (
                      <Tag color="error" className="m-0 text-[10px] font-bold">
                        {Math.abs(diff)} দিন অতিক্রান্ত
                      </Tag>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] text-xs space-y-1">
                  <div className="flex items-center justify-between font-medium text-[var(--antd-text)]">
                    <span>তারিখ: {patient.nextRecallDate}</span>
                    <span className="text-[10px] text-[var(--antd-text-secondary)]">
                      {patient.recallStatus === "CONTACTED" ? "যোগাযোগ হয়েছে" : "অপেক্ষমাণ"}
                    </span>
                  </div>
                  {patient.recallNotes && (
                    <p className="text-[11px] text-[var(--antd-primary)] m-0 truncate">
                      নোট: {patient.recallNotes}
                    </p>
                  )}
                </div>

                {/* Mobile Action Bar */}
                <div className="pt-2 border-t border-[var(--antd-border-split)] space-y-2">
                  <Button
                    type="primary"
                    size="middle"
                    style={{ background: "#25D366", borderColor: "#25D366" }}
                    icon={<MessageOutlined />}
                    block
                    className="font-bold text-xs"
                    onClick={() => handleSendWhatsApp(patient)}
                  >
                    WhatsApp এ রিমাইন্ডার পাঠান
                  </Button>

                  <div className="grid grid-cols-3 gap-1.5">
                    <Button
                      size="small"
                      icon={<PhoneOutlined />}
                      href={`tel:${patient.phone}`}
                      className="text-xs font-semibold"
                      block
                    >
                      কল
                    </Button>
                    <Button
                      size="small"
                      type="dashed"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleOpenContactModal(patient)}
                      className="text-xs"
                      block
                    >
                      লগ
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#1677ff" }}
                      icon={<CalendarOutlined />}
                      onClick={() => {
                        setReschedulePatient(patient);
                        setIsRescheduleOpen(true);
                      }}
                      className="text-xs"
                      block
                    >
                      নতুন তারিখ
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop View: Ant Design Card with Table (>= lg) */}
      <div className="hidden lg:!block">
        <Card
          className="rounded-2xl border border-[var(--antd-border-split)] shadow-xs overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          <Table
            dataSource={filteredList}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            locale={{ emptyText: "কোনো ফলো-আপ শিডিউল পাওয়া যায়নি।" }}
          />
        </Card>
      </div>

      {/* Contact Logging Modal */}
      <Modal
        title="যোগাযোগ লগ ও রোগীর প্রতিক্রিয়া সংরক্ষণ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveContactLog}
        okText="লগ সংরক্ষণ করুন"
        cancelText="বাতিল"
        confirmLoading={updateMutation.isPending}
      >
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: 14 }}>
            {selectedPatient?.patientName}
          </Text>
          <div style={{ fontSize: 12, color: "#1e40af" }}>
            📞 {selectedPatient?.phone}
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              display: "block",
              marginBottom: 4,
            }}
          >
            কথোপকথনের নোট বা রোগীর প্রতিক্রিয়া:
          </label>
          <TextArea
            rows={3}
            placeholder="যেমন: রোগীকে কল করা হয়েছিল, উনি সামনের বৃহস্পতিবার বিকাল ৬টায় আসার প্রতিশ্রুতি দিয়েছেন..."
            value={callNote}
            onChange={(e) => setCallNote(e.target.value)}
          />
        </div>
      </Modal>

      {/* Reschedule Modal */}
      {reschedulePatient && (
        <RecallScheduleModal
          open={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          patientId={reschedulePatient.id}
          patientName={reschedulePatient.patientName}
          currentRecallDate={reschedulePatient.nextRecallDate}
          currentRecallNotes={reschedulePatient.recallNotes}
          onSave={handleSaveReschedule}
          loading={updateMutation.isPending}
        />
      )}
    </div>
  );
}
