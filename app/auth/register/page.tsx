'use client';

import Link from 'next/link';
import { RegisterForm } from '@/app/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-sm">Join us today to get started</p>
        </div>

        <RegisterForm />

        <p className="text-center mt-6 text-slate-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
