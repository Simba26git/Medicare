import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiService from '../utils/api';

export default function PatientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!apiService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = apiService.getCurrentUser();
    if (currentUser.role !== 'patient') {
      router.push(`/${currentUser.role}`);
      return;
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
    apiService.logout();
    router.push('/');
  };

  const bookAppointment = async () => {
    try {
      // In a real app, this would open a modal or redirect to booking page
      const appointmentData = {
        patientId: user.id,
        doctorId: 2, // Dr. Sarah Johnson
        date: '2025-02-01',
        time: '10:00',
        type: 'General Consultation',
        notes: 'Regular checkup'
      };

      const response = await apiService.createAppointment(appointmentData);
      if (response.success) {
        alert('Appointment booked successfully!');
        loadDashboardData(); // Refresh data
      }
    } catch (err) {
      alert('Failed to book appointment: ' + err.message);
    }
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
                      onClick={bookAppointment}
                      className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                          <p className="text-sm text-gray-600">Schedule a new visit</p>
                        </div>
                      </div>
                    </button>

                    <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Message Doctor</h3>
                          <p className="text-sm text-gray-600">Ask a question</p>
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
                    onClick={bookAppointment}
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Prescriptions</h2>
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
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
                  ))}
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
    </div>
  );
}
