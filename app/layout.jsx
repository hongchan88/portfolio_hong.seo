import '../styles/globals.css';
import ClientProviders from './ClientProviders';
import { Space_Mono, Rubik } from 'next/font/google';
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'], // adjust if needed
  variable: '--font-space-mono',
  display: 'swap',
});
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['700'], // or ['300', '400', '500', '700', etc.] if needed
  variable: '--font-rubik',
  display: 'swap',
});
export const metadata = {
  metadataBase: new URL('https://portfolio-hong-seo.vercel.app'),
  title: { default: 'Hong Seo | Developer Portfolio', template: '%s | Hong Seo' },
  description: 'Hong Seo’s developer portfolio: web projects, skills, and interactive 3D work.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Hong Seo | Developer Portfolio',
    description: 'Explore Hong Seo’s web projects, skills, and interactive 3D work.',
    url: '/',
    siteName: 'Hong Seo Portfolio',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${spaceMono.variable} ${rubik.variable}`}
      suppressHydrationWarning
    >
      <body
        style={{ overscrollBehavior: 'none' }}
        className='dark:bg-gray-800 w-full'
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
