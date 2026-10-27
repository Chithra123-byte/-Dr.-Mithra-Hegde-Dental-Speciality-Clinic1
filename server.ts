import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { clinicDb } from './src/data/dbStore.ts';
import { CLINIC_FAQS, PATIENT_TESTIMONIALS, SERVICE_CATEGORIES } from './src/data/initialData.ts';
import { checkSupabaseStatus, saveAppointmentToSupabase, SUPABASE_PROJECT_ID, SUPABASE_URL } from './src/services/supabase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parser
app.use(express.json());

// Simple Bearer token admin auth check middleware
const ADMIN_TOKEN = "dr-mithra-admin-auth-session-2026";

const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized: Administrator credentials required" });
    return;
  }
  next();
};

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// 1. Clinic Info & Configuration
app.get('/api/clinic-info', (_req: Request, res: Response) => {
  const settings = clinicDb.getSettings();
  res.json({
    settings,
    categories: SERVICE_CATEGORIES,
    testimonials: PATIENT_TESTIMONIALS,
    faqs: CLINIC_FAQS
  });
});

// 2. Services List
app.get('/api/services', (req: Request, res: Response) => {
  const activeOnly = req.query.all !== 'true';
  const services = clinicDb.getServices(activeOnly);
  res.json(services);
});

// 3. Staff List
app.get('/api/staff', (req: Request, res: Response) => {
  const activeOnly = req.query.all !== 'true';
  const staff = clinicDb.getStaff(activeOnly);
  res.json(staff);
});

// 4. Availability Slot Engine
app.get('/api/availability', (req: Request, res: Response) => {
  const { date, serviceId, staffId } = req.query;

  if (!date || typeof date !== 'string' || !serviceId || typeof serviceId !== 'string') {
    res.status(400).json({ error: "date and serviceId query parameters are required" });
    return;
  }

  const result = clinicDb.computeAvailableSlots(
    date,
    serviceId,
    typeof staffId === 'string' ? staffId : undefined
  );

  res.json(result);
});

// 5. Atomic Appointment Booking
app.post('/api/appointments', (req: Request, res: Response) => {
  const { serviceId, staffId, appointmentDate, appointmentTime, customer, addonIds } = req.body;

  if (!serviceId || !staffId || !appointmentDate || !appointmentTime || !customer) {
    res.status(400).json({ error: "Missing required booking fields" });
    return;
  }

  const result = clinicDb.createAppointment({
    serviceId,
    staffId,
    appointmentDate,
    appointmentTime,
    customer,
    addonIds
  });

  if (!result.success) {
    res.status(409).json({ error: result.error });
    return;
  }

  res.status(201).json(result.appointment);
});

// 6. Look up Appointment by Reference
app.get('/api/appointments/:reference', (req: Request, res: Response) => {
  const { reference } = req.params;
  const phoneOrEmail = req.query.verify as string | undefined;

  const appointment = clinicDb.getAppointmentByReference(reference, phoneOrEmail);
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found or verification details did not match." });
    return;
  }

  res.json(appointment);
});

// 7. Reschedule Appointment
app.patch('/api/appointments/:reference/reschedule', (req: Request, res: Response) => {
  const { reference } = req.params;
  const { newDate, newTime } = req.body;

  if (!newDate || !newTime) {
    res.status(400).json({ error: "newDate and newTime are required." });
    return;
  }

  const result = clinicDb.rescheduleAppointment(reference, newDate, newTime);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json(result.appointment);
});

// 8. Cancel Appointment
app.patch('/api/appointments/:reference/cancel', (req: Request, res: Response) => {
  const { reference } = req.params;
  const { reason } = req.body;

  const result = clinicDb.cancelAppointment(reference, reason);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({ message: "Appointment cancelled successfully." });
});

// 9. Contact Inquiry Submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    res.status(400).json({ error: "Name, phone number, and message are required." });
    return;
  }

  res.json({
    success: true,
    message: "Thank you for reaching out to Dr. Mithra Hegde's clinic. Our front desk will contact you shortly."
  });
});

