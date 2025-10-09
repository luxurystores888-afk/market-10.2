import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  Html, 
  Text,
  Box,
  Plane,
  KeyboardControls,
  useKeyboardControls
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Play, Pause, RotateCcw, Trophy, Zap, Car } from 'lucide-react';

// Game Controls
enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  brake = 'brake',
  boost = 'boost',
}

interface GameState {
  isPlaying: boolean;
  score: number;
  speed: number;
  lap: number;
  position: [number, number, number];
  rotation: [number, number, number];
  boostEnergy: number;
  collectedItems: number;
  collectedProductIds: Set<string>;
}

interface Product {
  id: string;
  name: string;
  price: string;
  position: [number, number, number];
  collected: boolean;
}

// Racing Car Component
function RacingCar({ position, rotation, speed }: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  speed: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.rotation.set(...rotation);
      
      // Add hover effect based on speed
      const hoverHeight = Math.sin(Date.now() * 0.01) * 0.1 * (speed / 50);
      meshRef.current.position.y = position[1] + hoverHeight;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main car body */}
      <Box args={[2, 0.5, 4]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00D4FF" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#00D4FF"
          emissiveIntensity={speed > 0 ? 0.1 : 0}
        />
      </Box>
      
      {/* Car details */}
      <Box args={[1.5, 0.3, 2]} position={[0, 0.3, 0]}>
        <meshStandardMaterial 
          color="#FF00FF" 
          metalness={0.6} 
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </Box>
      
      {/* Boost thrusters */}
      <Box args={[0.3, 0.3, 0.8]} position={[-0.8, -0.1, -2]}>
        <meshStandardMaterial 
          color="#00FF41" 
          emissive="#00FF41"
          emissiveIntensity={speed > 30 ? 0.5 : 0.1}
        />
      </Box>
      <Box args={[0.3, 0.3, 0.8]} position={[0.8, -0.1, -2]}>
        <meshStandardMaterial 
          color="#00FF41" 
          emissive="#00FF41"
          emissiveIntensity={speed > 30 ? 0.5 : 0.1}
        />
      </Box>
      
      {/* Front lights */}
      <Box args={[0.2, 0.2, 0.3]} position={[-0.6, 0, 1.8]}>
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
        />
      </Box>
      <Box args={[0.2, 0.2, 0.3]} position={[0.6, 0, 1.8]}>
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
        />
      </Box>
    </group>
  );
}

