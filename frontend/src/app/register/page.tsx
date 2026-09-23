'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (formData.full_name.trim().length < 2) err.full_name = 'Full name is required.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = 'Valid email is required.';
    if (formData.phone.trim().length < 7) err.phone = 'Valid contact number is required.';
    if (formData.password.length < 8) err.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirm_password) err.confirm_password = 'Passwords do not match.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setApiError(err.response?.data?.detail || 'Registration failed. Email might already be registered.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create an Account</h1>
      
      {apiError && <div className="p-3 mb-4 text-sm text-rose-600 bg-rose-50 rounded-lg">{apiError}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
          {errors.full_name && <p className="text-xs text-rose-600 mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
          />
          {errors.confirm_password && <p className="text-xs text-rose-600 mt-1">{errors.confirm_password}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50"
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-6">
        Already registered? <Link href="/login" className="text-rose-600 hover:underline">Sign In</Link>
      </p>
    </div>
  );
}