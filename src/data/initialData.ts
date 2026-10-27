import { BusinessSettings, Service, ServiceCategory, Staff } from '../types';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  businessName: "Dr. Mithra Hegde's Dental Speciality Clinic",
  legalName: "Dr. Mithra Hegde's Dental Speciality Clinic & Cosmetic Centre",
  tagline: "Premier Endodontics, Aesthetic Smile Design & Multi-Speciality Dental Care",
  category: "Dental Speciality Clinic & Cosmetic Centre",
  leadSpecialist: "Dr. Mithra N. Hegde (BDS, MDS, PhD, MAMS, MFDS RCPS Glasg)",
  phone: "+91 98452 84411",
  email: "contact@drmithrahegde.com",
  address: {
    line1: "3rd Floor, Commercial Complex, Mangalore Gate",
    line2: "Solapur - Mangalore Highway (Near Karavali Circle), Kankanady",
    city: "Mangaluru",
    state: "Karnataka",
    pincode: "575002",
    country: "India",
    landmark: "Near Karavali Circle & Mangalore Gate Building"
  },
  googleMapsUrl: "https://www.google.com/maps/place/Dr+Mithra+Hegde%E2%80%99s+Dental+Speciality+Clinic/@12.8697325,74.5532376,11z/data=!3m1!5s0x3ba35a3396225701:0x3b7545caf14c41ac!4m7!3m6!1s0x3ba35a33be7f31e7:0xe33c1485905d07af!8m2!3d12.8697325!4d74.8581082!15sChRkZW50aXN0IGluIG1hbmdhbG9yZVoWIhRkZW50aXN0IGluIG1hbmdhbG9yZZIBDWRlbnRhbF9jbGluaWPgAQA!16s%2Fg%2F11b8jcpnlq",
  googleRating: 4.8,
  reviewCount: 326,
  workingHours: {
    monday: { isOpen: true, start: "15:30", end: "20:00", label: "03:30 PM - 08:00 PM" },
    tuesday: { isOpen: true, start: "15:30", end: "20:00", label: "03:30 PM - 08:00 PM" },
    wednesday: { isOpen: true, start: "15:30", end: "20:00", label: "03:30 PM - 08:00 PM" },
    thursday: { isOpen: true, start: "15:30", end: "20:00", label: "03:30 PM - 08:00 PM" },
    friday: { isOpen: true, start: "15:30", end: "20:00", label: "03:30 PM - 08:00 PM" },
    saturday: { isOpen: true, start: "15:30", end: "20:00", label: "03:30 PM - 08:00 PM" },
    sunday: { isOpen: false, start: "00:00", end: "00:00", label: "Closed (Emergency on Call)" }
  },
  slotIntervalMinutes: 30,
  bufferMinutes: 10,
  maxAdvanceDays: 30,
  minLeadHours: 2,
  cancellationNoticeHours: 4,
  closedDates: [
    "2026-11-01", // Karnataka Rajyotsava
    "2026-12-25"  // Christmas
  ],
  announcementNotice: "Prior appointment recommended. Emergency dental treatments accommodated with swift coordination."
};

