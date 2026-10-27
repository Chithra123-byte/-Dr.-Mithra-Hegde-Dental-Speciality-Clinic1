import React, { useState, useMemo } from 'react';
import { Search, Clock, ArrowRight, Check, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';

interface ServicesViewProps {
  services: Service[];
  categories: ServiceCategory[];
  onBookService: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  categories,
  onBookService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Specialized Treatments & Procedures
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-1">
            Conservative Endodontics, Implants & Cosmetic Dentistry
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Every procedure at Dr. Mithra Hegde’s clinic adheres to evidence-based conservative dentistry protocols. Transparent pricing in Indian Rupees (₹) with estimated consultation durations.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 space-y-4 shadow-xs">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search treatments by name, e.g. Root Canal, Veneers, Whitening, Filling, Implants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs (Segmented control button elements per constitution) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Treatments ({services.length})
            </button>
            {categories.map(cat => {
              const count = services.filter(s => s.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <span>
            Showing <strong className="text-slate-800">{filteredServices.length}</strong> treatment{filteredServices.length === 1 ? '' : 's'}
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-teal-700 font-medium hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Services List / Cards */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <p className="font-semibold text-slate-700">No treatments found matching "{searchQuery}"</p>
            <p className="text-xs mt-1">Try searching for root canal, whitening, filling, or implants.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
            >
              Show All Procedures
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map(service => {
              const isExpanded = expandedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Treatment Title & Category */}
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-teal-800">
                          <span>{service.categoryName}</span>
                          {service.isPopular && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-700">Frequently Requested</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-xl text-slate-900">
                          {service.name}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Pricing & Duration Block */}
                      <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-left md:text-right">
                          <span className="font-display font-bold text-2xl text-slate-900 tabular-nums block">
                            {service.priceDisplay}
                          </span>
                          <span className="text-xs text-slate-500 tabular-nums flex items-center gap-1 md:justify-end">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            <span>{service.durationMinutes} mins estimated</span>
                          </span>
                        </div>

                        <button
                          onClick={() => onBookService(service.id)}
                          className="mt-3 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Book This Service</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* View Details Toggle */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                        className="text-teal-700 hover:text-teal-900 font-medium"
                      >
                        {isExpanded ? 'Hide Clinical Protocol ↑' : 'View Clinical Details & Add-ons ↓'}
                      </button>

                      <span className="text-slate-400">
                        Performed under aseptic rubber dam isolation
                      </span>
                    </div>

                    {/* Expanded Clinical Notes */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200/80 bg-slate-50 -mx-6 -mb-6 p-6 space-y-4 text-xs">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Clinical Procedure Overview:</h4>
                          <p className="text-slate-600 leading-relaxed">
                            {service.fullDescription}
                          </p>
                        </div>

                        {service.addons && service.addons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Available Adjuncts / Add-Ons:</h4>
                            <div className="space-y-1.5">
                              {service.addons.map(addon => (
                                <div key={addon.id} className="flex justify-between items-center text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                                  <span>
                                    <strong>{addon.name}</strong> – {addon.description}
                                  </span>
                                  <span className="font-semibold text-slate-900 tabular-nums shrink-0 ml-2">
                                    +₹{addon.price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {service.prerequisites && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Pre-Treatment Guidelines:</h4>
                            <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                              {service.prerequisites.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
