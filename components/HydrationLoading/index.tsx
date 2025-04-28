'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HydrationLoading() {
  return (
    <div className='fixed inset-0 h-full w-full bg-greenYellowGradient z-[9999] flex flex-col items-center justify-center  pointer-events-none'>
      <div className='relative w-56 h-56 mb-4 overflow-hidden '>
        <Image
          width={224}
          height={224}
          src='/loading/loading2.webp' // Replace with your PNG
          alt='avatar'
          className='absolute top-0 left-0 w-full h-full object-cover opacity-20'
          priority
        />
      </div>
    </div>
  );
}
