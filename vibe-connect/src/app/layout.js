import './globals.css';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'VibeConnect - Connect by Vibe, Not by Looks',
  description: 'A vibe-based social connection platform matching you based on music, hobbies, and personality.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  themeColor: '#0B0B0F',
  width: 'device-width',
  initialScale: 1,
};

import { Providers } from '@/components/Providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
