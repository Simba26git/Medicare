import React, { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const systemStats = {
    totalUsers: 1247,
    totalDoctors: 45,
    totalPatients: 1156,
    totalAppointments: 324,
    activeToday: 89,
    systemUptime: '99.9%'
  }

  const recentUsers = [
    { id: 1, name: 'Dr. Michael Chen', role: 'Doctor', department: 'Cardiology', joinDate: '2025-07-20', status: 'active' },
    { id: 2, name: 'Jane Smith', role: 'Patient', department: '-', joinDate: '2025-07-19', status: 'active' },
    { id: 3, name: 'Nurse Mary Johnson', role: 'Staff', department: 'Emergency', joinDate: '2025-07-18', status: 'active' },
    { id: 4, name: 'Dr. Sarah Wilson', role: 'Doctor', department: 'Pediatrics', joinDate: '2025-07-17', status: 'pending' }
  ]

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Server load is above 80%', time: '2 minutes ago', severity: 'medium' },
    { id: 2, type: 'info', message: 'Database backup completed successfully', time: '1 hour ago', severity: 'low' },
    { id: 3, type: 'error', message: 'Payment gateway connection timeout', time: '3 hours ago', severity: 'high' },
    { id: 4, type: 'success', message: 'Security scan completed - no threats found', time: '6 hours ago', severity: 'low' }
  ]

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
  )

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
                <p className="text-sm text-gray-600">System Administrator</p>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">SA</span>
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
                id="users"
                label="User Management"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
                isActive={activeTab === 'users'}
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
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">System Overview</h2>
                  
                  {/* System Stats */}
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                        <p className="text-3xl font-bold text-purple-600">{systemStats.totalUsers.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Doctors</p>
                        <p className="text-3xl font-bold text-emerald-600">{systemStats.totalDoctors}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Patients</p>
                        <p className="text-3xl font-bold text-blue-600">{systemStats.totalPatients.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Appointments</p>
                        <p className="text-3xl font-bold text-orange-600">{systemStats.totalAppointments}</p>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Active Today</p>
                        <p className="text-3xl font-bold text-green-600">{systemStats.activeToday}</p>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Uptime</p>
                        <p className="text-3xl font-bold text-indigo-600">{systemStats.systemUptime}</p>
                      </div>
                    </div>
                  </div>

                  {/* System Alerts */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">System Alerts</h3>
                    <div className="space-y-3">
                      {systemAlerts.slice(0, 4).map((alert) => (
                        <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${
                          alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                          alert.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              alert.type === 'error' ? 'bg-red-500' :
                              alert.type === 'warning' ? 'bg-yellow-500' :
                              alert.type === 'success' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{alert.message}</p>
                              <p className="text-sm text-gray-500">{alert.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button className="flex items-center justify-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium text-purple-600">Add User</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium text-emerald-600">View Reports</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium text-blue-600">System Settings</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-300">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-orange-600">Backup System</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                    Add New User
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            user.role === 'Doctor' ? 'bg-emerald-100' :
                            user.role === 'Patient' ? 'bg-blue-100' :
                            'bg-purple-100'
                          }`}>
                            <span className={`font-bold ${
                              user.role === 'Doctor' ? 'text-emerald-600' :
                              user.role === 'Patient' ? 'text-blue-600' :
                              'text-purple-600'
                            }`}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600">{user.role} {user.department !== '-' ? `• ${user.department}` : ''}</p>
                            <p className="text-sm text-gray-500">Joined: {user.joinDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                          <button className="text-purple-600 hover:text-purple-800 transition-colors duration-300">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 bg-gradient-to-t from-purple-100 to-purple-50 rounded-lg flex items-end justify-center">
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Appointment Trends</h3>
                    <div className="h-64 bg-gradient-to-t from-emerald-100 to-emerald-50 rounded-lg flex items-end justify-center">
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Usage Statistics</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">87%</p>
                      <p className="text-sm text-gray-600">Daily Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">92%</p>
                      <p className="text-sm text-gray-600">Appointment Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-gray-600">Avg. Daily Appointments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">4.8/5</p>
                      <p className="text-sm text-gray-600">User Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">System Health</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Server Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>API Server</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Online</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Database</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Online</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment Gateway</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Warning</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Service</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">CPU Usage</span>
                          <span className="text-sm text-gray-600">67%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '67%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Memory Usage</span>
                          <span className="text-sm text-gray-600">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Disk Usage</span>
                          <span className="text-sm text-gray-600">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent System Events</h3>
                  <div className="space-y-3">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            alert.type === 'error' ? 'bg-red-500' :
                            alert.type === 'warning' ? 'bg-yellow-500' :
                            alert.type === 'success' ? 'bg-green-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-500">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
