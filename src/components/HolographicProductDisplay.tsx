import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  Html, 
  useHelper,
  Text,
  Box,
  Sphere,
  Torus,
  Icosahedron,
  Cylinder
} from '@react-three/drei';
import * as THREE from 'three';
import { X, RotateCcw, ZoomIn, ZoomOut, Volume2, VolumeX } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  stock: number;
  tags?: string[];
}

interface HolographicProductDisplayProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

// Particle system for holographic effects
function Particles({ count = 100, category = 'Neural Tech' }: { count?: number; category?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Color based on category
      switch (category) {
        case 'Neural Tech':
          col[i * 3] = 0; // R
          col[i * 3 + 1] = Math.random() * 0.8 + 0.2; // G (cyan-ish)
          col[i * 3 + 2] = 1; // B
          break;
        case 'Cybernetics':
          col[i * 3] = 1; // R (magenta)
          col[i * 3 + 1] = 0; // G
          col[i * 3 + 2] = Math.random() * 0.8 + 0.2; // B
          break;
        case 'Quantum Tech':
          col[i * 3] = Math.random() * 0.5 + 0.5; // R
          col[i * 3 + 1] = 0; // G
          col[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B (purple)
          break;
        case 'AI Systems':
          col[i * 3] = 0; // R
          col[i * 3 + 1] = 1; // G (green)
          col[i * 3 + 2] = Math.random() * 0.3; // B
          break;
        default:
          col[i * 3] = 0; // R
          col[i * 3 + 1] = Math.random() * 0.8 + 0.2; // G
          col[i * 3 + 2] = 1; // B
      }
    }
    return [pos, col];
  }, [count, category]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const matrix = new THREE.Matrix4();
    
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3] + Math.sin(time + i) * 0.1;
      const y = positions[i * 3 + 1] + Math.cos(time + i * 0.5) * 0.1;
      const z = positions[i * 3 + 2] + Math.sin(time + i * 0.3) * 0.1;
      
      matrix.setPosition(x, y, z);
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Neural network visualization for Neural Tech
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central brain-like structure */}
      <Icosahedron args={[1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.7}
          emissive="#0066cc"
          emissiveIntensity={0.3}
        />
      </Icosahedron>
      
      {/* Neural connections */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        return (
          <group key={i}>
            <Sphere args={[0.1]} position={[x, 0, z]}>
              <meshStandardMaterial color="#00ff41" emissive="#00cc33" emissiveIntensity={0.5} />
            </Sphere>
            <Cylinder 
              args={[0.01, 0.01, 2]} 
              position={[x/2, 0, z/2]} 
              rotation={[0, -angle, Math.PI/2]}
            >
              <meshStandardMaterial color="#00d4ff" transparent opacity={0.5} />
            </Cylinder>
          </group>
        );
      })}
    </group>
  );
}

// Cybernetic arm visualization for Cybernetics
function CyberneticArm() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main arm structure */}
      <Box args={[0.3, 2, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ff00ff" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#cc0099"
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Joints */}
      <Sphere args={[0.2]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#00d4ff" emissive="#0099cc" emissiveIntensity={0.4} />
      </Sphere>
      <Sphere args={[0.2]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#00d4ff" emissive="#0099cc" emissiveIntensity={0.4} />
      </Sphere>
      
      {/* Glowing wires */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} args={[0.02, 1.8, 0.02]} position={[0.1 - i * 0.05, 0, 0.16]}>
          <meshStandardMaterial color="#00ff41" emissive="#00ff41" emissiveIntensity={0.8} />
        </Box>
      ))}
    </group>
  );
}

// Quantum visualization for Quantum Tech
function QuantumField() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Quantum particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const radius = 1.5 + (i % 3) * 0.5;
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 3) * 0.5;
        
        return (
          <Sphere key={i} args={[0.08]} position={[x, y, z]}>
            <meshStandardMaterial 
              color={`hsl(${270 + i * 10}, 100%, 60%)`}
              emissive={`hsl(${270 + i * 10}, 100%, 30%)`}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </Sphere>
        );
      })}
      
      {/* Central quantum core */}
      <Icosahedron args={[0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ff00ff" 
          transparent 
          opacity={0.3}
          emissive="#ff00ff"
          emissiveIntensity={0.5}
        />
      </Icosahedron>
    </group>
  );
}

