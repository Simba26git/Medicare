import React from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const handleLogin = (role) => {
    router.push(`/login?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                MedCare Platform
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Features</a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block p-3 rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Modern Healthcare
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline medical appointments, manage prescriptions, and provide better patient care 
            with our comprehensive healthcare platform designed specifically for African healthcare providers.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              role: 'patient',
              title: 'Patients',
              description: 'Book appointments, view medical records, and manage prescriptions',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              borderColor: 'border-blue-200'
            },
            {
              role: 'doctor',
              title: 'Doctors',
              description: 'Manage patients, create prescriptions, and schedule appointments',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
              color: 'from-emerald-500 to-emerald-600',
              bgColor: 'bg-emerald-50',
              borderColor: 'border-emerald-200'
            },
            {
              role: 'admin',
              title: 'Administrators',
              description: 'Oversee operations, manage users, and view analytics',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-50',
              borderColor: 'border-purple-200'
            }
          ].map((user, index) => (
            <div key={index} className={`${user.bgColor} ${user.borderColor} border-2 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
                 onClick={() => handleLogin(user.role)}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${user.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {user.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{user.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{user.description}</p>
              <button className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r ${user.color} text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                Login as {user.title.slice(0, -1)}
              </button>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to modernize healthcare delivery in Africa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📅",
                title: "Smart Scheduling",
                description: "AI-powered appointment scheduling that optimizes doctor availability and patient preferences"
              },
              {
                icon: "💊",
                title: "E-Prescriptions",
                description: "Digital prescription management with pharmacy integration and medication tracking"
              },
              {
                icon: "📱",
                title: "Mobile First",
                description: "Progressive web app optimized for mobile devices with offline capabilities"
              },
              {
                icon: "🌍",
                title: "Africa-Optimized",
                description: "Designed for African healthcare systems with local language support and low-bandwidth optimization"
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description: "End-to-end encryption and HIPAA-compliant data protection for patient privacy"
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                description: "Real-time insights and reporting for healthcare providers and administrators"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-center text-white mt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of healthcare providers already using MedCare Platform to deliver better patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-300">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-xl font-bold">MedCare</span>
              </div>
              <p className="text-gray-400">Revolutionizing healthcare management across Africa.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MedCare Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
