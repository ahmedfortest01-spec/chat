import { Link } from '@/i18n/routing';
import { getSession, logout } from '@/lib/actions';
import { getTranslations } from 'next-intl/server';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export default async function Navbar() {
  const user = await getSession();
  const t = await getTranslations('Common');

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t('nextAuth')}<span className="text-blue-500">{t('app')}</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          {user ? (
            <>
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                {t('dashboard')}
              </Link>
              <Link href="/chat" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
                {t('chat')}
                <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded-full text-white">New</span>
              </Link>
              <form action={logout}>
                <button type="submit" className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-red-600/20">
                  {t('logout')}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                {t('login')}
              </Link>
              <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                {t('register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
