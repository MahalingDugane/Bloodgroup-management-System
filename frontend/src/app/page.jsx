'use client';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          +
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bloodgroup Management System
        </h1>
        <p className="text-sm text-gray-600">
          Next.js App Router frontend is running.
        </p>
      </div>
    </main>
  );
}
