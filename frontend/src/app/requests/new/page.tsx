'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function NewBloodRequestPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    patient_name: '',
    blood_group: 'A+',
    required_units: 1,
    hospital_name: '',
    hospital_address: '',
    city: '',
    contact_number: '',
    urgency: 'Normal',
    reason: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Automatically sync registered phone number when user profile resolves asynchronously
  useEffect(() => {
    if (user?.phone && !formData.contact_number) {
      setFormData((prev) => ({ ...prev, contact_number: user.phone }));
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/requests/', {
        ...formData,
        required_units: Number(formData.required_units),
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to submit blood request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return <div className="p-8 text-center text-slate-500">Loading form...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Emergency Blood Request</h1>
      {error && <div className="p-3 mb-4 text-sm text-rose-600 bg-rose-50 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Units Needed</label>
            <input
              type="number"
              min="1"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.required_units}
              onChange={(e) => setFormData({ ...formData, required_units: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.hospital_name}
              onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
            />
          </div>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Address / Ward Details</label>
          <textarea
            required
            rows={2}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={formData.hospital_address}
            onChange={(e) => setFormData({ ...formData, hospital_address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Clinical Notes</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50"
        >
          {submitting ? 'Broadcasting...' : 'Broadcast Blood Request'}
        </button>
      </form>
    </div>
  );
}