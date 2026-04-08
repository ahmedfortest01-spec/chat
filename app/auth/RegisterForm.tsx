'use client';

import { FormEvent, useTransition } from 'react';
import { register } from '@/app/actions';

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await register(formData);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-300 block">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isPending}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-slate-300 block">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          disabled={isPending}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          placeholder="johndoe"
        />
      </div>

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
        {isPending ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}
