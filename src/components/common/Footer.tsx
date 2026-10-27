import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onOpenPolicy: (type: 'privacy' | 'cancellation') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenBooking,
  onOpenLookup,
  onOpenAdmin,
  onOpenPolicy
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top reassurance strip */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-900/60 text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Karnataka Rajyotsava Awardee</p>
                <p className="text-xs text-slate-400">Dr. Mithra N. Hegde · 30+ Years Clinical Eminence</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-900/60 text-teal-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Evening Consultation Timings</p>
                <p className="text-xs text-slate-400">Monday – Saturday: 03:30 PM – 08:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-900/60 text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Hospital-Grade Sterilization</p>
                <p className="text-xs text-slate-400">Class-B Vacuum Autoclave & Sealed Pouch Isolation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-display font-bold text-lg">
                M
              </div>
              <span className="font-display font-bold text-lg text-white">
                Dr. Mithra Hegde
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre is Mangalore’s premier practice for single-sitting microscopic endodontics, smile architecture, and comprehensive dental health.
            </p>
            <div className="text-xs text-slate-400 pt-1">
              <span>Google Rating 4.8 / 5.0</span>
              <span className="mx-2">·</span>
              <span>320+ Patient Reviews</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Treatments & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-400 transition-colors"
                >
                  About Dr. Mithra N. Hegde
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Clinical Infrastructure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Directions & Contact
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-teal-400 transition-colors"
                >
                  Manage Existing Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinical Hours & Emergency */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Consultation Hours
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mon – Sat</span>
                <span className="font-medium text-white tabular-nums">03:30 PM – 08:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Sunday</span>
                <span className="text-amber-400 font-medium">Closed (Emergency Only)</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full mt-2 py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 text-white font-medium text-sm transition-colors text-center"
                >
                  Book Evening Slot
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Mangalore Clinic
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <address className="not-italic text-xs text-slate-300 leading-relaxed">
                  3rd Floor, Commercial Complex, Mangalore Gate,<br />
                  Near Karavali Circle, Solapur - Mangalore Highway,<br />
                  Kankanady, Mangaluru, Karnataka 575002
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href="tel:+919845284411"
                  className="text-white hover:text-teal-300 transition-colors font-medium tabular-nums"
                >
                  +91 98452 84411
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-300 text-xs">contact@drmithrahegde.com</span>
              </div>

              <div className="pt-1">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicy('cancellation')}
              className="hover:text-slate-200 transition-colors"
            >
              Cancellation & Rescheduling
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-teal-300 font-medium transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
