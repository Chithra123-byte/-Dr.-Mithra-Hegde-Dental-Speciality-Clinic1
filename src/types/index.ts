export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  price: number;
  priceDisplay: string;
  durationMinutes: number;
  isPopular?: boolean;
  isActive: boolean;
  image?: string;
  availableStaffIds?: string[];
  addons?: ServiceAddon[];
  prerequisites?: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  qualifications: string;
  role: string;
  bio: string;
  specialties: string[];
  avatar: string;
  isActive: boolean;
  isLead?: boolean;
}

export interface TimeSlot {
  time: string; // e.g. "15:30"
  displayTime: string; // e.g. "03:30 PM"
  isAvailable: boolean;
  reason?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  age?: string;
  gender?: string;
  notes?: string;
  agreedToTerms: boolean;
}

export interface Appointment {
  id: string;
  referenceCode: string; // e.g. "DMH-2026-9481"
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  servicePrice: number;
  selectedAddons: ServiceAddon[];
  totalPrice: number;
  durationMinutes: number;
  staffId: string;
  staffName: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "HH:mm" (24h)
  displayTime: string; // "03:30 PM"
  customer: CustomerDetails;
  status: AppointmentStatus;
  statusHistory: Array<{
    status: AppointmentStatus;
    timestamp: string;
    note?: string;
  }>;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  businessName: string;
  legalName: string;
  tagline: string;
  category: string;
  leadSpecialist: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    landmark: string;
  };
  googleMapsUrl: string;
  googleRating: number;
  reviewCount: number;
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      start: string; // "15:30"
      end: string; // "20:00"
      label: string;
    };
  };
  slotIntervalMinutes: number; // 30 mins
  bufferMinutes: number; // 10 mins
  maxAdvanceDays: number; // 30 days
  minLeadHours: number; // 2 hours
  cancellationNoticeHours: number; // 4 hours
  closedDates: string[]; // List of YYYY-MM-DD
  announcementNotice?: string;
}

export interface NotificationLog {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  subject: string;
  content: string;
  status: 'sent' | 'delivered' | 'pending';
  timestamp: string;
  appointmentRef: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}
