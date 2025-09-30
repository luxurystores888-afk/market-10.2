import React, { useState } from 'react';
import { Zap, Cpu, Loader2, Sparkles, Save, Lightbulb } from 'lucide-react';

interface GeneratedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  tags: string[];
  status: string;
}

interface AIResponse {
  success: boolean;
  product: GeneratedProduct;
  savedToDatabase: boolean;
  productId?: string;
  originalIdea: string;
  generatedAt: string;
  error?: string;
  message?: string;
  code?: string;
}

export function AIProductGenerator() {
  const [productIdea, setProductIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<GeneratedProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [examples, setExamples] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false);

  // Fetch example ideas
  const fetchExamples = async () => {
    try {
      const response = await fetch('/api/ai/example-ideas');
      const data = await response.json();
      if (data.success) {
        setExamples(data.examples);
        setShowExamples(true);
      }
    } catch (error) {
      console.error('Failed to fetch examples:', error);
    }
  };

  // Generate product using AI
  const handleGenerate = async () => {
    if (!productIdea.trim()) {
      setError('Please enter a product idea');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedProduct(null);

    try {
      const response = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIdea: productIdea.trim()
        })
      });

      const data: AIResponse = await response.json();

      if (data.success) {
        setGeneratedProduct(data.product);
        setError(null);
      } else {
        // Handle specific error cases
        if (data.code === 'API_KEY_MISSING') {
          setError('🔑 AI Service Unavailable: OpenAI API key is not configured. Please add your OPENAI_API_KEY environment variable to enable AI product generation.');
        } else if (data.code === 'VALIDATION_ERROR') {
          setError(`❌ ${data.message}`);
        } else {
          setError(`❌ ${data.message || 'Failed to generate product'}`);
        }
      }
    } catch (error) {
      console.error('Error generating product:', error);
      setError('🌐 Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save product to database
  const handleSaveToStore = async () => {
    if (!generatedProduct) return;

    setSaving(true);
    try {
      const response = await fetch('/api/ai/save-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: generatedProduct.name,
          description: generatedProduct.description,
          price: generatedProduct.price,
          category: generatedProduct.category,
          stock: generatedProduct.stock,
          status: generatedProduct.status,
          tags: generatedProduct.tags,
          originalIdea: productIdea.trim()
        })
      });

      const data = await response.json();

      if (data.success && data.savedToDatabase) {
        alert(`✅ "${generatedProduct.name}" saved to store successfully! Product ID: ${data.productId}`);
      } else {
        const errorMessage = data.message || 'Failed to save product to store';
        alert(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Network error while saving product.');
    } finally {
      setSaving(false);
    }
  };

  // Use example idea
  const useExample = (example: string) => {
    setProductIdea(example);
    setShowExamples(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 rounded-full mr-4">
            <Zap className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            AI Product Generator
          </h2>
        </div>
        <p className="text-gray-400 text-lg">
          Transform any idea into a cyberpunk masterpiece with AI consciousness
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <Cpu className="h-5 w-5 text-cyan-400 mr-2" />
          <label className="text-white font-semibold">Enter Your Product Idea</label>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={productIdea}
            onChange={(e) => setProductIdea(e.target.value)}
            placeholder="quantum coffee maker, neural gaming chair, cyberpunk running shoes..."
            className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
            rows={3}
            maxLength={200}
            disabled={loading}
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !productIdea.trim()}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Cyberpunk Magic...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Product
                </>
              )}
            </button>
            
            <button
              onClick={fetchExamples}
              className="bg-gray-800/50 border border-purple-500/30 hover:border-purple-400/50 text-purple-400 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Get Ideas
            </button>
          </div>
        </div>
      </div>

      {/* Example Ideas */}
      {showExamples && examples.length > 0 && (
        <div className="bg-gray-900/30 border border-purple-500/20 rounded-xl p-4 mb-6">
          <h3 className="text-purple-400 font-semibold mb-3">💡 Example Ideas (Click to use):</h3>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => useExample(example)}
                className="bg-purple-900/30 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm hover:bg-purple-800/40 hover:border-purple-400/50 transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6">
          <div className="text-red-400 whitespace-pre-line">{error}</div>
        </div>
      )}

      {/* Generated Product Display */}
      {generatedProduct && (
        <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-cyan-900/20 border border-cyan-500/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-cyan-400 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Generated Product
            </h3>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={handleSaveToStore}
                disabled={saving}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Exact Product...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save This Exact Product
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-right">
                💡 Saves the exact product shown above
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Product Info */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">{generatedProduct.name}</h4>
                <p className="text-gray-300 text-lg leading-relaxed">{generatedProduct.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {generatedProduct.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-900/50 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Stats */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-1">
                    ${generatedProduct.price.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Price</div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {generatedProduct.stock}
                  </div>
                  <div className="text-gray-400 text-sm">In Stock</div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-pink-400 mb-1">
                    {generatedProduct.category}
                  </div>
                  <div className="text-gray-400 text-sm">Category</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}