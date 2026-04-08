'use client';

import Link from 'next/link';
import { LoginForm } from '@/app/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
        </div>

        <LoginForm />

        <p className="text-center mt-6 text-slate-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
