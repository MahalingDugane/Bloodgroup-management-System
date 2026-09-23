'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function RegisterDonorPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    blood_group: 'A+',
    phone: '',
    age: 25,
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    last_donation_date: '',
    availability: true,
  });

  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        setFormData((prev) => ({
          ...prev,
          full_name: user.full_name || '',
          phone: user.phone || ''
        }));
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedAccuracy) {
      setError('Please acknowledge the accuracy confirmation before proceeding.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      await api.post('/donors/', {
        ...formData,
        age: Number(formData.age),
        last_donation_date: formData.last_donation_date || null,
      });
      router.push('/profile');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to register donor profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return <div className="p-8 text-center text-slate-500">Verifying session...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm my-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Register as a Blood Donor</h1>
      {error && <div className="p-3 mb-4 text-sm text-rose-600 bg-rose-50 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.blood_group}
              onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Age (18-65)</label>
            <input
              type="number"
              min="18"
              max="65"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Donation Date (Optional)</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={formData.last_donation_date}
            onChange={(e) => setFormData({ ...formData, last_donation_date: e.target.value })}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmedAccuracy}
              onChange={(e) => setConfirmedAccuracy(e.target.checked)}
            />
            <span>
              I confirm that my donor information is accurate and that I am currently available to be contacted about donation requests.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50 mt-4"
        >
          {submitting ? 'Registering...' : 'Complete Donor Registration'}
        </button>
      </form>
    </div>
  );
}