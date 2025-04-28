'use client';
import { useProgress } from '@react-three/drei';
import { useSettingStore } from '@store/settingStore';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function LoadingOverlay() {
  const { progress, active } = useProgress();
  const [maxProgress, setMaxProgress] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageRefWrapper = useRef<HTMLImageElement>(null);
  const setIsLoadingDone = useSettingStore((s) => s.setIsLoadingDone);
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);

  useEffect(() => {
    if (progress > maxProgress) {
      setMaxProgress(progress); // grow only
    }

    // ✅ Play animation ONCE when fully loaded
    if (!active && progress === 100) {
      const tl = gsap.timeline();
      tl.to(imageRef.current, {
        clipPath: `inset(0 0% 0 0)`,
        WebkitClipPath: `inset(0 0% 0 0)`,
        duration: 0.2,
        ease: 'power2.inOut',
      })
        .to(imageRefWrapper.current, {
          scale: 1.3,
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(imageRefWrapper.current, {
          scale: 0,
          duration: 0.2,
          ease: 'back.in(1.7)',
        });

      const timeout = setTimeout(() => {
        setIsLoadingDone(true);
      }, 600); // wait until animation finishes

      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  if (isLoadingDone) return null;

  return (
    <div className='fixed inset-0 h-full w-full bg-greenYellowGradient z-[9999] flex flex-col items-center justify-center text-white pointer-events-none'>
      <div
        ref={imageRefWrapper}
        className='relative w-56 h-56 mb-4 overflow-hidden x'
      >
        {/* Base image (desaturated/gray) */}
        <Image
          width={224}
          height={224}
          src='/loading/loading2.webp' // Replace with your PNG
          alt='avatar'
          className='absolute top-0 left-0 w-full h-full object-cover opacity-20'
          priority
        />

        {/* Colored reveal from left to right using clip-path */}
        <Image
          width={224}
          height={224}
          ref={imageRef}
          priority
          src='/loading/loading2.webp' // Same image
          alt='avatar fill'
          className='absolute top-0 left-0 w-full h-full object-cover'
          style={{
            clipPath: `inset(0 ${
              maxProgress == 0 ? 100 : 85 - maxProgress
            }% 0 0)`,
            WebkitClipPath: `inset(0 ${
              maxProgress == 0 ? 100 : 85 - maxProgress
            }% 0 0)`,
            transition: 'clip-path 0.3s ease, -webkit-clip-path 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
