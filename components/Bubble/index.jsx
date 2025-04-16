import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

function SingleBubble({ position }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    // Random delay so bubbles animate independently
    const delay = Math.random() * 2;

    gsap.to(ref.current.position, {
      y: ref.current.position.y + 1.9,
      duration: 2,
      repeat: -1,
      ease: 'power1.out',
      delay,
    });

    gsap.to(ref.current.material, {
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: 'power1.out',
      delay,
    });
  }, []);

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial transparent opacity={1} color='skyblue' />
    </mesh>
  );
}

export default function Bubbles({ count = 2, position }) {
  console.log(position, 'position');
  const bubbles = Array.from({ length: count }, (_, i) => {
    const x = (Math.random() - 0.5) * 4;
    const y = Math.random() * 10;
    const z = (Math.random() - 0.5) * 4;
    return <SingleBubble key={i} position={position} />;
  });

  return <>{bubbles}</>;
}
