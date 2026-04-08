import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-800">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">
                Welcome, <span className="text-blue-500">{user.name}</span>!
              </h1>
              <p className="text-slate-400">Successfully logged into your protected dashboard.</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-2 rounded-xl border border-red-600/20 transition-all font-semibold"
              >
                Logout
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">User ID</p>
              <p className="text-white font-mono text-xs break-all">{user._id.toString()}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Member Since</p>
              <p className="text-white font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
             <h4 className="text-blue-500 font-bold mb-2">System Notification</h4>
             <p className="text-slate-300 text-sm">
                Your session is secured using an httpOnly cookie and a JSON Web Token.
                This dashboard is protected by a server-side middleware check.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
