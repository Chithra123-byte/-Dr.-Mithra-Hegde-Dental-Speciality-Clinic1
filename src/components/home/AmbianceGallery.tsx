import React, { useState } from 'react';
import { Maximize2, X, ArrowRight } from 'lucide-react';

interface AmbianceGalleryProps {
  onViewAllGallery: () => void;
}

export const AmbianceGallery: React.FC<AmbianceGalleryProps> = ({ onViewAllGallery }) => {
  const [activeImage, setActiveImage] = useState<{ src: string; title: string; desc: string } | null>(null);

  const galleryItems = [
    {
      src: "/src/assets/images/hero_dental_clinic_1793063550311.jpg",
      title: "Digital Operatory & Microscope Bay",
      desc: "Ergonomic clinical operatory equipped with high-magnification dental microscopy and digital imaging.",
      span: "col-span-1 md:col-span-2"
    },
    {
      src: "/src/assets/images/clinic_sterilization_lab_1793063552675.jpg",
      title: "Hospital-Grade Autoclave Sterilization",
      desc: "Class-B vacuum autoclave unit with sealed individual instrument cassettes ensuring zero cross-contamination.",
      span: "col-span-1"
    },
    {
      src: "/src/assets/images/clinic_reception_interior_1793063553329.jpg",
      title: "Patient Consultation Lounge",
      desc: "Tranquil, welcoming reception lounge designed to alleviate dental anxiety with warm acoustic architecture.",
      span: "col-span-1"
    },
    {
      src: "/src/assets/images/cosmetic_dentistry_smile_1793063551949.jpg",
      title: "Aesthetic Smile Architecture",
      desc: "Flawless aesthetic outcomes using biocompatible ceramic veneers and tooth-preserving restorative layering.",
      span: "col-span-1 md:col-span-2"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Clinical Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              A Sterile, Calming & Ultra-Modern Environment
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Experience dental care in an environment that pairs university-grade sterilization with relaxing patient comfort at Mangalore Gate, Kankanady.
            </p>
          </div>

          <button
            onClick={onViewAllGallery}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 self-start md:self-auto py-2 px-3 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <span>View Complete Clinic Tour</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(item)}
              className={`group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-xs ${item.span}`}
            >
              <div className="h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeImage.src}
              alt={activeImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-6 bg-slate-900 text-white border-t border-slate-800">
              <h4 className="font-display font-bold text-lg text-white">
                {activeImage.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {activeImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
