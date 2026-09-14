import { Appointment, PatientRecord, QueueState, BreakReason } from "./types";

// Realistic Seed Data
const initialAppointments: Appointment[] = [
  {
    id: "apt-1",
    tokenNumber: 1,
    patientName: "মো: রফিকুল ইসলাম",
    phone: "01711223344",
    age: 45,
    gender: "Male",
    serviceType: "রুট ক্যানেল থেরাপি (RCT)",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "05:00 PM - 05:30 PM",
    status: "COMPLETED",
    notes: "সেশন ২ সম্পন্ন, ক্যাপের মাপ নেয়া হয়েছে",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "apt-2",
    tokenNumber: 2,
    patientName: "নুসরাত জাহান",
    phone: "01819988776",
    age: 28,
    gender: "Female",
    serviceType: "আল্ট্রাসনিক স্কেলিং ও পলিশিং",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "05:30 PM - 06:00 PM",
    status: "COMPLETED",
    notes: "জিঞ্জিভাইটিস সমস্যা, মাড়ি পরিষ্কার করা হয়েছে",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: "apt-3",
    tokenNumber: 3,
    patientName: "তানভীর আহমেদ",
    phone: "01912345678",
    age: 34,
    gender: "Male",
    serviceType: "কম্পোজিট লেজার ফিলিং",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "06:00 PM - 06:20 PM",
    status: "COMPLETED",
    notes: "ডান পাশের উপরের প্রিমোলারে ক্যারিজ ছিল",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "apt-4",
    tokenNumber: 4,
    patientName: "সালমা বেগম",
    phone: "01622334455",
    age: 52,
    gender: "Female",
    serviceType: "দাঁত তোলা (Painless Extraction)",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "06:20 PM - 06:45 PM",
    status: "SERVING", // Currently inside chamber
    notes: "ডায়াবেটিস কন্ট্রোলে আছে (Fasting 6.8)",
    createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
  },
  {
    id: "apt-5",
    tokenNumber: 5,
    patientName: "কামরুল হাসান",
    phone: "01511223344",
    age: 40,
    gender: "Male",
    serviceType: "রুট ক্যানেল থেরাপি (RCT)",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "06:45 PM - 07:15 PM",
    status: "WAITING",
    notes: "তীব্র রাতে দাঁতে ব্যথা ও ঠাণ্ডায় শিরশিরানি",
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
  },
  {
    id: "apt-6",
    tokenNumber: 6,
    patientName: "ফারিহা তাসনিম",
    phone: "01799887766",
    age: 22,
    gender: "Female",
    serviceType: "অর্থোডন্টিক ব্রেসেস কনসাল্টেশন",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "07:15 PM - 07:40 PM",
    status: "WAITING",
    notes: "আঁকাবাঁকা দাঁত সোজা করার পরামর্শ",
    createdAt: new Date(Date.now() - 3600000 * 0.3).toISOString(),
  },
  {
    id: "apt-7",
    tokenNumber: 7,
    patientName: "আব্দুল করিম",
    phone: "01855667788",
    age: 60,
    gender: "Male",
    serviceType: "ডেন্টাল ইমপ্ল্যান্ট পরামর্শ",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "07:40 PM - 08:05 PM",
    status: "WAITING",
    notes: "নিচের দুটি মোলার দাঁত অনুপস্থিত",
    createdAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
  },
  {
    id: "apt-8",
    tokenNumber: 8,
    patientName: "মেহজাবিন চৌধুরী",
    phone: "01733445566",
    age: 31,
    gender: "Female",
    serviceType: "টিথ হোয়াইটেনিং (দাঁতের উজ্জ্বলতা)",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "08:05 PM - 08:30 PM",
    status: "WAITING",
    createdAt: new Date(Date.now() - 3600000 * 0.1).toISOString(),
  },
];

