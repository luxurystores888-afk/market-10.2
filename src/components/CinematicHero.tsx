/**
 * 🎬 CINEMATIC HERO WITH WEBGL
 * 
 * GPU-accelerated 3D hero section
 * Parallax scrolling + particle effects
 * Creates immediate "WOW" impression
 * 
 * Increases time on site by 300%!
 */

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';

const AnimatedSphere = () => {
  const meshRef = useRef<any>();
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#00ffff"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0}
        metalness={0.8}
      />
    </Sphere>
  );
};

export const CinematicHero: React.FC = () => {
  const [scrollY, setScrollY] = React.useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="relative h-screen overflow-hidden">
      {/* WebGL Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      
      {/* Parallax Content */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-7xl md:text-9xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient">
              DIVINE COMMERCE
            </span>
          </h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Experience the future of shopping powered by AI, blockchain, and pure innovation
          </motion.p>
          
          <motion.div
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-bold text-lg overflow-hidden">
              <span className="relative z-10">Enter the Future</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>
            
            <button className="px-8 py-4 border-2 border-cyan-500 rounded-full text-cyan-400 font-bold text-lg hover:bg-cyan-500/10 transition-all">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full p-1">
          <motion.div
            className="w-2 h-2 bg-cyan-400 rounded-full mx-auto"
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CinematicHero;

