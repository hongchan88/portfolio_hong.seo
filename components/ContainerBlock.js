import React from 'react';

import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ContainerBlock({ children, aboutRef, projectRef }) {
  const router = useRouter();

  return (
    <main className='dark:bg-gray-800 w-full'>
      <Navbar aboutRef={aboutRef} projectRef={projectRef} />
      <div className='main-contents'>{children}</div>
      <Footer />
    </main>
  );
}