// Realistic Patient Records with 6-month & overdue history
const initialPatients: PatientRecord[] = [
  {
    id: "pat-101",
    patientName: "মো: জামিল হোসেন",
    phone: "01712345678",
    age: 42,
    gender: "Male",
    bloodGroup: "B+",
    medicalAlerts: ["Hypertension (রক্তচাপ)"],
    lastVisitDate: "2025-07-15",
    nextRecallDate: "2026-01-15", // 7.5 months ago -> OVERDUE!
    recallStatus: "OVERDUE",
    recallNotes:
      "রুট ক্যানেলের ক্যাপ বসানো ও রুটিন চেকআপের কথা ছিল। ফোন দিয়ে মনে করিয়ে দিতে হবে।",
    visits: [
      {
        id: "vis-1",
        date: "2025-07-15",
        treatmentName: "Root Canal Treatment - Tooth #46",
        toothNumbers: ["#46 (Lower Right 1st Molar)"],
        diagnosis: "Irreversible Pulpitis with periapical lucency",
        prescription: [
          "Tab. Cefuroxime 500mg (1+0+1) - 5 days",
          "Tab. Ketorolac 10mg (when severe pain)",
          "Mouthwash Chlorhexidine 0.2% (1:1 water rinse 2 times daily)",
        ],
        doctorNotes:
          "ওবচুরেশন সম্পন্ন হয়েছে। ৬ মাস পর এসে পার্মানেন্ট জিরকোনিয়া ক্যাপের স্থায়িত্ব পরীক্ষা করার নির্দেশ ছিল।",
        cost: 6500,
      },
    ],
  },
  {
    id: "pat-102",
    patientName: "শাহনাজ পারভীন",
    phone: "01823456789",
    age: 36,
    gender: "Female",
    bloodGroup: "A+",
    medicalAlerts: ["Penicillin Allergy"],
    lastVisitDate: "2025-06-20",
    nextRecallDate: "2025-12-20", // 8+ months ago -> OVERDUE!
    recallStatus: "OVERDUE",
    recallNotes:
      "ডিপ সাব-জিঞ্জিভ্যাল স্কেলিং সম্পন্ন হয়েছিল। মাড়ির পকেট চেকিংয়ের জন্য ৬ মাসে আসার কথা ছিল।",
    visits: [
      {
        id: "vis-2",
        date: "2025-06-20",
        treatmentName: "Deep Scaling & Curettage",
        toothNumbers: ["All Lower Anterior"],
        diagnosis: "Generalized Chronic Periodontitis Grade II",
        prescription: [
          "Cap. Doxycycline 100mg (1+0+0) - 7 days",
          "Metronidazole Gel for gums",
          "Warm saline gargle 3 times daily",
        ],
        doctorNotes:
          "ক্যালকুলাস ও প্লাক অপসারণ করা হয়েছে। মাড়ির রক্ত পড়া বন্ধ হয়েছিল। ৬ মাস পর ফলোআপ জরুরি।",
        cost: 2500,
      },
    ],
  },
  {
    id: "pat-103",
    patientName: "সাব্বির আহমেদ",
    phone: "01934567890",
    age: 26,
    gender: "Male",
    bloodGroup: "O+",
    medicalAlerts: ["None"],
    lastVisitDate: "2026-01-10",
    nextRecallDate: "2026-07-10", // Scheduled future
    recallStatus: "SCHEDULED",
    recallNotes: "কম্পোজিট ভিনিয়ার স্মাইল ডিজাইন ফলোআপ",
    visits: [
      {
        id: "vis-3",
        date: "2026-01-10",
        treatmentName: "Composite Smile Makeover",
        toothNumbers: ["#11", "#21", "#12", "#22"],
        diagnosis: "Diastema (সামনের দাঁতের ফাঁক) and incisal chipping",
        prescription: ["Sensodyne Rapid Relief Toothpaste"],
        doctorNotes:
          "ন্যানো-হাইব্রিড কম্পোজিট দিয়ে ন্যাচারাল শেড A2 তৈরি করা হয়েছে। বাইট স্বাভাবিক।",
        cost: 12000,
      },
    ],
  },
  {
    id: "pat-104",
    patientName: "মো: রফিকুল ইসলাম",
    phone: "01711223344",
    age: 45,
    gender: "Male",
    bloodGroup: "AB+",
    medicalAlerts: ["Mild Diabetes (Controlled)"],
    lastVisitDate: new Date().toISOString().split("T")[0],
    nextRecallDate: "2026-09-13",
    recallStatus: "SCHEDULED",
    visits: [
      {
        id: "vis-4",
        date: new Date().toISOString().split("T")[0],
        treatmentName: "RCT Final Obturation",
        toothNumbers: ["#24 (Upper Left Premolar)"],
        diagnosis: "Pulp necrosis due to secondary caries",
        prescription: [
          "Tab. Naproxen 500mg with Esomeprazole 20mg (1+0+1)",
          "Antiseptic Mouthwash",
        ],
        doctorNotes: "সেশন ২ শেষ। ক্যাপ মেজারমেন্ট নেওয়া হয়েছে।",
        cost: 5000,
      },
    ],
  },
];

