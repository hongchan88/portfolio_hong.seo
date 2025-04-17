'use client';
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ModelViewer = dynamic(() => import('./ModelViewer/ModelViewer'), {
  ssr: false,
});

export default function Hero({ currentStage }) {
  return (
    <div className='relative w-full'>
      <div className='absolute top-0 z-20 w-full'>
        <Navbar />
      </div>

      <div className='flex flex-row justify-center items-start overflow-hidden'>
        <ModelViewer currentStage={currentStage} />
      </div>
    </div>
  );
}
