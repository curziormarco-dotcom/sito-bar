'use client';
import { usePathname } from 'next/navigation';
import { ScrollToTop } from './scroll-to-top';
import { LocaleProvider } from './locale-provider';
import { CookieConsentProvider } from './cookie-consent';
import { SiteHeader } from './site-header';
import { SiteAnalytics } from './site-analytics';
import { SiteFooter } from './site-footer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname === '/keystatic' || pathname.startsWith('/keystatic/')) return <>{children}</>;
  return <LocaleProvider><CookieConsentProvider><SiteAnalytics /><ScrollToTop /><SiteHeader /><main className="w-full overflow-x-hidden">{children}</main><SiteFooter /></CookieConsentProvider></LocaleProvider>;
}
