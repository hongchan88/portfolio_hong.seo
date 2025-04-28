'use client';

import { useEffect } from 'react';

export default function ScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0); // optional: scroll to top explicitly
  }, []);
  return null;
}
