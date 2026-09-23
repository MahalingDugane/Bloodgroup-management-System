'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [donor, setDonor] = useState<any>(null);
  const [loadingDonor, setLoadingDonor] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await api.get('/donors/me');
        if (res.data) {
          setDonor(res.data);
          setAvailability(res.data.availability);
        }
      } catch (err) {
        console.error('Failed to load donor profile:', err);
      } finally {
        setLoadingDonor(false);
      }
    };
    if (user) {
      fetchDonor();
    }
  }, [user]);

  const toggleAvailability = async () => {
    try {
      const res = await api.patch('/donors/me/availability', {
        availability: !availability,
      });
      setAvailability(res.data.availability);
      setMsg('Availability status updated.');
    } catch {
      setMsg('Failed to update availability.');
    }
  };

  if (isLoading || loadingDonor) {
    return <div className="p-12 text-center text-slate-500">Loading user profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>

      {msg && <div className="p-3 text-sm bg-slate-100 text-slate-700 rounded-lg">{msg}</div>}

      <div className="space-y-3 border-b pb-6 text-sm">
        <div>
          <span className="text-xs text-slate-400 block">Full Name</span>
          <span className="font-semibold text-slate-800">{user?.full_name}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Registered Email</span>
          <span className="text-slate-800">{user?.email}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Phone Number</span>
          <span className="text-slate-800">{user?.phone}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Account Role</span>
          <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">{user?.role}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Donor Information</h2>
        {donor ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Blood Group</span>
                <span className="font-bold text-rose-600 text-base">{donor.blood_group}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Age / Gender</span>
                <span className="text-slate-800">{donor.age} yrs / {donor.gender}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Location</span>
              <span className="text-slate-800">{donor.city}, {donor.state}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Last Donation</span>
              <span className="text-slate-800">{donor.last_donation_date || 'None recorded'}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">Donation Availability</span>
                <p className="text-xs text-slate-500">Toggle whether you can currently be contacted for blood donation</p>
              </div>
              <button
                onClick={toggleAvailability}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                  availability ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {availability ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">You are not yet registered as a donor.</p>
        )}
      </div>
    </div>
  );
}