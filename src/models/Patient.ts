import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatientVisit {
  id: string;
  date: string;
  treatmentName: string;
  toothNumbers: string[];
  diagnosis: string;
  prescription: string[];
  doctorNotes: string;
  cost?: number;
}

export interface IPatient extends Document {
  patientId: string;
  patientName: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  medicalAlerts: string[];
  toothConditions: Record<string, { condition: string; note?: string; updatedAt?: string }>;
  visits: IPatientVisit[];
  lastVisitDate: string;
  nextRecallDate: string;
  recallStatus: "PENDING" | "OVERDUE" | "CONTACTED" | "SCHEDULED";
  recallNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientVisitSchema = new Schema<IPatientVisit>(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    treatmentName: { type: String, required: true },
    toothNumbers: [{ type: String }],
    diagnosis: { type: String, default: "" },
    prescription: [{ type: String }],
    doctorNotes: { type: String, default: "" },
    cost: { type: Number, default: 0 },
  },
  { _id: false }
);

const PatientSchema = new Schema<IPatient>(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    patientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, default: "Male" },
    bloodGroup: { type: String, default: "O+" },
    medicalAlerts: [{ type: String }],
    toothConditions: { type: Map, of: Object, default: {} },
    visits: [PatientVisitSchema],
    lastVisitDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    nextRecallDate: { type: String, default: "" },
    recallStatus: {
      type: String,
      enum: ["PENDING", "OVERDUE", "CONTACTED", "SCHEDULED"],
      default: "SCHEDULED",
    },
    recallNotes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
