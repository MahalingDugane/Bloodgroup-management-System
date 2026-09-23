'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Donor {
  id: number;
  full_name: string;
  blood_group: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  availability: boolean;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorSearchPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (bloodGroup) params.append('blood_group', bloodGroup);
      if (city.trim()) params.append('city', city.trim());
      params.append('available_only', 'true');

      const res = await api.get(`/donors/search?${params.toString()}`);
      setDonors(res.data);
    } catch (err) {
      console.error('Failed to load donors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Find Active Donors</h1>
        <p className="text-slate-500 mt-1">
          Search registered voluntary blood donors by group and local municipality.
        </p>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Blood Type
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            City or Area
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Kolhapur, Pune, Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Searching active donors...</div>
      ) : donors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
          No matching eligible donors found in this location.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{donor.full_name}</h3>
                    <p className="text-xs text-slate-400">
                      {donor.age} yrs • {donor.gender}
                    </p>
                  </div>
                  <span className="text-xl font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                    {donor.blood_group}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>
                      {donor.city}, {donor.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {donor.availability ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Available Now
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${donor.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call {donor.phone}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}