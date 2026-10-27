import React, { useState } from 'react';
import { Maximize2, X, Filter } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [activeModal, setActiveModal] = useState<any | null>(null);

  const galleryItems = [
    {
      id: 1,
      category: 'operatory',
      title: 'Ergonomic Dental Operatory & Microscope Bay',
      categoryLabel: 'Clinical Operatory',
      desc: 'Featuring ergonomic patient positioning, Leica dental optical loupes, computer-assisted apex locators, and dual-monitor digital radiology display.',
      src: '/src/assets/images/hero_dental_clinic_1793063550311.jpg'
    },
    {
      id: 2,
      category: 'sterilization',
      title: 'Hospital-Grade Class-B Autoclave & Instrument Packaging Bay',
      categoryLabel: 'Infection Control',
      desc: 'Rigorous multi-stage decontamination area equipped with ultrasonic scalers, dry heat pre-cleaners, and vacuum autoclave sterilization.',
      src: '/src/assets/images/clinic_sterilization_lab_1793063552675.jpg'
    },
    {
      id: 3,
      category: 'cosmetic',
      title: 'Aesthetic Smile Architecture & Veneer Outcome',
      categoryLabel: 'Smile Transformations',
      desc: 'Seamless ceramic bonding and porcelain laminate veneers showing natural light transmission, gingival symmetry, and pearlescent luster.',
      src: '/src/assets/images/cosmetic_dentistry_smile_1793063551949.jpg'
    },
    {
      id: 4,
      category: 'lounge',
      title: 'Patient Reception & Consultation Lounge',
      categoryLabel: 'Patient Lounge',
      desc: 'Comfortable waiting area with serene acoustic design, comfortable upholstered seating, and transparent treatment plan counseling desks.',
      src: '/src/assets/images/clinic_reception_interior_1793063553329.jpg'
    },
    {
      id: 5,
      category: 'operatory',
      title: 'Specialist Consultation Suite with Dr. Mithra N. Hegde',
      categoryLabel: 'Clinical Operatory',
      desc: 'Direct one-on-one diagnostic consultation area with digital high-definition intraoral camera and instant chairside radiographic reviews.',
      src: '/src/assets/images/doctor_mithra_portrait_1793063551817.jpg'
    }
  ];

  const filteredItems = galleryItems.filter(item => filter === 'all' || item.category === filter);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Clinic Tour & Facility Standards
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-1">
            Clinical Ambiance & Infection Control
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Take a visual tour of our facilities at 3rd Floor, Commercial Complex, Mangalore Gate, Kankanady, Mangaluru.
          </p>
        </div>

        {/* Filter Bar (Functional buttons per constitution) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'operatory', label: 'Operatory & Equipment' },
            { id: 'sterilization', label: 'Sterilization & Hygiene' },
            { id: 'cosmetic', label: 'Cosmetic Cases' },
            { id: 'lounge', label: 'Reception & Lounge' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
                filter === tab.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveModal(item)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-60 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded">
                  {item.categoryLabel}
                </div>
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 text-right">
                  <span className="text-[11px] text-teal-700 font-semibold group-hover:underline">
                    View Full Image & Details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeModal.src}
              alt={activeModal.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain bg-black"
            />

            <div className="p-6 bg-slate-900 text-white border-t border-slate-800">
              <span className="text-xs uppercase font-semibold text-teal-400 block mb-1">
                {activeModal.categoryLabel}
              </span>
              <h4 className="font-display font-bold text-xl text-white">
                {activeModal.title}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeModal.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
