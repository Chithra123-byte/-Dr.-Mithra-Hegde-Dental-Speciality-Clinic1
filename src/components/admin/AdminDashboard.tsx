import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Eye,
  DollarSign,
  Phone,
  Mail,
  Lock,
  LogOut,
  X,
  ExternalLink,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { api, getStoredAdminToken, setStoredAdminToken } from '../../services/api';
import {
  fetchSupabaseAppointments,
  editSupabaseAppointment,
  cancelSupabaseAppointment,
  deleteSupabaseAppointment,
  createSupabaseAppointment,
  checkSupabaseStatus,
  SupabaseAppointmentRow,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL
} from '../../services/supabase';
import { Service, Staff } from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getStoredAdminToken());
  const [adminEmail, setAdminEmail] = useState<string>('admin@drmithrahegde.com');
  const [adminPassword, setAdminPassword] = useState<string>('MithraClinic@2026');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'database' | 'services' | 'settings' | 'logs'>('database');

  // Supabase live database bookings
  const [bookings, setBookings] = useState<SupabaseAppointmentRow[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Selected Booking for View / Edit
  const [viewingBooking, setViewingBooking] = useState<SupabaseAppointmentRow | null>(null);
  const [editingBooking, setEditingBooking] = useState<SupabaseAppointmentRow | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<SupabaseAppointmentRow>>({});
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>('');
  const [editSuccess, setEditSuccess] = useState<string>('');

  // Deletion Confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // New Booking Modal (Direct to Supabase)
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [newBookingData, setNewBookingData] = useState({
    service_name: 'Microscopic Root Canal Treatment (Single Sitting)',
    staff_name: 'Dr. Mithra N. Hegde',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '16:00',
    display_time: '04:00 PM',
    duration_minutes: 45,
    total_price: 4500,
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_age: '',
    patient_gender: 'Female',
    notes: '',
    status: 'confirmed'
  });
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Supabase Health & Sync
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string>('');

  // Services & Staff for dropdowns
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await api.adminLogin(adminEmail, adminPassword);
      setIsAuthenticated(true);
      loadSupabaseBookings();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setStoredAdminToken(null);
    setIsAuthenticated(false);
  };

  // Fetch all bookings directly from Supabase
  const loadSupabaseBookings = async () => {
    setIsLoadingBookings(true);
    setFetchError('');
    try {
      const data = await fetchSupabaseAppointments();
      setBookings(data);

      const statusRes = await checkSupabaseStatus();
      setSupabaseStatus(statusRes);

      const [srv, stf] = await Promise.all([api.getServices(true), api.getStaff(true)]);
      setServicesList(srv);
      setStaffList(stf);
    } catch (err: any) {
      console.error('Failed to load from Supabase:', err);
      setFetchError(err.message || 'Failed to retrieve bookings from Supabase database.');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSupabaseBookings();
    }
  }, [isAuthenticated]);

  // Open Edit Modal
  const handleStartEdit = (booking: SupabaseAppointmentRow) => {
    setEditingBooking(booking);
    setEditFormData({
      patient_name: booking.patient_name,
      patient_phone: booking.patient_phone,
      patient_email: booking.patient_email || '',
      patient_age: booking.patient_age || '',
      patient_gender: booking.patient_gender || '',
      service_name: booking.service_name,
      staff_name: booking.staff_name,
      appointment_date: booking.appointment_date,
      appointment_time: booking.appointment_time,
      display_time: booking.display_time,
      total_price: booking.total_price,
      status: booking.status,
      notes: booking.notes || ''
    });
    setEditError('');
    setEditSuccess('');
  };

  // Save Edit to Supabase
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsSavingEdit(true);
    setEditError('');
    setEditSuccess('');

    try {
      // Calculate 12h display time if time changed
      let dispTime = editFormData.display_time || editingBooking.display_time;
      if (editFormData.appointment_time) {
        const [h, m] = editFormData.appointment_time.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const dispH = h % 12 === 0 ? 12 : h % 12;
        dispTime = `${String(dispH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
      }

      const updatedRow = await editSupabaseAppointment(editingBooking.id, {
        ...editFormData,
        display_time: dispTime
      });

      setBookings(prev => prev.map(b => (b.id === updatedRow.id ? updatedRow : b)));
      setEditSuccess('Appointment updated in Supabase database!');
      setTimeout(() => {
        setEditingBooking(null);
        setEditSuccess('');
      }, 1200);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update record in Supabase');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Quick Cancel in Supabase
  const handleQuickCancel = async (booking: SupabaseAppointmentRow) => {
    const reason = prompt(
      `Confirm cancellation for ${booking.patient_name} (Ref: ${booking.reference_code})?\nEnter cancellation reason (optional):`,
      'Cancelled by clinic coordinator'
    );
    if (reason === null) return; // user pressed cancel in prompt

    try {
      const updated = await cancelSupabaseAppointment(booking.id, reason);
      setBookings(prev => prev.map(b => (b.id === updated.id ? updated : b)));
      alert(`Appointment #${booking.reference_code} marked as cancelled in Supabase.`);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment in Supabase');
    }
  };

  // Delete from Supabase
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteSupabaseAppointment(deletingId);
      setBookings(prev => prev.filter(b => b.id !== deletingId));
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete record from Supabase');
    } finally {
      setIsDeleting(false);
    }
  };

  // Create New Booking directly to Supabase
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingData.patient_name.trim() || !newBookingData.patient_phone.trim()) {
      alert('Patient name and phone number are required.');
      return;
    }

    setIsCreatingNew(true);
    try {
      // 12h display time
      const [h, m] = newBookingData.appointment_time.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const dispH = h % 12 === 0 ? 12 : h % 12;
      const displayTime = `${String(dispH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;

      const randomCode = `DMH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await createSupabaseAppointment({
        ...newBookingData,
        reference_code: randomCode,
        display_time: displayTime
      });

      setBookings(prev => [created, ...prev]);
      setShowNewBookingModal(false);
      alert(`New booking #${created.reference_code} created directly in Supabase!`);
    } catch (err: any) {
      alert(err.message || 'Failed to create booking in Supabase');
    } finally {
      setIsCreatingNew(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (bookings.length === 0) {
      alert('No booking records to export.');
      return;
    }

    const headers = [
      'Reference Code',
      'Date',
      'Time',
      'Patient Name',
      'Phone',
      'Email',
      'Service',
      'Specialist',
      'Fee (INR)',
      'Status',
      'Notes',
      'Created At'
    ];

    const rows = bookings.map(b => [
      b.reference_code,
      b.appointment_date,
      b.display_time,
      `"${b.patient_name.replace(/"/g, '""')}"`,
      `"${b.patient_phone}"`,
      b.patient_email || '',
      `"${b.service_name.replace(/"/g, '""')}"`,
      `"${b.staff_name}"`,
      b.total_price,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      b.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `supabase-appointments-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesDate = !dateFilter || b.appointment_date === dateFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.reference_code.toLowerCase().includes(q) ||
        b.patient_name.toLowerCase().includes(q) ||
        b.patient_phone.includes(q) ||
        b.service_name.toLowerCase().includes(q) ||
        b.staff_name.toLowerCase().includes(q);

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [bookings, statusFilter, dateFilter, searchQuery]);

  // Live KPI Calculations from Supabase records
  const kpiStats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const rescheduled = bookings.filter(b => b.status === 'rescheduled').length;
    const revenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

    return { total, confirmed, completed, cancelled, rescheduled, revenue };
  }, [bookings]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white">
                  Clinic Admin Dashboard
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-900/90 text-teal-300 border border-teal-700/60">
                  Supabase Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected to Supabase Project: <code className="text-teal-400 font-mono">{SUPABASE_PROJECT_ID}</code> · Table: <code className="text-teal-400 font-mono">public.appointments</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTH SCREEN IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto my-auto w-full space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Administrator Sign In
              </h3>
              <p className="text-xs text-slate-500">
                Access and manage all appointment booking records stored in your Supabase database.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Email
                </label>
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-600">
                <span className="font-semibold block text-slate-800">Pre-set Admin Credentials:</span>
                <span>User: <code className="bg-white px-1 rounded border">admin@drmithrahegde.com</code> · Pass: <code className="bg-white px-1 rounded border">MithraClinic@2026</code></span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In to Supabase Admin'}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Sub-Bar with Actions */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>Database: public.appointments</span>
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-teal-800 font-semibold tabular-nums">
                  {bookings.length} Record{bookings.length === 1 ? '' : 's'} Retrieved
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={loadSupabaseBookings}
                  disabled={isLoadingBookings}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  title="Reload appointments directly from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings ? 'animate-spin text-teal-600' : ''}`} />
                  <span>Refresh DB</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setShowNewBookingModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Walk-in to Supabase</span>
                </button>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3 h-3 text-teal-300" />
                </a>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* KPI Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium">Total Stored</span>
                  <p className="font-display font-bold text-2xl text-slate-900 mt-0.5 tabular-nums">
                    {kpiStats.total}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[11px] text-teal-700 font-medium">Confirmed</span>
                  <p className="font-display font-bold text-2xl text-teal-800 mt-0.5 tabular-nums">
                    {kpiStats.confirmed}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[11px] text-blue-700 font-medium">Completed</span>
                  <p className="font-display font-bold text-2xl text-blue-800 mt-0.5 tabular-nums">
                    {kpiStats.completed}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[11px] text-amber-700 font-medium">Rescheduled</span>
                  <p className="font-display font-bold text-2xl text-amber-800 mt-0.5 tabular-nums">
                    {kpiStats.rescheduled}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[11px] text-red-700 font-medium">Cancelled</span>
                  <p className="font-display font-bold text-2xl text-red-800 mt-0.5 tabular-nums">
                    {kpiStats.cancelled}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium">Payable Revenue</span>
                  <p className="font-display font-bold text-2xl text-slate-900 mt-0.5 tabular-nums">
                    ₹{kpiStats.revenue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Error Message if fetch failed */}
              {fetchError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-900">Supabase Connection Notice:</strong>
                    <span>{fetchError}</span>
                  </div>
                </div>
              )}

              {/* Search, Filter & Date Control Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search patient, phone, ref, or service..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="all">All Statuses ({bookings.length})</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No-Show</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Date:</span>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={e => setDateFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                    {dateFilter && (
                      <button
                        onClick={() => setDateFilter('')}
                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Supabase Appointments Data Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3">Ref Code</th>
                        <th className="p-3">Patient Info</th>
                        <th className="p-3">Treatment</th>
                        <th className="p-3">Specialist</th>
                        <th className="p-3">Schedule</th>
                        <th className="p-3">Fee</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isLoadingBookings ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500">
                            <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mx-auto mb-2" />
                            <span>Retrieving live appointments from Supabase...</span>
                          </td>
                        </tr>
                      ) : filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                            No appointments found matching your search or filters in Supabase.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Ref Code */}
                            <td className="p-3">
                              <span className="font-mono font-bold text-teal-800 text-xs block">
                                {item.reference_code}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </td>

                            {/* Patient Info */}
                            <td className="p-3">
                              <strong className="text-slate-900 block text-xs">
                                {item.patient_name}
                              </strong>
                              <span className="text-slate-600 font-mono text-[11px] block">
                                {item.patient_phone}
                              </span>
                              {item.patient_email && (
                                <span className="text-slate-400 text-[10px] block truncate max-w-[140px]">
                                  {item.patient_email}
                                </span>
                              )}
                            </td>

                            {/* Service */}
                            <td className="p-3">
                              <span className="font-medium text-slate-900 block">
                                {item.service_name}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                {item.duration_minutes || 30} mins
                              </span>
                            </td>

                            {/* Specialist */}
                            <td className="p-3 text-slate-700 whitespace-nowrap">
                              {item.staff_name}
                            </td>

                            {/* Schedule */}
                            <td className="p-3 whitespace-nowrap">
                              <span className="font-semibold text-slate-900 block">
                                {item.appointment_date}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                {item.display_time}
                              </span>
                            </td>

                            {/* Fee */}
                            <td className="p-3 font-bold text-slate-900 tabular-nums">
                              ₹{(Number(item.total_price) || 0).toLocaleString()}
                            </td>

                            {/* Status */}
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize whitespace-nowrap ${
                                  item.status === 'confirmed'
                                    ? 'bg-teal-100 text-teal-800'
                                    : item.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : item.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : item.status === 'rescheduled'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* View */}
                                <button
                                  onClick={() => setViewingBooking(item)}
                                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                  title="View full details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1.5 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-md transition-colors"
                                  title="Edit appointment"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Quick Cancel */}
                                {item.status !== 'cancelled' && item.status !== 'completed' && (
                                  <button
                                    onClick={() => handleQuickCancel(item)}
                                    className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-md transition-colors"
                                    title="Cancel appointment"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={() => setDeletingId(item.id)}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                  title="Delete from Supabase"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW APPOINTMENT DETAILS */}
      {/* ========================================================= */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-teal-800 font-bold uppercase block">
                  Reference: {viewingBooking.reference_code}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-0.5">
                  {viewingBooking.service_name}
                </h3>
              </div>
              <button onClick={() => setViewingBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Patient Name</span>
                <strong className="text-slate-900 text-sm">{viewingBooking.patient_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number</span>
                <strong className="text-slate-900 text-sm font-mono">{viewingBooking.patient_phone}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Email</span>
                <span className="text-slate-800">{viewingBooking.patient_email || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Age / Gender</span>
                <span className="text-slate-800">
                  {viewingBooking.patient_age ? `${viewingBooking.patient_age} yrs` : 'N/A'} · {viewingBooking.patient_gender || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Appointment Date</span>
                <strong className="text-slate-900">{viewingBooking.appointment_date}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Slot Time</span>
                <strong className="text-slate-900">{viewingBooking.display_time}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Consulting Doctor</span>
                <span className="text-slate-900 font-semibold">{viewingBooking.staff_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Fee</span>
                <strong className="text-slate-900 text-sm">₹{Number(viewingBooking.total_price).toLocaleString()}</strong>
              </div>
            </div>

            {/* Symptoms / Notes */}
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Chief Complaint / Symptoms / Notes:</span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 italic">
                {viewingBooking.notes ? `"${viewingBooking.notes}"` : 'No additional symptoms or notes provided.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Created in Supabase: {new Date(viewingBooking.created_at).toLocaleString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const b = viewingBooking;
                    setViewingBooking(null);
                    handleStartEdit(b);
                  }}
                  className="px-3.5 py-1.5 bg-teal-700 text-white rounded font-semibold text-xs hover:bg-teal-800"
                >
                  Edit Booking
                </button>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-semibold text-xs hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT / MANAGE APPOINTMENT */}
      {/* ========================================================= */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-teal-800 font-bold">
                  Editing #{editingBooking.reference_code}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Update Appointment in Supabase
                </h3>
              </div>
              <button onClick={() => setEditingBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs">
                {editError}
              </div>
            )}

            {editSuccess && (
              <div className="p-3 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.appointment_date || ''}
                    onChange={e => setEditFormData({ ...editFormData, appointment_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot (Evening)</label>
                  <select
                    value={editFormData.appointment_time || ''}
                    onChange={e => setEditFormData({ ...editFormData, appointment_time: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="16:30">04:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="17:30">05:30 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="18:30">06:30 PM</option>
                    <option value="19:00">07:00 PM</option>
                    <option value="19:30">07:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editFormData.status || ''}
                  onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Assigned</label>
                <select
                  value={editFormData.staff_name || ''}
                  onChange={e => setEditFormData({ ...editFormData, staff_name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Dr. Mithra N. Hegde">Dr. Mithra N. Hegde (Chief Endodontist)</option>
                  <option value="Dr. Rohan Kamath">Dr. Rohan Kamath (Prosthodontist)</option>
                  <option value="Dr. Shweta Shetty">Dr. Shweta Shetty (Periodontist)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.patient_name || ''}
                    onChange={e => setEditFormData({ ...editFormData, patient_name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.patient_phone || ''}
                    onChange={e => setEditFormData({ ...editFormData, patient_phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Symptoms</label>
                <textarea
                  rows={2}
                  value={editFormData.notes || ''}
                  onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving in Supabase...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="font-bold text-sm text-red-900">Delete Appointment from Database?</h4>
            <p className="text-slate-600">
              Are you sure you want to permanently delete this booking row from your Supabase database? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded"
              >
                Keep Record
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CREATE NEW WALK-IN DIRECTLY TO SUPABASE */}
      {/* ========================================================= */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase">Supabase Direct Insert</span>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Register Walk-in Patient
                </h3>
              </div>
              <button onClick={() => setShowNewBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBooking} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Treatment</label>
                <select
                  value={newBookingData.service_name}
                  onChange={e => setNewBookingData({ ...newBookingData, service_name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Microscopic Root Canal Treatment (Single Sitting)">Microscopic Root Canal Treatment (₹4,500)</option>
                  <option value="Root Canal Re-Treatment & Complex Canal Therapy">Root Canal Re-Treatment (₹6,000)</option>
                  <option value="In-Office Laser Teeth Whitening">Laser Teeth Whitening (₹8,500)</option>
                  <option value="Porcelain Ceramic Smile Veneers (Per Tooth)">Porcelain Veneers (₹9,000)</option>
                  <option value="Dental Implant Surgical Planning & Consultation">Dental Implant Consultation (₹1,500)</option>
                  <option value="CAD/CAM High-Translucency Zirconia Crown">CAD/CAM Zirconia Crown (₹7,500)</option>
                  <option value="Nanohybrid Aesthetic Tooth Filling">Nanohybrid Aesthetic Filling (₹1,200)</option>
                  <option value="Full Mouth Ultrasonic Scaling & Air Polishing">Ultrasonic Scaling (₹1,800)</option>
                  <option value="Comprehensive Specialist Consultation & Oral Checkup">Specialist Consultation (₹500)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialist</label>
                <select
                  value={newBookingData.staff_name}
                  onChange={e => setNewBookingData({ ...newBookingData, staff_name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Dr. Mithra N. Hegde">Dr. Mithra N. Hegde (Chief Endodontist)</option>
                  <option value="Dr. Rohan Kamath">Dr. Rohan Kamath (Prosthodontist)</option>
                  <option value="Dr. Shweta Shetty">Dr. Shweta Shetty (Periodontist)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newBookingData.appointment_date}
                    onChange={e => setNewBookingData({ ...newBookingData, appointment_date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={newBookingData.appointment_time}
                    onChange={e => setNewBookingData({ ...newBookingData, appointment_time: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="16:30">04:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="17:30">05:30 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="18:30">06:30 PM</option>
                    <option value="19:00">07:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Patient Name"
                    value={newBookingData.patient_name}
                    onChange={e => setNewBookingData({ ...newBookingData, patient_name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 XXXXX"
                    value={newBookingData.patient_phone}
                    onChange={e => setNewBookingData({ ...newBookingData, patient_phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Symptoms / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Tooth sensitivity, throbbing pain, chipped tooth..."
                  value={newBookingData.notes}
                  onChange={e => setNewBookingData({ ...newBookingData, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingNew}
                  className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded shadow-xs"
                >
                  {isCreatingNew ? 'Inserting to Supabase...' : 'Save to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