export const STAFF_MEMBERS: Staff[] = [
  {
    id: "dr-mithra-hegde",
    name: "Dr. Mithra N. Hegde",
    title: "Senior Professor & Chief Endodontist",
    qualifications: "BDS, MDS, PhD, MAMS, MFDS RCPS (Glasg)",
    role: "Founder & Lead Specialist",
    bio: "Recipient of the prestigious Karnataka Rajyotsava Award (2011), Dean & Senior Professor in Conservative Dentistry and Endodontics at ABSMIDS (Nitte University). Renowned internationally for precision root canal therapies, aesthetic micro-restorations, and research leadership with 30+ years of clinical distinction.",
    specialties: ["Microscopic Endodontics", "Aesthetic Dentistry", "Conservative Restorations", "Complex Root Canals"],
    avatar: "/src/assets/images/doctor_mithra_portrait_1793063551817.jpg",
    isActive: true,
    isLead: true
  },
  {
    id: "dr-rohan-kamath",
    name: "Dr. Rohan Kamath",
    title: "Prosthodontist & Implantologist",
    qualifications: "BDS, MDS (Prosthodontics)",
    role: "Senior Consultant",
    bio: "Specializing in fixed prosthodontics, CAD/CAM all-ceramic crowns, implant-supported prosthetics, and complete smile reconstructions with over 12 years of specialized restorative experience.",
    specialties: ["Dental Implants", "Zirconia Crowns", "Fixed Bridges", "Full Mouth Rehabilitation"],
    avatar: "/src/assets/images/clinic_reception_interior_1793063553329.jpg",
    isActive: true,
    isLead: false
  },
  {
    id: "dr-shweta-shetty",
    name: "Dr. Shweta Shetty",
    title: "Periodontist & Aesthetic Laser Specialist",
    qualifications: "BDS, MDS (Periodontics)",
    role: "Consultant Periodontist",
    bio: "Expert in regenerative periodontal therapy, cosmetic gingival sculpting, ultrasonic deep root planning, and laser-assisted periodontal treatments.",
    specialties: ["Laser Gum Therapy", "Deep Ultrasonic Scaling", "Gingival Sculpting", "Preventive Care"],
    avatar: "/src/assets/images/clinic_sterilization_lab_1793063552675.jpg",
    isActive: true,
    isLead: false
  }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "endodontics",
    name: "Endodontics & Root Canal",
    description: "Painless, microscopic root canal treatments designed to preserve natural tooth structure.",
    iconName: "Activity"
  },
  {
    id: "cosmetic",
    name: "Cosmetic & Smile Design",
    description: "Porcelain veneers, aesthetic bonding, and laser whitening crafted for natural brilliance.",
    iconName: "Sparkles"
  },
  {
    id: "implants-crowns",
    name: "Implants & Crowns",
    description: "Permanent tooth replacements, all-ceramic Zirconia crowns, and fixed bridge solutions.",
    iconName: "ShieldCheck"
  },
  {
    id: "restorative",
    name: "Restorative Fillings",
    description: "Tooth-colored nanocomposite restorations, biological caries management, and inlays.",
    iconName: "Layers"
  },
  {
    id: "periodontics",
    name: "Periodontics & Hygiene",
    description: "Ultrasonic scaling, air-polishing, gum health rejuvenation, and preventive dental care.",
    iconName: "HeartPulse"
  },
  {
    id: "consultation",
    name: "Diagnostics & Consultation",
    description: "Comprehensive oral examination, digital radiograph assessment, and clinical treatment plan.",
    iconName: "FileText"
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "micro-rct-single",
    categoryId: "endodontics",
    categoryName: "Endodontics & Root Canal",
    name: "Microscopic Root Canal Treatment (Single Sitting)",
    tagline: "Advanced painless endodontic preservation under high-magnification",
    description: "Complete cleaning, shaping, and bio-ceramic obturation of infected root canals using computerized apex locators and rotary instrumentation.",
    fullDescription: "Conducted under strict aseptic isolation using rubber dam and precision endodontic motors. Ideal for relieving severe toothaches while saving your natural tooth without surgery.",
    price: 4500,
    priceDisplay: "₹4,500",
    durationMinutes: 45,
    isPopular: true,
    isActive: true,
    image: "/src/assets/images/hero_dental_clinic_1793063550311.jpg",
    availableStaffIds: ["dr-mithra-hegde"],
    addons: [
      { id: "digital-xray", name: "High-Resolution Digital RVG X-Ray", price: 300, durationMinutes: 10, description: "Instant digital intraoral radiograph with minimal radiation" },
      { id: "post-core", name: "Fiber Post & Core Build-Up", price: 1500, durationMinutes: 20, description: "Structural tooth reinforcement after root canal" }
    ],
    prerequisites: ["Prior dental X-ray recommended or done at clinic", "Local anaesthesia administered"]
  },
  {
    id: "micro-rct-re-treatment",
    categoryId: "endodontics",
    categoryName: "Endodontics & Root Canal",
    name: "Root Canal Re-Treatment & Complex Canal Therapy",
    tagline: "Specialist rescue of previously treated or failing root canals",
    description: "Specialized removal of old filling materials, location of calcified canals, and complete disinfection under magnification.",
    fullDescription: "Supervised by Dr. Mithra Hegde, international authority in endodontic failure management and conservative dental preservation.",
    price: 6000,
    priceDisplay: "₹6,000",
    durationMinutes: 60,
    isActive: true,
    image: "/src/assets/images/clinic_sterilization_lab_1793063552675.jpg",
    availableStaffIds: ["dr-mithra-hegde"],
    addons: [
      { id: "bio-ceramic-seal", name: "Bio-Ceramic Retrograde Sealing", price: 1200, durationMinutes: 15, description: "Advanced biological root-end seal" }
    ]
  },
  {
    id: "laser-teeth-whitening",
    categoryId: "cosmetic",
    categoryName: "Cosmetic & Smile Design",
    name: "In-Office Laser Teeth Whitening",
    tagline: "Safe, rapid brightening up to 6–8 shades in a single clinical session",
    description: "Medical-grade activation of whitening gel with protective gum barrier, delivering noticeable brightness without enamel damage.",
    fullDescription: "Includes pre-whitening shade assessment, gingival protection shield, dual-cycle light activation, and a post-treatment remineralization desensitizer treatment.",
    price: 8500,
    priceDisplay: "₹8,500",
    durationMinutes: 60,
    isPopular: true,
    isActive: true,
    image: "/src/assets/images/cosmetic_dentistry_smile_1793063551949.jpg",
    availableStaffIds: ["dr-mithra-hegde", "dr-shweta-shetty"],
    addons: [
      { id: "take-home-tray", name: "Custom Take-Home Maintenance Kit", price: 2500, durationMinutes: 0, description: "Custom thermoformed trays with maintenance gel" }
    ]
  },
  {
    id: "porcelain-veneers",
    categoryId: "cosmetic",
    categoryName: "Cosmetic & Smile Design",
    name: "Porcelain Ceramic Smile Veneers (Per Tooth)",
    tagline: "Ultra-thin custom ceramic shells for flawless tooth symmetry and color",
    description: "Custom-crafted laminate veneers correcting chipped, discolored, spaced, or mildly misaligned anterior teeth.",
    fullDescription: "Digital smile preview, conservative micro-preparation, shade matching to facial aesthetics, and bonding with dual-cure resin luting agents.",
    price: 9000,
    priceDisplay: "₹9,000",
    durationMinutes: 60,
    isActive: true,
    image: "/src/assets/images/cosmetic_dentistry_smile_1793063551949.jpg",
    availableStaffIds: ["dr-mithra-hegde", "dr-rohan-kamath"]
  },
  {
    id: "dental-implant-consult",
    categoryId: "implants-crowns",
    categoryName: "Implants & Crowns",
    name: "Dental Implant Surgical Planning & Consultation",
    tagline: "Permanent, bone-anchored natural tooth replacement evaluation",
    description: "Comprehensive 3D bone assessment, smile line evaluation, and customized surgical roadmap for missing teeth.",
    fullDescription: "Evaluation for single tooth, multiple missing teeth, or implant-supported fixed bridges using world-leading titanium implant systems.",
    price: 1500,
    priceDisplay: "₹1,500",
    durationMinutes: 30,
    isPopular: false,
    isActive: true,
    image: "/src/assets/images/hero_dental_clinic_1793063550311.jpg",
    availableStaffIds: ["dr-rohan-kamath"],
    addons: [
      { id: "cbct-review", name: "3D CBCT Scan Radiographic Report Review", price: 800, durationMinutes: 15, description: "Detailed bone volume mapping" }
    ]
  },
  {
    id: "zirconia-ceramic-crown",
    categoryId: "implants-crowns",
    categoryName: "Implants & Crowns",
    name: "CAD/CAM High-Translucency Zirconia Crown",
    tagline: "Metal-free, biocompatible crown with superior strength and natural luster",
    description: "Milled with computerized precision for full structural protection after root canal or for severely worn teeth.",
    fullDescription: "Laser digital impression, biocompatible monolithic zirconia or layered ceramic, 10-year structural warranty, seamless gum margin.",
    price: 7500,
    priceDisplay: "₹7,500",
    durationMinutes: 45,
    isActive: true,
    image: "/src/assets/images/hero_dental_clinic_1793063550311.jpg",
    availableStaffIds: ["dr-rohan-kamath", "dr-mithra-hegde"]
  },
  {
    id: "composite-restoration",
    categoryId: "restorative",
    categoryName: "Restorative Fillings",
    name: "Nanohybrid Aesthetic Tooth Filling",
    tagline: "Seamless tooth-matching restoration for cavities and chipped edges",
    description: "Direct light-cured composite bonding that chemically adheres to tooth enamel and dentin, invisible to the naked eye.",
    fullDescription: "Gentle cavity debridement, selective acid-etching, premium 3M/Kerr composite layering, and diamond anatomical polishing.",
    price: 1200,
    priceDisplay: "₹1,200",
    durationMinutes: 30,
    isPopular: true,
    isActive: true,
    image: "/src/assets/images/clinic_sterilization_lab_1793063552675.jpg",
    availableStaffIds: ["dr-mithra-hegde", "dr-rohan-kamath", "dr-shweta-shetty"],
    addons: [
      { id: "desensitizer-varnish", name: "Fluoride Remineralizing Desensitizer", price: 400, durationMinutes: 5, description: "Protective varnish to eliminate post-op cold sensitivity" }
    ]
  },
  {
    id: "ultrasonic-scaling-polishing",
    categoryId: "periodontics",
    categoryName: "Periodontics & Hygiene",
    name: "Full Mouth Ultrasonic Scaling & Air Polishing",
    tagline: "Painless removal of hardened plaque, tartar calculus, and tobacco/tea stains",
    description: "Piezoceramic ultrasonic cleaning followed by prophylaxis paste and air-flow polishing for healthy pink gums and fresh breath.",
    fullDescription: "Essential 6-month preventive maintenance. Gentle on tooth enamel, highly effective for preventing gingivitis, bad breath, and bleeding gums.",
    price: 1800,
    priceDisplay: "₹1,800",
    durationMinutes: 30,
    isPopular: true,
    isActive: true,
    image: "/src/assets/images/clinic_sterilization_lab_1793063552675.jpg",
    availableStaffIds: ["dr-shweta-shetty", "dr-mithra-hegde"],
    addons: [
      { id: "laser-gum-pocket", name: "Laser Pocket Decontamination (Per Quad)", price: 1000, durationMinutes: 15, description: "Bacterial eradication in deep gum pockets" }
    ]
  },
  {
    id: "comprehensive-dental-consult",
    categoryId: "consultation",
    categoryName: "Diagnostics & Consultation",
    name: "Comprehensive Specialist Consultation & Oral Checkup",
    tagline: "In-depth clinical diagnostic examination, digital imaging & custom plan",
    description: "Examination of teeth, periodontal tissues, occlusion, TMJ, and oral mucosa with full treatment roadmap and cost estimate.",
    fullDescription: "Conducted directly by senior clinicians. Includes visual camera screening, cavity risk assessment, and transparent discussion of treatment priorities.",
    price: 500,
    priceDisplay: "₹500",
    durationMinutes: 30,
    isPopular: true,
    isActive: true,
    image: "/src/assets/images/doctor_mithra_portrait_1793063551817.jpg",
    availableStaffIds: ["dr-mithra-hegde", "dr-rohan-kamath", "dr-shweta-shetty"],
    addons: [
      { id: "digital-rvg", name: "Digital RVG Diagnostic Radiograph", price: 300, durationMinutes: 10, description: "Instant localized diagnostic imaging" }
    ]
  }
];

