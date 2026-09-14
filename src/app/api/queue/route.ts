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
        doctorName: "ডা. মো. আসিফুল হক",
        currentlyServingToken: 1,
        totalTokensToday: 0,
        avgMinutesPerPatient: 20,
      });
    }

    const appointments = await Appointment.find({
      appointmentDate: todayStr,
    })
      .sort({ tokenNumber: 1 })
      .lean();

    const totalToday = appointments.length;
    const currentServing = queueDoc.currentlyServingToken || 1;

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
      isDoctorInChamber: queueDoc.isDoctorInChamber ?? true,
      chamberName: queueDoc.chamberName || "রুম #৪০২ (ডিজিটাল চেম্বার)",
      doctorName: queueDoc.doctorName || "ডা. মো. আসিফুল হক",
      currentlyServingToken: currentServing,
      totalTokensToday: totalToday || queueDoc.totalTokensToday,
      avgMinutesPerPatient: queueDoc.avgMinutesPerPatient || 20,
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
    console.warn("MongoDB queue query error, using fallback:", err);
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

    await connectDB();
    const todayStr = new Date().toISOString().split("T")[0];

    const queueDoc = await QueueModel.findOne({ queueId: "main_opd_queue" });
    let currentServing = queueDoc ? queueDoc.currentlyServingToken : 1;

    if (action === "next") {
      // 1. Mark currently serving appointment as COMPLETED in MongoDB
      await Appointment.updateMany(
        {
          appointmentDate: todayStr,
          tokenNumber: currentServing,
          status: "SERVING",
        },
        { status: "COMPLETED" }
      );

      // 2. Find next WAITING appointment
      let nextPatient = await Appointment.findOne({
        appointmentDate: todayStr,
        status: "WAITING",
        tokenNumber: { $gt: currentServing },
      }).sort({ tokenNumber: 1 });

      if (!nextPatient) {
        // Wrap around to any waiting
        nextPatient = await Appointment.findOne({
          appointmentDate: todayStr,
          status: "WAITING",
        }).sort({ tokenNumber: 1 });
      }

      if (nextPatient) {
        nextPatient.status = "SERVING";
        await nextPatient.save();
        currentServing = nextPatient.tokenNumber;
      } else {
        currentServing += 1;
      }

      await QueueModel.findOneAndUpdate(
        { queueId: "main_opd_queue" },
        { currentlyServingToken: currentServing, lastUpdated: new Date() },
        { upsert: true }
      );
    } else if (action === "skip" && typeof tokenNumber === "number") {
      await Appointment.findOneAndUpdate(
        { appointmentDate: todayStr, tokenNumber },
        { status: "WAITING" }
      );

      // Find next patient
      const nextPatient = await Appointment.findOne({
        appointmentDate: todayStr,
        status: "WAITING",
        tokenNumber: { $ne: tokenNumber },
      }).sort({ tokenNumber: 1 });

      if (nextPatient) {
        nextPatient.status = "SERVING";
        await nextPatient.save();
        currentServing = nextPatient.tokenNumber;

        await QueueModel.findOneAndUpdate(
          { queueId: "main_opd_queue" },
          { currentlyServingToken: currentServing, lastUpdated: new Date() },
          { upsert: true }
        );
      }
    } else if (action === "recall" && typeof tokenNumber === "number") {
      // Un-complete or recall patient
      await Appointment.updateMany(
        { appointmentDate: todayStr, status: "SERVING" },
        { status: "COMPLETED" }
      );

      await Appointment.findOneAndUpdate(
        { appointmentDate: todayStr, tokenNumber },
        { status: "SERVING" }
      );

      currentServing = tokenNumber;
      await QueueModel.findOneAndUpdate(
        { queueId: "main_opd_queue" },
        { currentlyServingToken: currentServing, lastUpdated: new Date() },
        { upsert: true }
      );
    } else if (action === "setDoctorStatus" && typeof inChamber === "boolean") {
      await QueueModel.findOneAndUpdate(
        { queueId: "main_opd_queue" },
        { isDoctorInChamber: inChamber, lastUpdated: new Date() },
        { upsert: true }
      );
    } else if (action === "setBreak") {
      const now = new Date();
      const resumeMinutes = durationMinutes || 15;
      const resumeDate = new Date(now.getTime() + resumeMinutes * 60000);
      const expectedResumeTime = resumeDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const breakInfo = {
        isOnBreak: Boolean(isOnBreak),
        reason: reason || "TEA",
        reasonText: customText || "",
        durationMinutes: resumeMinutes,
        startedAt: now.toISOString(),
        expectedResumeTime,
      };

      await QueueModel.findOneAndUpdate(
        { queueId: "main_opd_queue" },
        {
          isDoctorInChamber: !isOnBreak,
          breakInfo,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "অকার্যকর অ্যাকশন" },
        { status: 400 }
      );
    }

    // Also sync in-memory store as fallback
    if (action === "next") clinicStore.nextPatient();
    else if (action === "skip") clinicStore.skipPatient(tokenNumber);
    else if (action === "recall") clinicStore.recallPatient(tokenNumber);
    else if (action === "setDoctorStatus") clinicStore.setDoctorStatus(inChamber);
    else if (action === "setBreak") clinicStore.setBreak(isOnBreak, reason, durationMinutes, customText);

    // Fetch refreshed queue state directly from MongoDB
    const updatedAppointments = await Appointment.find({
      appointmentDate: todayStr,
    })
      .sort({ tokenNumber: 1 })
      .lean();

    const updatedQueueDoc = await QueueModel.findOne({
      queueId: "main_opd_queue",
    }).lean();

    const activeList: AppointmentType[] = updatedAppointments.map((a) => ({
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

    const responseState: QueueState = {
      isDoctorInChamber: updatedQueueDoc?.isDoctorInChamber ?? true,
      chamberName: updatedQueueDoc?.chamberName || "রুম #৪০২ (ডিজিটাল চেম্বার)",
      doctorName: updatedQueueDoc?.doctorName || "ডা. মো. আসিফুল হক",
      currentlyServingToken: updatedQueueDoc?.currentlyServingToken ?? currentServing,
      totalTokensToday: updatedAppointments.length,
      avgMinutesPerPatient: updatedQueueDoc?.avgMinutesPerPatient || 20,
      activeQueueList: activeList,
      breakInfo: updatedQueueDoc?.breakInfo as any,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: responseState });
  } catch (error) {
    console.error("Queue action error in MongoDB:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার অপারেশন ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}
