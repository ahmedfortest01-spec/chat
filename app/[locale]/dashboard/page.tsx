import { getSession } from '@/lib/actions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function DashboardPage() {
  const user = await getSession();
  const t = await getTranslations('Common');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl dark:shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Welcome, <span className="text-blue-500">{user?.name}</span>!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl">
            You are successfully logged into your production-ready Next.js scaffold. From here, you can start building your application features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Account Info</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Username: <span className="text-slate-900 dark:text-slate-200 font-medium">{user?.username}</span></p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Email: <span className="text-slate-900 dark:text-slate-200 font-medium">{user?.email}</span></p>
            </div>

            <Link href="/chat" className="group bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-500/20 flex flex-col justify-between hover:bg-blue-700 transition-all transform hover:-translate-y-1">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{t('chat')}</h3>
                <p className="text-sm text-blue-100">Experience real-time messaging with Socket.io</p>
              </div>
              <span className="text-white text-sm font-bold mt-4 flex items-center gap-2">
                Open Chat <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Session Status</h3>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-200 uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
