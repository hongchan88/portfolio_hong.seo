import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

export default function TiltScene({ children }) {
  const groupRef = useRef(null);
  const { gl } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1

      target.current.x = -x * 0.6; // max horizontal movement
      target.current.y = y * 0.6; // max vertical movement (invert Y for natural feel)
    };
    const reset = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', reset);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', reset);
    };
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      target.current.x,
      0.08
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      target.current.y,
      0.08
    );
  });

  return <group ref={groupRef}>{children}</group>;
}
