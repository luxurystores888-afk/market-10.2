import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image, Zap, Cpu, Eye, Sparkles, X, Download } from 'lucide-react';

interface ImageAnalysisResult {
  description: string;
  detectedObjects: string[];
  suggestedProducts: string[];
  cyberpunkElements: string[];
}

interface AnalysisResponse {
  success: boolean;
  analysis: ImageAnalysisResult;
  analyzedAt: string;
  provider: string;
  error?: string;
  message?: string;
}

export function ImageAnalysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image file too large. Please select an image under 10MB.');
      return;
    }

    setImageFile(file);
    setError(null);
    setAnalysis(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const analyzeImage = async () => {
    if (!selectedImage || !imageFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      console.log('🔍 Starting AI image analysis...');
      
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage,
          mimeType: imageFile.type
        })
      });

      const data: AnalysisResponse = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        console.log('✅ Image analysis completed:', data.analysis);
      } else {
        const errorMsg = data.error === 'Image Analysis Unavailable' 
          ? 'Gemini AI is required for image analysis. This feature needs GEMINI_API_KEY to be configured for unlimited multimodal AI power.'
          : data.message || 'Failed to analyze image';
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      setError('Network error during image analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateProductsFromSuggestions = async () => {
    if (!analysis?.suggestedProducts.length) return;

    try {
      // Generate products from the first few suggestions
      const suggestions = analysis.suggestedProducts.slice(0, 3);
      
      for (const suggestion of suggestions) {
        console.log(`🤖 Generating product: ${suggestion}`);
        
        const response = await fetch('/api/ai/generate-product?saveToStore=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productIdea: suggestion
          })
        });
        
        const data = await response.json();
        if (data.success) {
          console.log(`✅ Generated and saved: ${data.product.name}`);
        }
      }
      
      alert(`🎉 Generated ${suggestions.length} products from image analysis! Check the products page to see them.`);
    } catch (error) {
      console.error('Product generation error:', error);
      alert('❌ Failed to generate products from suggestions.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-400 to-cyan-400 p-3 rounded-full mr-4">
            <Eye className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400">
            AI Vision Analysis
          </h2>
        </div>
        <p className="text-gray-400 text-lg">
          Upload any image and let our Gemini AI analyze it for cyberpunk product suggestions
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 text-green-400">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-semibold">POWERED BY GEMINI 2.5 FLASH • MULTIMODAL AI • FREE ANALYSIS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            ref={dragRef}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              selectedImage
                ? 'border-purple-500/50 bg-purple-900/20'
                : 'border-cyan-500/50 bg-gray-900/50 hover:border-purple-500/50 hover:bg-purple-900/10'
            }`}
          >
            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full max-h-64 rounded-lg shadow-lg"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-cyan-400">Image ready for analysis</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-4 rounded-full w-fit mx-auto">
                  <Upload className="h-12 w-12 text-black" />
                </div>
                <div>
                  <p className="text-xl text-white mb-2">Drop an image here</p>
                  <p className="text-gray-400 mb-4">or click to browse files</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <Image className="h-5 w-5 mr-2 inline" />
                    Select Image
                  </button>
                </div>
                <p className="text-sm text-gray-500">Supports JPG, PNG, GIF • Max 10MB</p>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Analyze Button */}
          {selectedImage && (
            <button
              onClick={analyzeImage}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {analyzing ? (
                <>
                  <Cpu className="h-5 w-5 mr-2 animate-pulse" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze Image
                </>
              )}
            </button>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400">⚠️ {error}</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {analysis ? (
            <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-400 mr-2" />
                <h3 className="text-xl font-bold text-green-400">AI Analysis Results</h3>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                  {analysis.description}
                </p>
              </div>

              {/* Detected Objects */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">Detected Objects</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.detectedObjects.map((obj, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Products */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">Suggested Cyberpunk Products</h4>
                <div className="space-y-2">
                  {analysis.suggestedProducts.map((product, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-purple-400 font-medium">{product}</p>
                    </div>
                  ))}
                </div>
                {analysis.suggestedProducts.length > 0 && (
                  <button
                    onClick={generateProductsFromSuggestions}
                    className="mt-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate These Products
                  </button>
                )}
              </div>

              {/* Cyberpunk Elements */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Cyberpunk Enhancement Ideas</h4>
                <div className="space-y-2">
                  {analysis.cyberpunkElements.map((element, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-pink-400">{element}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/30 border border-gray-500/30 rounded-xl p-6 text-center">
              <Cpu className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Analysis Yet</h3>
              <p className="text-gray-500">
                Upload an image and click "Analyze Image" to see AI-powered insights and product suggestions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-3">AI Vision Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Eye className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white mb-1">Object Detection</h4>
            <p className="text-gray-400 text-sm">Advanced AI identifies objects and scenes</p>
          </div>
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white mb-1">Product Suggestions</h4>
            <p className="text-gray-400 text-sm">AI suggests cyberpunk products based on image</p>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white mb-1">Auto-Generation</h4>
            <p className="text-gray-400 text-sm">Instantly create products from suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
}