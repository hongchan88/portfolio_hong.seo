'use client';
import dynamic from 'next/dynamic';
const ModelViewer = dynamic(() => import('./ModelViewer/ModelViewer'), {
  ssr: false,
});

export default function Hero() {
  return (
    <>
      <div className='relative w-full'>
        <div className='flex flex-row justify-center items-start overflow-hidden'>
          <ModelViewer />
        </div>
      </div>
    </>
  );
}
