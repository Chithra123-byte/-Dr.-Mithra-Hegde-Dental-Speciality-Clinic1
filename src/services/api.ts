import {
  Appointment,
  AppointmentStatus,
  AuditLog,
  BusinessSettings,
  CustomerDetails,
  NotificationLog,
  Service,
  ServiceCategory,
  Staff,
  TimeSlot
} from '../types';
import {
  fetchSupabaseAppointments,
  editSupabaseAppointment,
  cancelSupabaseAppointment,
  deleteSupabaseAppointment,
  createSupabaseAppointment,
  SupabaseAppointmentRow
} from './supabase';

const ADMIN_TOKEN_KEY = 'dmh_admin_token';

export const getStoredAdminToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setStoredAdminToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
};

const getAuthHeaders = (): HeadersInit => {
  const token = getStoredAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Clinic Info
  async getClinicInfo(): Promise<{
    settings: BusinessSettings;
    categories: ServiceCategory[];
    testimonials: any[];
    faqs: any[];
  }> {
    const res = await fetch('/api/clinic-info');
    if (!res.ok) throw new Error('Failed to load clinic information');
    return res.json();
  },

  // Services
  async getServices(all: boolean = false): Promise<Service[]> {
    const res = await fetch(`/api/services${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to load services');
    return res.json();
  },

  // Staff
  async getStaff(all: boolean = false): Promise<Staff[]> {
    const res = await fetch(`/api/staff${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to load specialists');
    return res.json();
  },

  // Availability calculation
  async getAvailability(date: string, serviceId: string, staffId?: string): Promise<{
    slots: TimeSlot[];
    businessDayInfo: { isOpen: boolean; reason?: string; workingHoursLabel?: string };
  }> {
    const params = new URLSearchParams({ date, serviceId });
    if (staffId && staffId !== 'any') {
      params.append('staffId', staffId);
    }
    const res = await fetch(`/api/availability?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to calculate available appointment slots');
    }
    return res.json();
  },

  // Create Appointment
  async createAppointment(payload: {
    serviceId: string;
    staffId: string;
    appointmentDate: string;
    appointmentTime: string;
    customer: CustomerDetails;
    addonIds?: string[];
  }): Promise<Appointment> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create booking');
    }
    return res.json();
  },

  // Lookup Appointment
  async lookupAppointment(reference: string, verify?: string): Promise<Appointment> {
    const url = `/api/appointments/${encodeURIComponent(reference)}${
      verify ? `?verify=${encodeURIComponent(verify)}` : ''
    }`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Appointment not found or details mismatch');
    }
    return res.json();
  },

  // Reschedule
  async rescheduleAppointment(reference: string, newDate: string, newTime: string): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${encodeURIComponent(reference)}/reschedule`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate, newTime })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reschedule appointment');
    }
    return res.json();
  },

  // Cancel
  async cancelAppointment(reference: string, reason?: string): Promise<{ message: string }> {
    const res = await fetch(`/api/appointments/${encodeURIComponent(reference)}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to cancel appointment');
    }
    return res.json();
  },

  // Contact Form
  async submitContact(data: { name: string; phone: string; email?: string; message: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit inquiry');
    }
    return res.json();
  },

  // Admin Login
  async adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid admin credentials');
    }
    const data = await res.json();
    setStoredAdminToken(data.token);
    return data;
  },

  // Admin Stats
  async getAdminStats(): Promise<{
    todayTotal: number;
    todayConfirmed: number;
    todayCompleted: number;
    totalUpcoming: number;
    totalCompleted: number;
    totalCancelled: number;
    estimatedRevenue: number;
    totalPatients: number;
  }> {
    const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized or failed to load stats');
    return res.json();
  },

  // Admin Appointments List
  async getAdminAppointments(filters?: {
    date?: string;
    status?: string;
    staffId?: string;
    search?: string;
  }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.staffId) params.append('staffId', filters.staffId);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`/api/admin/appointments?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load appointments');
    return res.json();
  },

  // Admin Update Appointment
  async updateAdminAppointment(id: string, updates: { status?: AppointmentStatus; internalNotes?: string }): Promise<Appointment> {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  },

  // Admin Create Appointment
  async createAdminAppointment(payload: any): Promise<Appointment> {
    const res = await fetch('/api/admin/appointments', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create booking');
    }
    return res.json();
  },

  // Admin Update Service
  async updateAdminService(id: string, updates: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },

  // Admin Create Service
  async createAdminService(service: Omit<Service, 'id'>): Promise<Service> {
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },

  // Admin Update Settings
  async updateAdminSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Admin Logs
  async getAdminLogs(): Promise<{ notifications: NotificationLog[]; audit: AuditLog[] }> {
    const res = await fetch('/api/admin/logs', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load logs');
    return res.json();
  },

  // Supabase Status
  async getSupabaseStatus(): Promise<{
    connected: boolean;
    tableReady: boolean;
    projectId: string;
    url: string;
    message: string;
  }> {
    const res = await fetch('/api/supabase/status');
    if (!res.ok) throw new Error('Failed to fetch Supabase status');
    return res.json();
  },

  // Admin Sync To Supabase
  async syncToSupabase(): Promise<{
    total: number;
    successCount: number;
    failCount: number;
    lastError?: string;
    projectId: string;
  }> {
    const res = await fetch('/api/admin/supabase/sync', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to sync with Supabase');
    return res.json();
  },

  // Direct Supabase Database Methods
  async getSupabaseBookings(): Promise<SupabaseAppointmentRow[]> {
    return fetchSupabaseAppointments();
  },

  async updateSupabaseBooking(id: string, updates: Partial<SupabaseAppointmentRow>): Promise<SupabaseAppointmentRow> {
    return editSupabaseAppointment(id, updates);
  },

  async cancelSupabaseBooking(id: string, reason?: string): Promise<SupabaseAppointmentRow> {
    return cancelSupabaseAppointment(id, reason);
  },

  async deleteSupabaseBooking(id: string): Promise<void> {
    return deleteSupabaseAppointment(id);
  },

  async createSupabaseBooking(data: any): Promise<SupabaseAppointmentRow> {
    return createSupabaseAppointment(data);
  }
};
