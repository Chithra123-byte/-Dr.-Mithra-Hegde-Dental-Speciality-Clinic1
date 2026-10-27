import React from 'react';
import { Award, Microscope, ShieldCheck, Sparkles } from 'lucide-react';

export const TrustIndicators: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: "01. Academic & Clinical Authority",
      description: "Founded by Dr. Mithra N. Hegde, recipient of the prestigious Karnataka Rajyotsava Award (2011), Dean & Senior Professor at ABSMIDS (Nitte University) with 30+ years of clinical excellence."
    },
    {
      icon: Microscope,
      title: "02. Single-Sitting Microscopic RCT",
      description: "Precision endodontics using high-magnification optical loupes, electronic apex locators, and rotary files for comfortable, single-visit root canal preservation."
    },
    {
      icon: ShieldCheck,
      title: "03. Class-B Autoclave Sterility",
      description: "Rigorous international multi-stage sterilization protocols, vacuum-sealed instrument pouches opened in your presence, and hospital-grade surface disinfection."
    },
    {
      icon: Sparkles,
      title: "04. Precision Aesthetic Architecture",
      description: "Custom porcelain laminate veneers, CAD/CAM monolithic zirconia crowns, and in-office laser whitening tailored to your natural facial symmetry."
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Why Patients Trust Dr. Mithra Hegde
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
            Clinical Distinction Grounded in 30+ Years of Academic Leadership
          </h2>
        </div>

        {/* 4 Pillars Grid (Hairline borders per constitution, single-level elevation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
