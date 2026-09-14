# Dentist App Rules & Architectural Memory

Always keep in mind the core features and design context of this Bengali Dental Clinic web app:
1. **Core Features**:
   - Live Serial & Chamber TV Queue (`/live-queue`, `/display`, `LiveQueueMonitor.tsx`)
   - Online Appointment Booking with Bangla tooth service names (`/book`, `AppointmentBooking.tsx`)
   - Patient History & Prescription Lookup (`/patient-history`, `PatientHistoryLookup.tsx`)
   - Dental Symptom Checker (`SymptomChecker.tsx`)
   - Smile Gallery & Before/After showcase (`SmileGallery.tsx`, `/services`)
   - Admin/Doctor Dashboard for patient records and queue calling (`/admin`, `/admin/patients/[id]`)
2. **State & Store**:
   - `src/lib/store.ts` handles local storage syncing, Bangladeshi patient seed records, queue state, and appointments.
   - `src/lib/types.ts` contains `Appointment`, `PatientRecord`, `PatientVisit`, and `QueueState`.
3. **UI / Styling**:
   - Premium aesthetic with dark/light mode toggle (`theme-toggle.tsx`), responsive mobile tab bar (`MobileTabBar.tsx`), and Bangla typography.
