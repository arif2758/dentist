# Dentist Web Application - Project Memory & Context

## 🏥 প্রজেক্টের সারসংক্ষেপ (Project Overview)
- **নাম ও ধরন:** আধুনিক ডেন্টাল ক্লিনিক ম্যানেজমেন্ট ও পেশেন্ট পোর্টাল ওয়েব অ্যাপ্লিকেশন (Smart Dental Clinic Management & Patient Portal).
- **ভাষা ও লোকালাইজেশন:** সম্পূর্ণ বাংলা ইন্টারফেস (Bangla UI & Localization) ডেন্টাল চিকিৎসা ও রোগী নির্দেশিকার সাথে সামঞ্জস্যপূর্ণ।
- **টেকনোলজি স্ট্যাক:** Next.js 16 (App Router), React 19, TypeScript, Ant Design 6, Lucide Icons, TanStack Query, Tailwind CSS / Vanilla CSS tokens, Next Themes (Light/Dark Mode), Mongoose.

---

## 🎯 মূল ফিচারসমূহ ও আর্কিটেকচার (Core Features & Architecture)

### ১. লাইভ সিরিয়াল ও ওয়েটিং রুম মনিটর (Live Queue & Chamber Display)
- **রুট:** `/live-queue` এবং `/display`
- **কম্পোনেন্ট:** `LiveQueueMonitor.tsx`, `LiveQueuePage`
- **সুবিধাসমূহ:** ডক্টরের চেম্বার স্ট্যাটাস, রানিং টোকেন, ওয়েটিং টাইম ও ফুলস্ক্রিন ডিজিটাল টিভি ডিসপ্লে বোর্ড (`/display`)।

### ২. অনলাইন অ্যাপয়েন্টমেন্ট বুকিং (Appointment Booking)
- **রুট:** `/book` এবং হোমপেজে `AppointmentBooking.tsx`
- **সুবিধাসমূহ:** চিকিৎসা নির্বাচন (RCT, স্কেলিং, ফিলিং, ইমপ্ল্যান্ট ইত্যাদি), স্লট বুকিং ও তাৎক্ষণিক টোকেন কনফার্মেশন স্লিপ।

### ৩. ইন্টারেক্টিভ ডেন্টাল টুথ চার্ট (Interactive Tooth Chart - FDI 32 Teeth)
- **কম্পোনেন্ট:** `src/components/dental/ToothChart.tsx`
- **সুবিধাসমূহ:** ৩২টি প্রাপ্তবয়স্ক দাঁতের অ্যানাটমিক্যাল আর্চ, কন্ডিশন সিলেক্টর (Healthy, Caries, RCT, Crown, Missing, Extraction Needed) ও ডক্টরস ডায়াগনসিস নোট। রোগীর রেকর্ড পেজে ইন্টিগ্রেটেড।

### ৪. ডক্টর পরিচিতি ও চেম্বার শিডিউল পেজ (Doctor Profile & Schedule)
- **রুট:** `/doctor`
- **সুবিধাসমূহ:** ডক্টরের ডিগ্রি (BDS, PGT), BMDC রেজিস্ট্রেশন নম্বর (A-84920), সাপ্তাহিক প্র্যাকটিস সময়সূচী, চেম্বারের ঠিকানা ও গুগল ম্যাপ।

### ৫. পোস্ট-ট্রিটমেন্ট কেয়ার ও রোগী নির্দেশিকা (Post-Op Aftercare Guidelines)
- **রুট:** `/after-care`
- **সুবিধাসমূহ:** দাঁত তোলা, রুট ক্যানেল, স্কেলিং, ফিলিং ও ব্রেসেসের পর করণীয় ও বর্জনীয় (Do's and Don'ts) কার্ড ও প্রিন্ট সুবিধা।

### ৬. ইমার্জেন্সি ডেন্টাল ফার্স্ট এইড ও FAQ (Emergency First Aid & FAQs)
- **রুট:** `/emergency`
- **সুবিধাসমূহ:** তীব্র দাঁতে ব্যথা, রক্তপাত, ভেঙে যাওয়া দাঁতের তাৎক্ষণিক ফার্স্ট এইড গাইড, সাধারণ জিজ্ঞাসা (১০+ FAQ) ও ২৪/৭ জরুরি হটলাইন।

### ৭. পেশেন্ট হিস্ট্রি ও প্রেসক্রিপশন পোর্টাল (Patient History & Records)
- **রুট:** `/patient-history` এবং `/admin/patients/[id]`
- **কম্পোনেন্ট:** `PatientHistoryLookup.tsx`, `ToothChart.tsx`
- **সুবিধাসমূহ:** মোবাইল নম্বর দিয়ে পূর্ববর্তী প্রেসক্রিপশন ও ভিজিট হিস্ট্রি সার্চ, প্রেসক্রিপশন প্রিন্ট ও WhatsApp-এ শেয়ার।

### ৮. ডক্টর ও অ্যাডমিন পোর্টাল (Doctor / Admin Dashboard)
- **রুট:** `/admin`, `/admin/patients`, `/admin/recalls`
- **সুবিধাসমূহ:** আজকের সিরিয়াল কলিং (`Call Next`, `Skip`, `Recall`), মেডিকেল হিস্ট্রি এলার্ট (Diabetic, Allergy), টুথ চার্ট ও ফলো-আপ শিডিউলিং।
