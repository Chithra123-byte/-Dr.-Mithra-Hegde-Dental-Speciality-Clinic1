import React, { useState } from 'react';
import { Menu, X, Calendar, Phone, Search, ShieldCheck, Database } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenBooking,
  onOpenLookup,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Dr. Mithra' },
    { id: 'gallery', label: 'Clinic Gallery' },
    { id: 'contact', label: 'Contact & Location' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Clean single-line element per Top Bar Contract) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-800 text-white flex items-center justify-center font-display font-bold text-xl shadow-xs">
              M
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight block leading-tight whitespace-nowrap">
                Dr. Mithra Hegde
              </span>
              <span className="text-xs font-medium text-teal-700 tracking-wide uppercase block whitespace-nowrap">
                Dental Speciality Clinic
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Clean Nav Links (whitespace-nowrap shrink-0) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded ${
                  currentTab === item.id
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-700 -mb-0.5'
                    : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 whitespace-nowrap shrink-0 py-1 text-slate-600 hover:text-teal-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
            >
              <Search className="w-3.5 h-3.5" />
              <span>My Booking</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Admin Access */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Open Supabase Admin Panel"
            >
              <Database className="w-3.5 h-3.5 text-teal-700" />
              <span>Admin Panel</span>
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors shadow-xs active:scale-[0.98] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 rounded-md hover:bg-teal-800"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                currentTab === item.id
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md text-slate-700 hover:bg-slate-50 font-medium text-base"
            >
              <Search className="w-4 h-4 text-teal-700" />
              <span>Find / Manage My Booking</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-50 text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Staff / Clinic Admin Login</span>
            </button>

            <a
              href="tel:+919845284411"
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md text-teal-800 bg-teal-50/70 font-medium text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Clinic: +91 98452 84411</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
