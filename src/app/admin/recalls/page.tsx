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
  message,
  Modal,
  Input,
  Alert,
  Tooltip,
} from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { PatientRecord } from "@/lib/types";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AdminRecallCenter() {
  const queryClient = useQueryClient();
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null,
  );
  const [callNote, setCallNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch overdue patients
  const { data, isLoading } = useQuery<{
    success: boolean;
    data: PatientRecord[];
  }>({
    queryKey: ["overdueRecalls"],
    queryFn: async () => {
      const res = await fetch("/api/patients?overdue=true");
      return res.json();
    },
  });

  const overdueList = data?.data || [];

  // Mutation to update recall status
  const updateMutation = useMutation({
    mutationFn: async (payload: {
      patientId: string;
      status: string;
      note?: string;
    }) => {
      const res = await fetch("/api/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overdueRecalls"] });
      message.success("ফলো-আপ স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!");
      setIsModalOpen(false);
      setCallNote("");
    },
    onError: () => {
      message.error("স্ট্যাটাস আপডেট করা সম্ভব হয়নি।");
    },
  });

  const handleSendWhatsApp = (patient: PatientRecord) => {
    const lastVisit = patient.visits[0];
    const treatment = lastVisit ? lastVisit.treatmentName : "ডেন্টাল";
    const msg = `আসসালামু আলাইকুম ${patient.patientName} সাহেব/ম্যাডাম, ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার থেকে জানাচ্ছি। আপনার পূর্বে সম্পন্নকৃত "${treatment}" চিকিৎসার নিয়মিত ৬ মাসের ফলো-আপ ও রুটিন চেকআপের সময় পার হয়ে গেছে। আপনার দাঁতের দীর্ঘস্থায়ী সুরক্ষায় অনুগ্রহ করে সুবিধাজনক সময়ে চেম্বারে এসে চেকআপ সম্পন্ন করুন। ধন্যবাদ।`;

    const url = `https://wa.me/88${patient.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleOpenContactModal = (patient: PatientRecord) => {
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

  const columns = [
    {
      title: "রোগীর নাম ও মোবাইল",
      dataIndex: "patientName",
      key: "patientName",
      render: (name: string, record: PatientRecord) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>
            {name}
          </Text>
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
      title: "পূর্বের চিকিৎসা ও দাঁত",
      key: "treatment",
      render: (_: any, record: PatientRecord) => {
        const lastVisit = record.visits[0];
        if (!lastVisit) return <Text type="secondary">রেকর্ড নেই</Text>;
        return (
          <div>
            <Text strong>{lastVisit.treatmentName}</Text>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              তারিখ: {lastVisit.date} ({lastVisit.toothNumbers.join(", ")})
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              ডাক্তারের নোট: {lastVisit.doctorNotes}
            </div>
          </div>
        );
      },
    },
    {
      title: "ফলো-আপ শিডিউল",
      dataIndex: "nextRecallDate",
      key: "nextRecallDate",
      render: (date: string) => (
        <div>
          <Tag color="error" icon={<ExclamationCircleOutlined />}>
            ৭+ মাস অতিক্রান্ত
          </Tag>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            নির্ধারিত ছিল: {date}
          </div>
        </div>
      ),
    },
    {
      title: "স্ট্যাটাস",
      dataIndex: "recallStatus",
      key: "recallStatus",
      render: (status: string, record: PatientRecord) => (
        <div>
          {status === "OVERDUE" && <Tag color="red">রোগী আসেননি (Overdue)</Tag>}
          {status === "CONTACTED" && <Tag color="cyan">যোগাযোগ সম্পন্ন</Tag>}
          {record.recallNotes && (
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              নোট: {record.recallNotes}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "স্টাফ রিকল অ্যাকশন",
      key: "actions",
      width: 220,
      render: (_: any, record: PatientRecord) => (
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

          <Space size="small">
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
              কল লগ আপডেট
            </Button>
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{ maxWidth: 1200, margin: "0 auto" }}
      className="w-full overflow-hidden space-y-3"
    >
      {/* Explanation Banner */}
      <Alert
        title="৬-মাস রিকল ও ফলো-আপ ট্র্যাকিং সেন্টার"
        description="যেসব রোগীর রুট ক্যানেল, স্কেলিং বা সার্জারির পর ৬ মাস পার হয়ে গেছে কিন্তু আসেননি, তাদের তালিকা স্বয়ংক্রিয়ভাবে এখানে ফিল্টার হয়েছে। চেম্বার স্টাফরা এক ক্লিকেই হোয়াটসঅ্যাপ মেসেজ বা সরাসরি কল করে তাদের মনে করিয়ে দিতে পারবেন।"
        type="warning"
        showIcon
        style={{ marginBottom: 14 }}
      />

      {/* Mobile View: Standalone Section Header + High-Touch Cards (< lg) */}
      <div className="block lg:!hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--antd-text)] m-0">
              ওভারডিউ রোগী তালিকা
            </h2>
            <span className="text-xs text-[var(--antd-text-tertiary)] font-semibold">
              ({overdueList.length} জন)
            </span>
          </div>
          <Button
            icon={<SyncOutlined spin={isLoading} />}
            size="small"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["overdueRecalls"] })
            }
            style={{ fontSize: 11 }}
          >
            রিফ্রেশ
          </Button>
        </div>

        <div className="space-y-2.5">
          {overdueList.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--antd-text-secondary)] bg-[var(--antd-bg-container)] rounded-xl border border-[var(--antd-border-split)]">
              কোনো ওভারডিউ রোগী নেই
            </div>
          ) : (
            overdueList.map((patient) => {
              const lastVisit = patient.visits[0];
              return (
                <div
                  key={patient.id}
                  className="p-3.5 rounded-xl border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Text strong style={{ fontSize: 14 }}>
                          {patient.patientName}
                        </Text>
                        <Tag color="red" style={{ margin: 0, fontSize: 10 }}>
                          ৭+ মাস ওভারডিউ
                        </Tag>
                      </div>
                      <div className="text-xs text-[var(--antd-text-secondary)] mt-0.5">
                        রক্তের গ্রুপ:{" "}
                        <strong className="text-[var(--antd-text)]">
                          {patient.bloodGroup}
                        </strong>{" "}
                        • বয়স: {patient.age} বছর
                      </div>
                    </div>

                    <div className="text-right">
                      {patient.recallStatus === "CONTACTED" ? (
                        <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>
                          যোগাযোগ হয়েছে
                        </Tag>
                      ) : (
                        <Tag color="error" style={{ margin: 0, fontSize: 10 }}>
                          অপেক্ষমাণ
                        </Tag>
                      )}
                    </div>
                  </div>

                  {/* Treatment Info */}
                  <div className="p-2.5 rounded-lg bg-[var(--antd-bg-layout)]/60 border border-[var(--antd-border-split)] text-xs space-y-0.5">
                    <div className="flex items-center justify-between font-medium text-[var(--antd-text)]">
                      <span>
                        {lastVisit?.treatmentName || "ডেন্টাল চিকিৎসা"}
                      </span>
                      <span className="text-[10px] text-[var(--antd-text-tertiary)]">
                        {lastVisit?.date}
                      </span>
                    </div>
                    {lastVisit?.doctorNotes && (
                      <p className="text-[11px] text-[var(--antd-text-secondary)] truncate">
                        নোট: {lastVisit.doctorNotes}
                      </p>
                    )}
                  </div>

                  {/* One-Tap Mobile Action Bar */}
                  <div className="pt-2 border-t border-[var(--antd-border-split)] space-y-2">
                    <Button
                      type="primary"
                      size="middle"
                      style={{
                        background: "#25D366",
                        borderColor: "#25D366",
                        boxShadow: "0 2px 6px rgba(37,211,102,0.3)",
                      }}
                      icon={<MessageOutlined />}
                      block
                      className="font-bold text-xs"
                      onClick={() => handleSendWhatsApp(patient)}
                    >
                      WhatsApp এ রিমাইন্ডার পাঠান
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="small"
                        icon={<PhoneOutlined />}
                        href={`tel:${patient.phone}`}
                        className="text-xs font-semibold"
                        block
                      >
                        কল করুন
                      </Button>
                      <Button
                        size="small"
                        type="dashed"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleOpenContactModal(patient)}
                        className="text-xs"
                        block
                      >
                        লগ রাখুন
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Desktop View: Ant Design Card with Table (>= lg) */}
      <div className="!hidden lg:!block">
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                ওভারডিউ রোগী তালিকা ({overdueList.length} জন)
              </span>
              <Button
                icon={<SyncOutlined spin={isLoading} />}
                size="small"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["overdueRecalls"],
                  })
                }
              >
                রিফ্রেশ
              </Button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <Table
              dataSource={overdueList}
              columns={columns}
              rowKey="id"
              loading={isLoading}
              pagination={{ pageSize: 6 }}
            />
          </div>
        </Card>
      </div>

      {/* Staff Call Log Modal */}
      <Modal
        title={`ফলো-আপ যোগাযোগ লগ: ${selectedPatient?.patientName}`}
        open={isModalOpen}
        onOk={handleSaveContactLog}
        onCancel={() => setIsModalOpen(false)}
        okText="সংরক্ষণ করুন"
        cancelText="বাতিল"
        confirmLoading={updateMutation.isPending}
      >
        <div style={{ marginBottom: 12, fontSize: 13 }}>
          <p>
            <strong>রোগীর মোবাইল:</strong> {selectedPatient?.phone}
          </p>
          <p>
            <strong>পূর্বের চিকিৎসা:</strong>{" "}
            {selectedPatient?.visits[0]?.treatmentName}
          </p>
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
    </div>
  );
}
