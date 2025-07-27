import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiService from '../utils/api';
import NotificationCenter from '../components/NotificationCenter';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
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
    if (!currentUser || currentUser.role !== 'admin') {
      // Force logout and redirect to clear any cached state
      apiService.logout();
      router.replace('/login');
      return;
    }

    setUser(currentUser);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [statsResponse, usersResponse, appointmentsResponse, prescriptionsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getUsers(),
        apiService.getAppointments(),
        apiService.getPrescriptions()
      ]);

      setStats(statsResponse.stats || {});
      setUsers(usersResponse.users || []);
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

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-purple-500 text-white shadow-lg'
          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const doctors = users.filter(u => u.role === 'doctor');
  const patients = users.filter(u => u.role === 'patient');
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Administrator</p>
                <p className="font-semibold text-gray-900">{user?.name || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
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
                label="Dashboard"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>}
                isActive={activeTab === 'overview'}
                onClick={setActiveTab}
              />
              <TabButton
                id="users"
                label="User Management"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                isActive={activeTab === 'users'}
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
                id="analytics"
                label="Analytics"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                isActive={activeTab === 'analytics'}
                onClick={setActiveTab}
              />
              <TabButton
                id="system"
                label="System Health"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                isActive={activeTab === 'system'}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-emerald-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Doctors</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Patients</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPatients || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Appointments Today</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                      {appointments.slice(0, 5).map((appointment) => (
                        <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Appointment: {appointment.patientName}</p>
                            <p className="text-sm text-gray-600">with {appointment.doctorName} - {appointment.date}</p>
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

                  {/* System Health */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">System Health</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">Database</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Online</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">API Server</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Running</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">Backup System</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">Performance</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8">
                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-emerald-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Doctors</h3>
                      <p className="text-3xl font-bold text-emerald-600">{doctors.length}</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Patients</h3>
                      <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Admins</h3>
                      <p className="text-3xl font-bold text-purple-600">{admins.length}</p>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.phone || 'Not provided'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h2>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                          <p className="text-gray-600">with {appointment.doctorName}</p>
                          <p className="text-sm text-gray-500 mt-1">{appointment.date} at {appointment.time}</p>
                          <p className="text-sm text-gray-600">Type: {appointment.type}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">Notes: {appointment.notes}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
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

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Appointments</h3>
                      <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
                      <p className="text-sm text-gray-500 mt-1">All time</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Prescriptions</h3>
                      <p className="text-3xl font-bold text-green-600">{prescriptions.filter(p => p.status === 'active').length}</p>
                      <p className="text-sm text-gray-500 mt-1">Currently active</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Reviews</h3>
                      <p className="text-3xl font-bold text-purple-600">{appointments.filter(a => a.status === 'pending').length}</p>
                      <p className="text-sm text-gray-500 mt-1">Require attention</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">System Uptime</h3>
                      <p className="text-3xl font-bold text-orange-600">99.9%</p>
                      <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                    </div>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-gray-500">Appointments by Month</p>
                      </div>
                    </div>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        <p className="text-gray-500">User Distribution</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-8">
                {/* System Status */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">API Server</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Status: Online</p>
                      <p className="text-sm text-gray-600 mb-2">Uptime: 99.9%</p>
                      <p className="text-sm text-gray-600">Response Time: 45ms</p>
                    </div>

                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Database</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Status: Connected</p>
                      <p className="text-sm text-gray-600 mb-2">Performance: Good</p>
                      <p className="text-sm text-gray-600">Query Time: 12ms</p>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Storage</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Used: 2.3 GB / 100 GB</p>
                      <p className="text-sm text-gray-600 mb-2">Available: 97.7 GB</p>
                      <p className="text-sm text-gray-600">Usage: 2.3%</p>
                    </div>
                  </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent System Logs</h2>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="text-green-400">✓ [2025-01-27 10:30:12] API Server started successfully</div>
                    <div className="text-blue-400">ℹ [2025-01-27 10:30:13] Database connection established</div>
                    <div className="text-green-400">✓ [2025-01-27 10:30:15] Authentication service online</div>
                    <div className="text-blue-400">ℹ [2025-01-27 10:31:22] User login: doctor@medcare.africa</div>
                    <div className="text-green-400">✓ [2025-01-27 10:32:45] Appointment created successfully</div>
                    <div className="text-blue-400">ℹ [2025-01-27 10:33:12] Prescription generated for patient ID: 3</div>
                    <div className="text-yellow-400">⚠ [2025-01-27 10:35:30] Rate limit warning: API calls from 192.168.1.1</div>
                    <div className="text-green-400">✓ [2025-01-27 10:40:15] Backup completed successfully</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
