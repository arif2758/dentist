import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DoctorModel } from "@/models/Doctor";
import { DoctorProfile } from "@/types";

const INITIAL_DOCTOR_DATA = {
  doctorId: "primary_doctor",
  name: "ডা. মো. আসিফুল হক",
  title: "সিনিয়র ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জন ও ডেন্টিস্ট",
  degrees: [
    "BDS (ঢাকা বিশ্ববিদ্যালয়, ডেন্টাল কলেজ)",
    "FCPS (ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জারি)",
    "FICD (ইউএসএ) - ফেলো, ইন্টারন্যাশনাল কলেজ অফ ডেন্টিস্টস",
    "অ্যাডভান্সড ইমপ্ল্যান্টোলজি ট্রেনিং (জার্মানি ও থাইল্যান্ড)",
  ],
  bmdcRegNo: "A-54920",
  experienceYears: 30,
  specialties: [
    "ব্যথামুক্ত রোটারি রুট ক্যানেল (RCT)",
    "টাইটানিয়াম ডেন্টাল ইমপ্ল্যান্ট সার্জারি",
    "কম্পোজিট কসমেটিক লেজার ফিলিং",
    "ইমপ্যাক্টেড আক্কেল দাঁতের ওটি (Wisdom Tooth Surgery)",
    "মাড়ির রোগ ও পিরিওডন্টাল চিকিৎসা",
    "শিশুদের আধুনিক ডেন্টাল কেয়ার",
  ],
  bio: "ডা. মো. আসিফুল হক বিগত ৩০ বছর ধরে সততা, দক্ষতা ও আধুনিক প্রযুক্তির সমন্বয়ে হাজার হাজার রোগীর সফল দন্তচিকিৎসা সেবা প্রদান করে আসছেন। আন্তর্জাতিক মানের ইউরোপিয়ান ক্লাস-বি অটোক্লেভ ও শতভাগ ব্যথামুক্ত অ্যানাস্থেসিয়া নিশ্চিত করাই ওনার চেম্বারের মূল লক্ষ্য।",
  phone: "+8801700000000",
  email: "dr.arif@dentalclinic.com",
  chamberAddress: "রুম #৪০২ (৪র্থ তলা), সিটি সেন্টার প্লাজা, রোড #৭/এ, ধানমন্ডি, ঢাকা-১২০৯",
  schedule: [
    { day: "শনিবার", time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা", status: "নিয়মিত চেম্বার" },
    { day: "রবিবার", time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা", status: "নিয়মিত চেম্বার" },
    { day: "সোমবার", time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা", status: "নিয়মিত চেম্বার" },
    { day: "মঙ্গলবার", time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা", status: "নিয়মিত চেম্বার" },
    { day: "বুধবার", time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা", status: "নিয়মিত চেম্বার" },
    { day: "বৃহস্পতিবার", time: "বিকাল ৫:০০ টা – রাত ৯:৩০ টা", status: "নিয়মিত চেম্বার" },
    { day: "শুক্রবার", time: "সাপ্তাহিক বন্ধ (জরুরি কল অন)", status: "বন্ধ" },
  ],
};

export async function GET() {
  try {
    await connectDB();

    let doc = await DoctorModel.findOne({ doctorId: "primary_doctor" }).lean();
    if (!doc) {
      doc = await DoctorModel.create(INITIAL_DOCTOR_DATA);
    }

    const profile: DoctorProfile = {
      id: doc.doctorId,
      name: doc.name,
      title: doc.title,
      degrees: doc.degrees,
      bmdcRegNo: doc.bmdcRegNo,
      experienceYears: doc.experienceYears,
      specialties: doc.specialties,
      bio: doc.bio,
      phone: doc.phone,
      email: doc.email,
      chamberAddress: doc.chamberAddress,
      schedule: doc.schedule,
    };

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.warn("Doctor profile query error, returning default:", error);
    return NextResponse.json({ success: true, data: INITIAL_DOCTOR_DATA });
  }
}
