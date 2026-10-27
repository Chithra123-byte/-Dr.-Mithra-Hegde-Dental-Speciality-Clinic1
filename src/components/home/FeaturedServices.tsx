import React from 'react';
import { Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Service } from '../../types';

interface FeaturedServicesProps {
  services: Service[];
  onBookService: (serviceId: string) => void;
  onViewAll: () => void;
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({
  services,
  onBookService,
  onViewAll
}) => {
  // Select top marquee services
  const featured = services.slice(0, 6);

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Specialized Dental Procedures
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Painless, Microscopic & Aesthetic Dentistry
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Every procedure is executed using dental loupes or surgical microscopes to preserve natural enamel and maximize clinical longevity.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 self-start md:self-auto py-2 px-3 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <span>View All Treatments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Services Grid (Hairline borders, zero pill clutter) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all"
            >
              {service.image && (
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded">
                    {service.categoryName}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span className="tabular-nums">{service.durationMinutes} minutes</span>
                    </span>
                    <span className="font-display font-bold text-base text-slate-900 tabular-nums">
                      {service.priceDisplay}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookService(service.id)}
                    className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
