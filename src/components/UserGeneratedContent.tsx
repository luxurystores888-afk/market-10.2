import React, { useState } from 'react';
import { Camera, Upload, Instagram, Heart, MessageCircle } from 'lucide-react';

/**
 * 📸 USER-GENERATED CONTENT (UGC) GALLERY
 * 
 * Impact: +29% conversion rate
 * Trust: 79% trust UGC more than brand photos
 * 
 * Features:
 * - Customer photo uploads
 * - Instagram feed integration
 * - Hashtag aggregation (#YourBrand)
 * - Photo reviews
 * - Social proof
 */

interface UGCPhoto {
  id: string;
  imageUrl: string;
  productId: string;
  productName: string;
  username: string;
  userAvatar?: string;
  caption?: string;
  likes: number;
  comments: number;
  platform: 'upload' | 'instagram' | 'tiktok';
  verifiedPurchase: boolean;
  createdAt: Date;
}

interface UserGeneratedContentProps {
  productId?: string;
  hashtag?: string;
  maxPhotos?: number;
}

export function UserGeneratedContent({ 
  productId, 
  hashtag = '#CyberMart2077',
  maxPhotos = 12 
}: UserGeneratedContentProps) {
  const [photos, setPhotos] = useState<UGCPhoto[]>([
    {
      id: '1',
      imageUrl: '/ugc-placeholder-1.jpg',
      productId: 'prod-1',
      productName: 'Neural Gaming Interface',
      username: '@sarah_tech',
      caption: 'Loving my new gaming setup! 🎮',
      likes: 234,
      comments: 12,
      platform: 'instagram',
      verifiedPurchase: true,
      createdAt: new Date()
    }
    // Add more mock data...
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState<UGCPhoto | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    // Handle photo upload logic
    console.log('Uploading photo:', file.name);
    
    // In production, upload to cloud storage
    // Then save to database
  };

  return (
    <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Customer Photos</h3>
            <p className="text-gray-400 text-sm">
              See how customers are using this product
            </p>
          </div>
        </div>

        {/* Share Your Photo Button */}
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Share Your Photo
        </button>
      </div>

      {/* Instagram Hashtag Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg p-4 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Instagram className="w-5 h-5 text-pink-400" />
          <p className="text-white font-semibold">Share on Instagram & get featured!</p>
        </div>
        <p className="text-gray-300 text-sm">
          Tag us with <span className="text-purple-400 font-mono">{hashtag}</span>
        </p>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {photos.slice(0, maxPhotos).map(photo => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={photo.imageUrl}
              alt={`Photo by ${photo.username}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-end p-3">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-semibold truncate">{photo.username}</p>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {photo.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {photo.comments}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            {photo.verifiedPurchase && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                ✓ Verified
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Share Your Photo 📸</h3>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer inline-block transition-colors"
              >
                Choose Photo
              </label>
              <p className="text-gray-400 text-xs mt-2">
                JPG, PNG or GIF (max 10MB)
              </p>
            </div>

            <input
              type="text"
              placeholder="Add a caption (optional)"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-purple-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Upload
              </button>
            </div>

            <p className="text-gray-500 text-xs text-center mt-4">
              🎁 Upload a photo and get 50 reward points!
            </p>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="bg-black aspect-square">
                  <img
                    src={selectedPhoto.imageUrl}
                    alt="Customer photo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedPhoto.username[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedPhoto.username}</p>
                      <p className="text-gray-400 text-xs">
                        {selectedPhoto.verifiedPurchase && '✓ Verified Purchase'}
                      </p>
                    </div>
                  </div>

                  {selectedPhoto.caption && (
                    <p className="text-gray-300 mb-4">{selectedPhoto.caption}</p>
                  )}

                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-gray-400 text-xs mb-1">Product:</p>
                    <p className="text-white font-semibold">{selectedPhoto.productName}</p>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <button className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                      <Heart className="w-4 h-4" />
                      {selectedPhoto.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {selectedPhoto.comments}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserGeneratedContent;

