import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQueueStateDoc extends Document {
  queueId: string;
  isDoctorInChamber: boolean;
  chamberName: string;
  doctorName: string;
  currentlyServingToken: number;
  totalTokensToday: number;
  avgMinutesPerPatient: number;
  lastUpdated: Date;
}

const QueueStateSchema = new Schema<IQueueStateDoc>(
  {
    queueId: { type: String, required: true, unique: true, default: "main_opd_queue" },
    isDoctorInChamber: { type: Boolean, default: true },
    chamberName: { type: String, default: "রুম #৪০২ (ডিজিটাল চেম্বার)" },
    doctorName: { type: String, default: "ডা. আরিফ চৌধুরী" },
    currentlyServingToken: { type: Number, default: 4 },
    totalTokensToday: { type: Number, default: 12 },
    avgMinutesPerPatient: { type: Number, default: 20 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const QueueModel: Model<IQueueStateDoc> =
  mongoose.models.QueueModel ||
  mongoose.model<IQueueStateDoc>("QueueModel", QueueStateSchema);
