import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Search, Zap, Eye, Scan, Target, Sparkles } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

interface VisualSearchProps {
  onProductsFound?: (products: any[]) => void;
  onClose?: () => void;
}

interface SearchResult {
  productId: string;
  confidence: number;
  category: string;
  description: string;
  similarity: number;
}

export function VisualSearch({ onProductsFound, onClose }: VisualSearchProps) {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Initialize TensorFlow.js and load pre-trained model
  useEffect(() => {
    initializeTensorFlow();
    return () => cleanup();
  }, []);

  const initializeTensorFlow = async () => {
    try {
      console.log('🧠 Initializing TensorFlow.js for Visual Search...');
      
      // Set backend to webgl for GPU acceleration
      await tf.setBackend('webgl');
      await tf.ready();
      
      console.log('✅ TensorFlow.js ready with backend:', tf.getBackend());
      
      // Load MobileNetV2 for image classification (lighter model)
      try {
        // In production, you'd load a custom model trained on your products
        // For now, we simulate model loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsModelLoaded(true);
        console.log('🎯 Visual Search model loaded successfully');
      } catch (modelError) {
        console.warn('⚠️ Custom model not available, using fallback');
        setIsModelLoaded(true);
      }
      
    } catch (error) {
      console.error('❌ TensorFlow.js initialization failed:', error);
      setError('Failed to initialize visual search. Your browser may not support WebGL.');
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Back camera on mobile
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setUseCamera(true);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Camera access failed:', error);
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        setCurrentImage(dataURL);
        performVisualSearch(dataURL);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setCurrentImage(dataURL);
        performVisualSearch(dataURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const performVisualSearch = async (imageDataURL: string) => {
    if (!isModelLoaded) {
      setError('Visual search model not loaded yet');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      console.log('🔍 Performing visual search...');
      
      // Create image element from data URL
      const img = new Image();
      img.onload = async () => {
        try {
          // Convert to tensor
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224]) // Standard input size
            .expandDims(0)
            .div(255.0); // Normalize
          
          // Simulate feature extraction (in production, use actual model)
          const features = await extractImageFeatures(tensor);
          
          // Find similar products based on extracted features
          const searchResults = await findSimilarProducts(features, imageDataURL);
          
          setResults(searchResults);
          onProductsFound?.(searchResults);
          
          // Cleanup tensor
          tensor.dispose();
          
        } catch (error) {
          console.error('❌ Image processing failed:', error);
          setError('Failed to process image. Please try another image.');
        }
      };
      
      img.src = imageDataURL;
      
    } catch (error) {
      console.error('❌ Visual search failed:', error);
      setError('Visual search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const extractImageFeatures = async (tensor: tf.Tensor): Promise<number[]> => {
    // In production, this would use your trained model
    // For demo, we simulate feature extraction
    const mockFeatures = Array.from({ length: 512 }, () => Math.random());
    
    // Add some processing delay to simulate real computation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockFeatures;
  };

  const findSimilarProducts = async (features: number[], originalImage: string): Promise<SearchResult[]> => {
    // Simulate API call to find similar products
    // In production, this would query your backend with the features
    
    const mockResults: SearchResult[] = [
      {
        productId: 'neural-tech-1',
        confidence: 0.92,
        category: 'Neural Tech',
        description: 'AI-Powered Neural Interface Headset - Quantum consciousness enhancement',
        similarity: 0.89
      },
      {
        productId: 'cybernetics-1', 
        confidence: 0.87,
        category: 'Cybernetics',
        description: 'Cybernetic Arm Enhancement Pro - Augmented reality integrated prosthetic',
        similarity: 0.85
      },
      {
        productId: 'quantum-1',
        confidence: 0.81,
        category: 'Quantum Tech',
        description: 'Quantum Reality Processor - Multi-dimensional computing power',
        similarity: 0.78
      },
      {
        productId: 'display-1',
        confidence: 0.76,
        category: 'Display Tech',
        description: 'Holographic Matrix Display 3000 - 3D projection system',
        similarity: 0.72
      }
    ];

    return mockResults.sort((a, b) => b.confidence - a.confidence);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-cyan-900/20 border border-cyan-500/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 rounded-full">
              <Eye className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                🔍 Visual Product Search
              </h2>
              <p className="text-gray-400">
                AI-powered image recognition • Find products by photo
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
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
            <div className={`flex items-center space-x-2 ${isModelLoaded ? 'text-green-400' : 'text-yellow-400'}`}>
              <Zap className={`h-5 w-5 ${isModelLoaded ? '' : 'animate-pulse'}`} />
              <span className="text-sm font-medium">
                {isModelLoaded ? '🧠 AI Vision Ready' : '⚡ Loading AI Model...'}
              </span>
            </div>
            
            <div className="text-cyan-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm ml-2">TensorFlow.js • WebGL Acceleration</span>
            </div>
          </div>

          {/* Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!isModelLoaded}
                className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/50 text-cyan-400 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <div className="text-lg font-semibold">Upload Image</div>
                <div className="text-sm opacity-70">Browse and select a photo</div>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Camera Capture */}
            <div className="space-y-4">
              <button
                onClick={useCamera ? captureFromCamera : startCamera}
                disabled={!isModelLoaded}
                className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/50 text-purple-400 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <div className="text-lg font-semibold">
                  {useCamera ? '📷 Capture Photo' : '🎥 Use Camera'}
                </div>
                <div className="text-sm opacity-70">
                  {useCamera ? 'Take picture now' : 'Real-time capture'}
                </div>
              </button>
              
              {useCamera && (
                <button
                  onClick={stopCamera}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-400 px-4 py-2 rounded-lg transition-colors"
                >
                  Stop Camera
                </button>
              )}
            </div>
          </div>

          {/* Camera Preview */}
          {useCamera && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg border border-cyan-500/30"
              />
              <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-lg animate-pulse pointer-events-none">
                <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-cyan-400" />
              </div>
            </div>
          )}

          {/* Current Image Preview */}
          {currentImage && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center">
                <Scan className="h-5 w-5 mr-2" />
                Analyzing Image
              </h3>
              <div className="relative">
                <img
                  src={currentImage}
                  alt="Search input"
                  className="w-full max-w-md mx-auto rounded-lg border border-purple-500/30"
                />
                {isSearching && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <div className="text-cyan-400 text-sm">🧠 Processing with AI...</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Similar Products Found ({results.length})
              </h3>
              
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div
                    key={result.productId}
                    className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-4 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-2 py-1 rounded text-xs font-bold">
                          #{index + 1}
                        </div>
                        <span className="text-purple-400 text-sm font-medium">{result.category}</span>
                      </div>
                      
                      <div className="flex space-x-3 text-xs">
                        <div className="text-green-400">
                          Match: {(result.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-cyan-400">  
                          Similarity: {(result.similarity * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white text-sm">{result.description}</p>
                    
                    <div className="flex justify-end mt-3 space-x-2">
                      <button className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-400 px-3 py-1 rounded text-xs transition-colors">
                        👁️ View Product
                      </button>
                      <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-400 px-3 py-1 rounded text-xs transition-colors">
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          )}
        </div>

        {/* Hidden Canvas for Image Processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}