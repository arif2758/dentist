import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { clinicStore } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  try {
    await connectDB();

    const count = await Appointment.countDocuments();
    if (count === 0) {
      const initialSeed = clinicStore.getQueue().activeQueueList;
      for (const a of initialSeed) {
        await Appointment.create({
          appointmentId: a.id,
          tokenNumber: a.tokenNumber,
          patientName: a.patientName,
          phone: a.phone,
          age: a.age,
          gender: a.gender,
          serviceType: a.serviceType,
          appointmentDate: a.appointmentDate,
          timeSlot: a.timeSlot,
          status: a.status,
          notes: a.notes,
        });
      }
    }

    const list = await Appointment.find({ appointmentDate: date }).sort({ tokenNumber: 1 }).lean();
    return NextResponse.json({
      success: true,
      data: list.map((a) => ({
        id: a.appointmentId,
        tokenNumber: a.tokenNumber,
        patientName: a.patientName,
        phone: a.phone,
        age: a.age,
        gender: a.gender,
        serviceType: a.serviceType,
        appointmentDate: a.appointmentDate,
        timeSlot: a.timeSlot,
        status: a.status,
        notes: a.notes,
        createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
      })),
    });
  } catch (err) {
    console.warn("Falling back to clinicStore for appointments:", err);
    const queue = clinicStore.getQueue();
    return NextResponse.json({ success: true, data: queue.activeQueueList });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, phone, age, gender, serviceType, appointmentDate, timeSlot, notes } = body;

    if (!patientName || !phone || !serviceType || !timeSlot) {
      return NextResponse.json({ success: false, message: "প্রয়োজনীয় সকল তথ্য প্রদান করুন।" }, { status: 400 });
    }

    const targetDate = appointmentDate || new Date().toISOString().split("T")[0];

    try {
      await connectDB();

      const lastDoc = await Appointment.findOne({ appointmentDate: targetDate })
        .sort({ tokenNumber: -1 })
        .lean();

      const nextToken = (lastDoc?.tokenNumber || 0) + 1;
      const appointmentId = `APT-${Date.now().toString().slice(-6)}`;

      const created = await Appointment.create({
        appointmentId,
        tokenNumber: nextToken,
        patientName,
        phone,
        age: Number(age) || 30,
        gender: gender || "Other",
        serviceType,
        appointmentDate: targetDate,
        timeSlot,
        status: "WAITING",
        notes: notes || "",
      });

      return NextResponse.json({
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
      });
    } catch {
      // Fallback to store
      const result = clinicStore.bookAppointment({
        patientName,
        phone,
        age: Number(age) || 30,
        gender: gender || "Other",
        serviceType,
        appointmentDate: targetDate,
        timeSlot,
        notes,
      });

      return NextResponse.json({ success: true, data: result.appointment, queueState: result.queueState });
    }
  } catch {
    return NextResponse.json({ success: false, message: "বুকিং প্রক্রিয়া ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
