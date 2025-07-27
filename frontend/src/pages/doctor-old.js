import React, { useState } from 'react'
import { useRouter } from 'next/router'

export default function DoctorDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const appointments = [
    { id: 1, patient: 'John Doe', time: '9:00 AM', type: 'Consultation', status: 'confirmed', duration: '30 min' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Follow-up', status: 'confirmed', duration: '15 min' },
    { id: 3, patient: 'Mike Johnson', time: '2:00 PM', type: 'Check-up', status: 'pending', duration: '30 min' },
    { id: 4, patient: 'Sarah Wilson', time: '3:30 PM', type: 'Consultation', status: 'confirmed', duration: '45 min' }
  ]

  const patients = [
    { id: 1, name: 'John Doe', age: 34, lastVisit: '2025-07-20', condition: 'Hypertension', status: 'stable' },
    { id: 2, name: 'Jane Smith', age: 28, lastVisit: '2025-07-18', condition: 'Diabetes Type 2', status: 'monitoring' },
    { id: 3, name: 'Mike Johnson', age: 45, lastVisit: '2025-07-15', condition: 'Arthritis', status: 'improving' },
    { id: 4, name: 'Sarah Wilson', age: 52, lastVisit: '2025-07-12', condition: 'Asthma', status: 'stable' }
  ]

  const prescriptions = [
    { id: 1, patient: 'John Doe', medication: 'Lisinopril 10mg', date: '2025-07-20', status: 'active' },
    { id: 2, patient: 'Jane Smith', medication: 'Metformin 500mg', date: '2025-07-18', status: 'active' },
    { id: 3, patient: 'Mike Johnson', medication: 'Ibuprofen 400mg', date: '2025-07-15', status: 'completed' },
    { id: 4, patient: 'Sarah Wilson', medication: 'Albuterol Inhaler', date: '2025-07-12', status: 'active' }
  ]

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
  )

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
                <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Cardiology Department</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">SJ</span>
              </div>
              <button
                onClick={() => router.push('/login')}
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
                label="Today's Schedule"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                isActive={activeTab === 'appointments'}
                onClick={setActiveTab}
              />
              <TabButton
                id="patients"
                label="My Patients"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
                isActive={activeTab === 'patients'}
                onClick={setActiveTab}
              />
              <TabButton
                id="prescriptions"
                label="Prescriptions"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" /></svg>}
                isActive={activeTab === 'prescriptions'}
                onClick={setActiveTab}
              />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Doctor Dashboard</h2>
                  
                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                          <p className="text-3xl font-bold text-emerald-600">4</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Patients</p>
                          <p className="text-3xl font-bold text-blue-600">47</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                          <p className="text-3xl font-bold text-purple-600">12</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                          <p className="text-3xl font-bold text-orange-600">3</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule Preview */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {appointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.time}</p>
                              <p className="text-sm text-gray-600">{appointment.patient} - {appointment.type}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button className="flex items-center justify-center space-x-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium text-emerald-600">New Prescription</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-blue-600">Add Patient</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium text-purple-600">Review Results</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-orange-600">Schedule Appointment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Today's Schedule</h2>
                  <div className="text-sm text-gray-600">
                    Saturday, July 26, 2025
                  </div>
                </div>
                
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{appointment.patient}</h3>
                            <p className="text-gray-600">{appointment.type}</p>
                            <p className="text-sm text-gray-500">{appointment.time} • {appointment.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          <button className="text-emerald-600 hover:text-emerald-800 transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">My Patients</h2>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                    Add New Patient
                  </button>
                </div>
                
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{patient.name}</h3>
                            <p className="text-gray-600">Age: {patient.age} • {patient.condition}</p>
                            <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'stable' 
                              ? 'bg-green-100 text-green-800' 
                              : patient.status === 'monitoring'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </span>
                          <button className="text-emerald-600 hover:text-emerald-800 transition-colors duration-300">
                            View Records
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Recent Prescriptions</h2>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                    New Prescription
                  </button>
                </div>
                
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{prescription.medication}</h3>
                            <p className="text-gray-600">Patient: {prescription.patient}</p>
                            <p className="text-sm text-gray-500">Prescribed: {prescription.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            prescription.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
