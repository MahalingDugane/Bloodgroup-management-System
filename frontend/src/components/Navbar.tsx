'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-rose-600 flex items-center gap-2">
          <span>Bloodlink</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link>
          <Link href="/donors" className="text-slate-600 hover:text-slate-900">Find Donors</Link>
          <Link href="/inventory" className="text-slate-600 hover:text-slate-900">Live Stock</Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              {user.role === 'ADMIN' ? (
                <Link href="/admin" className="text-rose-600 font-semibold">Admin Panel</Link>
              ) : (
                <Link href="/dashboard" className="text-slate-900">Dashboard</Link>
              )}
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {user.full_name}
              </span>
              <button
                onClick={logout}
                className="text-slate-500 hover:text-rose-600 text-xs font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <Link href="/login" className="text-slate-600 hover:text-slate-900">Sign In</Link>
              <Link href="/register" className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}