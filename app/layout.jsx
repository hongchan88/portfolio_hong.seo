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
        {/* Add to your layout, at the root */}
        <div
          id='bubbleOverlayWrapper'
          className='fixed inset-0 z-[9999] pointer-events-none opacity-0'
        >
          <svg
            id='bubbleOverlay'
            className='w-full h-full'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
          >
            <circle
              id='bubbleCircle'
              cx='0'
              cy='100'
              r='0'
              fill='#b1cc70' /* Tailwind yellow-400 */
            />
          </svg>
        </div>

        <ThemeProvider defaultTheme='light' attribute='class'>
          <ScrollRestoration />
          <div className='main-contents'>{children}</div>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
