import Link from "next/link";
import { Droplet, Search, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 py-6">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold">
          <Droplet className="w-4 h-4 fill-rose-600" />
          <span>Every Drop Counts</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Connecting Blood Donors With Hospitals in Real-Time
        </h1>
        <p className="text-lg text-slate-600">
          Find matching donors by city and blood type, review live stock inventory, or create emergency blood requests instantly.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/donors"
            className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-xl shadow-sm transition"
          >
            Find a Donor
          </Link>
          <Link
            href="/inventory"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl transition"
          >
            Check Live Stock
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Locate Blood Instantly</h3>
          <p className="text-sm text-slate-500">
            Search our active registry by city and blood group to contact verified voluntary donors near you.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Emergency Requests</h3>
          <p className="text-sm text-slate-500">
            Submit critical patient requirements directly to hospital databases with urgency markers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Verified Stocks</h3>
          <p className="text-sm text-slate-500">
            Hospital administrators moderate inventory units real-time to avoid wasted time during emergencies.
          </p>
        </div>
      </section>
    </div>
  );
}