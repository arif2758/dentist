"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Patient, IPatientVisit } from "@/models/Patient";
import { ActionResponse, PatientRecord, ToothCondition } from "@/types";

export async function getPatientByPhoneOrIdAction(
  query: string
): Promise<ActionResponse<PatientRecord | null>> {
  try {
    await connectDB();
    const cleanQuery = query.trim();

    const patient = await Patient.findOne({
      $or: [{ phone: cleanQuery }, { patientId: cleanQuery }],
    }).lean();

    if (!patient) {
      return {
        success: false,
        message: "রোগীর তথ্য পাওয়া যায়নি।",
        data: null,
      };
    }

    const formatted: PatientRecord = {
      id: patient.patientId,
      patientName: patient.patientName,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      medicalAlerts: patient.medicalAlerts || [],
      toothConditions: patient.toothConditions
        ? Object.fromEntries(
            (patient.toothConditions instanceof Map
              ? Array.from(patient.toothConditions.entries())
              : Object.entries(patient.toothConditions)
            ).map(([k, v]) => [
              Number(k),
              v as { condition: ToothCondition; note?: string; updatedAt?: string },
            ])
          )
        : {},
      visits: (patient.visits || []).map((v: IPatientVisit) => ({
        id: v.id,
        date: v.date,
        treatmentName: v.treatmentName,
        toothNumbers: v.toothNumbers,
        diagnosis: v.diagnosis,
        prescription: v.prescription,
        doctorNotes: v.doctorNotes,
        cost: v.cost,
      })),
      lastVisitDate: patient.lastVisitDate,
      nextRecallDate: patient.nextRecallDate,
      recallStatus: patient.recallStatus,
      recallNotes: patient.recallNotes,
      createdAt: patient.createdAt ? new Date(patient.createdAt).toISOString() : undefined,
    };

    return {
      success: true,
      message: "রোগীর রেকর্ড পাওয়া গেছে।",
      data: formatted,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "তথ্য লোড করতে ত্রুটি হয়েছে।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function addPatientVisitAction(
  patientId: string,
  visit: {
    treatmentName: string;
    toothNumbers: string[];
    diagnosis: string;
    prescription: string[];
    doctorNotes: string;
    nextRecallMonths?: number;
  }
): Promise<ActionResponse> {
  try {
    await connectDB();

    const dateToday = new Date().toISOString().split("T")[0];
    const newVisitId = `VST-${Date.now().toString().slice(-5)}`;

    const newVisit: IPatientVisit = {
      id: newVisitId,
      date: dateToday,
      treatmentName: visit.treatmentName,
      toothNumbers: visit.toothNumbers,
      diagnosis: visit.diagnosis,
      prescription: visit.prescription,
      doctorNotes: visit.doctorNotes,
      cost: 0,
    };

    // Calculate 6-month recall
    const recallDate = new Date();
    recallDate.setMonth(recallDate.getMonth() + (visit.nextRecallMonths || 6));
    const nextRecallStr = recallDate.toISOString().split("T")[0];

    const updated = await Patient.findOneAndUpdate(
      { patientId },
      {
        $push: { visits: { $each: [newVisit], $position: 0 } },
        $set: {
          lastVisitDate: dateToday,
          nextRecallDate: nextRecallStr,
          recallStatus: "SCHEDULED",
        },
      },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "রোগীর রেকর্ড পাওয়া যায়নি।" };
    }

    revalidatePath(`/admin/patients/${patientId}`);
    revalidatePath("/admin/patients");
    revalidatePath("/patient-history");

    return {
      success: true,
      message: "নতুন প্রেসক্রিপশন ও ভিজিট রেকর্ড সফলভাবে সেভ হয়েছে!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "ভিজিট রেকর্ড সেভ করা যায়নি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateToothConditionAction(
  patientId: string,
  toothNumber: number,
  condition: ToothCondition,
  note?: string
): Promise<ActionResponse> {
  try {
    await connectDB();

    const key = `toothConditions.${toothNumber}`;
    await Patient.findOneAndUpdate(
      { patientId },
      {
        $set: {
          [key]: {
            condition,
            note: note || "",
            updatedAt: new Date().toISOString(),
          },
        },
      }
    );

    revalidatePath(`/admin/patients/${patientId}`);
    return {
      success: true,
      message: `দাঁত #${toothNumber} এর অবস্থা সংরক্ষিত হয়েছে।`,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "টুথ চার্ট আপডেট করা যায়নি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
