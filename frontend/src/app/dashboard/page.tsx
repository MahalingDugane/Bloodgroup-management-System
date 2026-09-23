'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface BloodRequestItem {
  id: number;
  patient_name: string;
  blood_group: string;
  required_units: number;
  hospital_name: string;
  city: string;
  urgency: string;
  status: string;
  created_at: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [requests, setRequests] = useState<BloodRequestItem[]>([]);
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, donorRes] = await Promise.all([
          api.get('/requests/my-requests'),
          api.get('/donors/me')
        ]);
        setRequests(reqRes.data);
        setDonorProfile(donorRes.data);
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading user portal...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.full_name}</h1>
          <p className="text-slate-500 mt-1">Manage your blood requests and donor enrollment</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/requests/new"
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Create Blood Request
          </Link>
          {!donorProfile && (
            <Link
              href="/donors/register"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Register as Donor
            </Link>
          )}
        </div>
      </div>

      {donorProfile && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-rose-900">Active Donor Profile ({donorProfile.blood_group})</h2>
            <p className="text-sm text-rose-700">Status: {donorProfile.availability ? 'Available for donation' : 'Temporarily unavailable'}</p>
          </div>
          <Link href="/profile" className="text-rose-600 font-semibold text-sm hover:underline">
            Manage Availability &rarr;
          </Link>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">My Submitted Blood Requests</h2>
        {requests.length === 0 ? (
          <p className="text-slate-400 py-6 text-center">No blood requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-xs border-b">
                <tr>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Hospital</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{r.patient_name}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{r.blood_group}</td>
                    <td className="py-3 px-4">{r.required_units}</td>
                    <td className="py-3 px-4">{r.hospital_name} ({r.city})</td>
                    <td className="py-3 px-4">{r.urgency}</td>
                    <td className="py-3 px-4 font-semibold">{r.status}</td>
                    <td className="py-3 px-4">
                      <Link href={`/requests/${r.id}`} className="text-rose-600 hover:underline font-medium">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}