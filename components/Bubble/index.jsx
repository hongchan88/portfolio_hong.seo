import { useEffect, useRef } from 'react';
import { createBubbleAnimation } from './createBubbleAnimation';

function SingleBubble({ position }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    return createBubbleAnimation(ref.current);
  }, []);

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial transparent opacity={1} color='skyblue' />
    </mesh>
  );
}

export default function Bubbles({ count = 2, position }) {
  const bubbles = Array.from({ length: count }, (_, i) => {
    return <SingleBubble key={i} position={position} />;
  });

  return <>{bubbles}</>;
}
