'use client';
import dynamic from 'next/dynamic';
const ModelViewer = dynamic(() => import('./ModelViewer/ModelViewer'), {
  ssr: false,
});

export default function Hero({ currentStage, isPlaying }) {
  return (
    <>
      <div className='relative w-full'>
        <div className='absolute  font-bold top-[30vh] left-[5vw] w-full h-full z-10'>
          <div className='flex flex-col gap-5'>
            <p className='font-rubik font-bold text-5xl leading-relaxed'>
              Hey,
              <br /> My name is Hong.
            </p>
            <p className='font-mono  text-gray-600 text-xl '>
              I love building things with software
            </p>
          </div>
        </div>
        <div className='flex flex-row justify-center items-start overflow-hidden'>
          <ModelViewer currentStage={currentStage} isPlaying={isPlaying} />
        </div>
      </div>
    </>
  );
}
