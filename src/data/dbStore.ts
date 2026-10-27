import {
  Appointment,
  AppointmentStatus,
  AuditLog,
  BusinessSettings,
  CustomerDetails,
  NotificationLog,
  Service,
  ServiceAddon,
  Staff,
  TimeSlot
} from '../types';
import { INITIAL_BUSINESS_SETTINGS, INITIAL_SERVICES, STAFF_MEMBERS } from './initialData';
import { saveAppointmentToSupabase, updateAppointmentInSupabase } from '../services/supabase';

class ClinicDatabaseStore {
  private settings: BusinessSettings;
  private services: Service[];
  private staff: Staff[];
  private appointments: Appointment[];
  private notifications: NotificationLog[];
  private auditLogs: AuditLog[];

  constructor() {
    this.settings = { ...INITIAL_BUSINESS_SETTINGS };
    this.services = [...INITIAL_SERVICES];
    this.staff = [...STAFF_MEMBERS];
    this.notifications = [];
    this.auditLogs = [];
    this.appointments = this.generateSeedAppointments();
  }

  private generateSeedAppointments(): Appointment[] {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    return [
      {
        id: "seed-apt-1",
        referenceCode: "DMH-2026-8104",
        serviceId: "micro-rct-single",
        serviceName: "Microscopic Root Canal Treatment (Single Sitting)",
        serviceCategory: "Endodontics & Root Canal",
        servicePrice: 4500,
        selectedAddons: [
          { id: "digital-xray", name: "High-Resolution Digital RVG X-Ray", price: 300, durationMinutes: 10, description: "Instant digital intraoral radiograph" }
        ],
        totalPrice: 4800,
        durationMinutes: 45,
        staffId: "dr-mithra-hegde",
        staffName: "Dr. Mithra N. Hegde",
        appointmentDate: todayStr,
        appointmentTime: "16:00",
        displayTime: "04:00 PM",
        customer: {
          fullName: "Vikram Shenoy",
          email: "vikram.shenoy@example.com",
          phone: "+91 98860 12345",
          countryCode: "+91",
          age: "42",
          gender: "Male",
          notes: "Upper right molar throbbing pain since 2 days. Sensitivity to warm liquids.",
          agreedToTerms: true
        },
        status: "confirmed",
        statusHistory: [
          { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), note: "Online booking confirmed" }
        ],
        internalNotes: "Pre-op RVG advised. Patient allergic to penicillin.",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "seed-apt-2",
        referenceCode: "DMH-2026-5219",
        serviceId: "laser-teeth-whitening",
        serviceName: "In-Office Laser Teeth Whitening",
        serviceCategory: "Cosmetic & Smile Design",
        servicePrice: 8500,
        selectedAddons: [],
        totalPrice: 8500,
        durationMinutes: 60,
        staffId: "dr-mithra-hegde",
        staffName: "Dr. Mithra N. Hegde",
        appointmentDate: todayStr,
        appointmentTime: "17:30",
        displayTime: "05:30 PM",
        customer: {
          fullName: "Pooja Alva",
          email: "pooja.alva@example.com",
          phone: "+91 97412 88410",
          countryCode: "+91",
          age: "29",
          gender: "Female",
          notes: "Pre-wedding aesthetic smile consultation and whitening session.",
          agreedToTerms: true
        },
        status: "confirmed",
        statusHistory: [
          { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 48).toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "seed-apt-3",
        referenceCode: "DMH-2026-3942",
        serviceId: "composite-restoration",
        serviceName: "Nanohybrid Aesthetic Tooth Filling",
        serviceCategory: "Restorative Fillings",
        servicePrice: 1200,
        selectedAddons: [],
        totalPrice: 1200,
        durationMinutes: 30,
        staffId: "dr-rohan-kamath",
        staffName: "Dr. Rohan Kamath",
        appointmentDate: tomorrowStr,
        appointmentTime: "16:30",
        displayTime: "04:30 PM",
        customer: {
          fullName: "Karthik Mendon",
          email: "karthik.mendon@example.com",
          phone: "+91 94481 55670",
          countryCode: "+91",
          age: "35",
          notes: "Food lodgement lower premolars.",
          agreedToTerms: true
        },
        status: "confirmed",
        statusHistory: [
          { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: "seed-apt-4",
        referenceCode: "DMH-2026-1028",
        serviceId: "ultrasonic-scaling-polishing",
        serviceName: "Full Mouth Ultrasonic Scaling & Air Polishing",
        serviceCategory: "Periodontics & Hygiene",
        servicePrice: 1800,
        selectedAddons: [],
        totalPrice: 1800,
        durationMinutes: 30,
        staffId: "dr-shweta-shetty",
        staffName: "Dr. Shweta Shetty",
        appointmentDate: yesterdayStr,
        appointmentTime: "17:00",
        displayTime: "05:00 PM",
        customer: {
          fullName: "Nandini Rao",
          email: "nandini.rao@example.com",
          phone: "+91 98450 67890",
          countryCode: "+91",
          age: "31",
          agreedToTerms: true
        },
        status: "completed",
        statusHistory: [
          { status: "confirmed", timestamp: new Date(Date.now() - 3600000 * 72).toISOString() },
          { status: "completed", timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), note: "Scaling completed. Follow-up 6 months." }
        ],
        internalNotes: "Patient maintained good oral hygiene. Recall scheduled.",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ];
  }

  // --- Settings ---
  public getSettings(): BusinessSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<BusinessSettings>): BusinessSettings {
    this.settings = { ...this.settings, ...partial };
    this.logAudit("UPDATE_SETTINGS", "Admin", "Clinic business settings updated");
    return this.getSettings();
  }

  // --- Services ---
  public getServices(activeOnly: boolean = false): Service[] {
    if (activeOnly) {
      return this.services.filter(s => s.isActive);
    }
    return [...this.services];
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  public updateService(id: string, updates: Partial<Service>): Service | null {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.services[idx] = { ...this.services[idx], ...updates };
    this.logAudit("UPDATE_SERVICE", "Admin", `Service "${this.services[idx].name}" updated`);
    return this.services[idx];
  }

  public addService(newService: Omit<Service, 'id'>): Service {
    const id = `srv-${Date.now()}`;
    const service: Service = { ...newService, id };
    this.services.push(service);
    this.logAudit("ADD_SERVICE", "Admin", `New service "${service.name}" created`);
    return service;
  }

  // --- Staff ---
  public getStaff(activeOnly: boolean = false): Staff[] {
    if (activeOnly) {
      return this.staff.filter(s => s.isActive);
    }
    return [...this.staff];
  }

  public getStaffById(id: string): Staff | undefined {
    return this.staff.find(s => s.id === id);
  }

  // --- Appointment & Availability Engine ---
  public computeAvailableSlots(dateStr: string, serviceId: string, staffId?: string): {
    slots: TimeSlot[];
    businessDayInfo: { isOpen: boolean; reason?: string; workingHoursLabel?: string };
  } {
    const service = this.getServiceById(serviceId);
    if (!service) {
      return {
        slots: [],
        businessDayInfo: { isOpen: false, reason: "Invalid or inactive dental service selected" }
      };
    }

    const targetDate = new Date(`${dateStr}T00:00:00`);
    if (isNaN(targetDate.getTime())) {
      return {
        slots: [],
        businessDayInfo: { isOpen: false, reason: "Invalid calendar date" }
      };
    }

    // Check past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return {
        slots: [],
        businessDayInfo: { isOpen: false, reason: "Cannot book appointments for past dates" }
      };
    }

    // Check maximum advance booking window
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + this.settings.maxAdvanceDays);
    if (targetDate > maxDate) {
      return {
        slots: [],
        businessDayInfo: { isOpen: false, reason: `Booking is open only up to ${this.settings.maxAdvanceDays} days in advance` }
      };
    }

