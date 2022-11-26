import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import '../styles/globals.css';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <ThemeProvider defaultTheme='light' attribute='class'>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
