import type React from 'react';
import type { Metadata } from 'next';
import { Instrument_Serif, Work_Sans } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: '400',
});

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Reactive Contracts - Bidirectional API Contracts',
  description:
    'Bidirectional API contracts that put frontend in control. Stop consuming APIs. Start negotiating contracts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${instrumentSerif.variable} ${workSans.variable}antialiased`}>
        {children}
      </body>
    </html>
  );
}
