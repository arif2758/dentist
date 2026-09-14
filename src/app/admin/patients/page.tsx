"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  Table,
  Tag,
  Button,
  Typography,
  Input,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PatientRecord } from "@/lib/types";

const { Text } = Typography;

export default function AdminPatients() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<{ success: boolean; data: PatientRecord[] }>({
    queryKey: ["allPatients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      return res.json();
    },
  });

  const allPatients = data?.data || [];

  const filteredPatients = allPatients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.patientName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });


  const columns = [
    {
      title: "রোগীর আইডি",
      dataIndex: "id",
      key: "id",
      width: 110,
      render: (id: string) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: "নাম ও পরিচয়",
      dataIndex: "patientName",
      key: "patientName",
      render: (name: string, record: PatientRecord) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            {record.gender}, {record.age} বছর • রক্তের গ্রুপ: {record.bloodGroup}
          </div>
        </div>
      ),
    },
    {
      title: "মোবাইল",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "মেডিক্যাল সতর্কতা (Alerts)",
      dataIndex: "medicalAlerts",
      key: "medicalAlerts",
      render: (alerts: string[]) => (
        <div>
          {alerts.length > 0 ? (
            alerts.map((a, i) => (
              <Tag color="volcano" key={i}>
                {a}
              </Tag>
            ))
          ) : (
            <span style={{ fontSize: 12, color: "#94a3b8" }}>কোনো এলার্জি নেই</span>
          )}
        </div>
      ),
    },
    {
      title: "সর্বশেষ ভিজিট",
      dataIndex: "lastVisitDate",
      key: "lastVisitDate",
      width: 130,
    },
    {
      title: "মোট ভিজিট",
      key: "visitsCount",
      width: 100,
      render: (_: any, record: PatientRecord) => (
        <Tag color="cyan">{record.visits.length} বার</Tag>
      ),
    },
    {
      title: "অ্যাকশন",
      key: "action",
      width: 130,
      render: (_: any, record: PatientRecord) => (
        <Link href={`/admin/patients/${record.id}`}>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            style={{ background: "#1677ff" }}
          >
            হিস্ট্রি দেখুন
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="w-full overflow-hidden space-y-3">
      {/* Top Search & Filter Bar */}
      <div className="bg-[var(--antd-bg-container)] border border-[var(--antd-border-split)] rounded-xl p-3 sm:p-4 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[var(--antd-text)]">
              রোগীর ইলেকট্রনিক হেলথ রেকর্ড (EHR)
            </h1>
            <p className="text-[11px] text-[var(--antd-text-secondary)]">
              মোট নিবন্ধিত রোগী: {filteredPatients.length} জন
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="নাম, মোবাইল বা আইডি লিখুন..."
              prefix={<SearchOutlined style={{ color: "#1677ff" }} />}
              value={search}
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Mobile View: Standalone Patient Cards (< lg) */}
      <div className="block lg:!hidden space-y-2.5">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--antd-text-secondary)] bg-[var(--antd-bg-container)] rounded-xl border border-[var(--antd-border-split)]">
            কোনো রোগী পাওয়া যায়নি
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="p-3.5 rounded-xl border border-[var(--antd-border-split)] bg-[var(--antd-bg-container)] space-y-2 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Tag color="blue" style={{ margin: 0, fontSize: 10, fontWeight: "bold" }}>
                    {patient.id}
                  </Tag>
                  <div>
                    <Text strong style={{ fontSize: 13 }}>{patient.patientName}</Text>
                    <div className="text-[11px] text-[var(--antd-text-secondary)]">
                      {patient.gender}, {patient.age} বছর • রক্তের গ্রুপ: <strong className="text-rose-500">{patient.bloodGroup}</strong>
                    </div>
                  </div>
                </div>

                <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>
                  {patient.visits.length} ভিজিট
                </Tag>
              </div>

              {/* Medical Alert tags */}
              {patient.medicalAlerts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {patient.medicalAlerts.map((alert, idx) => (
                    <Tag color="volcano" key={idx} style={{ margin: 0, fontSize: 10 }}>
                      ⚠️ {alert}
                    </Tag>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-[var(--antd-border-split)] flex items-center justify-between text-xs">
                <Link href={`tel:${patient.phone}`} className="text-[var(--antd-primary)] font-semibold text-xs">
                  📞 {patient.phone}
                </Link>
                <Link href={`/admin/patients/${patient.id}`}>
                  <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    style={{ background: "#1677ff", fontSize: 11 }}
                  >
                    হিস্ট্রি দেখুন
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Ant Design Table (>= lg) */}
      <div className="!hidden lg:!block">
        <Card>
          <div className="overflow-x-auto">
            <Table
              dataSource={filteredPatients}
              columns={columns}
              rowKey="id"
              loading={isLoading}
              pagination={{ pageSize: 8 }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
