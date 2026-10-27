import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Download,
  CalendarPlus,
  RefreshCw,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { saveAppointmentToSupabase } from '../../services/supabase';
import { Appointment, CustomerDetails, Service, ServiceAddon, Staff, TimeSlot } from '../../types';

interface BookingWizardProps {
  services: Service[];
  staffMembers: Staff[];
  preselectedServiceId?: string;
  onClose?: () => void;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  staffMembers,
  preselectedServiceId,
  onClose,
  onBookingSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || services[0]?.id || '');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('dr-mithra-hegde');
  
  // Date selection
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today if open and time allows, else tomorrow
    const d = new Date();
    // If today is Sunday (0), pick Monday
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  });

  // Time slot selection
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [dayInfo, setDayInfo] = useState<{ isOpen: boolean; reason?: string; workingHoursLabel?: string }>({
    isOpen: true
  });
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string>('');

  // Customer Form
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    age: '',
    gender: 'Prefer not to say',
    notes: '',
    agreedToTerms: false
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Active Service & Staff objects
  const activeService = services.find(s => s.id === selectedServiceId) || services[0];
  const activeStaff = staffMembers.find(s => s.id === selectedStaffId);

  // When preselectedServiceId changes
  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  // Load available time slots when date, service, or staff changes
  useEffect(() => {
    if (!selectedDate || !selectedServiceId) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setSlotsError('');

    api.getAvailability(selectedDate, selectedServiceId, selectedStaffId)
      .then(res => {
        if (!isMounted) return;
        setSlots(res.slots);
        setDayInfo(res.businessDayInfo);
        // Deselect time if no longer valid
        if (selectedTime && !res.slots.some(s => s.time === selectedTime && s.isAvailable)) {
          setSelectedTime('');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setSlotsError(err.message || 'Failed to fetch slots');
        setSlots([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedServiceId, selectedStaffId]);

  // Toggle Addon
  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  // Pricing calculation
  const selectedAddonsList: ServiceAddon[] = (activeService?.addons || []).filter(a =>
    selectedAddonIds.includes(a.id)
  );
  const addonsTotal = selectedAddonsList.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (activeService?.price || 0) + addonsTotal;
  const totalDuration = (activeService?.durationMinutes || 30) +
    selectedAddonsList.reduce((sum, a) => sum + a.durationMinutes, 0);

  // Handle Booking Submission
  const handleConfirmBooking = async () => {
    setSubmitError('');

    if (!customer.fullName.trim() || !customer.phone.trim()) {
      setSubmitError('Please enter your full name and contact phone number.');
      return;
    }

    if (!customer.agreedToTerms) {
      setSubmitError('You must agree to the appointment cancellation policy and terms to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const appointment = await api.createAppointment({
        serviceId: selectedServiceId,
        staffId: selectedStaffId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        customer,
        addonIds: selectedAddonIds
      });

      setConfirmedAppointment(appointment);
      setCurrentStep(7); // Jump to step 7 (Confirmation)

      // Direct write to Supabase database
      saveAppointmentToSupabase(appointment).catch(err => {
        console.warn('[Supabase client save]:', err);
      });

      if (onBookingSuccess) {
        onBookingSuccess(appointment);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to confirm booking. The slot might have been taken. Please choose another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (apt: Appointment) => {
    const title = encodeURIComponent(`${apt.serviceName} - Dr. Mithra Hegde's Clinic`);
    const details = encodeURIComponent(
      `Appointment Ref: ${apt.referenceCode}\nSpecialist: ${apt.staffName}\nClinic: 3rd Floor, Commercial Complex, Mangalore Gate, Kankanady, Mangaluru.\nPhone: +91 98452 84411`
    );
    const location = encodeURIComponent("Dr. Mithra Hegde's Dental Speciality Clinic, Mangalore Gate, Kankanady, Mangaluru");

    // Format start/end in UTC for Google Calendar: YYYYMMDDTHHmmssZ
    // Using date and time (assuming IST = UTC+5:30)
    const [h, m] = apt.appointmentTime.split(':').map(Number);
    const startDate = new Date(`${apt.appointmentDate}T${apt.appointmentTime}:00+05:30`);
    const endDate = new Date(startDate.getTime() + apt.durationMinutes * 60000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const formatUtc = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatUtc(startDate)}/${formatUtc(endDate)}&details=${details}&location=${location}`;
  };

  // Download iCal (.ics) file
  const downloadIcsFile = (apt: Appointment) => {
    const [h, m] = apt.appointmentTime.split(':').map(Number);
    const startDate = new Date(`${apt.appointmentDate}T${apt.appointmentTime}:00+05:30`);
    const endDate = new Date(startDate.getTime() + apt.durationMinutes * 60000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const formatUtc = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dr Mithra Hegde Dental Speciality Clinic//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${apt.id}@drmithrahegde.com`,
      `DTSTAMP:${formatUtc(new Date())}`,
      `DTSTART:${formatUtc(startDate)}`,
      `DTEND:${formatUtc(endDate)}`,
      `SUMMARY:${apt.serviceName} - Dr. Mithra Hegde Clinic`,
      `DESCRIPTION:Appointment Reference: ${apt.referenceCode}\\nSpecialist: ${apt.staffName}\\nContact: +91 98452 84411`,
      'LOCATION:3rd Floor, Commercial Complex, Mangalore Gate, Kankanady, Mangaluru',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${apt.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl w-full mx-auto">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold block">
            Online Appointment Reservation
          </span>
          <h2 className="text-lg sm:text-xl font-display font-bold">
            Dr. Mithra Hegde’s Dental Speciality Clinic
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Stepper Indicator (Steps 1 to 6) */}
      {currentStep <= 6 && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Doctor' },
              { num: 3, label: 'Date' },
              { num: 4, label: 'Time' },
              { num: 5, label: 'Details' },
              { num: 6, label: 'Review' }
            ].map(step => (
              <div
                key={step.num}
                className="flex items-center gap-1.5"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    currentStep === step.num
                      ? 'bg-teal-700 text-white ring-2 ring-teal-200'
                      : currentStep > step.num
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <span
                  className={`hidden sm:inline font-medium ${
                    currentStep === step.num
                      ? 'text-slate-900 font-semibold'
                      : currentStep > step.num
                      ? 'text-teal-900'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content Area */}
      <div className="p-6 sm:p-8 min-h-[420px]">

        {/* STEP 1: Select Service & Add-ons */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Step 1: Choose a Dental Treatment
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Select your required dental procedure. Transparent pricing and estimated duration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedServiceId === service.id
                      ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
                        {service.categoryName}
                      </span>
                      <h4 className="font-semibold text-slate-900 text-base mt-0.5">
                        {service.name}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display font-bold text-slate-900 text-base tabular-nums">
                        {service.priceDisplay}
                      </span>
                      <span className="block text-xs text-slate-500 tabular-nums">
                        {service.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Optional Add-ons for selected service */}
            {activeService?.addons && activeService.addons.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
                  Optional Recommended Add-Ons
                </span>
                <div className="space-y-2">
                  {activeService.addons.map(addon => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          isChecked ? 'bg-teal-50 border-teal-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon.id)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                          />
                          <div>
                            <span className="text-sm font-semibold text-slate-900 block">
                              {addon.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {addon.description} (+{addon.durationMinutes} mins)
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-slate-800 tabular-nums">
                          +₹{addon.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Choose Specialist Doctor */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Step 2: Choose Your Dental Specialist
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Consult directly with Dr. Mithra N. Hegde or our associate clinical consultants.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option: Any Available Professional */}
              <div
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedStaffId === 'any'
                    ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Any Available Specialist</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Fastest appointment allocation by our senior clinical team based on slot availability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Staff Members List */}
              {staffMembers.map(staff => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedStaffId === staff.id
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-base">
                          {staff.name}
                        </h4>
                        {staff.isLead && (
                          <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                            Chief Specialist · Dean
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-teal-800 font-medium mt-0.5">
                        {staff.qualifications} · {staff.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {staff.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Choose Date */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Step 3: Select Consultation Date
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Appointments are conducted Monday through Saturday between 3:30 PM and 8:00 PM. Clinic is closed on Sundays.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-md mx-auto">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Pick a Date (Within Next 30 Days)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  max={(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 30);
                    return d.toISOString().split('T')[0];
                  })()}
                  onChange={e => {
                    setSelectedDate(e.target.value);
                    setSelectedTime('');
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              {/* Day info feedback */}
              <div className="mt-4 text-xs">
                {(() => {
                  const d = new Date(`${selectedDate}T00:00:00`);
                  const isSun = d.getDay() === 0;
                  if (isSun) {
                    return (
                      <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>The clinic is closed on Sundays. Please select Monday to Saturday.</span>
                      </div>
                    );
                  }
                  return (
                    <div className="p-3 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                        <span>Clinic Open: Mon–Sat Evening Shift</span>
                      </div>
                      <span className="font-semibold tabular-nums">03:30 PM - 08:00 PM</span>
                    </div>
                  );
                })()}
              </div>

              {/* Quick Date Presets */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600 block mb-2">Quick Select:</span>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map(offset => {
                    const d = new Date();
                    d.setDate(d.getDate() + offset);
                    // Skip Sundays
                    if (d.getDay() === 0) return null;
                    const dateStr = d.toISOString().split('T')[0];
                    const dayLabel = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedTime('');
                        }}
                        className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                          selectedDate === dateStr
                            ? 'bg-teal-700 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {dayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Select Available Time Slot */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Step 4: Select an Available Time Slot
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Showing live real-time availability for{' '}
                <strong className="text-slate-800">
                  {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </strong>
                .
              </p>
            </div>

            {isLoadingSlots ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                <p className="text-sm text-slate-600 font-medium">Checking live schedule with clinic database...</p>
              </div>
            ) : slotsError ? (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Unable to load slots</p>
                  <p className="text-xs mt-0.5">{slotsError}</p>
                </div>
              </div>
            ) : !dayInfo.isOpen ? (
              <div className="p-6 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-amber-600" />
                <h4 className="font-semibold text-base">Clinic Closed on This Date</h4>
                <p className="text-xs text-amber-700">{dayInfo.reason}</p>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="mt-3 px-4 py-2 bg-amber-700 text-white rounded-md text-xs font-semibold hover:bg-amber-800"
                >
                  Choose Another Date
                </button>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
                <p className="font-medium text-sm">No slots available on this date for this duration.</p>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="mt-3 text-xs text-teal-700 font-semibold hover:underline"
                >
                  Change Date
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>Evening Consultation Slots</span>
                  <span className="tabular-nums">Duration: {totalDuration} mins</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        !slot.isAvailable
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                          : selectedTime === slot.time
                          ? 'bg-teal-700 border-teal-700 text-white font-semibold shadow-xs ring-2 ring-teal-300'
                          : 'bg-white border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 text-slate-800'
                      }`}
                    >
                      <span className="block text-sm font-medium tabular-nums">
                        {slot.displayTime}
                      </span>
                      <span className="block text-[10px] mt-0.5">
                        {slot.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Customer Details */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Step 5: Patient Contact Details
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Please provide accurate contact details for appointment confirmation SMS & clinical records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kamath"
                  value={customer.fullName}
                  onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for SMS & WhatsApp Confirmation) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98450 12345"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-r-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="anand@example.com"
                  value={customer.email}
                  onChange={e => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 34"
                  value={customer.age}
                  onChange={e => setCustomer({ ...customer, age: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={customer.gender}
                  onChange={e => setCustomer({ ...customer, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chief Complaint / Dental Symptoms / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your toothache, sensitivity to hot/cold, chipped tooth, or any medical history..."
                  value={customer.notes}
                  onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customer.agreedToTerms}
                    onChange={e => setCustomer({ ...customer, agreedToTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to the clinic booking guidelines and acknowledge that appointments can be rescheduled or cancelled up to 4 hours in advance. I consent to receiving appointment confirmations via SMS, WhatsApp, and Email.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Final Confirmation */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Step 6: Review Appointment Summary
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Please verify your appointment details before submitting for clinical reservation.
              </p>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Booking Error</p>
                  <p className="text-xs mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <span className="text-xs uppercase font-semibold text-teal-700 tracking-wider">
                    Treatment
                  </span>
                  <h4 className="font-display font-bold text-lg text-slate-900">
                    {activeService?.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: {activeService?.categoryName} · Approx. {totalDuration} minutes
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 block">Total Payable at Clinic</span>
                  <span className="font-display font-bold text-2xl text-slate-900 tabular-nums">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Addons breakdown if any */}
              {selectedAddonsList.length > 0 && (
                <div className="pb-3 border-b border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-700">Included Add-ons:</span>
                  {selectedAddonsList.map(a => (
                    <div key={a.id} className="flex justify-between text-slate-600">
                      <span>• {a.name} (+{a.durationMinutes}m)</span>
                      <span className="tabular-nums font-medium">+₹{a.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Appointment Date</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Appointment Slot</span>
                  <span className="font-semibold text-slate-900 text-sm tabular-nums">
                    {slots.find(s => s.time === selectedTime)?.displayTime || selectedTime} (Evening Session)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Consulting Doctor</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {activeStaff?.name || 'Any Available Specialist'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Clinic Location</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    3rd Floor, Mangalore Gate, Kankanady, Mangaluru
                  </span>
                </div>
              </div>

              {/* Patient Snapshot */}
              <div className="pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500 block">Patient Information</span>
                <p className="font-medium text-slate-800 mt-0.5">
                  {customer.fullName} · {customer.phone} {customer.email && `· ${customer.email}`}
                </p>
                {customer.notes && (
                  <p className="text-slate-500 mt-1 italic">
                    Notes: "{customer.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                No online payment required now. Consultation fee is settled directly at the clinic reception upon arrival.
              </span>
            </div>
          </div>
        )}

        {/* STEP 7: Booking Confirmed Success Screen */}
        {currentStep === 7 && confirmedAppointment && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-teal-700 tracking-wider">
                Appointment Successfully Reserved
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
                Booking Reference: {confirmedAppointment.referenceCode}
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                Thank you, <strong>{confirmedAppointment.customer.fullName}</strong>. Your appointment has been booked in our clinical system.
              </p>
            </div>

            {/* Confirmed Details Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 max-w-lg mx-auto text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-900 text-right">{confirmedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Specialist:</span>
                <span className="font-semibold text-slate-900">{confirmedAppointment.staffName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {confirmedAppointment.appointmentDate} at {confirmedAppointment.displayTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Estimated Fee:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ₹{confirmedAppointment.totalPrice.toLocaleString()} (Payable at clinic)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-slate-900 text-right">
                  Mangalore Gate, Kankanady, Mangaluru
                </span>
              </div>
            </div>

            {/* Calendar Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={getGoogleCalendarUrl(confirmedAppointment)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                onClick={() => downloadIcsFile(confirmedAppointment)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download .ICS File</span>
              </button>
            </div>

            {/* Notification Preview */}
            <div className="max-w-lg mx-auto bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-800 text-left">
              <p className="font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>SMS & WhatsApp Confirmation Dispatched:</span>
              </p>
              <p className="mt-1 text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-teal-100">
                "Dear {confirmedAppointment.customer.fullName}, your dental appointment for {confirmedAppointment.serviceName} is confirmed on {confirmedAppointment.appointmentDate} at {confirmedAppointment.displayTime}. Ref: {confirmedAppointment.referenceCode}."
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (onClose) onClose();
                  else {
                    setCurrentStep(1);
                    setConfirmedAppointment(null);
                  }
                }}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold"
              >
                {onClose ? 'Done' : 'Book Another Appointment'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Stepper Footer Controls (Steps 1 to 6) */}
      {currentStep <= 6 && (
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-md hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 6 && (
              <button
                type="button"
                disabled={
                  (currentStep === 1 && !selectedServiceId) ||
                  (currentStep === 3 && !selectedDate) ||
                  (currentStep === 4 && (!selectedTime || !dayInfo.isOpen)) ||
                  (currentStep === 5 && (!customer.fullName.trim() || !customer.phone.trim() || !customer.agreedToTerms))
                }
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 6 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-60 transition-colors shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Book Appointment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
