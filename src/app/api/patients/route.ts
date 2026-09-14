import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/models/Patient";
import { clinicStore } from "@/lib/store";

function parseToothConditions(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (raw instanceof Map) {
    return Object.fromEntries(raw.entries());
  }
  if (typeof raw === "object") {
    return raw as Record<string, unknown>;
  }
  return {};
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  const id = searchParams.get("id");
  const overdueOnly = searchParams.get("overdue") === "true";

  try {
    await connectDB();

    // Auto-seed if collection is empty
    const count = await Patient.countDocuments();
    if (count === 0) {
      const initialSeed = clinicStore.getPatients();
      for (const p of initialSeed) {
        await Patient.create({
          patientId: p.id,
          patientName: p.patientName,
          phone: p.phone,
          age: p.age,
          gender: p.gender,
          bloodGroup: p.bloodGroup,
          medicalAlerts: p.medicalAlerts,
          visits: p.visits,
          lastVisitDate: p.lastVisitDate,
          nextRecallDate: p.nextRecallDate,
          recallStatus: p.recallStatus,
          recallNotes: p.recallNotes,
        });
      }
    }

    if (id) {
      const patient = await Patient.findOne({ patientId: id }).lean();
      if (!patient) {
        return NextResponse.json({ success: false, message: "রোগীর রেকর্ড পাওয়া যায়নি।" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: {
          id: patient.patientId,
          patientName: patient.patientName,
          phone: patient.phone,
          age: patient.age,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          medicalAlerts: patient.medicalAlerts,
          toothConditions: parseToothConditions(patient.toothConditions),
          visits: patient.visits,
          lastVisitDate: patient.lastVisitDate,
          nextRecallDate: patient.nextRecallDate,
          recallStatus: patient.recallStatus,
          recallNotes: patient.recallNotes,
        },
      });
    }

    if (phone) {
      const cleanPhone = phone.trim();
      const patient = await Patient.findOne({ phone: cleanPhone }).lean();
      if (!patient) {
        return NextResponse.json({ success: false, message: "কোনো পূর্বের রেকর্ড পাওয়া যায়নি।" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: {
          id: patient.patientId,
          patientName: patient.patientName,
          phone: patient.phone,
          age: patient.age,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          medicalAlerts: patient.medicalAlerts,
          toothConditions: parseToothConditions(patient.toothConditions),
          visits: patient.visits,
          lastVisitDate: patient.lastVisitDate,
          nextRecallDate: patient.nextRecallDate,
          recallStatus: patient.recallStatus,
          recallNotes: patient.recallNotes,
        },
      });
    }

    if (overdueOnly) {
      const overdueList = await Patient.find({ recallStatus: "OVERDUE" }).lean();
      return NextResponse.json({
        success: true,
        data: overdueList.map((p) => ({
          id: p.patientId,
          patientName: p.patientName,
          phone: p.phone,
          age: p.age,
          gender: p.gender,
          bloodGroup: p.bloodGroup,
          medicalAlerts: p.medicalAlerts,
          toothConditions: parseToothConditions(p.toothConditions),
          visits: p.visits,
          lastVisitDate: p.lastVisitDate,
          nextRecallDate: p.nextRecallDate,
          recallStatus: p.recallStatus,
          recallNotes: p.recallNotes,
        })),
      });
    }

    const allPatients = await Patient.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      data: allPatients.map((p) => ({
        id: p.patientId,
        patientName: p.patientName,
        phone: p.phone,
        age: p.age,
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        medicalAlerts: p.medicalAlerts,
        toothConditions: parseToothConditions(p.toothConditions),
        visits: p.visits,
        lastVisitDate: p.lastVisitDate,
        nextRecallDate: p.nextRecallDate,
        recallStatus: p.recallStatus,
        recallNotes: p.recallNotes,
      })),
    });
  } catch (dbErr) {
    console.warn("Falling back to in-memory clinicStore for patients:", dbErr);
    // Graceful fallback to clinicStore
    if (id) {
      const patient = clinicStore.getPatientById(id);
      if (!patient) return NextResponse.json({ success: false, message: "রোগীর রেকর্ড পাওয়া যায়নি।" }, { status: 404 });
      return NextResponse.json({ success: true, data: patient });
    }
    if (phone) {
      const patient = clinicStore.searchPatientByPhone(phone);
      if (!patient) return NextResponse.json({ success: false, message: "কোনো পূর্বের রেকর্ড পাওয়া যায়নি।" }, { status: 404 });
      return NextResponse.json({ success: true, data: patient });
    }
    if (overdueOnly) {
      return NextResponse.json({ success: true, data: clinicStore.getOverdueRecalls() });
    }
    return NextResponse.json({ success: true, data: clinicStore.getPatients() });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { patientId, status, note } = body;

    try {
      await connectDB();
      const updated = await Patient.findOneAndUpdate(
        { patientId },
        { recallStatus: status, recallNotes: note },
        { new: true }
      );
      if (updated) {
        return NextResponse.json({ success: true, data: updated });
      }
    } catch {
      // Fallback
    }

    const fallbackUpdated = clinicStore.updateRecallStatus(patientId, status, note);
    return NextResponse.json({ success: true, data: fallbackUpdated });
  } catch {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}
