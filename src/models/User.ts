import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "@/types/auth";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string; // bcrypt hash
  role: UserRole;
  status: "active" | "inactive";
  avatarUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["doctor", "staff", "admin"],
      default: "staff",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
    avatarUrl: { type: String },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDoc> =
  mongoose.models.UserModel ||
  mongoose.model<IUserDoc>("UserModel", UserSchema);
