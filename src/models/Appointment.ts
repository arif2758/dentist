import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  appointmentId: string;
  tokenNumber: number;
  patientName: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  serviceType: string;
  appointmentDate: string;
  timeSlot: string;
  status: "WAITING" | "SERVING" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true, index: true },
    tokenNumber: { type: Number, required: true, index: true },
    patientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    serviceType: { type: String, required: true },
    appointmentDate: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["WAITING", "SERVING", "COMPLETED", "CANCELLED"],
      default: "WAITING",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
