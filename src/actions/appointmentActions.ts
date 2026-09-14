"use server";

import { clinicStore } from "@/lib/store";
import { revalidatePath } from "next/cache";

export async function createAppointmentAction(prevState: any, formData: FormData) {
  try {
    const patientName = formData.get("patientName") as string;
    const phone = formData.get("phone") as string;
    const age = Number(formData.get("age")) || 25;
    const gender = (formData.get("gender") as 'Male' | 'Female' | 'Other') || 'Male';
    const serviceType = formData.get("serviceType") as string;
    const appointmentDate = (formData.get("appointmentDate") as string) || new Date().toISOString().split("T")[0];
    const timeSlot = formData.get("timeSlot") as string;
    const notes = (formData.get("notes") as string) || "";

    if (!patientName || !phone || !serviceType || !timeSlot) {
      return {
        success: false,
        error: "দয়া করে আপনার নাম, মোবাইল নম্বর, সেবা এবং সময় নির্বাচন করুন।",
      };
    }

    const result = clinicStore.bookAppointment({
      patientName,
      phone,
      age,
      gender,
      serviceType,
      appointmentDate,
      timeSlot,
      notes,
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      data: result.appointment,
      message: `অভিনন্দন! আপনার সিরিয়াল টোকেন নং #${result.appointment.tokenNumber} সফলভাবে বুক হয়েছে।`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "সিরিয়াল বুকিং সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।",
    };
  }
}