    // Check blackout / holiday dates
    if (this.settings.closedDates.includes(dateStr)) {
      return {
        slots: [],
        businessDayInfo: { isOpen: false, reason: "Clinic is closed on this date (Holiday / Observance)" }
      };
    }

    // Check Day of week in clinic settings
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[targetDate.getDay()];
    const dayConfig = this.settings.workingHours[dayName];

    if (!dayConfig || !dayConfig.isOpen) {
      return {
        slots: [],
        businessDayInfo: {
          isOpen: false,
          reason: dayName === 'sunday' ? "Clinic is closed on Sundays (Emergency on-call only)" : "Clinic closed on this day"
        }
      };
    }

    // Working hours range (e.g., 15:30 to 20:00)
    const [startH, startM] = dayConfig.start.split(':').map(Number);
    const [endH, endM] = dayConfig.end.split(':').map(Number);

    const clinicStartMinutes = startH * 60 + startM;
    const clinicEndMinutes = endH * 60 + endM;
    const intervalMinutes = this.settings.slotIntervalMinutes || 30;
    const duration = service.durationMinutes || 30;

    // Gather existing active bookings for this date
    // Note: status !== 'cancelled'
    const existingAppointments = this.appointments.filter(
      apt => apt.appointmentDate === dateStr && apt.status !== 'cancelled'
    );

