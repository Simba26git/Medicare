import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiService from '../utils/api';
import NotificationCenter from '../components/NotificationCenter';

// Calendar component for appointment booking
const AppointmentCalendar = ({ onSelectDate, bookedDates = [], onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const isDateBooked = (day) => {
    if (!day) return false;
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookedDates.includes(dateString);
  };

  const isDatePast = (day) => {
    if (!day) return false;
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  const handleDateSelect = (day) => {
    if (!day || isDateBooked(day) || isDatePast(day)) return;
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      onSelectDate(selectedDate, selectedTime);
      onClose();
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md lg:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Book Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-sm sm:text-base lg:text-lg font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-3 sm:mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.substring(0, 1)}</span>
            </div>
          ))}
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => handleDateSelect(day)}
                  disabled={isDateBooked(day) || isDatePast(day)}
                  className={`w-full h-full rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      ? 'bg-blue-500 text-white'
                      : isDateBooked(day)
                      ? 'bg-red-100 text-red-400 cursor-not-allowed'
                      : isDatePast(day)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Select Time</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md sm:rounded-lg transition-all ${
                    selectedTime === time
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs text-gray-500 mb-3 sm:mb-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-100 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-100 rounded"></div>
            <span>Past</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

// Prescription Upload Modal
const PrescriptionUploadModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview if it's an image
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      // Simulate upload - in real app, you'd upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prescriptionData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        status: 'pending_review'
      };
      
      onUpload(prescriptionData);
      onClose();
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Upload Prescription</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center mb-3 sm:mb-4 relative">
          {preview ? (
            <div className="space-y-3 sm:space-y-4">
              <img src={preview} alt="Preview" className="max-w-full h-24 sm:h-32 object-contain mx-auto rounded" />
              <p className="text-xs sm:text-sm text-gray-600 break-all">{file.name}</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Click to upload or drag and drop</p>
                <p className="text-xs sm:text-sm text-gray-400">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PatientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    // Clear any browser caches first
    if (typeof window !== 'undefined') {
      // Clear history state to prevent back navigation issues
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Check authentication with cache clearing
    if (!apiService.isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const currentUser = apiService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'patient') {
      // Force logout and redirect to clear any cached state
      apiService.logout();
      return; // logout() will handle the redirect
    }

    setUser(currentUser);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [statsResponse, appointmentsResponse, prescriptionsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getAppointments(),
        apiService.getPrescriptions()
      ]);

      setStats(statsResponse.stats || {});
      setAppointments(appointmentsResponse.appointments || []);
      setPrescriptions(prescriptionsResponse.prescriptions || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all state and force navigation
    setUser(null);
    setAppointments([]);
    setPrescriptions([]);
    setUploadedPrescriptions([]);
    setStats({});
    
    // Call API logout which will handle cache clearing and redirection
    apiService.logout();
  };

  const handleAppointmentBooking = async (date, time) => {
    try {
      const appointmentData = {
        patientId: user.id,
        doctorId: 2, // Dr. Sarah Johnson
        date: date,
        time: time,
        type: 'General Consultation',
        notes: 'Appointment booked via calendar'
      };

      const response = await apiService.createAppointment(appointmentData);
      if (response.success) {
        alert('Appointment booked successfully!');
        loadDashboardData(); // Refresh data
        setShowCalendar(false);
      }
    } catch (err) {
      alert('Failed to book appointment: ' + err.message);
    }
  };

  const handlePrescriptionUpload = (prescriptionData) => {
    // Add to uploaded prescriptions list
    setUploadedPrescriptions(prev => [...prev, {
      id: Date.now(),
      ...prescriptionData
    }]);
    alert('Prescription uploaded successfully! It will be reviewed by medical staff.');
  };

  // Get booked dates for calendar
  const getBookedDates = () => {
    return appointments.map(apt => apt.date);
  };

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-blue-500 text-white shadow-lg'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                  Patient Portal
                </h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name || 'Patient'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'P'}
                </span>
              </div>
              <NotificationCenter />
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64">
            <nav className="space-y-2">
              <TabButton
                id="overview"
                label="Overview"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>}
                isActive={activeTab === 'overview'}
                onClick={setActiveTab}
              />
              <TabButton
                id="appointments"
                label="Appointments"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                isActive={activeTab === 'appointments'}
                onClick={setActiveTab}
              />
              <TabButton
                id="prescriptions"
                label="Prescriptions"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                isActive={activeTab === 'prescriptions'}
                onClick={setActiveTab}
              />
              <TabButton
                id="records"
                label="Medical Records"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                isActive={activeTab === 'records'}
                onClick={setActiveTab}
              />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Upcoming</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Past Visits</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pastAppointments || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Active Meds</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activePrescriptions || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Records</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPrescriptions || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                      onClick={() => setShowCalendar(true)}
                      className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                          <p className="text-sm text-gray-600">Choose date & time</p>
                        </div>
                      </div>
                    </button>

                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="group p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Upload Prescription</h3>
                          <p className="text-sm text-gray-600">Share your prescription</p>
                        </div>
                      </div>
                    </button>

                    <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">View Records</h3>
                          <p className="text-sm text-gray-600">Medical history</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{appointment.type} with {appointment.doctorName}</p>
                          <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Book New Appointment
                  </button>
                </div>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                          <p className="text-gray-600">Dr. {appointment.doctorName}</p>
                          <p className="text-sm text-gray-500 mt-1">{appointment.date} at {appointment.time}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">Notes: {appointment.notes}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                {/* Doctor Prescribed Medications */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Doctor Prescriptions</h2>
                  </div>
                  <div className="space-y-4">
                    {prescriptions.length > 0 ? prescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">Prescribed by {prescription.doctorName}</h3>
                            <p className="text-sm text-gray-500">{prescription.date}</p>
                            {prescription.diagnosis && (
                              <p className="text-sm text-gray-600 mt-1">Diagnosis: {prescription.diagnosis}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {prescription.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {prescription.medications.map((med, index) => (
                            <div key={index} className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{med.name}</p>
                                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                                  <p className="text-sm text-gray-500">Duration: {med.duration}</p>
                                  {med.instructions && (
                                    <p className="text-sm text-blue-600 mt-1">{med.instructions}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">No prescriptions available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Prescriptions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Uploaded Prescriptions</h2>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload Prescription</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {uploadedPrescriptions.length > 0 ? uploadedPrescriptions.map((upload) => (
                      <div key={upload.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{upload.fileName}</p>
                              <p className="text-sm text-gray-500">
                                Uploaded on {new Date(upload.uploadDate).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {(upload.fileSize / 1024 / 1024).toFixed(2)} MB • {upload.fileType}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            upload.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                            upload.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {upload.status === 'pending_review' ? 'Pending Review' : 
                             upload.status === 'reviewed' ? 'Reviewed' : upload.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-500 mb-2">No uploaded prescriptions</p>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Upload your first prescription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Records</h2>
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Records</h3>
                  <p className="text-gray-600">Your medical records will appear here once they are available.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <AppointmentCalendar
          onSelectDate={handleAppointmentBooking}
          bookedDates={getBookedDates()}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {/* Prescription Upload Modal */}
      {showUploadModal && (
        <PrescriptionUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handlePrescriptionUpload}
        />
      )}
    </div>
  );
}
