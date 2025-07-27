import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiService from '../utils/api';

export default function DoctorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Prescription form state
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });

  useEffect(() => {
    // Check authentication
    if (!apiService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = apiService.getCurrentUser();
    if (currentUser.role !== 'doctor') {
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
      const [statsResponse, appointmentsResponse, prescriptionsResponse, patientsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getAppointments(),
        apiService.getPrescriptions(),
        apiService.getUsers('patient')
      ]);

      setStats(statsResponse.stats || {});
      setAppointments(appointmentsResponse.appointments || []);
      setPrescriptions(prescriptionsResponse.prescriptions || []);
      setPatients(patientsResponse.users || []);
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

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await apiService.updateAppointment(appointmentId, { status: newStatus });
      if (response.success) {
        loadDashboardData(); // Refresh data
      }
    } catch (err) {
      alert('Failed to update appointment: ' + err.message);
    }
  };

  const createPrescription = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createPrescription({
        ...prescriptionForm,
        doctorId: user.id
      });
      
      if (response.success) {
        alert('Prescription created successfully!');
        setShowPrescriptionForm(false);
        setPrescriptionForm({
          patientId: '',
          diagnosis: '',
          medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
        });
        loadDashboardData(); // Refresh data
      }
    } catch (err) {
      alert('Failed to create prescription: ' + err.message);
    }
  };

  const addMedication = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const updateMedication = (index, field, value) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedication = (index) => {
    if (prescriptionForm.medications.length > 1) {
      setPrescriptionForm(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    }
  };

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-emerald-500 text-white shadow-lg'
          : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                  Doctor Portal
                </h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Dr.</p>
                <p className="font-semibold text-gray-900">{user?.name || 'Doctor'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'D'}
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
                id="schedule"
                label="Schedule"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                isActive={activeTab === 'schedule'}
                onClick={setActiveTab}
              />
              <TabButton
                id="patients"
                label="Patients"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                isActive={activeTab === 'patients'}
                onClick={setActiveTab}
              />
              <TabButton
                id="prescriptions"
                label="Prescriptions"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                isActive={activeTab === 'prescriptions'}
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
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-emerald-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Patients</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPatients || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Today's Appointments</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments || 0}</p>
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
                        <p className="text-sm text-gray-600 font-medium">Active Prescriptions</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activePrescriptions || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setShowPrescriptionForm(true)}
                      className="group p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl border border-emerald-200 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Create Prescription</h3>
                          <p className="text-sm text-gray-600">Write a new prescription</p>
                        </div>
                      </div>
                    </button>

                    <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">View Schedule</h3>
                          <p className="text-sm text-gray-600">Check today's appointments</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Today's Appointments */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Appointments</h2>
                  <div className="space-y-4">
                    {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.time} - {appointment.type}</p>
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

            {activeTab === 'schedule' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Schedule</h2>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                          <p className="text-gray-600">{appointment.type}</p>
                          <p className="text-sm text-gray-500 mt-1">{appointment.date} at {appointment.time}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">Notes: {appointment.notes}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Patients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patients.map((patient) => (
                    <div key={patient.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {patient.phone && (
                          <p className="text-gray-600">📞 {patient.phone}</p>
                        )}
                        {patient.bloodType && (
                          <p className="text-gray-600">🩸 Blood Type: {patient.bloodType}</p>
                        )}
                        {patient.allergies && patient.allergies.length > 0 && (
                          <p className="text-gray-600">⚠️ Allergies: {patient.allergies.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
                  <button
                    onClick={() => setShowPrescriptionForm(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Create New Prescription
                  </button>
                </div>
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Patient: {prescription.patientName}</h3>
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
          </main>
        </div>
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Create New Prescription</h3>
                <button
                  onClick={() => setShowPrescriptionForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={createPrescription} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <select
                  value={prescriptionForm.patientId}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, patientId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter diagnosis..."
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Medications</label>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    + Add Medication
                  </button>
                </div>
                
                {prescriptionForm.medications.map((med, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Medication {index + 1}</span>
                      {prescriptionForm.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Medication name"
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g., Twice daily)"
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 7 days)"
                        value={med.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Special instructions (optional)"
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      className="w-full mt-3 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
