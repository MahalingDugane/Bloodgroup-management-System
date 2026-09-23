'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function RequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [request, setRequest] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/requests/${id}`);
        setRequest(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Unable to retrieve request details.');
      } finally {
        setLoading(false);
      }
    };
    if (user && id) {
      fetchDetails();
    }
  }, [user, id]);

  if (isLoading || loading) {
    return <div className="p-12 text-center text-slate-500">Loading blood request details...</div>;
  }

  if (error || !request) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-white border border-slate-200 rounded-xl text-center">
        <p className="text-rose-600 mb-4">{error || 'Request record not found.'}</p>
        <Link href="/dashboard" className="text-sm font-semibold text-slate-900 underline">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400">Request #{request.id}</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{request.patient_name}</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          request.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
          request.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
          request.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-xs text-slate-400">Required Group</span>
          <p className="text-2xl font-black text-rose-600">{request.blood_group}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Required Units</span>
          <p className="text-2xl font-bold text-slate-800">{request.required_units}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Urgency</span>
          <p className="text-base font-semibold text-slate-800">{request.urgency}</p>
        </div>
      </div>

      <div className="space-y-3 border-t pt-4 text-sm">
        <div>
          <span className="text-slate-400 block text-xs">Hospital / Treatment Center</span>
          <span className="font-medium text-slate-800">{request.hospital_name}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-xs">Address Details</span>
          <span className="text-slate-700">{request.hospital_address}, {request.city}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-xs">Emergency Contact</span>
          <a href={`tel:${request.contact_number}`} className="text-rose-600 font-semibold hover:underline">
            {request.contact_number}
          </a>
        </div>
        {request.reason && (
          <div>
            <span className="text-slate-400 block text-xs">Clinical Notes / Reason</span>
            <p className="text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg border">{request.reason}</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t flex justify-between items-center text-xs text-slate-400">
        <span>Submitted on {new Date(request.created_at).toLocaleDateString()}</span>
        <Link href="/dashboard" className="text-slate-900 font-semibold underline">
          &larr; Back to My Requests
        </Link>
      </div>
    </div>
  );
}