// Racing Track Component
function RacingTrack({ isPlaying }: { isPlaying: boolean }) {
  const trackRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    // 🔧 FIX: Only animate when game is playing
    if (!isPlaying || !trackRef.current) return;

    // Animate track moving backwards to simulate forward movement
    trackRef.current.children.forEach((child, index) => {
      child.position.z += 0.5;
      if (child.position.z > 20) {
        child.position.z = -200;
      }
    });
  });

  const trackSegments = [];
  for (let i = 0; i < 50; i++) {
    trackSegments.push(
      <group key={i} position={[0, -1, -i * 8]}>
        {/* Track surface */}
        <Plane args={[10, 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.1} 
            roughness={0.8}
          />
        </Plane>
        
        {/* Track lines */}
        <Plane args={[0.2, 8]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <meshStandardMaterial 
            color="#00D4FF" 
            emissive="#00D4FF"
            emissiveIntensity={0.3}
          />
        </Plane>
        
        {/* Side barriers */}
        <Box args={[0.5, 2, 8]} position={[-5, 1, 0]}>
          <meshStandardMaterial 
            color="#FF00FF" 
            emissive="#FF00FF"
            emissiveIntensity={0.2}
          />
        </Box>
        <Box args={[0.5, 2, 8]} position={[5, 1, 0]}>
          <meshStandardMaterial 
            color="#FF00FF" 
            emissive="#FF00FF"
            emissiveIntensity={0.2}
          />
        </Box>
      </group>
    );
  }

  return <group ref={trackRef}>{trackSegments}</group>;
}

// Individual Product Component with embedded metadata
function ProductItem({ 
  product, 
  gameState, 
  onCollect 
}: { 
  product: Product; 
  gameState: GameState;
  onCollect: (productId: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentPos, setCurrentPos] = useState<[number, number, number]>(product.position);
  
  useFrame(() => {
    if (!gameState.isPlaying || !groupRef.current) return;
    if (gameState.collectedProductIds.has(product.id)) return;

    // Move product toward player
    setCurrentPos(prev => {
      const newZ = prev[2] + 0.5;
      const resetZ = newZ > 20 ? -200 : newZ;
      return [prev[0], prev[1], resetZ];
    });
    
    // Update visual position
    groupRef.current.position.set(...currentPos);
    
    // Rotate for visual appeal
    groupRef.current.rotation.y += 0.02;

    // 🔧 FIX: Proper AABB collision detection with current position
    const playerPos = gameState.position;
    const distance = Math.sqrt(
      Math.pow(playerPos[0] - currentPos[0], 2) +
      Math.pow(playerPos[1] - currentPos[1], 2) +
      Math.pow(playerPos[2] - currentPos[2], 2)
    );

    // Collision detection - collect if within range
    if (distance < 2.5 && !gameState.collectedProductIds.has(product.id)) {
      onCollect(product.id);
    }
  });

  // Don't render if collected
  if (gameState.collectedProductIds.has(product.id)) {
    return null;
  }

  return (
    <group ref={groupRef} position={currentPos}>
      <Box 
        args={[1, 1, 1]} 
        onPointerOver={(e) => {
          const mesh = e.object as THREE.Mesh;
          if (mesh.material && 'emissiveIntensity' in mesh.material) {
            (mesh.material as any).emissiveIntensity = 0.5;
          }
        }}
        onPointerOut={(e) => {
          const mesh = e.object as THREE.Mesh;
          if (mesh.material && 'emissiveIntensity' in mesh.material) {
            (mesh.material as any).emissiveIntensity = 0.2;
          }
        }}
      >
        <meshStandardMaterial 
          color="#00FF41" 
          emissive="#00FF41"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#00FF41"
        anchorX="center"
        anchorY="middle"
      >
        {product.name}
      </Text>
      
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        ${product.price}
      </Text>
    </group>
  );
}

// Product Collectibles Component with proper collision detection
function ProductCollectibles({ 
  gameState, 
  onCollect 
}: { 
  gameState: GameState;
  onCollect: (productId: string) => void;
}) {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Neural Headset', price: '2999', position: [2, 1, -50], collected: false },
    { id: '2', name: 'Cyber Arm', price: '7999', position: [-3, 1, -100], collected: false },
    { id: '3', name: 'Quantum CPU', price: '4999', position: [1, 1, -150], collected: false },
    { id: '4', name: 'Holo Display', price: '3499', position: [-2, 1, -200], collected: false },
    { id: '5', name: 'AI Core', price: '8999', position: [3, 1, -250], collected: false },
    { id: '6', name: 'Data Deck', price: '1999', position: [-1, 1, -300], collected: false },
    { id: '7', name: 'Memory Bank', price: '3299', position: [2.5, 1, -350], collected: false },
    { id: '8', name: 'Sync Module', price: '2499', position: [-3.5, 1, -400], collected: false },
  ]);

  return (
    <group>
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          gameState={gameState}
          onCollect={onCollect}
        />
      ))}
    </group>
  );
}

// Main Game Scene Component
function GameScene({ gameState, onCollectProduct }: { 
  gameState: GameState; 
  onCollectProduct: (productId: string) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#00D4FF" />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#FF00FF" />
      <pointLight position={[0, 5, 0]} intensity={1} color="#00FF41" />
      
      {/* Game objects */}
      <RacingCar 
        position={gameState.position} 
        rotation={gameState.rotation} 
        speed={gameState.speed}
      />
      <RacingTrack isPlaying={gameState.isPlaying} />
      <ProductCollectibles 
        gameState={gameState} 
        onCollect={onCollectProduct}
      />
      
      {/* Environment */}
      <Environment preset="night" />
    </>
  );
}

