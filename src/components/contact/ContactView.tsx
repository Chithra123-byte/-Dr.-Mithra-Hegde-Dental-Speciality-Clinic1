import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { api } from '../../services/api';
import { BusinessSettings } from '../../types';
import { CLINIC_FAQS } from '../../data/initialData';

interface ContactViewProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings, onOpenBooking }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // FAQ Accordion
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, contact phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.submitContact(formData);
      setSuccessMsg(res.message);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Get in Touch & Visit Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-1">
            Clinic Contact & Location
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Located at Mangalore Gate on the Solapur-Mangalore Highway in Kankanady. Contact our front desk for appointment scheduling and clinical queries.
          </p>
        </div>

        {/* Contact Info & Inquiry Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-lg">
                Mangalore Clinic Office
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Address:</strong>
                    <span>
                      3rd Floor, Commercial Complex, Mangalore Gate,<br />
                      Near Karavali Circle, Solapur - Mangalore Highway,<br />
                      Kankanady, Mangaluru, Karnataka 575002
                    </span>
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-700 font-semibold mt-1 hover:underline"
                    >
                      <span>Open Directions in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Phone Consultation:</strong>
                    <a
                      href={`tel:${settings.phone}`}
                      className="font-bold text-teal-800 hover:underline text-sm tabular-nums"
                    >
                      {settings.phone}
                    </a>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Mon–Sat: 3:30 PM to 8:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Email:</strong>
                    <span>contact@drmithrahegde.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <Clock className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Consultation Timings:</strong>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Monday – Saturday:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">03:30 PM – 08:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="font-semibold text-amber-700">Closed (Emergency Only)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Evening Consultation</span>
                </button>
              </div>
            </div>

            {/* Quick Emergency Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Severe Dental Pain or Trauma?</p>
              <p className="leading-relaxed">
                If you have an acute toothache or traumatic dental injury, call our emergency phone line at <a href={`tel:${settings.phone}`} className="font-bold underline">{settings.phone}</a>. We prioritize severe emergencies.
              </p>
            </div>

          </div>

          {/* Right: Validated Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-lg mb-1">
                Send an Inquiry or Feedback
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Our front desk coordinators will respond to your inquiry promptly.
              </p>

              {successMsg && (
                <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Message Sent</p>
                    <p className="mt-0.5">{successMsg}</p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Submission Error</p>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Bhat"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message / Question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about root canal procedures, smile veneers, clinic timings, or other dental queries..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Embedded Map */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">Interactive Map View</h4>
              <p className="text-xs text-slate-400">Dr. Mithra Hegde’s Dental Speciality Clinic, Kankanady, Mangaluru</p>
            </div>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>View in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="h-[350px] w-full bg-slate-200">
            <iframe
              title="Clinic Map"
              src="https://maps.google.com/maps?q=12.8697325,74.8581082&hl=en&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Common Questions
            </span>
            <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {CLINIC_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
