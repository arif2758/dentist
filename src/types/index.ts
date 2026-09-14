export type AppointmentStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'CANCELLED';

export type Gender = 'Male' | 'Female' | 'Other';

export type RecallStatus = 'PENDING' | 'OVERDUE' | 'CONTACTED' | 'SCHEDULED';

export type ToothCondition =
  | 'HEALTHY'
  | 'CARIES'
  | 'RCT'
  | 'CROWN'
  | 'MISSING'
  | 'EXTRACT_NEEDED';

export interface ToothConditionRecord {
  condition: ToothCondition;
  note?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  tokenNumber: number;
  patientName: string;
  phone: string;
  age: number;
  gender: Gender;
  serviceType: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface PatientVisit {
  id: string;
  date: string;
  treatmentName: string;
  toothNumbers: string[]; // e.g. ["16", "26", "48"]
  diagnosis: string;
  prescription: string[];
  doctorNotes: string;
  cost?: number;
}

export interface PatientRecord {
  id: string;
  patientName: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  medicalAlerts: string[]; // e.g. ["Diabetic", "Hypertension", "Penicillin Allergy"]
  toothConditions?: Record<number, ToothConditionRecord>;
  visits: PatientVisit[];
  lastVisitDate: string;
  nextRecallDate: string; // e.g. 6 months after treatment
  recallStatus: RecallStatus;
  recallNotes?: string;
  createdAt?: string;
}

export interface QueueState {
  isDoctorInChamber: boolean;
  chamberName: string;
  doctorName: string;
  currentlyServingToken: number;
  totalTokensToday: number;
  avgMinutesPerPatient: number;
  activeQueueList: Appointment[];
  lastUpdated: string;
}

export interface DoctorProfile {
  id: string;
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

// Server Action Response Types
export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
