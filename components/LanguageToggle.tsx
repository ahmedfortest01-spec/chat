'use client';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };
  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Languages className="w-5 h-5 text-blue-500" />
      <span className="text-xs font-bold text-slate-300 uppercase">
        {locale === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
}