// Player Controls Component
function PlayerController({ 
  gameState, 
  setGameState 
}: { 
  gameState: GameState; 
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}) {
  const [subscribe, getState] = useKeyboardControls<Controls>();

  useFrame(() => {
    if (!gameState.isPlaying) return;

    const controls = getState();
    let newSpeed = gameState.speed;
    let newPosition = [...gameState.position] as [number, number, number];
    let newRotation = [...gameState.rotation] as [number, number, number];
    let newBoostEnergy = gameState.boostEnergy;

    // Forward/backward controls
    if (controls.forward) {
      newSpeed = Math.min(newSpeed + 2, 80);
    }
    if (controls.back) {
      newSpeed = Math.max(newSpeed - 3, 0);
    }
    if (controls.brake) {
      newSpeed = Math.max(newSpeed - 5, 0);
    }

    // Boost control
    if (controls.boost && newBoostEnergy > 0) {
      newSpeed = Math.min(newSpeed + 3, 100);
      newBoostEnergy = Math.max(newBoostEnergy - 2, 0);
    } else {
      newBoostEnergy = Math.min(newBoostEnergy + 0.5, 100);
    }

    // Left/right steering
    if (controls.left && newSpeed > 0) {
      newPosition[0] = Math.max(newPosition[0] - 0.2, -4);
      newRotation[2] = Math.min(newRotation[2] + 0.02, 0.3);
    } else if (controls.right && newSpeed > 0) {
      newPosition[0] = Math.min(newPosition[0] + 0.2, 4);
      newRotation[2] = Math.max(newRotation[2] - 0.02, -0.3);
    } else {
      // Return to center rotation
      newRotation[2] *= 0.95;
    }

    // Apply friction when not accelerating
    if (!controls.forward && !controls.boost) {
      newSpeed *= 0.98;
    }

    // Update score based on speed
    const newScore = gameState.score + Math.floor(newSpeed / 10);

    setGameState(prev => ({
      ...prev,
      speed: newSpeed,
      position: newPosition,
      rotation: newRotation,
      boostEnergy: newBoostEnergy,
      score: newScore
    }));
  });

  return null;
}

// Main Racing Game Component
export const RacingGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    speed: 0,
    lap: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    boostEnergy: 100,
    collectedItems: 0,
    collectedProductIds: new Set<string>()
  });

  const keyMap = [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
    { name: Controls.brake, keys: ['Space'] },
    { name: Controls.boost, keys: ['ShiftLeft', 'ShiftRight'] },
  ];

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      score: 0,
      speed: 0,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      boostEnergy: 100,
      collectedItems: 0,
      collectedProductIds: new Set<string>()
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  const resetGame = () => {
    setGameState({
      isPlaying: false,
      score: 0,
      speed: 0,
      lap: 1,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      boostEnergy: 100,
      collectedItems: 0,
      collectedProductIds: new Set<string>()
    });
  };

  const handleCollectProduct = (productId: string) => {
    setGameState(prev => {
      // 🔧 FIX: Prevent repeated collection
      if (prev.collectedProductIds.has(productId)) return prev;
      
      const newCollectedIds = new Set(prev.collectedProductIds);
      newCollectedIds.add(productId);
      
      return {
        ...prev,
        score: prev.score + 500,
        collectedItems: prev.collectedItems + 1,
        collectedProductIds: newCollectedIds,
        boostEnergy: Math.min(prev.boostEnergy + 20, 100) // Reward with boost energy
      };
    });
    console.log(`Collected product: ${productId} - Score +500, Boost +20`);
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Game Canvas */}
      <KeyboardControls map={keyMap}>
        <Canvas 
          camera={{ position: [0, 5, 10], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <GameScene 
              gameState={gameState} 
              onCollectProduct={handleCollectProduct}
            />
            <PlayerController 
              gameState={gameState} 
              setGameState={setGameState}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-gray-900/90 border-cyan-500/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-2 text-white">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Score: {gameState.score.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>Speed: {Math.floor(gameState.speed)} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span>Boost: {Math.floor(gameState.boostEnergy)}%</span>
              </div>
              <div>Items: {gameState.collectedItems}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-gray-900/90 border-cyan-500/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              {!gameState.isPlaying ? (
                <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseGame} className="bg-yellow-600 hover:bg-yellow-700">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetGame} className="bg-red-600 hover:bg-red-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-gray-900/90 border-cyan-500/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-white text-sm space-y-1">
              <div className="font-bold mb-2">Controls:</div>
              <div>W/↑ - Accelerate</div>
              <div>A/← D/→ - Steer</div>
              <div>S/↓ - Reverse</div>
              <div>Space - Brake</div>
              <div>Shift - Boost</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Over Screen */}
      {!gameState.isPlaying && gameState.score > 0 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <Card className="bg-gray-900 border-cyan-500">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">Race Complete!</h2>
              <div className="text-white text-xl mb-4">
                Final Score: {gameState.score.toLocaleString()}
              </div>
              <div className="text-white mb-6">
                Products Collected: {gameState.collectedItems}
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={startGame} className="bg-cyan-600 hover:bg-cyan-700">
                  Race Again
                </Button>
                <Button onClick={resetGame} variant="outline">
                  Main Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};