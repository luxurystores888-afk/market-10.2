import React, { useRef, useEffect } from 'react';

export const ParticleEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // Simple particle sim
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw particles
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};
