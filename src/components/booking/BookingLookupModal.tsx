import React, { useState } from 'react';
import {
  Search,
  X,
  AlertCircle,
  Calendar,
  Clock,
  User,
  MapPin,
  RefreshCw,
  XCircle,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { api } from '../../services/api';
import { Appointment } from '../../types';

interface BookingLookupModalProps {
  onClose: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({ onClose }) => {
  const [referenceCode, setReferenceCode] = useState('');
  const [verifyContact, setVerifyContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Cancel state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceCode.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setActionSuccess('');
    try {
      const data = await api.lookupAppointment(referenceCode.trim(), verifyContact.trim() || undefined);
      setAppointment(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not find booking. Please check reference code.');
      setAppointment(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!appointment || !newDate || !newTime) return;
    setRescheduleLoading(true);
    setRescheduleError('');
    try {
      const updated = await api.rescheduleAppointment(appointment.referenceCode, newDate, newTime);
      setAppointment(updated);
      setIsRescheduling(false);
      setActionSuccess('Your appointment has been successfully rescheduled.');
    } catch (err: any) {
      setRescheduleError(err.message || 'Failed to reschedule. Slot may not be available.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!appointment) return;
    setCancelLoading(true);
    try {
      await api.cancelAppointment(appointment.referenceCode, cancelReason);
      setAppointment({ ...appointment, status: 'cancelled' });
      setIsCancelling(false);
      setActionSuccess('Your appointment has been cancelled.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-400" />
            <h3 className="font-display font-bold text-lg">Manage Your Appointment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {actionSuccess && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Search Form */}
          {!appointment && (
            <form onSubmit={handleSearch} className="space-y-4">
              <p className="text-xs text-slate-500">
                Enter your unique booking reference number (e.g. <span className="font-mono text-slate-700">DMH-2026-8104</span>) and registered phone number to access your reservation.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Booking Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="DMH-2026-XXXX"
                  value={referenceCode}
                  onChange={e => setReferenceCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 uppercase font-mono tracking-wider focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Mobile Number or Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9845012345 or email"
                  value={verifyContact}
                  onChange={e => setVerifyContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching Records...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Appointment</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Appointment Record Display */}
          {appointment && !isRescheduling && !isCancelling && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    Ref: {appointment.referenceCode}
                  </span>
                  <h4 className="font-display font-bold text-lg text-slate-900">
                    {appointment.serviceName}
                  </h4>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded font-semibold capitalize ${
                    appointment.status === 'confirmed'
                      ? 'bg-teal-100 text-teal-800'
                      : appointment.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Date</span>
                  <span className="font-semibold text-slate-900">{appointment.appointmentDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Time</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{appointment.displayTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Specialist</span>
                  <span className="font-semibold text-slate-900">{appointment.staffName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payable Fee</span>
                  <span className="font-bold text-slate-900 tabular-nums">₹{appointment.totalPrice.toLocaleString()}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block">Patient Name</span>
                  <span className="font-semibold text-slate-900">{appointment.customer.fullName} · {appointment.customer.phone}</span>
                </div>
              </div>

              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsRescheduling(true)}
                    className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CalendarDays className="w-4 h-4 text-teal-700" />
                    <span>Reschedule Slot</span>
                  </button>

                  <button
                    onClick={() => setIsCancelling(true)}
                    className="flex-1 py-2 px-3 border border-red-200 text-red-700 hover:bg-red-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Appointment</span>
                  </button>
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    setAppointment(null);
                    setReferenceCode('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Look up another booking
                </button>
              </div>
            </div>
          )}

          {/* Reschedule View */}
          {appointment && isRescheduling && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">
                Reschedule Appointment #{appointment.referenceCode}
              </h4>

              {rescheduleError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs">
                  {rescheduleError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Evening Slot (e.g. 16:30, 17:00, 18:00)
                </label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">Select Time Slot</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="16:30">04:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="17:30">05:30 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="18:30">06:30 PM</option>
                  <option value="19:00">07:00 PM</option>
                  <option value="19:30">07:30 PM</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  className="flex-1 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={rescheduleLoading || !newDate || !newTime}
                  onClick={handleRescheduleSubmit}
                  className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold"
                >
                  {rescheduleLoading ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          )}

          {/* Cancel View */}
          {appointment && isCancelling && (
            <div className="space-y-4">
              <h4 className="font-semibold text-red-900 text-sm">
                Cancel Appointment #{appointment.referenceCode}
              </h4>
              <p className="text-xs text-slate-600">
                Are you sure you want to cancel your consultation for {appointment.serviceName} on {appointment.appointmentDate}?
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule conflict, feeling better, travel"
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelling(false)}
                  className="flex-1 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={handleCancelSubmit}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                >
                  {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
