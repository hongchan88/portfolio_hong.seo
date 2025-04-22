'use client';
import '../styles/globals.css';
import Footer from '../components/Footer';
import { ThemeProvider } from 'next-themes';
import { Space_Mono, Rubik } from 'next/font/google';
import dynamic from 'next/dynamic';
const ScrollRestoration = dynamic(() => import('./utils/ScrollRestoration'), {
  ssr: false,
});
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'], // adjust if needed
  variable: '--font-space-mono',
  display: 'swap',
});
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700'], // or ['300', '400', '500', '700', etc.] if needed
  variable: '--font-rubik',
  display: 'swap',
});
export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${spaceMono.variable} ${rubik.variable}`}
      suppressHydrationWarning
    >
      <body className='dark:bg-gray-800 w-full'>
        <ThemeProvider defaultTheme='light' attribute='class'>
          <ScrollRestoration />
          <div className='main-contents'>{children}</div>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
