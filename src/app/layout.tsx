import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap', // Tối ưu font loading
  preload: true,
});

export const metadata: Metadata = {
  title: 'ISU - I See U',
  description: 'An application to xem bói toán',
  icons: {
    icon: '/logo_isu.png',
    shortcut: '/logo_isu.png',
    apple: '/logo_isu.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Preconnect to API */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_GATEWAY_DEPLOY} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_GATEWAY_DEPLOY} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
