import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const JWT_SECRET = process.env.JWT_SECRET || '800e843c089c894982637213456789abcdef';
const secret = new TextEncoder().encode(JWT_SECRET);
const locales = ['en', 'ar'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Filter out any invalid languages that might cause match to throw
  const validLanguages = languages.filter(lang => {
    try {
      return !!new Intl.Locale(lang);
    } catch (e) {
      return false;
    }
  });

  try {
    return match(validLanguages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
  const isProtectedPath = pathWithoutLocale.startsWith('/dashboard') || pathWithoutLocale.startsWith('/chat');
  const isAuthPath = pathWithoutLocale.startsWith('/auth');
  if (isProtectedPath) {
    if (!token) return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    try { await jwtVerify(token, secret); } catch (error) { return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url)); }
  }
  if (isAuthPath && token) {
    try { await jwtVerify(token, secret); return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url)); } catch (error) {}
  }
  return NextResponse.next();
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
