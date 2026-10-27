import React from 'react';
import { X, ShieldCheck, Clock } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'cancellation';
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            ) : (
              <Clock className="w-5 h-5 text-teal-700" />
            )}
            <h3 className="font-display font-bold text-xl text-slate-900">
              {type === 'privacy' ? 'Patient Privacy Policy' : 'Appointment Cancellation & Rescheduling Policy'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Body */}
        <div className="py-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pr-2">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre</strong> is committed to preserving patient confidentiality and complying with medical data protection standards.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Data Collected</h4>
              <p>
                We collect only information necessary for clinical diagnosis, patient communication, and appointment scheduling: full name, contact telephone number, optional email address, and chief complaints or dental history.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Use of Information</h4>
              <p>
                Your phone number and email are used exclusively to deliver appointment confirmation receipts, schedule reminders, and clinical instructions via SMS, WhatsApp, or Email. We never sell, share, or monetize patient data to any third-party advertisers.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Radiographic & Clinical Records</h4>
              <p>
                Digital RVG radiographs and clinical treatment records are retained securely in our clinic practice management system for your continuity of care.
              </p>
            </>
          ) : (
            <>
              <p>
                Because our clinical appointments are reserved on a dedicated, one-on-one basis with Dr. Mithra Hegde and our specialist consultants, we request your cooperation with our scheduling terms:
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Advance Notice for Rescheduling</h4>
              <p>
                If you need to reschedule your appointment, please use the online <strong>"My Booking"</strong> portal or call our front desk (+91 98452 84411) at least <strong>4 hours prior</strong> to your scheduled slot.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Free Cancellation</h4>
              <p>
                Appointments can be cancelled at no penalty. Advance cancellation allows our team to allocate the slot to patients experiencing acute dental pain.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Arrival Time</h4>
              <p>
                Please arrive 10 minutes prior to your scheduled time slot to facilitate basic registration and pre-operative digital imaging where required.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">4. Payment Policy</h4>
              <p>
                No payment is taken online. All treatment fees and consultation charges are settled directly at the clinic reception via Cash, UPI, Credit/Debit cards, or Net Banking after your consultation.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
