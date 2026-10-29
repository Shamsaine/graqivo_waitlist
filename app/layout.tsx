import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Graqivo — Your work, connected.', description: 'A connected workspace for your projects, documents, people, and decisions. Join the Graqivo early-access waitlist.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
