"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { QueueModel } from "@/models/Queue";
import {
  ActionResponse,
  QueueState,
  Appointment as AppointmentType,
  AppointmentStatus,
  BreakReason,
} from "@/types";

export async function getQueueStateAction(): Promise<
  ActionResponse<QueueState>
> {
  try {
    await connectDB();

    const todayStr = new Date().toISOString().split("T")[0];

    // Find queue config
    let queueDoc = await QueueModel.findOne({ queueId: "main_opd_queue" });
    if (!queueDoc) {
      queueDoc = await QueueModel.create({
        queueId: "main_opd_queue",
        isDoctorInChamber: true,
        chamberName: "রুম #৪০২ (ডিজিটাল চেম্বার)",
        doctorName: "ডা. আসিফ চৌধুরী",
        currentlyServingToken: 1,
        totalTokensToday: 0,
        avgMinutesPerPatient: 20,
      });
    }

    // Find today's active appointments
    const appointments = await Appointment.find({
      appointmentDate: todayStr,
      status: { $in: ["WAITING", "SERVING"] },
    })
      .sort({ tokenNumber: 1 })
      .lean();

    const totalToday = await Appointment.countDocuments({
      appointmentDate: todayStr,
    });

    const activeList: AppointmentType[] = appointments.map((a) => ({
      id: a.appointmentId,
      tokenNumber: a.tokenNumber,
      patientName: a.patientName,
      phone: a.phone,
      age: a.age,
      gender: a.gender,
      serviceType: a.serviceType,
      appointmentDate: a.appointmentDate,
      timeSlot: a.timeSlot,
      status: a.status as AppointmentStatus,
      notes: a.notes,
      createdAt: a.createdAt
        ? new Date(a.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    const state: QueueState = {
      isDoctorInChamber: queueDoc.isDoctorInChamber,
      chamberName: queueDoc.chamberName,
      doctorName: queueDoc.doctorName,
      currentlyServingToken: queueDoc.currentlyServingToken,
      totalTokensToday: totalToday || queueDoc.totalTokensToday,
      avgMinutesPerPatient: queueDoc.avgMinutesPerPatient,
      activeQueueList: activeList,
      lastUpdated: queueDoc.lastUpdated
        ? new Date(queueDoc.lastUpdated).toISOString()
        : new Date().toISOString(),
    };

    return {
      success: true,
      message: "কিউ স্টেট লোড হয়েছে।",
      data: state,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "কিউ স্টেট লোড করতে ত্রুটি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function callNextPatientAction(): Promise<ActionResponse> {
  try {
    await connectDB();
    const todayStr = new Date().toISOString().split("T")[0];

    const queueDoc = await QueueModel.findOne({ queueId: "main_opd_queue" });
    const currentServing = queueDoc ? queueDoc.currentlyServingToken : 1;

    // Complete current serving
    await Appointment.updateMany(
      {
        appointmentDate: todayStr,
        tokenNumber: currentServing,
        status: "SERVING",
      },
      { status: "COMPLETED" },
    );

    // Find next waiting patient
    const nextPatient = await Appointment.findOne({
      appointmentDate: todayStr,
      status: "WAITING",
      tokenNumber: { $gt: currentServing },
    })
      .sort({ tokenNumber: 1 })
      .exec();

    const fallbackNext = nextPatient
      ? nextPatient.tokenNumber
      : await Appointment.findOne({
          appointmentDate: todayStr,
          status: "WAITING",
        })
          .sort({ tokenNumber: 1 })
          .then((p) => p?.tokenNumber ?? currentServing + 1);

    if (nextPatient) {
      nextPatient.status = "SERVING";
      await nextPatient.save();
    }

    await QueueModel.findOneAndUpdate(
      { queueId: "main_opd_queue" },
      { currentlyServingToken: fallbackNext, lastUpdated: new Date() },
      { upsert: true },
    );

    revalidatePath("/live-queue");
    revalidatePath("/admin");
    revalidatePath("/display");

    return {
      success: true,
      message: `টোকেন #${fallbackNext} ডাকা হয়েছে।`,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "পরবর্তী রোগী ডাকা সম্ভব হয়নি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function setDoctorStatusAction(
  inChamber: boolean,
): Promise<ActionResponse> {
  try {
    await connectDB();

    await QueueModel.findOneAndUpdate(
      { queueId: "main_opd_queue" },
      { isDoctorInChamber: inChamber, lastUpdated: new Date() },
      { upsert: true },
    );

    revalidatePath("/live-queue");
    revalidatePath("/admin");
    revalidatePath("/display");

    return {
      success: true,
      message: inChamber
        ? "ডক্টর চেম্বারে উপস্থিত আছেন।"
        : "ডক্টর সাময়িক বিরতিতে আছেন।",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "স্ট্যাটাস আপডেট করা যায়নি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function setChamberBreakAction(params: {
  isOnBreak: boolean;
  reason?: BreakReason;
  durationMinutes?: number;
  customText?: string;
}): Promise<ActionResponse> {
  try {
    await connectDB();

    const now = new Date();
    const duration = params.durationMinutes || 15;
    const resumeDate = new Date(now.getTime() + duration * 60 * 1000);

    const formatTime = (d: Date) => {
      let hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, "0")}:${mins} ${ampm}`;
    };

    const reasonMap: Record<BreakReason, string> = {
      PRAYER: "নামাজের বিরতি",
      TEA: "চা ও হালকা নাস্তার বিরতি",
      MEAL: "খাবার / ডিনারের বিরতি",
      COMPLEX_SURGERY: "জরুরি জটিল চিকিৎসা / ওটি চলছে",
      EMERGENCY: "জরুরি কেস পরিচালনা",
      OTHER: params.customText || "সাময়িক বিরতি",
    };

    const breakInfo = {
      isOnBreak: params.isOnBreak,
      reason: params.reason || "TEA",
      reasonText:
        params.customText ||
        (params.reason ? reasonMap[params.reason] : "সাময়িক বিরতি"),
      durationMinutes: duration,
      startedAt: params.isOnBreak ? formatTime(now) : "",
      expectedResumeTime: params.isOnBreak ? formatTime(resumeDate) : "",
    };

    await QueueModel.findOneAndUpdate(
      { queueId: "main_opd_queue" },
      {
        isDoctorInChamber: !params.isOnBreak,
        breakInfo,
        lastUpdated: new Date(),
      },
      { upsert: true },
    );

    revalidatePath("/live-queue");
    revalidatePath("/admin");
    revalidatePath("/display");

    return {
      success: true,
      message: params.isOnBreak
        ? `বিরতি চালু করা হয়েছে: ${breakInfo.reasonText} (প্রত্যাশিত শুরু: ${breakInfo.expectedResumeTime})`
        : "বিরতি শেষ করে চেম্বার পুনরায় চালু করা হয়েছে।",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "বিরতি আপডেট করা যায়নি।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