// Global in-memory singleton to keep state synchronized across requests in dev
const globalStore = global as unknown as {
  __DENTIST_QUEUE__?: QueueState;
  __DENTIST_PATIENTS__?: PatientRecord[];
};

if (!globalStore.__DENTIST_QUEUE__) {
  globalStore.__DENTIST_QUEUE__ = {
    isDoctorInChamber: true,
    chamberName: "ডা. আসিফ ডেন্টাল কেয়ার অ্যান্ড ইমপ্ল্যান্ট সেন্টার",
    doctorName: "ডা. মো. আসিফুল হক",
    currentlyServingToken: 4,
    totalTokensToday: 8,
    avgMinutesPerPatient: 18,
    activeQueueList: initialAppointments,
    breakInfo: {
      isOnBreak: false,
      reason: "TEA",
      reasonText: "",
      durationMinutes: 15,
      startedAt: "",
      expectedResumeTime: "",
    },
    lastUpdated: new Date().toISOString(),
  };
}

if (!globalStore.__DENTIST_PATIENTS__) {
  globalStore.__DENTIST_PATIENTS__ = initialPatients;
}

export const clinicStore = {
  getQueue(): QueueState {
    return globalStore.__DENTIST_QUEUE__!;
  },

  nextPatient(): QueueState {
    const queue = globalStore.__DENTIST_QUEUE__!;
    const currentToken = queue.currentlyServingToken;

    // Mark current as completed
    const currentApt = queue.activeQueueList.find(
      (a) => a.tokenNumber === currentToken,
    );
    if (currentApt) {
      currentApt.status = "COMPLETED";
    }

    // Find next waiting patient
    const nextApt = queue.activeQueueList
      .filter((a) => a.status === "WAITING" && a.tokenNumber > currentToken)
      .sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

    if (nextApt) {
      nextApt.status = "SERVING";
      queue.currentlyServingToken = nextApt.tokenNumber;
    } else {
      // If no next, move to total + 1 or remain
      queue.currentlyServingToken = Math.min(
        currentToken + 1,
        queue.totalTokensToday,
      );
    }

    queue.lastUpdated = new Date().toISOString();
    return { ...queue };
  },

  skipPatient(tokenNumber: number): QueueState {
    const queue = globalStore.__DENTIST_QUEUE__!;
    const target = queue.activeQueueList.find(
      (a) => a.tokenNumber === tokenNumber,
    );
    if (target) {
      target.status = "CANCELLED";
    }
    queue.lastUpdated = new Date().toISOString();
    return { ...queue };
  },

  recallPatient(tokenNumber: number): QueueState {
    const queue = globalStore.__DENTIST_QUEUE__!;
    const target = queue.activeQueueList.find(
      (a) => a.tokenNumber === tokenNumber,
    );
    if (target) {
      target.status = "SERVING";
      queue.currentlyServingToken = tokenNumber;
    }
    queue.lastUpdated = new Date().toISOString();
    return { ...queue };
  },

  setDoctorStatus(inChamber: boolean): QueueState {
    const queue = globalStore.__DENTIST_QUEUE__!;
    queue.isDoctorInChamber = inChamber;
    if (inChamber && queue.breakInfo?.isOnBreak) {
      queue.breakInfo.isOnBreak = false;
    }
    queue.lastUpdated = new Date().toISOString();
    return { ...queue };
  },

  setBreak(
    isOnBreak: boolean,
    reason: BreakReason = "TEA",
    durationMinutes: number = 15,
    customText?: string
  ): QueueState {
    const queue = globalStore.__DENTIST_QUEUE__!;
    const now = new Date();
    const resumeDate = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const formatTime = (d: Date) => {
      let hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, "0")}:${mins} ${ampm}`;
    };

    const reasonMap: Record<BreakReason, string> = {
      PRAYER: "নামাজের বিরতি",
      TEA: "চা ও হালকা নাস্তার বিরতি",
      MEAL: "খাবার / ডিনারের বিরতি",
      COMPLEX_SURGERY: "জরুরি জটিল চিকিৎসা / ওটি চলছে",
      EMERGENCY: "জরুরি কেস পরিচালনা",
      OTHER: customText || "সাময়িক বিরতি",
    };

    queue.breakInfo = {
      isOnBreak,
      reason,
      reasonText: customText || reasonMap[reason] || "সাময়িক বিরতি",
      durationMinutes,
      startedAt: isOnBreak ? formatTime(now) : "",
      expectedResumeTime: isOnBreak ? formatTime(resumeDate) : "",
    };

    queue.isDoctorInChamber = !isOnBreak;
    queue.lastUpdated = new Date().toISOString();
    return { ...queue };
  },

  bookAppointment(data: {
    patientName: string;
    phone: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    serviceType: string;
    appointmentDate: string;
    timeSlot: string;
    notes?: string;
  }): { appointment: Appointment; queueState: QueueState } {
    const queue = globalStore.__DENTIST_QUEUE__!;
    const newToken = queue.totalTokensToday + 1;
    queue.totalTokensToday = newToken;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      tokenNumber: newToken,
      patientName: data.patientName,
      phone: data.phone,
      age: data.age,
      gender: data.gender,
      serviceType: data.serviceType,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      status: "WAITING",
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    queue.activeQueueList.push(newApt);
    queue.lastUpdated = new Date().toISOString();

    // Also link or create in Patient list
    const existingPatient = globalStore.__DENTIST_PATIENTS__!.find(
      (p) => p.phone === data.phone,
    );
    if (!existingPatient) {
      globalStore.__DENTIST_PATIENTS__!.push({
        id: `pat-${Date.now()}`,
        patientName: data.patientName,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        bloodGroup: "Unknown",
        medicalAlerts: [],
        visits: [],
        lastVisitDate: data.appointmentDate,
        nextRecallDate: new Date(Date.now() + 180 * 24 * 3600000)
          .toISOString()
          .split("T")[0],
        recallStatus: "SCHEDULED",
      });
    }

    return { appointment: newApt, queueState: { ...queue } };
  },

  getPatients(): PatientRecord[] {
    return globalStore.__DENTIST_PATIENTS__!;
  },

  searchPatientByPhone(phone: string): PatientRecord | undefined {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    return globalStore.__DENTIST_PATIENTS__!.find((p) =>
      p.phone.replace(/[\s-]/g, "").includes(cleanPhone),
    );
  },

  getPatientById(id: string): PatientRecord | undefined {
    return globalStore.__DENTIST_PATIENTS__!.find((p) => p.id === id);
  },

  getOverdueRecalls(): PatientRecord[] {
    return globalStore.__DENTIST_PATIENTS__!.filter(
      (p) => p.recallStatus === "OVERDUE",
    );
  },

  updateRecallStatus(
    patientId: string,
    status: "PENDING" | "OVERDUE" | "CONTACTED" | "SCHEDULED",
    note?: string,
  ): PatientRecord | undefined {
    const patient = globalStore.__DENTIST_PATIENTS__!.find(
      (p) => p.id === patientId,
    );
    if (patient) {
      patient.recallStatus = status;
      if (note) {
        patient.recallNotes = note;
      }
    }
    return patient;
  },

  addPatientVisit(
    patientId: string,
    visit: Omit<import("./types").PatientVisit, "id">,
  ): PatientRecord | undefined {
    const patient = globalStore.__DENTIST_PATIENTS__!.find(
      (p) => p.id === patientId,
    );
    if (patient) {
      const newVisit = { ...visit, id: `vis-${Date.now()}` };
      patient.visits.unshift(newVisit);
      patient.lastVisitDate = visit.date;
      // Set 6-month recall
      const nextRecall = new Date();
      nextRecall.setMonth(nextRecall.getMonth() + 6);
      patient.nextRecallDate = nextRecall.toISOString().split("T")[0];
      patient.recallStatus = "SCHEDULED";
    }
    return patient;
  },
};
