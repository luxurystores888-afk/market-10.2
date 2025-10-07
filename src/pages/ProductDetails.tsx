import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuickShareButtons } from '../components/QuickShareButtons';
import { PriceDropAlert } from '../components/PriceDropAlert';
import { Helmet } from 'react-helmet';
import ProductCard from '../components/ProductCard';
import { ThreeDShowcase } from '../components/ThreeDShowcase';
import { VoiceControl } from '../components/VoiceControl';
import { LiveStream } from '../components/LiveStream';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { NFTMarketplace } from '../components/NFTMarketplace';
import { EyeTracking } from '../components/EyeTracking';
import { MultiModalInput } from '../components/MultiModalInput';
import { BCICompatibility } from '../components/BCICompatibility';
import ProductReviews from '../components/ProductReviews';
import SocialShareButton from '../components/SocialShareButton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl?: string;
  category?: string;
  stock: number;
  tags?: string[];
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState<string>('');
  const [watchlisted, setWatchlisted] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setWatchlisted(!!localStorage.getItem(`watch_${id}`));
    const saved = localStorage.getItem(`price_threshold_${id}`);
    if (saved) setThreshold(saved);
  }, [id]);

  useEffect(() => {
    if (product) {
      fetch(`/api/recommendations/${product.id}`)
        .then(res => res.json())
        .then(setRecommendations);
    }
  }, [product]);

  const numericPrice = useMemo(() => {
    if (!product) return 0;
    return typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  }, [product]);

  const handleSaveThreshold = () => {
    if (!id) return;
    localStorage.setItem(`price_threshold_${id}`, threshold);
    // Persist to backend if authenticated (best effort)
    const value = parseFloat(threshold);
    if (!isNaN(value)) {
      fetch('/api/alerts/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, threshold: value })
      }).catch(() => {});
    }
    alert('Price alert threshold saved');
  };

  const toggleWatchlist = () => {
    if (!id) return;
    if (watchlisted) {
      localStorage.removeItem(`watch_${id}`);
      setWatchlisted(false);
    } else {
      localStorage.setItem(`watch_${id}`, '1');
      setWatchlisted(true);
    }
  };

  if (loading) {
    return <div className="min-h-screen text-center text-cyan-400 p-12">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen text-center text-red-400 p-12">
        Product not found. <Link to="/products" className="underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 text-white p-6">

      {/* Add Helmet at the top of the return */}
      <Helmet>
        <title>{product.name} - Cyber Mart 2077</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="og:url" content={`http://yourdomain.com/product/${product.id}`} />
      </Helmet>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl || '/icon-512x512.png'} alt={product.name} className="w-full rounded-xl border border-cyan-500/30" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-cyan-300 text-2xl font-semibold mb-4">${numericPrice.toFixed(2)}</div>
          <p className="text-gray-300 mb-6">{product.description}</p>

          {/* Threshold alert */}
          <div className="mb-4 p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl">
            <div className="text-sm text-gray-300 mb-2">Set a price threshold to be notified when price goes below</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">$</span>
              <input
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder={(numericPrice - 10).toFixed(2)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white w-32"
              />
              <button onClick={handleSaveThreshold} className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700">Save</button>
            </div>
            <div className="text-xs text-gray-500 mt-2">(Demo stores threshold locally. Backend hooks available.)</div>
          </div>

          <div className="mb-4">
            <button onClick={toggleWatchlist} className={`px-4 py-2 rounded ${watchlisted ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
              {watchlisted ? '★ In Watchlist' : '☆ Add to Watchlist'}
            </button>
          </div>

          <PriceDropAlert productId={product.id} productName={product.name} />
          <QuickShareButtons productName={product.name} productUrl={window.location.href} />
          <SocialShareButton url={window.location.href} title={product.name} />

          <div className="mt-8">
            <h2>Recommended Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map(rec => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ThreeDShowcase />
      <VoiceControl />
      <LiveStream />
      <SentimentAnalysis text="Sample review text" />
      <NFTMarketplace />
      <EyeTracking />
      <MultiModalInput />
      <BCICompatibility />
      <ProductReviews productId={product.id} />
    </div>
  );
}
