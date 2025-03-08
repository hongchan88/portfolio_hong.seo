import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='dark:bg-gray-800 w-full'>
        <ThemeProvider defaultTheme='light' attribute='class'>
          <div className='main-contents'>{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