// ==========================================
// ADMIN API ROUTES (Protected)
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Default verified credentials for administrator
  if (
    (email === 'admin@drmithrahegde.com' || email === 'admin') &&
    (password === 'MithraClinic@2026' || password === 'admin123')
  ) {
    res.json({
      token: ADMIN_TOKEN,
      user: {
        name: "Dr. Mithra Hegde (Administrator)",
        email: "admin@drmithrahegde.com",
        role: "Chief Dental Director"
      }
    });
  } else {
    res.status(401).json({ error: "Invalid administrator credentials." });
  }
});

// Admin Dashboard Overview Stats
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const stats = clinicDb.getDashboardStats();
  res.json(stats);
});

// Admin All Appointments with Filtering
app.get('/api/admin/appointments', requireAdmin, (req: Request, res: Response) => {
  let appointments = clinicDb.getAppointments();

  const { date, status, staffId, search } = req.query;

  if (date && typeof date === 'string') {
    appointments = appointments.filter(a => a.appointmentDate === date);
  }

  if (status && typeof status === 'string' && status !== 'all') {
    appointments = appointments.filter(a => a.status === status);
  }

  if (staffId && typeof staffId === 'string' && staffId !== 'all') {
    appointments = appointments.filter(a => a.staffId === staffId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    appointments = appointments.filter(
      a =>
        a.referenceCode.toLowerCase().includes(q) ||
        a.customer.fullName.toLowerCase().includes(q) ||
        a.customer.phone.includes(q) ||
        a.serviceName.toLowerCase().includes(q)
    );
  }

  res.json(appointments);
});

// Admin Update Appointment (Status or Internal Clinical Notes)
app.patch('/api/admin/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;

  const updated = clinicDb.updateAppointmentAdmin(id, { status, internalNotes });
  if (!updated) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(updated);
});

// Admin Create Walk-in / Phone-in Appointment
app.post('/api/admin/appointments', requireAdmin, (req: Request, res: Response) => {
  const { serviceId, staffId, appointmentDate, appointmentTime, customer, addonIds } = req.body;
  const result = clinicDb.createAppointment({
    serviceId,
    staffId,
    appointmentDate,
    appointmentTime,
    customer,
    addonIds
  });

  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json(result.appointment);
});

// Admin Services Management
app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = clinicDb.updateService(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(updated);
});

app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
  const service = clinicDb.addService(req.body);
  res.status(201).json(service);
});

// Admin Settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = clinicDb.updateSettings(req.body);
  res.json(updated);
});

// Admin Logs (Notification & Audit)
app.get('/api/admin/logs', requireAdmin, (_req: Request, res: Response) => {
  res.json({
    notifications: clinicDb.getNotificationLogs(),
    audit: clinicDb.getAuditLogs()
  });
});

// Supabase Status Check
app.get('/api/supabase/status', async (_req: Request, res: Response) => {
  const status = await checkSupabaseStatus();
  res.json(status);
});

// Admin Sync All Appointments to Supabase
app.post('/api/admin/supabase/sync', requireAdmin, async (_req: Request, res: Response) => {
  const appointments = clinicDb.getAppointments();
  let successCount = 0;
  let failCount = 0;
  let lastError = '';

  for (const apt of appointments) {
    const result = await saveAppointmentToSupabase(apt);
    if (result.success) {
      successCount++;
    } else {
      failCount++;
      lastError = result.error || 'Unknown error';
    }
  }

  res.json({
    total: appointments.length,
    successCount,
    failCount,
    lastError: failCount > 0 ? lastError : undefined,
    projectId: SUPABASE_PROJECT_ID
  });
});

// ==========================================
// VITE OR STATIC FRONTEND SERVING
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      const htmlFile = path.join(distPath, 'index.html');
      if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dr. Mithra Hegde Dental Portal] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
