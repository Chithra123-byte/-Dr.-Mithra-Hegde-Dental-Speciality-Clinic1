import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { BusinessSettings, Service, ServiceCategory, Staff } from './types';
import { INITIAL_BUSINESS_SETTINGS, INITIAL_SERVICES, STAFF_MEMBERS, SERVICE_CATEGORIES } from './data/initialData';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TrustIndicators } from './components/home/TrustIndicators';
import { FeaturedServices } from './components/home/FeaturedServices';
import { DoctorSpotlight } from './components/home/DoctorSpotlight';
import { AmbianceGallery } from './components/home/AmbianceGallery';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { LocationHoursSection } from './components/home/LocationHoursSection';
import { ServicesView } from './components/services/ServicesView';
import { AboutView } from './components/about/AboutView';
import { GalleryView } from './components/gallery/GalleryView';
import { ContactView } from './components/contact/ContactView';
import { BookingWizard } from './components/booking/BookingWizard';
import { BookingLookupModal } from './components/booking/BookingLookupModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PolicyModal } from './components/legal/PolicyModal';
import { AlertCircle, Phone, Calendar, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settings, setSettings] = useState<BusinessSettings>(INITIAL_BUSINESS_SETTINGS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [categories, setCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [staffMembers, setStaffMembers] = useState<Staff[]>(STAFF_MEMBERS);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'cancellation' | null>(null);

  // Fetch initial data from server
  useEffect(() => {
    api.getClinicInfo()
      .then(res => {
        if (res.settings) setSettings(res.settings);
        if (res.categories) setCategories(res.categories);
      })
      .catch(err => {
        console.warn('Using client baseline data:', err);
      });

    api.getServices()
      .then(res => {
        if (res && res.length > 0) setServices(res);
      })
      .catch(console.warn);

    api.getStaff()
      .then(res => {
        if (res && res.length > 0) setStaffMembers(res);
      })
      .catch(console.warn);
  }, []);

  // Handlers
  const handleOpenBooking = (serviceId?: string) => {
    setBookingServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleBookWithDoctor = (staffId: string) => {
    // Open booking modal
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-600 selection:text-white">
      
      {/* Top Clinical Alert / Timings Announcement Bar */}
      <div className="bg-teal-900 text-teal-100 px-4 py-2 text-xs border-b border-teal-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-white">Mangalore Clinic Consultation:</span>
            <span>Monday – Saturday 03:30 PM to 08:00 PM (IST)</span>
            <span className="hidden md:inline text-teal-400">· Prior booking required</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[11px]">
            <a
              href="tel:+919845284411"
              className="flex items-center gap-1.5 text-white hover:text-teal-200 transition-colors font-medium tabular-nums"
            >
              <Phone className="w-3 h-3 text-teal-300" />
              <span>+91 98452 84411</span>
            </a>
            <span className="hidden sm:inline text-teal-700">|</span>
            <button
              onClick={() => setIsLookupOpen(true)}
              className="text-teal-200 hover:text-white underline transition-colors"
            >
              Manage Booking
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={tab => setCurrentTab(tab)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Body View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onOpenBooking={() => handleOpenBooking()}
              onExploreServices={() => setCurrentTab('services')}
            />
            <TrustIndicators />
            <FeaturedServices
              services={services}
              onBookService={id => handleOpenBooking(id)}
              onViewAll={() => setCurrentTab('services')}
            />
            <DoctorSpotlight
              staffMembers={staffMembers}
              onBookWithDoctor={handleBookWithDoctor}
              onReadMore={() => setCurrentTab('about')}
            />
            <AmbianceGallery
              onViewAllGallery={() => setCurrentTab('gallery')}
            />
            <TestimonialsSection />
            <LocationHoursSection
              settings={settings}
              onOpenBooking={() => handleOpenBooking()}
            />
          </>
        )}

        {currentTab === 'services' && (
          <ServicesView
            services={services}
            categories={categories}
            onBookService={id => handleOpenBooking(id)}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            staffMembers={staffMembers}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView />
        )}

        {currentTab === 'contact' && (
          <ContactView
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={tab => setCurrentTab(tab)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPolicy={type => setPolicyType(type)}
      />

      {/* Floating Action Button on Mobile (Caps below 15% mobile sticky per constitution) */}
      <div className="sm:hidden fixed bottom-4 right-4 z-30">
        <button
          onClick={() => handleOpenBooking()}
          className="flex items-center gap-2 px-4 py-3 bg-teal-700 text-white rounded-full shadow-lg font-semibold text-xs active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Slot</span>
        </button>
      </div>

      {/* MODAL: Booking Wizard */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full my-auto">
            <BookingWizard
              services={services.filter(s => s.isActive)}
              staffMembers={staffMembers.filter(s => s.isActive)}
              preselectedServiceId={bookingServiceId}
              onClose={() => {
                setIsBookingOpen(false);
                setBookingServiceId(undefined);
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL: Look up Existing Booking */}
      {isLookupOpen && (
        <BookingLookupModal
          onClose={() => setIsLookupOpen(false)}
        />
      )}

      {/* MODAL: Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* MODAL: Policies */}
      {policyType && (
        <PolicyModal
          type={policyType}
          onClose={() => setPolicyType(null)}
        />
      )}

    </div>
  );
}
