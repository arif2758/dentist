import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/models/Patient";
import { clinicStore } from "@/lib/store";
import { generatePatientId, normalizeLegacyPatientIds } from "@/lib/patientId";

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
  const recallsOnly = searchParams.get("recalls") === "true";

  try {
    await connectDB();

    // Ensure any existing legacy records conform to yymmdd-xxx
    await normalizeLegacyPatientIds();

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

    if (recallsOnly || overdueOnly) {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayTime = new Date(todayStr).getTime();

      let queryFilter: any = { nextRecallDate: { $exists: true, $ne: "" } };
      if (overdueOnly) {
        queryFilter = {
          $or: [
            { recallStatus: "OVERDUE" },
            {
              nextRecallDate: { $exists: true, $ne: "", $lte: todayStr },
              recallStatus: { $ne: "CONTACTED" },
            },
          ],
        };
      }

      const list = await Patient.find(queryFilter).lean();

      const mappedList = list.map((p) => {
        const recallTime = p.nextRecallDate ? new Date(p.nextRecallDate).getTime() : 0;
        const diffDays = Math.round((recallTime - todayTime) / (1000 * 60 * 60 * 24));
        const isOverdue =
          p.recallStatus === "OVERDUE" ||
          (Boolean(p.nextRecallDate) && p.nextRecallDate < todayStr && p.recallStatus !== "CONTACTED");

        let status = p.recallStatus;
        if (p.recallStatus !== "CONTACTED") {
          if (isOverdue) status = "OVERDUE";
          else status = "SCHEDULED";
        }

        return {
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
          recallStatus: status,
          recallNotes: p.recallNotes,
          diffDays,
        };
      });

      // Sort: যারটা যত কাছে তারটা তত উপরে থাকবে
      mappedList.sort((a, b) => {
        const distA = Math.abs(a.diffDays);
        const distB = Math.abs(b.diffDays);
        if (distA !== distB) {
          return distA - distB; // Closest to today comes first (0, 1, 2, 3...)
        }
        return b.diffDays - a.diffDays;
      });

      return NextResponse.json({
        success: true,
        data: mappedList,
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
    const { patientId, status, note, nextRecallDate } = body;

    try {
      await connectDB();
      const updateFields: Record<string, any> = {};
      if (status) updateFields.recallStatus = status;
      if (note !== undefined) updateFields.recallNotes = note;
      if (nextRecallDate) updateFields.nextRecallDate = nextRecallDate;

      const updated = await Patient.findOneAndUpdate(
        { patientId },
        { $set: updateFields },
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
