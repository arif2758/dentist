"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { Patient } from "@/models/Patient";
import { ActionResponse, Appointment as AppointmentType, AppointmentStatus, Gender } from "@/types";

export interface BookAppointmentInput {
  patientName: string;
  phone: string;
  age: number;
  gender: Gender;
  serviceType: string;
  appointmentDate: string;
  timeSlot: string;
  notes?: string;
}

export async function bookAppointmentAction(
  input: BookAppointmentInput
): Promise<ActionResponse<AppointmentType>> {
  try {
    await connectDB();

    const todayStr = input.appointmentDate || new Date().toISOString().split("T")[0];

    // Find highest token for the day
    const lastAppointment = await Appointment.findOne({ appointmentDate: todayStr })
      .sort({ tokenNumber: -1 })
      .lean();

    const nextTokenNumber = (lastAppointment?.tokenNumber || 0) + 1;
    const appointmentId = `APT-${Date.now().toString().slice(-6)}`;

    const newAppointment = await Appointment.create({
      appointmentId,
      tokenNumber: nextTokenNumber,
      patientName: input.patientName,
      phone: input.phone,
      age: input.age,
      gender: input.gender || "Male",
      serviceType: input.serviceType,
      appointmentDate: todayStr,
      timeSlot: input.timeSlot,
      status: "WAITING",
      notes: input.notes || "",
    });

    // Also ensure or update Patient Record in DB
    const existingPatient = await Patient.findOne({ phone: input.phone });
    if (!existingPatient) {
      const patientId = `P-${Math.floor(100 + Math.random() * 900)}`;
      await Patient.create({
        patientId,
        patientName: input.patientName,
        phone: input.phone,
        age: input.age,
        gender: input.gender,
        bloodGroup: "O+",
        medicalAlerts: [],
        toothConditions: {},
        visits: [],
        lastVisitDate: todayStr,
        nextRecallDate: "",
        recallStatus: "SCHEDULED",
      });
    }

    revalidatePath("/live-queue");
    revalidatePath("/admin");
    revalidatePath("/display");

    return {
      success: true,
      message: `টোকেন #${nextTokenNumber} সফলভাবে নিশ্চিত করা হয়েছে!`,
      data: {
        id: newAppointment.appointmentId,
        tokenNumber: newAppointment.tokenNumber,
        patientName: newAppointment.patientName,
        phone: newAppointment.phone,
        age: newAppointment.age,
        gender: newAppointment.gender,
        serviceType: newAppointment.serviceType,
        appointmentDate: newAppointment.appointmentDate,
        timeSlot: newAppointment.timeSlot,
        status: newAppointment.status as AppointmentStatus,
        notes: newAppointment.notes,
        createdAt: newAppointment.createdAt.toISOString(),
      },
    };
  } catch (error: unknown) {
    console.error("Failed to book appointment:", error);
    return {
      success: false,
      message: "অ্যাপয়েন্টমেন্ট বুকিং সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AppointmentStatus
): Promise<ActionResponse> {
  try {
    await connectDB();

    const updated = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।" };
    }

    revalidatePath("/live-queue");
    revalidatePath("/admin");
    revalidatePath("/display");

    return {
      success: true,
      message: `স্ট্যাটাস পরিবর্তন করা হয়েছে: ${status}`,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "স্ট্যাটাস আপডেট করা যায়নি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
