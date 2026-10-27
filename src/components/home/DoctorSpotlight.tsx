import React from 'react';
import { Award, GraduationCap, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { Staff } from '../../types';

interface DoctorSpotlightProps {
  staffMembers: Staff[];
  onBookWithDoctor: (staffId: string) => void;
  onReadMore: () => void;
}

export const DoctorSpotlight: React.FC<DoctorSpotlightProps> = ({
  staffMembers,
  onBookWithDoctor,
  onReadMore
}) => {
  const leadDoctor = staffMembers.find(s => s.id === 'dr-mithra-hegde') || staffMembers[0];
  const associates = staffMembers.filter(s => s.id !== leadDoctor.id);

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lead Doctor Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Portrait Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <img
                src={leadDoctor.avatar}
                alt={leadDoctor.name}
                referrerPolicy="no-referrer"
                className="w-full h-[450px] object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span>Rajyotsava Awardee (2011)</span>
                </div>
                <h3 className="text-xl font-display font-bold">
                  {leadDoctor.name}
                </h3>
                <p className="text-xs text-slate-300">
                  {leadDoctor.qualifications} · {leadDoctor.title}
                </p>
              </div>
            </div>
          </div>

          {/* Bio & Academic Credentials (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Founder & Lead Specialist
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
                A National Authority in Conservative Dentistry & Micro-Endodontics
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Dr. Mithra N. Hegde is one of India’s most respected clinicians and academicians in conservative dentistry and endodontics. Serving as Dean and Senior Professor at the prestigious A.B. Shetty Memorial Institute of Dental Sciences (ABSMIDS), Nitte University, she blends cutting-edge scientific rigor with gentle, patient-centered clinical care.
            </p>

            {/* Key Honors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>State Government Honor</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Conferred the Karnataka Rajyotsava Award for outstanding lifetime contributions in medicine and oral healthcare.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
                  <GraduationCap className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Academic Dean ABSMIDS</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Dean, Senior Professor, and PhD guide training generations of endodontists and dental surgeons across India and abroad.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
                  <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Prolific Researcher</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Author of numerous international peer-reviewed research papers and reference textbooks in root canal pathology and dental aesthetics.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Painless Single-Sitting RCT</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Pioneer of micro-endodontic conservation techniques ensuring maximum natural tooth structure preservation.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onBookWithDoctor(leadDoctor.id)}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                Book with Dr. Mithra Hegde
              </button>

              <button
                onClick={onReadMore}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 py-2.5 px-3 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span>Full Academic Profile & Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Associates Strip */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Associate Clinical Specialists
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 mt-0.5">
              Multi-Speciality Team Under Senior Guidance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {associates.map(assoc => (
              <div
                key={assoc.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4"
              >
                <img
                  src={assoc.avatar}
                  alt={assoc.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border border-slate-300 shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-base">
                    {assoc.name}
                  </h4>
                  <p className="text-xs text-teal-800 font-medium">
                    {assoc.qualifications} · {assoc.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {assoc.bio}
                  </p>
                  <button
                    onClick={() => onBookWithDoctor(assoc.id)}
                    className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                  >
                    <span>Reserve with {assoc.name.split(' ')[0]} {assoc.name.split(' ')[1]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
