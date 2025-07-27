import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiService from '../utils/api';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.query.role) {
      setRole(router.query.role);
    }
  }, [router.query.role]);

  // Check if user is already logged in
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      const user = apiService.getCurrentUser();
      if (user) {
        router.push(`/${user.role}`);
      }
    }
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData.email, formData.password);
      
      if (response.success) {
        // Clear browser cache and ensure clean state
        if (typeof window !== 'undefined') {
          // Clear any potential cached router state
          window.history.replaceState(null, '', '/');
          
          // Small delay to ensure logout cleanup is complete
          setTimeout(() => {
            // Force navigation with replace to prevent back button issues
            router.replace(`/${response.user.role}`, undefined, { 
              shallow: false,
              scroll: true 
            });
          }, 200);
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    patient: {
      title: 'Patient Portal',
      subtitle: 'Access your medical records and appointments',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      demoCredentials: { email: 'patient@medcare.africa', password: 'Patient123!' }
    },
    doctor: {
      title: 'Doctor Portal',
      subtitle: 'Manage patients and medical records',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      demoCredentials: { email: 'doctor@medcare.africa', password: 'Doctor123!' }
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'System administration and analytics',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      demoCredentials: { email: 'admin@medcare.africa', password: 'Admin123!' }
    }
  };

  const currentRole = roleConfig[role] || roleConfig.patient;

  const useDemoCredentials = () => {
    setFormData(currentRole.demoCredentials);
    setError(''); // Clear any existing errors
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${currentRole.color} text-white mb-6`}>
              {currentRole.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentRole.title}</h1>
            <p className="text-gray-600">{currentRole.subtitle}</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Login as:</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(roleConfig).map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setRole(roleKey)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    role === roleKey
                      ? `bg-gradient-to-r ${roleConfig[roleKey].color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials Banner */}
          <div className={`${currentRole.bgColor} border border-opacity-20 rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Demo Credentials</p>
                <p className="text-xs text-gray-600">{currentRole.demoCredentials.email}</p>
              </div>
              <button
                onClick={useDemoCredentials}
                className={`text-xs font-medium py-2 px-3 rounded-md bg-gradient-to-r ${currentRole.color} text-white hover:shadow-md transition-all duration-300`}
              >
                Use Demo
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors duration-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${currentRole.color} text-white hover:shadow-lg hover:scale-105`
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                `Sign In to ${currentRole.title}`
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors duration-300">
                Contact Administrator
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is encrypted and secure. This platform complies with healthcare privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
