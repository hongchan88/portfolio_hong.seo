'use client';
import '../styles/globals.css';
import Footer from '../components/Footer';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='dark:bg-gray-800 w-full'>
        <ThemeProvider defaultTheme='light' attribute='class'>
          <div className='main-contents'>{children}</div>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
