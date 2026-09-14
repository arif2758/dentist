import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QueueModel } from "@/models/Queue";
import { Appointment } from "@/models/Appointment";
import { clinicStore } from "@/lib/store";
import {
  Appointment as AppointmentType,
  AppointmentStatus,
  QueueState,
  BreakReason,
} from "@/types";

export async function GET() {
  try {
    await connectDB();
    const todayStr = new Date().toISOString().split("T")[0];

    let queueDoc = await QueueModel.findOne({
      queueId: "main_opd_queue",
    }).lean();
    if (!queueDoc) {
      queueDoc = await QueueModel.create({
        queueId: "main_opd_queue",
        isDoctorInChamber: true,
        chamberName: "রুম #৪০২ (ডিজিটাল চেম্বার)",
        doctorName: "ডা. আসিফ চৌধুরী",
        currentlyServingToken: 4,
        totalTokensToday: 12,
        avgMinutesPerPatient: 20,
      });
    }

    const appointments = await Appointment.find({
      appointmentDate: todayStr,
    })
      .sort({ tokenNumber: 1 })
      .lean();

    const activeList: AppointmentType[] =
      appointments.length > 0
        ? appointments.map((a) => ({
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
          }))
        : clinicStore.getQueue().activeQueueList;

    const state: QueueState = {
      isDoctorInChamber: queueDoc.isDoctorInChamber,
      chamberName: queueDoc.chamberName,
      doctorName: queueDoc.doctorName,
      currentlyServingToken: queueDoc.currentlyServingToken,
      totalTokensToday: appointments.length || queueDoc.totalTokensToday,
      avgMinutesPerPatient: queueDoc.avgMinutesPerPatient,
      activeQueueList: activeList,
      breakInfo: queueDoc.breakInfo
        ? {
            isOnBreak: queueDoc.breakInfo.isOnBreak,
            reason: (queueDoc.breakInfo.reason || "TEA") as BreakReason,
            reasonText: queueDoc.breakInfo.reasonText,
            durationMinutes: queueDoc.breakInfo.durationMinutes,
            startedAt: queueDoc.breakInfo.startedAt,
            expectedResumeTime: queueDoc.breakInfo.expectedResumeTime,
          }
        : {
            isOnBreak: false,
            reason: "TEA" as BreakReason,
            reasonText: "",
            durationMinutes: 15,
            startedAt: "",
            expectedResumeTime: "",
          },
      lastUpdated: queueDoc.lastUpdated
        ? new Date(queueDoc.lastUpdated).toISOString()
        : new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: state });
  } catch (err) {
    console.warn("Falling back to clinicStore for queue:", err);
    const queue = clinicStore.getQueue();
    return NextResponse.json({ success: true, data: queue });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      tokenNumber,
      inChamber,
      isOnBreak,
      reason,
      durationMinutes,
      customText,
    } = body;

    let updatedQueue;
    if (action === "next") {
      updatedQueue = clinicStore.nextPatient();
    } else if (action === "skip" && typeof tokenNumber === "number") {
      updatedQueue = clinicStore.skipPatient(tokenNumber);
    } else if (action === "recall" && typeof tokenNumber === "number") {
      updatedQueue = clinicStore.recallPatient(tokenNumber);
    } else if (action === "setDoctorStatus" && typeof inChamber === "boolean") {
      updatedQueue = clinicStore.setDoctorStatus(inChamber);
    } else if (action === "setBreak") {
      updatedQueue = clinicStore.setBreak(
        isOnBreak,
        reason,
        durationMinutes || 15,
        customText,
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 },
      );
    }

    try {
      await connectDB();
      if (action === "next" || action === "skip" || action === "recall") {
        await QueueModel.findOneAndUpdate(
          { queueId: "main_opd_queue" },
          {
            currentlyServingToken: updatedQueue.currentlyServingToken,
            lastUpdated: new Date(),
          },
          { upsert: true },
        );
      } else if (
        action === "setDoctorStatus" &&
        typeof inChamber === "boolean"
      ) {
        await QueueModel.findOneAndUpdate(
          { queueId: "main_opd_queue" },
          { isDoctorInChamber: inChamber, lastUpdated: new Date() },
          { upsert: true },
        );
      } else if (action === "setBreak") {
        await QueueModel.findOneAndUpdate(
          { queueId: "main_opd_queue" },
          {
            isDoctorInChamber: !isOnBreak,
            breakInfo: updatedQueue.breakInfo,
            lastUpdated: new Date(),
          },
          { upsert: true },
        );
      }
    } catch {
      // Ignored if DB is in fallback
    }

    return NextResponse.json({ success: true, data: updatedQueue });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
