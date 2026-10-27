import React from 'react';
import { Star, Quote } from 'lucide-react';
import { PATIENT_TESTIMONIALS } from '../../data/initialData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Patient Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Trusted by Generations of Families Across Mangalore
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Authentic patient feedback and experiences recorded on our Google Maps listing and clinical registers.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl self-start md:self-auto">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs border-l border-slate-300 pl-3">
              <span className="font-bold text-slate-900 block tabular-nums">4.8 / 5.0 Rating</span>
              <span className="text-slate-500">320+ Google Reviews</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid (Strict unboxed metadata per constitution) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PATIENT_TESTIMONIALS.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {item.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              {/* Author & Treatment (Unboxed text with separators) */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {item.author}
                  </span>
                  <span>{item.location}</span>
                </div>
                <div className="text-right">
                  <span className="text-teal-800 font-medium block">
                    {item.treatment}
                  </span>
                  <span className="text-[11px] text-slate-400">Verified Patient</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
