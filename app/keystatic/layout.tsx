import type { Metadata } from 'next';
import Link from 'next/link';
import Keystatic from './keystatic';
import { cmsIsConfigured } from '../../lib/cms-configured';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Gestione | Bar da Luciano', robots: { index: false, follow: false } };
export default function Layout() {
  if (!cmsIsConfigured()) return <main className="mx-auto max-w-lg px-6 py-16"><h1 className="font-serif text-3xl">Gestione del sito</h1><p className="mt-4 leading-7">Il pannello deve ancora essere attivato. Il sito e il menù restano disponibili.</p><Link className="mt-6 inline-block text-amber-900 underline" href="/">Torna al sito</Link></main>;
  return <Keystatic />;
}
