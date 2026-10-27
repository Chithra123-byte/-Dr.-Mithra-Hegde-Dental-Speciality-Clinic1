# Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre
### Official Appointment Booking & Patient Portal

Production-ready, responsive, full-stack appointment booking and management platform for **Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre**, located at Mangalore Gate, Kankanady, Mangaluru, Karnataka, India.

---

## 1. Verified Business Profile

- **Official Name:** Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre
- **Google Maps Reference:** [View on Google Maps](https://maps.app.goo.gl/khQq31KnHwbHTXt19)
- **Principal Specialist:** Dr. Mithra N. Hegde (BDS, MDS, PhD, MAMS, MFDS RCPS Glasg)
  - Recipient of the **Karnataka Rajyotsava Award (2011)** for lifetime medical contributions
  - Dean, Principal & Senior Professor, Department of Conservative Dentistry & Endodontics, ABSMIDS, Nitte (Deemed to be University)
  - 30+ years of clinical and academic excellence
- **Clinic Address:** 
  3rd Floor, Commercial Complex, Mangalore Gate (Near Karavali Circle),
  Solapur - Mangalore Highway, Kankanady, Mangaluru, Karnataka – 575002, India
- **Phone:** +91 98452 84411
- **Google Rating:** 4.8 / 5.0 (320+ patient reviews)
- **Operating Hours:**
  - Monday to Saturday: 03:30 PM – 08:00 PM (IST)
  - Sunday: Closed (Emergency on call)

---

## 2. Core Features

### Patient Facing
1. **7-Step Real-time Booking Engine:**
   - **Step 1:** Select dental service & optional add-ons (RVG digital radiographs, desensitizers, bio-ceramic sealers).
   - **Step 2:** Choose specialist (Dr. Mithra N. Hegde, Dr. Rohan Kamath, Dr. Shweta Shetty, or Any Available Specialist).
   - **Step 3:** Calendar date picker (with past dates, Sundays, and holiday closures disabled).
   - **Step 4:** Live slot generation (enforcing clinic hours, 30m intervals, buffers, and concurrent booking locks).
   - **Step 5:** Patient contact details (+91 mobile number, email, chief complaints, policy agreement).
   - **Step 6:** Review & breakdown with transparent fee display (settled at clinic upon arrival).
   - **Step 7:** Immediate confirmation with unique reference code (e.g. `DMH-2026-XXXX`), one-click Google Calendar integration, `.ics` calendar file download, and simulated SMS/WhatsApp dispatch preview.
2. **Booking Management Portal ("My Booking"):**
   - Patients can enter their booking reference and contact details to inspect appointment status, reschedule slots, or cancel in accordance with the 4-hour advance policy.
3. **Services Catalog:**
   - Filter by category (Endodontics, Cosmetic, Implants & Crowns, Restorative, Periodontics, Diagnostics).
   - Search by procedure keywords with transparent pricing in Indian Rupees (₹).
   - Direct "Book This Service" trigger that prefills the booking wizard.
4. **Clinical Tour & Infrastructure Gallery:**
   - Interactive photo gallery showcasing the digital operatory, Leica optical loupes, autoclave sterilization bay, and patient lounge with modal lightbox.
5. **Contact & Location:**
   - Interactive embedded Google Maps, mobile click-to-call, driving directions link, validated contact inquiry form, and dental FAQs.

### Administration Portal (`/admin`)
- **Protected Access:** Sign-in required (Demo credentials: `admin@drmithrahegde.com` / `MithraClinic@2026`).
- **Dashboard Overview:** Today's appointments, upcoming bookings, completed procedures, cancellations, and revenue snapshots.
- **Appointment Management:** List and calendar format, search by reference or patient name, status update actions (Confirmed, Completed, Rescheduled, Cancelled, No-Show), and internal clinical notes.
- **Walk-in / Phone Reservation Modal:** Front desk staff can book offline patients directly.
- **Services Manager:** Update service prices, durations, descriptions, and toggle active status.
- **Operating Hours & Clinic Settings:** Configure shift timings, booking window, buffer minutes, and announcement banners.
- **Notification & Audit Trail:** Log of all automated SMS, WhatsApp, and Email alerts dispatched.
- **Supabase Cloud Database Hub:** Real-time health monitor for Supabase project `slwyuakcgtekywozudyg`, 1-click SQL schema copy button, and "Sync All Bookings" button.

---

## 3. Supabase Database Integration

- **Project ID:** `slwyuakcgtekywozudyg`
- **Endpoint URL:** `https://slwyuakcgtekywozudyg.supabase.co`
- **Client Library:** `@supabase/supabase-js`
- **Automatic Sync:** Every time a patient fills out and confirms an appointment booking, it is automatically written and upserted to the `public.appointments` table in your Supabase database.
- **SQL Migration Script:** Found in `/supabase/schema.sql`. Paste it into the [Supabase SQL Editor](https://supabase.com/dashboard/project/slwyuakcgtekywozudyg/sql) to initialize the table with Row Level Security (RLS) policies.

---

## 4. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js, Express, TSX.
- **API Architecture:** RESTful endpoints for clinic info, services, staff, availability calculation, atomic bookings, appointment lookup, and administration.
- **Concurrency & Availability Engine:** Server-authoritative slot generation preventing overlapping appointments and double-booking.

---

## 4. Local Development & Deployment

### Installation
```bash
npm install
```

### Run Full-Stack Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with Express handling `/api/*` and Vite serving the frontend.

### Production Build
```bash
npm run build
npm start
```

---

## 5. Owner Handover Checklist & Third-Party Integrations

Before launching for production use, the business owner should configure:

1. **Custom Domain:** Point your DNS records (A/CNAME) to your Cloud Run or server instance.
2. **Transactional SMS Provider:** For live SMS in India, integrate an approved DLT-registered SMS gateway (e.g., Kaleyra, Gupshup, or Twilio) using your approved DLT sender ID.
3. **WhatsApp Business API:** Connect an official WhatsApp Business Cloud API account (Meta Business Manager) to replace simulated WhatsApp messages with automated WhatsApp templates.
4. **SMTP Email Gateway:** Set up SendGrid, Amazon SES, or Google Workspace SMTP credentials in `.env` for production email notifications.
5. **Admin Password:** Change the default admin password in production via environment configuration.
