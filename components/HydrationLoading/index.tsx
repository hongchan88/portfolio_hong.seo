'use client';
import Image from 'next/image';

export default function HydrationLoading() {
  return (
    <div className='fixed inset-0 h-full w-full bg-greenYellowGradient z-[9999] flex flex-col items-center justify-center pointer-events-none'>
      <div className='relative w-56 h-56 mb-4 overflow-hidden animate-subtlePulse'>
        <Image
          width={224}
          height={224}
          src='/loading/loading2.webp'
          alt='avatar'
          className='absolute top-0 left-0 w-full h-full object-cover opacity-20'
          priority
        />
      </div>
      <p className=' font-rubik font-bold text-gray-500'>LOADING</p>
    </div>
  );
}
