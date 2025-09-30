import React, { useState, useRef, useEffect } from 'react';
import { Glasses, Maximize, Hand, RotateCcw, Home, Zap, Eye } from 'lucide-react';

interface ARVRExperienceProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ARVRExperience({ product, isOpen, onClose }: ARVRExperienceProps) {
  const [xrSupported, setXrSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [handTrackingEnabled, setHandTrackingEnabled] = useState(false);
  const [roomVisualization, setRoomVisualization] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const xrSessionRef = useRef<XRSession | null>(null);
  
  useEffect(() => {
    checkXRSupport();
    return () => cleanup();
  }, []);

  const checkXRSupport = async () => {
    if ('xr' in navigator) {
      try {
        const navigator_xr = (navigator as any).xr;
        
        // Check AR support
        const arSupported = await navigator_xr.isSessionSupported('immersive-ar');
        // Check VR support  
        const vrSupported = await navigator_xr.isSessionSupported('immersive-vr');
        
        setXrSupported(arSupported || vrSupported);
        console.log('🥽 WebXR Support:', { ar: arSupported, vr: vrSupported });
        
      } catch (error) {
        console.warn('⚠️ WebXR support check failed:', error);
        setError('WebXR not available in this browser');
      }
    } else {
      setError('WebXR not supported. Try Chrome/Edge with WebXR flags enabled.');
    }
  };

  const cleanup = () => {
    if (xrSessionRef.current) {
      xrSessionRef.current.end();
      xrSessionRef.current = null;
    }
    setIsARActive(false);
    setIsVRActive(false);
  };

  const startARExperience = async () => {
    if (!xrSupported) {
      setError('AR not supported on this device');
      return;
    }

    try {
      const navigator_xr = (navigator as any).xr;
      const session = await navigator_xr.requestSession('immersive-ar', {
        requiredFeatures: ['local'],
        optionalFeatures: ['hand-tracking', 'hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      xrSessionRef.current = session;
      setIsARActive(true);
      setError(null);

      // Set up AR rendering loop
      await setupARSession(session);

      session.addEventListener('end', () => {
        setIsARActive(false);
        xrSessionRef.current = null;
      });

    } catch (error) {
      console.error('❌ Failed to start AR session:', error);
      setError('Failed to start AR. Make sure you\'re using HTTPS and have camera permissions.');
    }
  };

  const startVRExperience = async () => {
    if (!xrSupported) {
      setError('VR not supported on this device');
      return;
    }

    try {
      const navigator_xr = (navigator as any).xr;
      const session = await navigator_xr.requestSession('immersive-vr', {
        requiredFeatures: ['local'],
        optionalFeatures: ['hand-tracking', 'eye-tracking']
      });

      xrSessionRef.current = session;
      setIsVRActive(true);
      setError(null);

      // Set up VR rendering loop
      await setupVRSession(session);

      session.addEventListener('end', () => {
        setIsVRActive(false);
        xrSessionRef.current = null;
      });

    } catch (error) {
      console.error('❌ Failed to start VR session:', error);
      setError('Failed to start VR. Make sure you have a VR headset connected.');
    }
  };

  const setupARSession = async (session: any) => {
    console.log('🌍 Setting up AR experience for product:', product.name);
    
    // In a real implementation, you would:
    // 1. Set up WebGL rendering context
    // 2. Load 3D model of the product
    // 3. Implement hit testing to place product in real world
    // 4. Add interaction handlers for gestures
    // 5. Implement occlusion and lighting
    
    // Mock AR setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ AR session ready - Product placed in real world');
  };

  const setupVRSession = async (session: any) => {
    console.log('🥽 Setting up VR experience for product:', product.name);
    
    // In a real implementation, you would:
    // 1. Create virtual showroom environment
    // 2. Load and position 3D product model
    // 3. Set up hand tracking for interaction
    // 4. Add spatial audio and haptic feedback
    // 5. Create UI panels in 3D space
    
    // Mock VR setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ VR session ready - Virtual showroom loaded');
  };

  const endXRSession = () => {
    if (xrSessionRef.current) {
      xrSessionRef.current.end();
    }
  };

  const toggleHandTracking = () => {
    setHandTrackingEnabled(!handTrackingEnabled);
    console.log('👋 Hand tracking:', !handTrackingEnabled ? 'enabled' : 'disabled');
  };

  const toggleRoomVisualization = () => {
    setRoomVisualization(!roomVisualization);
    console.log('🏠 Room visualization:', !roomVisualization ? 'enabled' : 'disabled');
  };

  // Mock AR preview (camera + overlay)
  const startARPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setError('Camera access denied for AR preview');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-cyan-900/20 border border-cyan-500/50 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 rounded-full">
              <Glasses className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                🥽 AR/VR Experience
              </h2>
              <p className="text-gray-400">
                Immersive product visualization • Try before you buy
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          
          {/* Product Info */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-xl font-bold text-purple-400 mb-2">{product.name}</h3>
            <p className="text-gray-300 text-sm mb-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                ${product.price.toLocaleString()}
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>
          </div>

          {/* XR Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${xrSupported ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
              <div className="flex items-center space-x-2">
                <Eye className={`h-5 w-5 ${xrSupported ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm font-medium ${xrSupported ? 'text-green-400' : 'text-red-400'}`}>
                  WebXR {xrSupported ? 'Ready' : 'Not Available'}
                </span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${isARActive ? 'border-cyan-500/50 bg-cyan-900/20' : 'border-gray-500/50 bg-gray-800/20'}`}>
              <div className="flex items-center space-x-2">
                <Zap className={`h-5 w-5 ${isARActive ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isARActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                  AR {isARActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${isVRActive ? 'border-purple-500/50 bg-purple-900/20' : 'border-gray-500/50 bg-gray-800/20'}`}>
              <div className="flex items-center space-x-2">
                <Glasses className={`h-5 w-5 ${isVRActive ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isVRActive ? 'text-purple-400' : 'text-gray-400'}`}>
                  VR {isVRActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* AR Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center">
                📱 Augmented Reality
              </h3>
              
              <div className="bg-gray-800/30 border border-cyan-500/20 rounded-lg p-4 space-y-4">
                <p className="text-gray-300 text-sm">
                  Place the {product.name} in your real environment using your device camera.
                </p>
                
                {/* AR Preview/Controls */}
                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-cyan-500/30">
                  {videoRef.current ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-400">
                        <Glasses className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">AR Preview</p>
                      </div>
                    </div>
                  )}
                  
                  {/* AR Overlay UI */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 bg-black/70 text-cyan-400 px-3 py-1 rounded-full text-xs">
                      🎯 Point camera at flat surface
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-purple-400 px-3 py-1 rounded-full text-xs">
                      👋 Tap to place product
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={xrSupported ? startARExperience : startARPreview}
                    disabled={isARActive}
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/50 text-cyan-400 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50"
                  >
                    🚀 {xrSupported ? 'Launch AR' : 'AR Preview'}
                  </button>
                  
                  <button
                    onClick={toggleRoomVisualization}
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-400 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Home className="h-4 w-4 inline mr-1" />
                    Room Scan
                  </button>
                </div>
              </div>
            </div>

            {/* VR Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                🥽 Virtual Reality
              </h3>
              
              <div className="bg-gray-800/30 border border-purple-500/20 rounded-lg p-4 space-y-4">
                <p className="text-gray-300 text-sm">
                  Explore the {product.name} in a fully immersive virtual showroom.
                </p>
                
                {/* VR Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg overflow-hidden border border-purple-500/30">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-purple-400">
                      <Maximize className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">Virtual Showroom Preview</p>
                    </div>
                  </div>
                  
                  {/* VR UI Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 bg-black/70 text-purple-400 px-3 py-1 rounded-full text-xs">
                      🌍 360° Environment
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-cyan-400 px-3 py-1 rounded-full text-xs">
                      👐 Hand Tracking Ready
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startVRExperience}
                    disabled={isVRActive || !xrSupported}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/50 text-purple-400 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50"
                  >
                    🚀 Launch VR
                  </button>
                  
                  <button
                    onClick={toggleHandTracking}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-400 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Hand className="h-4 w-4 inline mr-1" />
                    Hand Track
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Session Controls */}
          {(isARActive || isVRActive) && (
            <div className="bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-pink-900/30 border border-gradient rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    🔴 {isARActive ? 'AR' : 'VR'} Session Active
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    Use gestures to interact with the product
                  </div>
                </div>
                
                <button
                  onClick={endXRSession}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  🛑 End Session
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-500/50 text-gray-300 px-3 py-2 rounded text-sm">
                  <RotateCcw className="h-4 w-4 inline mr-1" />
                  Reset View
                </button>
                
                <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-500/50 text-gray-300 px-3 py-2 rounded text-sm">
                  📏 Measure
                </button>
                
                <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-500/50 text-gray-300 px-3 py-2 rounded text-sm">
                  📸 Screenshot
                </button>
                
                <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-500/50 text-gray-300 px-3 py-2 rounded text-sm">
                  📤 Share
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <div className="text-red-400 text-sm">{error}</div>
              <div className="text-gray-400 text-xs mt-2">
                💡 Try using Chrome/Edge with WebXR support enabled, and ensure HTTPS connection
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for WebXR rendering */}
        <canvas ref={canvasRef} className="hidden" />
        {/* Hidden video for AR camera feed */}
        <video ref={videoRef} className="hidden" autoPlay playsInline />
      </div>
    </div>
  );
}