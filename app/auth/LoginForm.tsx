'use client';

import { FormEvent, useTransition } from 'react';
import { login } from '@/app/actions';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await login(formData);
      } catch (error) {
        console.error('Login failed:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-300 block">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          placeholder="name@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-300 block">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
      >
        {isPending ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}