export const PATIENT_TESTIMONIALS = [
  {
    id: "rev-1",
    author: "Prashanth Shetty",
    location: "Kankanady, Mangaluru",
    rating: 5,
    date: "2 months ago",
    treatment: "Microscopic Root Canal Treatment",
    text: "Dr. Mithra Hegde is genuinely a master of endodontics. I was terrified of root canal treatment due to excruciating pain in the past, but she completed the procedure in one sitting with zero pain. The clinic hygiene and modern equipment are world-class."
  },
  {
    id: "rev-2",
    author: "Deepika Rao",
    location: "Kadri, Mangalore",
    rating: 5,
    date: "3 months ago",
    treatment: "Cosmetic Veneers & Smile Makeover",
    text: "Got aesthetic smile veneers done at Dr. Mithra Hegde's clinic before my wedding. The precision, color match, and natural tooth shape exceeded all expectations. Everyone compliments my smile! Highly recommend Dr. Mithra and her team."
  },
  {
    id: "rev-3",
    author: "Capt. Ronald D'Souza",
    location: "Bejai, Mangalore",
    rating: 5,
    date: "5 months ago",
    treatment: "All-Ceramic Zirconia Crown & Restorations",
    text: "The professionalism here is unmatched. Strict sterilization, computerized appointment scheduling, and gentle care. Dr. Mithra takes time to explain every detail on the digital monitor. Worth every rupee."
  },
  {
    id: "rev-4",
    author: "Ananya Pai",
    location: "Bendoorwell, Mangalore",
    rating: 5,
    date: "6 months ago",
    treatment: "Ultrasonic Scaling & Preventative Checkup",
    text: "Extremely clean, modern clinic right at Mangalore Gate, Kankanady. The doctors are empathetic, courteous, and make you feel completely at ease. Evening appointment timings from 3:30 PM are very convenient for working professionals."
  }
];

