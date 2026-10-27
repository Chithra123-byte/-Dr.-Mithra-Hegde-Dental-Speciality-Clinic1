import React from 'react';
import { Calendar, Award, ShieldCheck, Star, ChevronRight, Clock } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreServices
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background image with measured contrast scrim per constitution */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_dental_clinic_1793063550311.jpg"
          alt="Dr. Mithra Hegde Dental Speciality Clinic Modern Operatory"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Headline & Value Proposition (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Kicker (Natural editorial text, no pill box per constitution) */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Karnataka Rajyotsava Awardee Practice</span>
              <span aria-hidden="true">·</span>
              <span>Mangaluru</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] text-balance">
              Painless Endodontics & Precision Aesthetic Dentistry
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Led by Dr. Mithra N. Hegde (BDS, MDS, PhD, Dean & Senior Professor ABSMIDS), our clinic provides world-class microscopic root canal therapies, custom smile architecture, and comprehensive dental health in Kankanady, Mangalore.
            </p>

            {/* Call to Actions (Single primary CTA + subtle secondary) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-sm active:scale-[0.98] whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap"
              >
                <span>View Treatments & Fees</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Adjacency Trust Markers (Unboxed clean text with separators) */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.8 / 5.0 Google Rating</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>320+ Patient Reviews</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>30+ Years Experience</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Class-B Vacuum Sterilization</span>
            </div>

          </div>

          {/* Marquee Clinic Feature Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-6 sm:p-7 shadow-2xl space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-semibold text-teal-400 tracking-wider">
                    Consultation Information
                  </span>
                  <h3 className="text-xl font-display font-bold text-white mt-1">
                    Evening Clinic Hours
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monday to Saturday · Prior Reservation Recommended
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-teal-900/60 text-teal-400 flex items-center justify-center shrink-0 border border-teal-700/50">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3 text-xs divide-y divide-slate-700/60">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Regular Consultation</span>
                  <span className="font-semibold text-white tabular-nums">03:30 PM – 08:00 PM</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Sunday</span>
                  <span className="font-semibold text-amber-400">Closed (Emergency On-Call)</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Root Canal Duration</span>
                  <span className="font-semibold text-white">Single Sitting (45–60 mins)</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Location</span>
                  <span className="font-semibold text-white">Mangalore Gate, Kankanady</span>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-700/60 flex items-center gap-3">
                <img
                  src="/src/assets/images/doctor_mithra_portrait_1793063551817.jpg"
                  alt="Dr. Mithra N. Hegde"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-600 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Dr. Mithra N. Hegde
                  </p>
                  <p className="text-[11px] text-teal-400 truncate">
                    Senior Professor & Chief Endodontist
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    BDS, MDS, PhD, MAMS, MFDS RCPS
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-colors shadow-xs"
              >
                Reserve Consultation Slot
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
