"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  message,
  Switch,
  Typography,
  Popconfirm,
  Badge,
} from "antd";
import {
  SoundOutlined,
  ForwardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Appointment, QueueState } from "@/lib/types";

const { Title, Text } = Typography;

export default function AdminQueueDesk() {
  const queryClient = useQueryClient();
  const [callingSound, setCallingSound] = useState(false);

  // TanStack Query for real-time queue
  const { data, isLoading } = useQuery<{ success: boolean; data: QueueState }>({
    queryKey: ["adminQueue"],
    queryFn: async () => {
      const res = await fetch("/api/queue");
      return res.json();
    },
    refetchInterval: 4000,
  });

  const queue = data?.data;
  const currentToken = queue?.currentlyServingToken ?? 4;
  const activeList = queue?.activeQueueList ?? [];
  const servingPatient = activeList.find((a) => a.tokenNumber === currentToken && a.status === "SERVING");
  const waitingPatients = activeList.filter((a) => a.status === "WAITING");

  // Mutation to update queue actions
  const queueMutation = useMutation({
    mutationFn: async (payload: { action: string; tokenNumber?: number; inChamber?: boolean }) => {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminQueue"] });
      queryClient.invalidateQueries({ queryKey: ["liveQueue"] });
      queryClient.invalidateQueries({ queryKey: ["queueStatus"] });
      message.success("সিরিয়াল স্ট্যাটাস সফলভাবে আপডেট হয়েছে!");
    },
    onError: () => {
      message.error("অ্যাকশন সম্পন্ন করা যায়নি।");
    },
  });

  const handleNext = () => {
    queueMutation.mutate({ action: "next" });
  };

  const handleSkip = (tokenNum: number) => {
    queueMutation.mutate({ action: "skip", tokenNumber: tokenNum });
  };

  const handleRecall = (tokenNum: number) => {
    queueMutation.mutate({ action: "recall", tokenNumber: tokenNum });
  };

  const handleToggleChamber = (checked: boolean) => {
    queueMutation.mutate({ action: "setDoctorStatus", inChamber: checked });
  };

  const columns = [
    {
      title: "টোকেন",
      dataIndex: "tokenNumber",
      key: "tokenNumber",
      width: 90,
      render: (token: number, record: Appointment) => (
        <span
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: record.status === "SERVING" ? "#1e40af" : "inherit",
          }}
        >
          #{token}
        </span>
      ),
    },
    {
      title: "রোগীর নাম",
      dataIndex: "patientName",
      key: "patientName",
      render: (name: string, record: Appointment) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            {record.gender}, {record.age} বছর • {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "চিকিৎসার ধরন",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "টাইম স্লট",
      dataIndex: "timeSlot",
      key: "timeSlot",
      width: 170,
    },
    {
      title: "স্ট্যাটাস",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        if (status === "SERVING") return <Tag color="processing">চলমান (Serving)</Tag>;
        if (status === "COMPLETED") return <Tag color="success">সম্পন্ন</Tag>;
        if (status === "WAITING") return <Tag color="warning">অপেক্ষমাণ</Tag>;
        return <Tag color="default">বাতিল</Tag>;
      },
    },
    {
      title: "অ্যাকশন",
      key: "action",
      width: 150,
      render: (_: any, record: Appointment) => (
        <Space orientation="horizontal" size="small">
          {record.status === "WAITING" && (
            <Button
              size="small"
              type="primary"
              style={{ background: "#1e40af" }}
              onClick={() => handleRecall(record.tokenNumber)}
            >
              এখন ডাকুন
            </Button>
          )}
          {record.status === "SERVING" && (
            <Popconfirm
              title="সিরিয়াল সম্পন্ন হিসেবে মার্ক করবেন?"
              onConfirm={handleNext}
              okText="হ্যাঁ"
              cancelText="না"
            >
              <Button size="small" type="primary" icon={<CheckCircleOutlined />}>
                সম্পন্ন
              </Button>
            </Popconfirm>
          )}
          {record.status === "WAITING" && (
            <Popconfirm
              title="রোগী অনুপস্থিত হিসেবে বাতিল করবেন?"
              onConfirm={() => handleSkip(record.tokenNumber)}
              okText="হ্যাঁ"
              cancelText="না"
            >
              <Button size="small" danger icon={<CloseCircleOutlined />}>
                স্কিপ
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="w-full overflow-hidden space-y-4">
      {/* Top Controller Bar */}
      <Row gutter={[{ xs: 0, sm: 12 }, 12]}>
        
        {/* Card 1: Currently In Consultation */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <Badge status="processing" color="#10b981" />
                <span style={{ fontWeight: 700, fontSize: 14 }}>চেম্বার রুমে চলমান রোগী</span>
              </Space>
            }
            extra={
              <Space size="small">
                <span className="hidden sm:inline" style={{ fontSize: 12, color: "#64748b" }}>ডাক্তার চেম্বারে:</span>
                <Switch
                  checked={queue?.isDoctorInChamber ?? true}
                  onChange={handleToggleChamber}
                  checkedChildren="উপস্থিত"
                  unCheckedChildren="বিরতি"
                  size="small"
                />
              </Space>
            }
            style={{
              borderColor: "#1677ff",
              boxShadow: "0 2px 10px rgba(22,119,255,0.08)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--antd-border-split)]">
              <div>
                <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
                  বর্তমান টোকেন নম্বর
                </span>
                <div style={{ fontSize: 44, fontWeight: 900, color: "#1677ff", lineHeight: 1.1 }}>
                  #{currentToken}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Text strong style={{ fontSize: 15 }}>
                    {servingPatient ? servingPatient.patientName : "কোনো রোগী ভেতরে নেই"}
                  </Text>
                  {servingPatient && (
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {servingPatient.serviceType} • {servingPatient.gender}, {servingPatient.age} বছর
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons to Advance Queue: Big and Thumb-Friendly */}
              <div className="flex flex-col sm:w-auto w-full gap-2 shrink-0">
                <Button
                  type="primary"
                  size="large"
                  icon={<ForwardOutlined />}
                  onClick={handleNext}
                  loading={queueMutation.isPending}
                  className="w-full sm:w-auto font-bold text-sm h-11"
                  style={{
                    background: "linear-gradient(135deg, #1677ff, #0958d9)",
                    boxShadow: "0 2px 8px rgba(22,119,255,0.3)",
                  }}
                >
                  পরবর্তী রোগী ডাকুন (Next)
                </Button>

                {servingPatient && (
                  <Popconfirm
                    title="এই রোগীকে অনুপস্থিত হিসেবে স্কিপ করবেন?"
                    onConfirm={() => handleSkip(currentToken)}
                    okText="হ্যাঁ"
                    cancelText="না"
                  >
                    <Button danger size="middle" icon={<CloseCircleOutlined />} className="w-full sm:w-auto text-xs">
                      রোগী স্কিপ করুন
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 text-xs text-[var(--antd-text-secondary)]">
              <span>স্লট: <strong className="text-[var(--antd-text)]">{servingPatient?.timeSlot || "N/A"}</strong></span>
              {servingPatient?.phone ? (
                <Link href={`tel:${servingPatient.phone}`} className="text-[var(--antd-primary)] font-semibold hover:underline">
                  কল: {servingPatient.phone}
                </Link>
              ) : (
                <span>মোবাইল: N/A</span>
              )}
            </div>
          </Card>
        </Col>

        {/* Card 2: Queue Stats */}
        <Col xs={24} lg={10}>
          <Card title={<span style={{ fontSize: 14, fontWeight: 700 }}>আজকের ওপিডি সারসংক্ষেপ</span>}>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-layout)]/60 text-center border border-[var(--antd-border-split)]">
                  <span className="text-[11px] text-[var(--antd-text-secondary)] block">মোট বুকিং</span>
                  <span className="text-xl font-extrabold text-[var(--antd-primary)]">
                    {queue?.totalTokensToday ?? activeList.length}
                  </span>
                </div>
              </Col>
              <Col span={8}>
                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-layout)]/60 text-center border border-[var(--antd-border-split)]">
                  <span className="text-[11px] text-[var(--antd-text-secondary)] block">অপেক্ষমাণ</span>
                  <span className="text-xl font-extrabold text-amber-500">
                    {waitingPatients.length}
                  </span>
                </div>
              </Col>
              <Col span={8}>
                <div className="p-2.5 rounded-lg bg-[var(--antd-bg-layout)]/60 text-center border border-[var(--antd-border-split)]">
                  <span className="text-[11px] text-[var(--antd-text-secondary)] block">সম্পন্ন</span>
                  <span className="text-xl font-extrabold text-emerald-500">
                    {activeList.filter((a) => a.status === "COMPLETED").length}
                  </span>
                </div>
              </Col>
            </Row>

            <div className="mt-3 p-2.5 rounded-lg bg-[var(--antd-bg-layout)] border border-[var(--antd-border-split)] flex items-center justify-between">
              <div>
                <Text strong style={{ fontSize: 12 }}>টিভি ডিসপ্লে মোড সক্রিয়</Text>
                <div style={{ fontSize: 10, color: "#64748b" }}>ওয়েটিং রুমে লাইভ স্ক্রিন চলছে</div>
              </div>
              <Button href="/display" target="_blank" size="small" type="dashed" style={{ fontSize: 11 }}>
                টিভি ভিউ ↗
              </Button>
            </div>
          </Card>
        </Col>

      </Row>

      {/* Mobile View: Standalone Section Header + High-Touch Cards (< lg) */}
      <div className="block lg:!hidden space-y-3">
        {/* Clean Standalone Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--antd-text)] m-0">
              আজকের সিরিয়াল
            </h2>
            <span className="text-xs text-[var(--antd-text-tertiary)] font-semibold">
              ({activeList.length} জন)
            </span>
          </div>

          <Button
            icon={<SyncOutlined spin={isLoading} />}
            size="small"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminQueue"] })}
            style={{ fontSize: 11 }}
          >
            রিফ্রেশ
          </Button>
        </div>

        {/* Standalone Full-Width Patient Cards List */}
        <div className="space-y-2.5">
          {activeList.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--antd-text-secondary)] bg-[var(--antd-bg-container)] rounded-xl border border-[var(--antd-border-split)]">
              কোনো সিরিয়াল নেই
            </div>
          ) : (
            [...activeList].reverse().map((apt) => {
              const isCurrent = apt.tokenNumber === currentToken && apt.status === "SERVING";
              return (
                <div
                  key={apt.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-[var(--antd-color-success-bg)]/50 border-[var(--antd-color-success-border)] shadow-xs"
                      : apt.status === "COMPLETED"
                      ? "bg-[var(--antd-bg-layout)]/30 border-[var(--antd-border-split)] opacity-75"
                      : "bg-[var(--antd-bg-container)] border-[var(--antd-border-split)] shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--antd-border-split)] gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                        isCurrent
                          ? "bg-[var(--antd-color-success)] text-white"
                          : "bg-[var(--antd-primary-bg)] text-[var(--antd-primary)] border border-[var(--antd-primary-border)]"
                      }`}>
                        #{apt.tokenNumber}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[var(--antd-text)] leading-tight">{apt.patientName}</p>
                        <p className="text-[11px] text-[var(--antd-text-secondary)] mt-0.5">
                          {apt.gender}, {apt.age} বছর • <Link href={`tel:${apt.phone}`} className="text-[var(--antd-primary)] font-medium">{apt.phone}</Link>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {apt.status === "SERVING" ? (
                        <Tag color="processing" style={{ margin: 0, fontSize: 10 }}>চলমান</Tag>
                      ) : apt.status === "COMPLETED" ? (
                        <Tag color="success" style={{ margin: 0, fontSize: 10 }}>সম্পন্ন</Tag>
                      ) : (
                        <Tag color="warning" style={{ margin: 0, fontSize: 10 }}>অপেক্ষমাণ</Tag>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[var(--antd-text-secondary)] gap-2">
                    <span className="font-medium text-[var(--antd-text)] truncate">{apt.serviceType}</span>
                    <span className="font-mono text-[11px] font-semibold text-[var(--antd-text-tertiary)] shrink-0">{apt.timeSlot}</span>
                  </div>

                  {/* Contextual Action Buttons */}
                  {(apt.status === "WAITING" || apt.status === "SERVING") && (
                    <div className="pt-2.5 mt-2 border-t border-[var(--antd-border-split)] flex items-center gap-2">
                      {apt.status === "WAITING" && (
                        <>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleRecall(apt.tokenNumber)}
                            className="flex-1 font-semibold text-xs h-8"
                            style={{ background: "#1677ff" }}
                          >
                            এখন ডাকুন
                          </Button>
                          <Popconfirm
                            title="রোগীকে স্কিপ করবেন?"
                            onConfirm={() => handleSkip(apt.tokenNumber)}
                            okText="হ্যাঁ"
                            cancelText="না"
                          >
                            <Button danger size="small" className="text-xs h-8">
                              স্কিপ
                            </Button>
                          </Popconfirm>
                        </>
                      )}
                      {apt.status === "SERVING" && (
                        <Popconfirm
                          title="চিকিৎসা সম্পন্ন হয়েছে?"
                          onConfirm={handleNext}
                          okText="হ্যাঁ"
                          cancelText="না"
                        >
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            className="w-full font-bold text-xs h-8"
                            style={{ background: "#10b981", borderColor: "#10b981" }}
                          >
                            চিকিৎসা সম্পন্ন মার্ক করুন
                          </Button>
                        </Popconfirm>
                      )}
                    </div>
                  )}
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
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, fontWeight: 700 }}>আজকের সিরিয়াল</span>
              <Button
                icon={<SyncOutlined spin={isLoading} />}
                size="small"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["adminQueue"] })}
              >
                রিফ্রেশ
              </Button>
            </div>
          }
        >
          <Table
            dataSource={activeList}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            loading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
}
