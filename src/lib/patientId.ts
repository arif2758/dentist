import { connectDB } from "@/lib/db";
import { Patient } from "@/models/Patient";

/**
 * Generates a clinical Patient ID in the format: yymmdd-xxx
 * Example: 260914-001, 260914-002
 *
 * @param date Optional date to base the prefix on (defaults to today)
 * @returns Formatted Patient ID string (e.g., "260914-001")
 */
export async function generatePatientId(date: Date = new Date()): Promise<string> {
  await connectDB();

  const validDate = isNaN(date.getTime()) ? new Date() : date;
  const yy = String(validDate.getFullYear()).slice(-2);
  const mm = String(validDate.getMonth() + 1).padStart(2, "0");
  const dd = String(validDate.getDate()).padStart(2, "0");
  const prefix = `${yy}${mm}${dd}`;

  // Find all patient IDs starting with this day's prefix
  const regex = new RegExp(`^${prefix}-\\d+`);
  const patientsToday = await Patient.find({ patientId: regex })
    .select("patientId")
    .lean();

  let maxSeq = 0;
  for (const p of patientsToday) {
    if (p.patientId) {
      const parts = p.patientId.split("-");
      if (parts.length >= 2) {
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }

  const nextSeq = maxSeq + 1;
  return `${prefix}-${String(nextSeq).padStart(3, "0")}`;
}

/**
 * Ensures all existing patients in MongoDB adhere to the yymmdd-xxx format.
 * If any patient has a legacy ID (such as "pat-101" or "P-xxx"), it automatically migrates them.
 */
export async function normalizeLegacyPatientIds(): Promise<number> {
  await connectDB();

  const legacyPatients = await Patient.find({
    patientId: { $not: /^\d{6}-\d{3,}$/ }
  }).sort({ createdAt: 1, _id: 1 });

  let migratedCount = 0;
  for (const patient of legacyPatients) {
    const date = patient.createdAt ? new Date(patient.createdAt) : new Date();
    const newId = await generatePatientId(date);
    await Patient.updateOne({ _id: patient._id }, { $set: { patientId: newId } });
    migratedCount++;
  }

  return migratedCount;
}
