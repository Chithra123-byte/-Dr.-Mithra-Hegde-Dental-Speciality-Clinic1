import React from 'react';
import { Award, GraduationCap, BookOpen, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import { Staff } from '../../types';

interface AboutViewProps {
  staffMembers: Staff[];
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ staffMembers, onOpenBooking }) => {
  const leadDoctor = staffMembers.find(s => s.id === 'dr-mithra-hegde') || staffMembers[0];
  const associates = staffMembers.filter(s => s.id !== leadDoctor.id);

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            About the Practice & Founder
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mt-1">
            Dr. Mithra N. Hegde
          </h1>
          <p className="text-base text-slate-600 mt-2 font-medium">
            BDS, MDS, PhD, MAMS, MFDS RCPS (Glasg) · Karnataka Rajyotsava Awardee (2011)
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Principal, Dean & Senior Professor, Department of Conservative Dentistry & Endodontics, ABSMIDS, Nitte University.
          </p>
        </div>

        {/* Lead Doctor In-Depth Biography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                <img
                  src={leadDoctor.avatar}
                  alt={leadDoctor.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-[460px] object-cover object-top"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>State Lifetime Achievement</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Conferred the <strong>Karnataka Rajyotsava Award</strong> by the Government of Karnataka in recognition of unparalleled contributions to medical and dental healthcare.
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment with Dr. Mithra</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 text-sm text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">
                Over Three Decades of Clinical Eminence & Education
              </h2>
              <p>
                Dr. Mithra N. Hegde is an internationally renowned specialist in conservative dentistry and endodontics. As the Dean and Senior Professor at the A.B. Shetty Memorial Institute of Dental Sciences (ABSMIDS), Nitte (Deemed to be University) in Mangalore, she has been at the forefront of postgraduate training, dental research, and clinical advancements for over thirty years.
              </p>
              <p className="mt-3">
                Her private clinical practice, <strong>Dr. Mithra Hegde’s Dental Speciality Clinic & Cosmetic Centre</strong> at Mangalore Gate, Kankanady, brings university-level clinical standards and microscopic precision directly to patients seeking conservative, pain-free dental care.
              </p>
            </div>

            {/* Academic Credentials & Contributions */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-display font-bold text-slate-900">
                Academic Roles & National Distinctions
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Dean & Senior Professor (ABSMIDS)</h4>
                    <p className="text-xs text-slate-600">
                      Guides PhD scholars and post-doctoral researchers in cutting-edge pulp biology, bioceramics, and conservative restorative materials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Author & International Researcher</h4>
                    <p className="text-xs text-slate-600">
                      Has authored standard reference textbooks and over two hundred research publications indexed in Scopus, PubMed, and Web of Science.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Royal College of Physicians and Surgeons of Glasgow</h4>
                    <p className="text-xs text-slate-600">
                      Holds the prestigious MFDS RCPS (Glasg) diploma and is a Fellow of the National Academy of Medical Sciences (MAMS).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Philosophy */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-display font-bold text-slate-900">
                Our Clinical Philosophy: Preservation First
              </h3>
              <p>
                At Dr. Mithra Hegde’s Dental Speciality Clinic, we operate on the fundamental belief that nothing functions or looks better than your natural tooth. We reject unnecessary aggressive tooth preparations or premature extractions:
              </p>
              <ul className="space-y-2 pt-1 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <span><strong>Microscopic Magnification:</strong> Using high-power loupes to visualize micro-calcifications and treat complex canal curvatures with extreme accuracy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <span><strong>Painless Single-Sitting RCT:</strong> Advanced rotary systems and biological sealers deliver rapid relief without repeated traumatizing visits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <span><strong>Minimal Prep Veneers:</strong> Conservative ceramic restorations that preserve up to 90% of intact natural enamel.</span>
                </li>
              </ul>
            </div>

            {/* Infection Control */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <span>Hospital-Grade Infection Control Standards</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The clinic adheres to strict international sterilization protocols. All instruments undergo multi-cycle ultrasonic decontamination, followed by vacuum Class-B autoclaving in tamper-evident sealed pouches that are opened only in the patient's presence.
              </p>
            </div>

          </div>
        </div>

        {/* Associates Section */}
        <div className="pt-12 border-t border-slate-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Our Multi-Disciplinary Team
            </span>
            <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">
              Associate Specialists Under Senior Guidance
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Collaborative care ensuring that complex full-mouth rehabilitations, surgical periodontics, and implant prosthetics are treated by dedicated post-graduate consultants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {associates.map(staff => (
              <div
                key={staff.id}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-base">{staff.name}</h4>
                    <p className="text-xs text-teal-800 font-medium">{staff.qualifications} · {staff.title}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{staff.bio}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Speciality: {staff.specialties.join(', ')}
                  </span>
                  <button
                    onClick={onOpenBooking}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    Book Consultation →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
