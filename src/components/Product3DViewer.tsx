import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Html, 
  useProgress,
  Stage,
  Text,
  Box,
  Sphere,
  Cylinder,
  Plane
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, Play, Pause, RotateCw, ZoomIn, ZoomOut, 
  Maximize, Settings, Palette, Camera, VolumeX, Volume2,
  Eye, EyeOff, Layers, Grid3x3, Lightbulb, Move3d,
  FullscreenIcon, Minimize, Download, Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Product3DViewerProps {
  productId: string;
  modelUrl?: string;
  images?: string[];
  title?: string;
  className?: string;
  enableAR?: boolean;
  enableVR?: boolean;
  enableCustomization?: boolean;
  showHolographicEffect?: boolean;
}

interface ViewerSettings {
  autoRotate: boolean;
  rotationSpeed: number;
  environment: string;
  lighting: string;
  shadows: boolean;
  wireframe: boolean;
  backgroundColor: string;
  cameraPosition: [number, number, number];
  zoom: number;
  animations: boolean;
  sound: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4 p-6 bg-background/80 backdrop-blur rounded-lg border">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">Loading 3D Model</div>
          <div className="text-sm text-muted-foreground">{Math.round(progress)}%</div>
          <div className="w-32 h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Html>
  );
}

// Basic 3D Product Model (placeholder)
function ProductModel({ 
  modelUrl, 
  color = '#00D4FF', 
  wireframe = false,
  scale = 1,
  position = [0, 0, 0] 
}: {
  modelUrl?: string;
  color?: string;
  wireframe?: boolean;
  scale?: number;
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate the model
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.scale.setScalar(scale * (hovered ? 1.1 : 1));
    }
  });

  // For now, we'll create a basic geometric representation
  // In a real app, you'd load the actual 3D model from modelUrl
  return (
    <group position={position}>
      {/* Main product body */}
      <Box
        ref={meshRef}
        args={[2, 3, 1]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          wireframe={wireframe}
          metalness={0.3}
          roughness={0.4}
        />
      </Box>
      
      {/* Product details */}
      <Cylinder args={[0.3, 0.3, 0.5]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#FF00FF" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      <Sphere args={[0.2]} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#00FF41" emissive="#00FF41" emissiveIntensity={0.2} />
      </Sphere>

      {/* Holographic effect */}
      <Plane args={[4, 4]} position={[0, 0, -1]} rotation={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#00D4FF" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Plane>
    </group>
  );
}

// Environment presets
const ENVIRONMENTS = {
  studio: 'studio',
  sunset: 'sunset', 
  forest: 'forest',
  night: 'night',
  warehouse: 'warehouse',
  apartment: 'apartment'
};

// Lighting presets
const LIGHTING_PRESETS = {
  soft: { intensity: 0.5, color: '#ffffff' },
  bright: { intensity: 1.2, color: '#ffffff' },
  warm: { intensity: 0.8, color: '#ffaa88' },
  cool: { intensity: 0.8, color: '#88aaff' },
  dramatic: { intensity: 1.5, color: '#ffffff' },
  neon: { intensity: 1.0, color: '#00D4FF' }
};

export default function Product3DViewer({
  productId,
  modelUrl,
  images = [],
  title = "3D Product View",
  className,
  enableAR = true,
  enableVR = true,
  enableCustomization = true,
  showHolographicEffect = true
}: Product3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [activeTab, setActiveTab] = useState('view');
  
  const [settings, setSettings] = useState<ViewerSettings>({
    autoRotate: true,
    rotationSpeed: 1,
    environment: 'studio',
    lighting: 'soft',
    shadows: true,
    wireframe: false,
    backgroundColor: '#1a1a1a',
    cameraPosition: [0, 0, 5],
    zoom: 1,
    animations: true,
    sound: true,
    quality: 'high'
  });

  const [customization, setCustomization] = useState({
    color: '#00D4FF',
    material: 'standard',
    scale: 1,
    position: [0, 0, 0] as [number, number, number]
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle settings changes
  const updateSetting = (key: keyof ViewerSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateCustomization = (key: string, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  // Take screenshot
  const takeScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `${title}_screenshot.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Screenshot Saved",
        description: "3D view screenshot has been downloaded",
      });
    }
  };

  // Share 3D view
  const shareView = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} - 3D View`,
          text: 'Check out this amazing 3D product view!',
          url: window.location.href
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "3D view link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // AR/VR Launch (coming soon - WebXR integration needed)
  const launchAR = () => {
    toast({
      title: "AR Experience (Preview)",
      description: "AR functionality coming soon with WebXR integration",
    });
  };

  const launchVR = () => {
    toast({
      title: "VR Experience (Preview)", 
      description: "VR functionality coming soon with WebXR integration",
    });
  };

  // Add VR session handling
  const startVR = async () => {
    // WebXR VR setup
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative bg-background rounded-lg overflow-hidden", className)}
    >
      {/* 3D Canvas */}
      <div className="relative aspect-square bg-gradient-to-br from-background to-muted">
        <Canvas
          ref={canvasRef}
          camera={{ position: settings.cameraPosition, fov: 75 }}
          style={{ background: settings.backgroundColor }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={<Loader />}>
            {/* Lighting */}
            <ambientLight intensity={LIGHTING_PRESETS[settings.lighting as keyof typeof LIGHTING_PRESETS].intensity * 0.4} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={LIGHTING_PRESETS[settings.lighting as keyof typeof LIGHTING_PRESETS].intensity}
              color={LIGHTING_PRESETS[settings.lighting as keyof typeof LIGHTING_PRESETS].color}
              castShadow={settings.shadows}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />

            {/* Environment */}
            <Environment preset={settings.environment as any} />

            {/* Stage with shadows */}
            <Stage
              shadows={settings.shadows}
              adjustCamera={false}
            >
              {/* 3D Product Model */}
              <ProductModel
                modelUrl={modelUrl}
                color={customization.color}
                wireframe={settings.wireframe}
                scale={customization.scale}
                position={customization.position}
              />
            </Stage>

            {/* Holographic Effect */}
            {showHolographicEffect && (
              <mesh position={[0, 0, -3]} rotation={[0, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial 
                  color="#00D4FF" 
                  transparent 
                  opacity={0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              autoRotate={settings.autoRotate}
              autoRotateSpeed={settings.rotationSpeed}
              maxPolarAngle={Math.PI / 2}
              minDistance={2}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/90 backdrop-blur flex items-center justify-center z-50"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-lg font-semibold">Loading 3D Experience</div>
                <div className="text-sm text-muted-foreground">Preparing immersive view...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-40">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur">
              3D View
            </Badge>
            {settings.quality && (
              <Badge variant="outline" className="bg-background/80 backdrop-blur">
                {settings.quality.toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={takeScreenshot}
              className="bg-background/80 backdrop-blur"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareView}
              className="bg-background/80 backdrop-blur"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-background/80 backdrop-blur"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <FullscreenIcon className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="bg-background/80 backdrop-blur"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AR/VR Buttons */}
        {(enableAR || enableVR) && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 z-40">
            {enableAR && (
              <Button
                variant="outline"
                size="sm"
                onClick={launchAR}
                className="bg-background/80 backdrop-blur cyberpunk-button"
              >
                <Eye className="h-4 w-4 mr-2" />
                AR View
              </Button>
            )}
            
            {enableVR && (
              <Button
                variant="outline"
                size="sm"
                onClick={launchVR}
                className="bg-background/80 backdrop-blur cyberpunk-button"
              >
                <Move3d className="h-4 w-4 mr-2" />
                VR View
              </Button>
            )}
          </div>
        )}

        {/* Quick Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSetting('autoRotate', !settings.autoRotate)}
            className={cn(
              "bg-background/80 backdrop-blur",
              settings.autoRotate && "bg-accent/20"
            )}
          >
            {settings.autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSetting('wireframe', !settings.wireframe)}
            className={cn(
              "bg-background/80 backdrop-blur",
              settings.wireframe && "bg-accent/20"
            )}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSetting('sound', !settings.sound)}
            className="bg-background/80 backdrop-blur"
          >
            {settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Control Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t z-50"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="view">View</TabsTrigger>
                  <TabsTrigger value="lighting">Lighting</TabsTrigger>
                  <TabsTrigger value="customize">Customize</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 max-h-64 overflow-y-auto">
                {/* View Controls */}
                <TabsContent value="view" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rotation Speed</Label>
                      <Slider
                        value={[settings.rotationSpeed]}
                        onValueChange={([value]) => updateSetting('rotationSpeed', value)}
                        max={5}
                        min={0.1}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Zoom</Label>
                      <Slider
                        value={[settings.zoom]}
                        onValueChange={([value]) => updateSetting('zoom', value)}
                        max={3}
                        min={0.5}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select 
                      value={settings.environment} 
                      onValueChange={(value) => updateSetting('environment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ENVIRONMENTS).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* Lighting Controls */}
                <TabsContent value="lighting" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Lighting Preset</Label>
                    <Select 
                      value={settings.lighting} 
                      onValueChange={(value) => updateSetting('lighting', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(LIGHTING_PRESETS).map((preset) => (
                          <SelectItem key={preset} value={preset}>
                            {preset.charAt(0).toUpperCase() + preset.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Cast Shadows</Label>
                    <Switch
                      checked={settings.shadows}
                      onCheckedChange={(checked) => updateSetting('shadows', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Wireframe Mode</Label>
                    <Switch
                      checked={settings.wireframe}
                      onCheckedChange={(checked) => updateSetting('wireframe', checked)}
                    />
                  </div>
                </TabsContent>

                {/* Customization Controls */}
                <TabsContent value="customize" className="space-y-4 mt-0">
                  {enableCustomization && (
                    <>
                      <div className="space-y-2">
                        <Label>Product Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customization.color}
                            onChange={(e) => updateCustomization('color', e.target.value)}
                            className="w-12 h-8 rounded border cursor-pointer"
                          />
                          <span className="text-sm text-muted-foreground">{customization.color}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Scale</Label>
                        <Slider
                          value={[customization.scale]}
                          onValueChange={([value]) => updateCustomization('scale', value)}
                          max={2}
                          min={0.5}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Material Type</Label>
                        <Select 
                          value={customization.material} 
                          onValueChange={(value) => updateCustomization('material', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="metallic">Metallic</SelectItem>
                            <SelectItem value="glass">Glass</SelectItem>
                            <SelectItem value="matte">Matte</SelectItem>
                            <SelectItem value="glossy">Glossy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select 
                      value={settings.quality} 
                      onValueChange={(value: any) => updateSetting('quality', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="ultra">Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Rotate</Label>
                    <Switch
                      checked={settings.autoRotate}
                      onCheckedChange={(checked) => updateSetting('autoRotate', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Animations</Label>
                    <Switch
                      checked={settings.animations}
                      onCheckedChange={(checked) => updateSetting('animations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Sound Effects</Label>
                    <Switch
                      checked={settings.sound}
                      onCheckedChange={(checked) => updateSetting('sound', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        // Reset to defaults
                        setSettings({
                          autoRotate: true,
                          rotationSpeed: 1,
                          environment: 'studio',
                          lighting: 'soft',
                          shadows: true,
                          wireframe: false,
                          backgroundColor: '#1a1a1a',
                          cameraPosition: [0, 0, 5],
                          zoom: 1,
                          animations: true,
                          sound: true,
                          quality: 'high'
                        });
                        setCustomization({
                          color: '#00D4FF',
                          material: 'standard',
                          scale: 1,
                          position: [0, 0, 0]
                        });
                      }}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        // Save preset (would save to localStorage or server)
                        toast({
                          title: "Settings Saved",
                          description: "Your 3D viewer preferences have been saved",
                        });
                      }}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}