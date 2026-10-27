import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

export const SUPABASE_PROJECT_ID = 'slwyuakcgtekywozudyg';
export const SUPABASE_URL = 'https://slwyuakcgtekywozudyg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_vkl_rL3HCewulm-BG9Qajw__e-XJFqI';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Format Appointment entity into Supabase database columns
export const formatAppointmentForSupabase = (apt: Appointment) => {
  return {
    id: apt.id,
    reference_code: apt.referenceCode,
    service_id: apt.serviceId,
    service_name: apt.serviceName,
    service_category: apt.serviceCategory,
    staff_id: apt.staffId,
    staff_name: apt.staffName,
    appointment_date: apt.appointmentDate,
    appointment_time: apt.appointmentTime,
    display_time: apt.displayTime,
    duration_minutes: apt.durationMinutes,
    total_price: apt.totalPrice,
    patient_name: apt.customer.fullName,
    patient_phone: apt.customer.phone,
    patient_email: apt.customer.email || null,
    patient_age: apt.customer.age || null,
    patient_gender: apt.customer.gender || null,
    notes: apt.customer.notes || null,
    status: apt.status,
    created_at: apt.createdAt || new Date().toISOString(),
    updated_at: apt.updatedAt || new Date().toISOString()
  };
};

/**
 * Saves a new appointment directly to the Supabase backend.
 */
export const saveAppointmentToSupabase = async (apt: Appointment): Promise<{ success: boolean; error?: string }> => {
  try {
    const row = formatAppointmentForSupabase(apt);
    const { data, error } = await supabase
      .from('appointments')
      .upsert(row, { onConflict: 'reference_code' });

    if (error) {
      console.warn('[Supabase] Insert notice:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Supabase] Appointment ${apt.referenceCode} saved to Supabase project ${SUPABASE_PROJECT_ID}!`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] Failed to write to Supabase:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Updates status or rescheduled time of an appointment in Supabase.
 */
export const updateAppointmentInSupabase = async (
  referenceCode: string,
  updates: {
    status?: string;
    appointment_date?: string;
    appointment_time?: string;
    display_time?: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('reference_code', referenceCode);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Check connection status and whether the 'appointments' table exists in Supabase.
 */
export const checkSupabaseStatus = async (): Promise<{
  connected: boolean;
  tableReady: boolean;
  projectId: string;
  url: string;
  message: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('reference_code')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return {
          connected: true,
          tableReady: false,
          projectId: SUPABASE_PROJECT_ID,
          url: SUPABASE_URL,
          message: "Connected to Supabase project, but the 'appointments' table has not been created yet. Please execute the provided schema.sql in your Supabase SQL Editor."
        };
      }
      return {
        connected: false,
        tableReady: false,
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        message: `Supabase error: ${error.message}`
      };
    }

    return {
      connected: true,
      tableReady: true,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      message: "Connected! The 'appointments' table is live and active in Supabase."
    };
  } catch (err: any) {
    return {
      connected: false,
      tableReady: false,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      message: err.message || 'Failed to connect to Supabase.'
    };
  }
};

export interface SupabaseAppointmentRow {
  id: string;
  reference_code: string;
  service_id?: string;
  service_name: string;
  service_category?: string;
  staff_id?: string;
  staff_name: string;
  appointment_date: string;
  appointment_time: string;
  display_time: string;
  duration_minutes: number;
  total_price: number;
  patient_name: string;
  patient_phone: string;
  patient_email?: string | null;
  patient_age?: string | null;
  patient_gender?: string | null;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all appointments directly from Supabase database.
 */
export const fetchSupabaseAppointments = async (): Promise<SupabaseAppointmentRow[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (error) {
    console.error('[Supabase] fetch error:', error);
    throw new Error(error.message);
  }

  return (data || []) as SupabaseAppointmentRow[];
};

/**
 * Update any appointment row in Supabase by ID.
 */
export const editSupabaseAppointment = async (
  id: string,
  updates: Partial<SupabaseAppointmentRow>
): Promise<SupabaseAppointmentRow> => {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('appointments')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] update error:', error);
    throw new Error(error.message);
  }

  return data as SupabaseAppointmentRow;
};

/**
 * Cancel an appointment in Supabase.
 */
export const cancelSupabaseAppointment = async (
  id: string,
  reason?: string
): Promise<SupabaseAppointmentRow> => {
  const payload: any = {
    status: 'cancelled',
    updated_at: new Date().toISOString()
  };
  if (reason) {
    payload.notes = reason;
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SupabaseAppointmentRow;
};

/**
 * Delete an appointment completely from Supabase database.
 */
export const deleteSupabaseAppointment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Create a new appointment directly in Supabase from admin panel.
 */
export const createSupabaseAppointment = async (
  row: Omit<SupabaseAppointmentRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<SupabaseAppointmentRow> => {
  const payload = {
    ...row,
    id: row.id || `apt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SupabaseAppointmentRow;
};

