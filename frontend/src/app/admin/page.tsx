'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface StockItem {
  blood_group: string;
  available_units: number;
}

interface BloodRequestItem {
  id: number;
  user_id: number;
  patient_name: string;
  blood_group: string;
  required_units: number;
  hospital_name: string;
  city: string;
  contact_number: string;
  urgency: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [stock, setStock] = useState<StockItem[]>([]);
  const [requests, setRequests] = useState<BloodRequestItem[]>([]);
  const [donorCount, setDonorCount] = useState<number>(0);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const loadData = async () => {
    try {
      const [stockRes, requestsRes, donorsRes] = await Promise.all([
        api.get('/requests/inventory/stock'),
        api.get('/requests/'),
        api.get('/donors/search')
      ]);
      setStock(stockRes.data);
      setRequests(requestsRes.data);
      setDonorCount(donorsRes.data.length);

      const initialInputs: Record<string, number> = {};
      stockRes.data.forEach((s: StockItem) => {
        initialInputs[s.blood_group] = s.available_units;
      });
      setStockInputs(initialInputs);
    } catch {
      setError('Failed to fetch admin data.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadData();
    }
  }, [user]);

  const handleUpdateStock = async (blood_group: string) => {
    const units = stockInputs[blood_group];
    try {
      await api.put('/requests/inventory/stock', {
        blood_group,
        available_units: Number(units),
      });
      loadData();
    } catch {
      setError('Unable to update blood stock.');
    }
  };

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    setError('');
    try {
      await api.patch(`/requests/${requestId}/status`, { status: newStatus });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Status transition failed.');
    }
  };

  if (isLoading || loadingData) {
    return <div className="p-12 text-center text-slate-500">Loading admin control center...</div>;
  }

  const filteredRequests = requests.filter((r) => {
    const statusMatch = statusFilter === 'All' || r.status === statusFilter;
    const urgencyMatch = urgencyFilter === 'All' || r.urgency === urgencyFilter;
    return statusMatch && urgencyMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
        <p className="text-slate-500 mt-1">Manage blood stock levels and hospital request verifications</p>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-lg">{error}</div>}

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-slate-800">{donorCount}</div>
          <div className="text-xs text-slate-500">Total Donors</div>
        </div>
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-slate-800">{requests.length}</div>
          <div className="text-xs text-slate-500">Total Requests</div>
        </div>
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-amber-600">{requests.filter(r => r.status === 'Pending').length}</div>
          <div className="text-xs text-slate-500">Pending</div>
        </div>
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{requests.filter(r => r.urgency === 'Emergency').length}</div>
          <div className="text-xs text-slate-500">Emergency</div>
        </div>
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-600">{requests.filter(r => r.status === 'Approved').length}</div>
          <div className="text-xs text-slate-500">Approved</div>
        </div>
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{requests.filter(r => r.status === 'Completed').length}</div>
          <div className="text-xs text-slate-500">Completed</div>
        </div>
        <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
          <div className="text-2xl font-bold text-slate-500">{requests.filter(r => r.status === 'Rejected').length}</div>
          <div className="text-xs text-slate-500">Rejected</div>
        </div>
      </div>

      {/* Stock Management Box */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Inventory Operations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {stock.map((item) => (
            <div key={item.blood_group} className="border border-slate-200 p-3 rounded-lg text-center flex flex-col justify-between">
              <span className="font-extrabold text-rose-600 text-lg">{item.blood_group}</span>
              <input
                type="number"
                min="0"
                className="w-full text-center border rounded py-1 my-2 text-sm font-semibold"
                value={stockInputs[item.blood_group] ?? item.available_units}
                onChange={(e) => setStockInputs({ ...stockInputs, [item.blood_group]: parseInt(e.target.value) || 0 })}
              />
              <button
                onClick={() => handleUpdateStock(item.blood_group)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs py-1 rounded transition"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Requests Management Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900">Incoming Blood Requests</h2>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border rounded-lg px-2.5 py-1.5"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="text-xs border rounded-lg px-2.5 py-1.5"
            >
              <option value="All">All Urgency</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs border-b">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Required</th>
                <th className="py-3 px-4">Hospital / City</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">No requests found matching criteria.</td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{r.patient_name}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{r.blood_group}</td>
                    <td className="py-3 px-4">{r.required_units} Units</td>
                    <td className="py-3 px-4">{r.hospital_name} ({r.city})</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        r.urgency === 'Emergency' ? 'bg-red-100 text-red-700' :
                        r.urgency === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{r.status}</td>
                    <td className="py-3 px-4 flex gap-2">
                      {r.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(r.id, 'Approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(r.id, 'Rejected')}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.status === 'Approved' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(r.id, 'Completed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(r.id, 'Rejected')}
                            className="bg-slate-600 hover:bg-slate-700 text-white text-xs px-2.5 py-1 rounded"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}