// AI data streams for AI Systems
function AIDataStream() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central AI core */}
      <Torus args={[1, 0.1, 16, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#00ff41" emissive="#00cc33" emissiveIntensity={0.5} />
      </Torus>
      
      {/* Data streams */}
      {Array.from({ length: 16 }).map((_, i) => {
        const height = 0.5 + (i % 4) * 0.3;
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        
        return (
          <Box key={i} args={[0.05, height, 0.05]} position={[x, height/2, z]}>
            <meshStandardMaterial 
              color="#00ff41" 
              emissive="#00ff41" 
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </Box>
        );
      })}
    </group>
  );
}

// Holographic display for Display Tech
function HolographicDisplay() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main display frame */}
      <Box args={[2, 1.2, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.3}
          emissive="#00d4ff"
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Holographic projections */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box 
          key={i} 
          args={[0.2, 0.2, 0.05]} 
          position={[-0.6 + i * 0.25, 0, 0.2 + Math.sin(i) * 0.1]}
        >
          <meshStandardMaterial 
            color="#ff00ff" 
            transparent 
            opacity={0.6}
            emissive="#ff00ff"
            emissiveIntensity={0.4}
          />
        </Box>
      ))}
    </group>
  );
}

// Scene component that renders based on product category
function ProductScene({ product }: { product: Product }) {
  const category = product.category || 'Neural Tech';
  
  const renderCategoryScene = () => {
    switch (category) {
      case 'Neural Tech':
        return <NeuralNetwork />;
      case 'Cybernetics':
        return <CyberneticArm />;
      case 'Quantum Tech':
      case 'Storage':
        return <QuantumField />;
      case 'AI Systems':
        return <AIDataStream />;
      case 'Display':
        return <HolographicDisplay />;
      default:
        return <NeuralNetwork />;
    }
  };

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#00d4ff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#ff00ff" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#00ff41" />
      
      {/* Product scene */}
      {renderCategoryScene()}
      
      {/* Particles */}
      <Particles count={150} category={category} />
      
      {/* Product information text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
      >
        {product.name}
      </Text>
      
      <Text
        position={[0, -3.8, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
      >
        {product.description}
      </Text>
      
      <Text
        position={[0, -4.5, 0]}
        fontSize={0.4}
        color="#00ff41"
        anchorX="center"
        anchorY="middle"
      >
        ${product.price}
      </Text>
    </>
  );
}

// Loading component
function LoadingSpinner() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.05;
    }
  });

  return (
    <Html center>
      <div className="flex flex-col items-center text-white">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-cyan-400">Loading Holographic Display...</p>
      </div>
    </Html>
  );
}

// Error boundary component
function ErrorFallback() {
  return (
    <Html center>
      <div className="text-center text-white bg-red-900/50 p-4 rounded-lg border border-red-500">
        <p className="text-red-400 mb-2">Holographic Display Error</p>
        <p className="text-gray-300 text-sm">3D visualization unavailable</p>
      </div>
    </Html>
  );
}

// Main component
export function HolographicProductDisplay({ product, isOpen, onClose }: HolographicProductDisplayProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [resetCamera, setResetCamera] = useState(false);
  
  if (!isOpen) return null;

  // Render the modal in a portal to ensure it appears above all content
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
         onClick={(e) => {
           // Close modal when clicking the backdrop
           if (e.target === e.currentTarget) {
             onClose();
           }
         }}>
      <div className="relative w-full h-full">
        {/* Controls overlay */}
        <div className="absolute top-4 right-4 z-[10000] flex space-x-2">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-400 p-2 rounded-lg transition-colors"
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        
        <button
          onClick={() => setResetCamera(true)}
          className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-400 p-2 rounded-lg transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <button
          onClick={onClose}
          className="bg-red-500/20 hover:bg-red-500/40 border border-red-400 text-red-400 p-2 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
        {/* Product info overlay */}
        <div className="absolute bottom-4 left-4 z-[10000] bg-gray-900/80 border border-cyan-500/30 rounded-lg p-4 max-w-sm">
        <h3 className="text-white font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-300 text-sm mb-2">{product.description}</p>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          ${product.price}
        </p>
        {product.category && (
          <p className="text-cyan-400 text-sm mt-1">Category: {product.category}</p>
        )}
      </div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#000011');
          }}
          onClick={(e) => e.stopPropagation()} // Prevent canvas clicks from closing the modal
        >
          <Suspense fallback={<LoadingSpinner />}>
            <ProductScene product={product} />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={15}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
        
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-30"></div>
        </div>
      </div>
    </div>,
    document.body
  );
}