import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctorDoc extends Document {
  doctorId: string;
  name: string;
  title: string;
  degrees: string[];
  bmdcRegNo: string;
  experienceYears: number;
  specialties: string[];
  bio: string;
  phone: string;
  email: string;
  chamberAddress: string;
  schedule: Array<{
    day: string;
    time: string;
    status: string;
  }>;
}

const DoctorSchema = new Schema<IDoctorDoc>(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      default: "primary_doctor",
    },
    name: { type: String, required: true, default: "ডা. আসিফ চৌধুরী" },
    title: {
      type: String,
      default: "চিফ ডেন্টাল সার্জন ও এন্ডোডন্টিক বিশেষজ্ঞ",
    },
    degrees: [{ type: String }],
    bmdcRegNo: { type: String, default: "A-84920" },
    experienceYears: { type: Number, default: 10 },
    specialties: [{ type: String }],
    bio: { type: String, default: "" },
    phone: { type: String, default: "+8801700000000" },
    email: { type: String, default: "chamber@drarifdental.com" },
    chamberAddress: {
      type: String,
      default: "রুম #৪০২ (৪র্থ তলা), সিটি সেন্টার প্লাজা, ধানমন্ডি, ঢাকা",
    },
    schedule: [
      {
        day: { type: String },
        time: { type: String },
        status: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const DoctorModel: Model<IDoctorDoc> =
  mongoose.models.DoctorModel ||
  mongoose.model<IDoctorDoc>("DoctorModel", DoctorSchema);
