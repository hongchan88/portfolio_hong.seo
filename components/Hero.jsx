'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

const ModelViewer = dynamic(() => import('./ModelViewer/ModelViewer'), {
  ssr: false, // Prevents server-side rendering issues
});
export default function Hero({ currentStage }) {
  const colors = ['#F59E0B', '#84CC16', '#10B981', '#3B82F6'];
  console.log(currentStage, 'currentStage');
  return (
    <div className='relative w-full  '>
      <div className='absolute top-0 z-20 w-full'>
        <Navbar />
      </div>

      <div className='flex flex-row justify-center items-start overflow-hidden'>
        {/* Text container */}
        <ModelViewer currentStage={currentStage} />
      </div>
    </div>
  );
}
