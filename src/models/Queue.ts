import mongoose, { Schema, Document, Model } from "mongoose";
import { BreakReason } from "@/types";

export interface IBreakInfoDoc {
  isOnBreak: boolean;
  reason: BreakReason;
  reasonText: string;
  startedAt?: string;
  expectedResumeTime?: string;
  durationMinutes?: number;
}

export interface IQueueStateDoc extends Document {
  queueId: string;
  isDoctorInChamber: boolean;
  chamberName: string;
  doctorName: string;
  currentlyServingToken: number;
  totalTokensToday: number;
  avgMinutesPerPatient: number;
  breakInfo: IBreakInfoDoc;
  lastUpdated: Date;
}

const BreakInfoSchema = new Schema<IBreakInfoDoc>(
  {
    isOnBreak: { type: Boolean, default: false },
    reason: { type: String, default: "TEA" },
    reasonText: { type: String, default: "" },
    startedAt: { type: String, default: "" },
    expectedResumeTime: { type: String, default: "" },
    durationMinutes: { type: Number, default: 15 },
  },
  { _id: false },
);

const QueueStateSchema = new Schema<IQueueStateDoc>(
  {
    queueId: {
      type: String,
      required: true,
      unique: true,
      default: "main_opd_queue",
    },
    isDoctorInChamber: { type: Boolean, default: true },
    chamberName: { type: String, default: "রুম #৪০২ (ডিজিটাল চেম্বার)" },
    doctorName: { type: String, default: "ডা. আসিফ চৌধুরী" },
    currentlyServingToken: { type: Number, default: 4 },
    totalTokensToday: { type: Number, default: 12 },
    avgMinutesPerPatient: { type: Number, default: 20 },
    breakInfo: {
      type: BreakInfoSchema,
      default: () => ({
        isOnBreak: false,
        reason: "TEA",
        reasonText: "",
        startedAt: "",
        expectedResumeTime: "",
        durationMinutes: 15,
      }),
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const QueueModel: Model<IQueueStateDoc> =
  mongoose.models.QueueModel ||
  mongoose.model<IQueueStateDoc>("QueueModel", QueueStateSchema);
