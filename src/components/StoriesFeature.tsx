import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 📸 STORIES FEATURE (Like Instagram/Facebook)
 * 24-hour disappearing content
 * Creates urgency + FOMO
 * Engagement rate: 500M daily viewers on Instagram!
 */

interface Story {
  id: string;
  type: 'product' | 'sale' | 'behind-scenes';
  image: string;
  title: string;
  cta: string;
  link: string;
}

export const StoriesFeature: React.FC = () => {
  const [stories] = useState<Story[]>([
    {
      id: '1',
      type: 'sale',
      image: '/api/placeholder/story-1',
      title: '🔥 Flash Sale - 50% OFF!',
      cta: 'Shop Now',
      link: '/products'
    },
    {
      id: '2',
      type: 'product',
      image: '/api/placeholder/story-2',
      title: '✨ New Arrival: Neural Headset',
      cta: 'Pre-Order',
      link: '/product/neural-headset'
    },
    {
      id: '3',
      type: 'behind-scenes',
      image: '/api/placeholder/story-3',
      title: '📦 Behind the Scenes',
      cta: 'Watch',
      link: '/about'
    }
  ]);

  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [progress, setProgress] = useState(0);

  const viewStory = (story: Story) => {
    setCurrentStory(story);
    setProgress(0);
    
    // Auto-advance after 5 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="my-8">
      {/* Stories Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => viewStory(story)}
            className="flex-shrink-0 cursor-pointer group"
          >
            <div className="relative">
              {/* Ring */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-[3px]">
                <div className="w-full h-full bg-gray-900 rounded-full p-[2px]">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl">
                    {story.type === 'sale' && '🔥'}
                    {story.type === 'product' && '✨'}
                    {story.type === 'behind-scenes' && '📦'}
                  </div>
                </div>
              </div>
              {/* Badge */}
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">
                  {stories.length}
                </div>
              )}
            </div>
            <p className="text-white text-xs text-center mt-2 w-20 truncate">
              {story.title.split(':')[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {currentStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setCurrentStory(null)}
            className="absolute top-4 right-4 text-white z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {stories.map((s, i) => (
              <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: s.id === currentStory.id ? `${progress}%` : '0%'
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Story Content */}
          <div className="relative w-full max-w-md h-full bg-gradient-to-br from-purple-600 to-cyan-600 flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              {currentStory.title}
            </h2>
            
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
              {currentStory.cta}
            </button>

            <p className="text-white/80 text-sm mt-4">
              ⏰ This story disappears in 24 hours!
            </p>
          </div>

          {/* Navigation */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
            <ChevronLeft className="w-12 h-12" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
            <ChevronRight className="w-12 h-12" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StoriesFeature;
