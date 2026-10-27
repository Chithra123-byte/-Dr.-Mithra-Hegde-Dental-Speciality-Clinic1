import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, Calendar, Navigation } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface LocationHoursSectionProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({
  settings,
  onOpenBooking
}) => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Find Our Clinic
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
            Centrally Located at Mangalore Gate, Kankanady
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Easy elevator access, dedicated parking, and prime connectivity on the Solapur - Mangalore Highway near Karavali Circle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact & Timings Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Clinic Address</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {settings.address.line1},<br />
                    {settings.address.line2},<br />
                    {settings.address.city}, {settings.address.state} – {settings.address.pincode}
                  </p>
                  <p className="text-[11px] text-teal-800 font-medium mt-1">
                    Landmark: {settings.address.landmark}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-md text-xs font-semibold transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Driving Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>{settings.phone}</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Consultation Schedule</h3>
                  <p className="text-xs text-slate-500">Regular evening clinical appointments</p>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium text-slate-700">Monday – Saturday</span>
                  <span className="font-bold text-slate-900 tabular-nums">03:30 PM – 08:00 PM</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium text-slate-700">Sunday</span>
                  <span className="font-semibold text-amber-600">Closed (Emergency Only)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Evening Consultation</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right: Embedded Interactive Map (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Google Maps Location</h4>
                  <p className="text-xs text-slate-400">Dr. Mithra Hegde’s Dental Speciality Clinic, Kankanady</p>
                </div>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Responsive Map Embed */}
              <div className="w-full h-[380px] bg-slate-200 relative">
                <iframe
                  title="Dr Mithra Hegde Dental Speciality Clinic Location"
                  src="https://maps.google.com/maps?q=12.8697325,74.8581082&hl=en&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Coordinates: 12.8697° N, 74.8581° E (Mangaluru)</span>
                <span className="text-teal-800 font-semibold">Elevator to 3rd Floor</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
