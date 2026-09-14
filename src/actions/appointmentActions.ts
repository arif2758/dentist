"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { Patient } from "@/models/Patient";
import { QueueModel } from "@/models/Queue";
import { generatePatientId } from "@/lib/patientId";
import { clinicStore } from "@/lib/store";

export async function createAppointmentAction(
  prevState: unknown,
  formData: FormData
) {
  try {
    const patientName = (formData.get("patientName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const age = Number(formData.get("age")) || 25;
    const gender = (formData.get("gender") as "Male" | "Female" | "Other") || "Male";
    const serviceType = (formData.get("serviceType") as string)?.trim();
    const appointmentDate =
      (formData.get("appointmentDate") as string)?.trim() ||
      new Date().toISOString().split("T")[0];
    const timeSlot = (formData.get("timeSlot") as string)?.trim();
    const notes = (formData.get("notes") as string)?.trim() || "";

    if (!patientName || !phone || !serviceType || !timeSlot) {
      return {
        success: false,
        error: "দয়া করে আপনার নাম, মোবাইল নম্বর, সেবা এবং সময় নির্বাচন করুন।",
      };
    }

    try {
      await connectDB();

      // 1. Fast indexed seek for the highest token number for the date
      const lastAppointment = await Appointment.findOne({ appointmentDate })
        .sort({ tokenNumber: -1 })
        .select("tokenNumber")
        .lean();

      const nextTokenNumber = (lastAppointment?.tokenNumber || 0) + 1;
      const appointmentId = `APT-${Date.now().toString().slice(-6)}`;

      // 2. Prepare concurrent database promises
      const appointmentPromise = Appointment.create({
        appointmentId,
        tokenNumber: nextTokenNumber,
        patientName,
        phone,
        age,
        gender,
        serviceType,
        appointmentDate,
        timeSlot,
        status: "WAITING",
        notes,
      });

      // 3. Concurrent QueueModel update (no need for countDocuments since nextTokenNumber is known)
      const queuePromise = QueueModel.findOneAndUpdate(
        { queueId: "main_opd_queue" },
        { totalTokensToday: nextTokenNumber, lastUpdated: new Date() },
        { upsert: true }
      );

      // 4. Concurrent Patient record check & update/create
      const patientPromise = (async () => {
        const existingPatient = await Patient.findOne({ phone }).select("lastVisitDate");
        if (!existingPatient) {
          const patientId = await generatePatientId(new Date(appointmentDate));
          return Patient.create({
            patientId,
            patientName,
            phone,
            age,
            gender,
            bloodGroup: "O+",
            medicalAlerts: [],
            toothConditions: {},
            visits: [],
            lastVisitDate: appointmentDate,
            nextRecallDate: "",
            recallStatus: "SCHEDULED",
          });
        } else {
          existingPatient.lastVisitDate = appointmentDate;
          return existingPatient.save();
        }
      })();

      // 5. Execute all DB writes in parallel for lightning-fast latency
      const [created] = await Promise.all([
        appointmentPromise,
        queuePromise,
        patientPromise,
      ]);

      // Synchronize in-memory fallback store
      clinicStore.bookAppointment({
        patientName,
        phone,
        age,
        gender,
        serviceType,
        appointmentDate,
        timeSlot,
        notes,
      });

      // Revalidate only essential active pages to minimize serverless response latency
      revalidatePath("/admin");
      revalidatePath("/live-queue");

      return {
        success: true,
        data: {
          id: created.appointmentId,
          tokenNumber: created.tokenNumber,
          patientName: created.patientName,
          phone: created.phone,
          age: created.age,
          gender: created.gender,
          serviceType: created.serviceType,
          appointmentDate: created.appointmentDate,
          timeSlot: created.timeSlot,
          status: created.status,
          notes: created.notes,
          createdAt: created.createdAt.toISOString(),
        },
        message: `অভিনন্দন! আপনার সিরিয়াল টোকেন নং #${created.tokenNumber} সফলভাবে বুক হয়েছে।`,
      };
    } catch (dbErr: unknown) {
      console.warn("MongoDB connection issue during booking, falling back to store:", dbErr);
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
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "সিরিয়াল বুকিং সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।";
    return {
      success: false,
      error: message,
    };
  }
}
