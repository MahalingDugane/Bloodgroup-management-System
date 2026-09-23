'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface StockItem {
  blood_group: string;
  available_units: number;
  last_updated: string;
}

export default function InventoryPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get('/requests/inventory/stock');
        setStock(res.data);
      } catch {
        setError('Unable to load blood inventory.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const getStatusBadge = (units: number) => {
    if (units === 0) return <span className="px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">Out of Stock</span>;
    if (units < 5) return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">Low Stock</span>;
    return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Available</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Live Blood Inventory</h1>
        <p className="text-slate-500 mt-1">Real-time units verified in hospital storage centers</p>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-lg">{error}</div>}

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading blood inventory data...</div>
      ) : stock.length === 0 ? (
        <div className="p-12 text-center text-slate-500">No inventory data available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stock.map((item) => (
            <div key={item.blood_group} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-3xl font-extrabold text-rose-600">{item.blood_group}</span>
                {getStatusBadge(item.available_units)}
              </div>
              <div className="mt-6">
                <div className="text-3xl font-bold text-slate-800">{item.available_units}</div>
                <div className="text-xs text-slate-400 mt-1">Available Units</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}