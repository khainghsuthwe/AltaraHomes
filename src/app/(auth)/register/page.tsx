'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register, login } from '@/lib/api';
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // if (!/^(?=.*[A-Za-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
    //   setError('Password must be at least 8 characters with letters and special characters.');
    //   return;
    // }
    setLoading(true);
    try {
      await register({
        username: formData.email,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        user_type: 'user',
      });
      // Auto-login after registration
      const loginResponse = await login({
        username: formData.email,
        password: formData.password,
      });
      localStorage.setItem('accessToken', loginResponse.data.access);
      localStorage.setItem('refreshToken', loginResponse.data.refresh);
      router.push('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { [key: string]: string[] | string };
        const errorMessages = Object.values(errorData)
          .flat()
          .join(' ');
        setError(errorMessages || 'Registration failed. Please check your input.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Create an Account</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-600" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <PhoneIcon className="h-4 w-4 mr-2 text-blue-600" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <LockClosedIcon className="h-4 w-4 mr-2 text-blue-600" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <LockClosedIcon className="h-4 w-4 mr-2 text-blue-600" />
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}