export const CLINIC_FAQS = [
  {
    question: "What are the clinic's operating hours?",
    answer: "Dr. Mithra Hegde's Dental Speciality Clinic operates Monday through Saturday from 3:30 PM to 8:00 PM (IST). The clinic is closed on Sundays. Prior booking via our online portal or phone (+91 98452 84411) ensures zero waiting time."
  },
  {
    question: "Is root canal treatment really painless at this clinic?",
    answer: "Yes. With over 30 years of endodontic specialization and modern computerized rotary systems, modern local anaesthetics, and high-magnification loupes, over 95% of our root canal procedures are performed comfortably in a single sitting with minimal to zero discomfort."
  },
  {
    question: "Where is the clinic located in Mangalore?",
    answer: "We are located on the 3rd Floor of the Commercial Complex at Mangalore Gate, on the Solapur - Mangalore Highway, near Karavali Circle, Kankanady, Mangaluru, Karnataka – 575002. Convenient elevator access and parking are available."
  },
  {
    question: "Can I reschedule or cancel my appointment if my plans change?",
    answer: "Yes. You can manage, reschedule, or cancel your appointment directly through our online 'Manage Booking' portal using your booking reference code (e.g., DMH-2026-XXXX) and registered phone number, provided it is done at least 4 hours prior to the scheduled slot."
  },
  {
    question: "What safety and sterilization standards do you follow?",
    answer: "We follow hospital-grade multi-tier infection control protocols including Class-B vacuum autoclave sterilization, vacuum sealed instrument pouches opened in front of each patient, medical-grade surface disinfectants, and disposable barriers."
  }
];