    const now = new Date();
    const isToday = targetDate.toDateString() === now.toDateString();
    const currentMinutesNow = now.getHours() * 60 + now.getMinutes();
    const minLeadMinutes = (this.settings.minLeadHours || 2) * 60;

    const slots: TimeSlot[] = [];

    for (let m = clinicStartMinutes; m + duration <= clinicEndMinutes; m += intervalMinutes) {
      const slotHour = Math.floor(m / 60);
      const slotMinute = m % 60;
      const timeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`;
      
      const period = slotHour >= 12 ? 'PM' : 'AM';
      const displayHour = slotHour % 12 === 0 ? 12 : slotHour % 12;
      const displayTime = `${String(displayHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')} ${period}`;

      // If today, enforce minimum lead time
      if (isToday && m < currentMinutesNow + minLeadMinutes) {
        slots.push({
          time: timeStr,
          displayTime,
          isAvailable: false,
          reason: "Lead time window has passed for today"
        });
        continue;
      }

      // Check slot conflict
      // Slot runs from m to (m + duration)
      const slotStart = m;
      const slotEnd = m + duration;

      let isOccupied = false;
      let conflictReason = "";

      for (const apt of existingAppointments) {
        // If staffId filter is applied, only conflict if same staff member
        if (staffId && staffId !== 'any' && apt.staffId !== staffId) {
          continue;
        }

        const [aptH, aptM] = apt.appointmentTime.split(':').map(Number);
        const aptStart = aptH * 60 + aptM;
        const aptEnd = aptStart + apt.durationMinutes;

        // Check overlap: slotStart < aptEnd && slotEnd > aptStart
        if (slotStart < aptEnd && slotEnd > aptStart) {
          isOccupied = true;
          conflictReason = `Reserved with ${apt.staffName}`;
          break;
        }
      }

      slots.push({
        time: timeStr,
        displayTime,
        isAvailable: !isOccupied,
        reason: isOccupied ? conflictReason : undefined
      });
    }

    return {
      slots,
      businessDayInfo: {
        isOpen: true,
        workingHoursLabel: dayConfig.label
      }
    };
  }

  // --- Atomic Appointment Booking with Concurrency Control ---
  public createAppointment(payload: {
    serviceId: string;
    staffId: string;
    appointmentDate: string;
    appointmentTime: string;
    customer: CustomerDetails;
    addonIds?: string[];
  }): { success: boolean; appointment?: Appointment; error?: string } {
    // 1. Validate service
    const service = this.getServiceById(payload.serviceId);
    if (!service || !service.isActive) {
      return { success: false, error: "The selected dental service is currently unavailable or inactive." };
    }

    // 2. Validate staff
    let selectedStaff: Staff | undefined;
    if (payload.staffId === 'any') {
      // Find an available staff member who can perform this service
      const eligibleStaff = this.staff.filter(
        st => st.isActive && (!service.availableStaffIds || service.availableStaffIds.includes(st.id))
      );
      selectedStaff = eligibleStaff[0] || this.staff[0];
    } else {
      selectedStaff = this.getStaffById(payload.staffId);
    }

    if (!selectedStaff) {
      return { success: false, error: "Selected specialist is not available." };
    }

    // 3. Validate customer details
    if (!payload.customer.fullName?.trim() || !payload.customer.phone?.trim()) {
      return { success: false, error: "Patient name and contact mobile number are strictly required." };
    }

    // 4. Server-side Availability & Concurrency Lock
    const availability = this.computeAvailableSlots(
      payload.appointmentDate,
      payload.serviceId,
      selectedStaff.id
    );

    const slot = availability.slots.find(s => s.time === payload.appointmentTime);
    if (!slot || !slot.isAvailable) {
      return {
        success: false,
        error: "This appointment slot is no longer available. Please select another time."
      };
    }

    // 5. Calculate selected add-ons and pricing snapshot
    const selectedAddons: ServiceAddon[] = [];
    let addonsTotal = 0;
    let extraDuration = 0;

    if (payload.addonIds && payload.addonIds.length > 0 && service.addons) {
      for (const addonId of payload.addonIds) {
        const found = service.addons.find(a => a.id === addonId);
        if (found) {
          selectedAddons.push(found);
          addonsTotal += found.price;
          extraDuration += found.durationMinutes;
        }
      }
    }

    const totalPrice = service.price + addonsTotal;
    const totalDuration = service.durationMinutes + extraDuration;

    // 6. Generate unique reference code (DMH-YEAR-XXXX)
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `DMH-${new Date().getFullYear()}-${randomHex}`;

    // Convert time to 12h display
    const [h, m] = payload.appointmentTime.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const dispH = h % 12 === 0 ? 12 : h % 12;
    const displayTime = `${String(dispH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;

    const nowIso = new Date().toISOString();
    const appointment: Appointment = {
      id: `apt-${Date.now()}-${randomHex}`,
      referenceCode,
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.categoryName,
      servicePrice: service.price,
      selectedAddons,
      totalPrice,
      durationMinutes: totalDuration,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      displayTime,
      customer: payload.customer,
      status: "confirmed",
      statusHistory: [
        { status: "confirmed", timestamp: nowIso, note: "Appointment confirmed and reserved" }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.appointments.unshift(appointment);

    // 7. Dispatch simulated automated notifications
    this.createNotificationLog({
      type: 'sms',
      recipient: payload.customer.phone,
      subject: "Appointment Confirmed - Dr. Mithra Hegde Dental Clinic",
      content: `Dear ${payload.customer.fullName}, your dental appointment for ${service.name} is confirmed for ${payload.appointmentDate} at ${displayTime} with ${selectedStaff.name}. Ref: ${referenceCode}. Location: Mangalore Gate, Kankanady. Contact: +91 98452 84411.`,
      appointmentRef: referenceCode
    });

    if (payload.customer.email) {
      this.createNotificationLog({
        type: 'email',
        recipient: payload.customer.email,
        subject: `Confirmed: Dental Consultation (${referenceCode}) - Dr. Mithra Hegde's Clinic`,
        content: `Dear ${payload.customer.fullName},\n\nWe have successfully reserved your appointment:\n• Service: ${service.name}\n• Specialist: ${selectedStaff.name}\n• Date & Time: ${payload.appointmentDate} at ${displayTime}\n• Clinic Address: 3rd Floor, Commercial Complex, Mangalore Gate, Kankanady, Mangaluru.\n\nThank you for choosing Dr. Mithra Hegde's Dental Speciality Clinic.`,
        appointmentRef: referenceCode
      });
    }

    this.createNotificationLog({
      type: 'whatsapp',
      recipient: payload.customer.phone,
      subject: "WhatsApp Booking Receipt",
      content: `Dr. Mithra Hegde's Dental Speciality Clinic: Confirmed booking #${referenceCode} on ${payload.appointmentDate} at ${displayTime}. Need to reschedule? Visit our portal or call +91 98452 84411.`,
      appointmentRef: referenceCode
    });

    this.logAudit("CREATE_APPOINTMENT", payload.customer.fullName, `Booking created ${referenceCode} for ${service.name}`);

    // Auto-save to connected Supabase database
    saveAppointmentToSupabase(appointment).catch(err => {
      console.warn('[Supabase auto-save error]:', err);
    });

    return { success: true, appointment };
  }

  // --- Lookup & Management ---
  public getAppointments(): Appointment[] {
    return [...this.appointments];
  }

  public getAppointmentByReference(refCode: string, phoneOrEmail?: string): Appointment | null {
    const cleanRef = refCode.trim().toUpperCase();
    const apt = this.appointments.find(a => a.referenceCode === cleanRef);
    if (!apt) return null;

    if (phoneOrEmail) {
      const match = phoneOrEmail.trim().toLowerCase();
      const phoneDigits = match.replace(/\D/g, '');
      const aptPhoneDigits = apt.customer.phone.replace(/\D/g, '');

      const isPhoneMatch = phoneDigits.length >= 7 && (aptPhoneDigits.endsWith(phoneDigits) || phoneDigits.endsWith(aptPhoneDigits));
      const isEmailMatch = apt.customer.email && apt.customer.email.toLowerCase() === match;

      if (!isPhoneMatch && !isEmailMatch) {
        return null;
      }
    }

    return apt;
  }

  public rescheduleAppointment(
    refCode: string,
    newDate: string,
    newTime: string
  ): { success: boolean; appointment?: Appointment; error?: string } {
    const apt = this.getAppointmentByReference(refCode);
    if (!apt) return { success: false, error: "Appointment not found." };

    if (apt.status === 'cancelled' || apt.status === 'completed') {
      return { success: false, error: `Cannot reschedule an appointment marked as ${apt.status}.` };
    }

    // Availability validation for new slot
    const availability = this.computeAvailableSlots(newDate, apt.serviceId, apt.staffId);
    const slot = availability.slots.find(s => s.time === newTime);
    if (!slot || !slot.isAvailable) {
      return { success: false, error: "The newly selected slot is unavailable." };
    }

    const [h, m] = newTime.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const dispH = h % 12 === 0 ? 12 : h % 12;
    const newDisplayTime = `${String(dispH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;

    const prevDate = apt.appointmentDate;
    const prevTime = apt.displayTime;

    apt.appointmentDate = newDate;
    apt.appointmentTime = newTime;
    apt.displayTime = newDisplayTime;
    apt.status = 'rescheduled';
    apt.updatedAt = new Date().toISOString();
    apt.statusHistory.push({
      status: 'rescheduled',
      timestamp: new Date().toISOString(),
      note: `Rescheduled from ${prevDate} ${prevTime} to ${newDate} ${newDisplayTime}`
    });

    this.createNotificationLog({
      type: 'sms',
      recipient: apt.customer.phone,
      subject: "Appointment Rescheduled - Dr. Mithra Hegde Clinic",
      content: `Your appointment ${apt.referenceCode} has been rescheduled to ${newDate} at ${newDisplayTime}. Clinic phone: +91 98452 84411.`,
      appointmentRef: apt.referenceCode
    });

    this.logAudit("RESCHEDULE_APPOINTMENT", apt.customer.fullName, `Rescheduled ${refCode} to ${newDate} ${newDisplayTime}`);

    updateAppointmentInSupabase(apt.referenceCode, {
      status: 'rescheduled',
      appointment_date: newDate,
      appointment_time: newTime,
      display_time: newDisplayTime
    }).catch(err => console.warn('[Supabase reschedule error]:', err));

    return { success: true, appointment: apt };
  }

  public cancelAppointment(refCode: string, reason?: string): { success: boolean; error?: string } {
    const apt = this.getAppointmentByReference(refCode);
    if (!apt) return { success: false, error: "Appointment not found." };

    if (apt.status === 'cancelled') {
      return { success: false, error: "Appointment is already cancelled." };
    }

    apt.status = 'cancelled';
    apt.updatedAt = new Date().toISOString();
    apt.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      note: reason || "Cancelled by patient"
    });

    this.createNotificationLog({
      type: 'sms',
      recipient: apt.customer.phone,
      subject: "Appointment Cancelled",
      content: `Your appointment ${apt.referenceCode} at Dr. Mithra Hegde's Clinic has been cancelled. If you wish to re-book, please visit our website.`,
      appointmentRef: apt.referenceCode
    });

    this.logAudit("CANCEL_APPOINTMENT", apt.customer.fullName, `Cancelled ${refCode}: ${reason || 'No reason provided'}`);

    updateAppointmentInSupabase(apt.referenceCode, {
      status: 'cancelled'
    }).catch(err => console.warn('[Supabase cancel error]:', err));

    return { success: true };
  }

  public updateAppointmentAdmin(
    id: string,
    updates: { status?: AppointmentStatus; internalNotes?: string }
  ): Appointment | null {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return null;

    if (updates.status && updates.status !== apt.status) {
      apt.status = updates.status;
      apt.statusHistory.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        note: `Status updated by Admin to ${updates.status}`
      });

      updateAppointmentInSupabase(apt.referenceCode, {
        status: updates.status
      }).catch(err => console.warn('[Supabase admin update error]:', err));
    }

    if (updates.internalNotes !== undefined) {
      apt.internalNotes = updates.internalNotes;
    }

    apt.updatedAt = new Date().toISOString();
    this.logAudit("ADMIN_UPDATE_APPOINTMENT", "Admin", `Updated status/notes for ${apt.referenceCode}`);
    return apt;
  }

  // --- Statistics ---
  public getDashboardStats() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = this.appointments.filter(a => a.appointmentDate === todayStr);

    const todayConfirmed = todayAppointments.filter(a => a.status === 'confirmed' || a.status === 'rescheduled');
    const todayCompleted = todayAppointments.filter(a => a.status === 'completed');
    const totalCompleted = this.appointments.filter(a => a.status === 'completed');
    const totalCancelled = this.appointments.filter(a => a.status === 'cancelled');
    const totalUpcoming = this.appointments.filter(
      a => a.appointmentDate >= todayStr && (a.status === 'confirmed' || a.status === 'rescheduled')
    );

    const estimatedRevenue = this.appointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed')
      .reduce((sum, a) => sum + (a.totalPrice || 0), 0);

    return {
      todayTotal: todayAppointments.length,
      todayConfirmed: todayConfirmed.length,
      todayCompleted: todayCompleted.length,
      totalUpcoming: totalUpcoming.length,
      totalCompleted: totalCompleted.length,
      totalCancelled: totalCancelled.length,
      estimatedRevenue,
      totalPatients: new Set(this.appointments.map(a => a.customer.phone)).size
    };
  }

  // --- Notification & Audit Logs ---
  private createNotificationLog(log: Omit<NotificationLog, 'id' | 'timestamp' | 'status'>) {
    this.notifications.unshift({
      ...log,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'delivered',
      timestamp: new Date().toISOString()
    });
  }

  public getNotificationLogs(): NotificationLog[] {
    return [...this.notifications];
  }

  private logAudit(action: string, performedBy: string, details: string) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString()
    });
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }
}

// Singleton instance
export const clinicDb = new ClinicDatabaseStore();
