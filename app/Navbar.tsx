import Link from 'next/link';
import { getSession, logout } from '@/lib/auth';

export default async function Navbar() {
  const user = await getSession();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          NextAuth<span className="text-blue-500">App</span>
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/chat" className="text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
                Chat
                <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded-full text-white">New</span>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-red-600/20"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
