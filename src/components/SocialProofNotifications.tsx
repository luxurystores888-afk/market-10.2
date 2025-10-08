import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, TrendingUp, Users } from 'lucide-react';

interface Notification {
  id: string;
  type: 'purchase' | 'viewing' | 'stock' | 'trending';
  message: string;
  location?: string;
  product?: string;
  time?: string;
}

export const SocialProofNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Sample data for realistic notifications
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'London', 'Paris', 'Tokyo', 'Sydney', 'Toronto', 'Berlin', 'Mumbai', 'Dubai'];
  const products = ['Neural Headset', 'Quantum Processor', 'Holographic Display', 'Cyber Smartwatch', 'AR Glasses', 'Wireless Earbuds', 'Gaming Mouse'];
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Avery', 'Quinn', 'Sage'];

  useEffect(() => {
    const generateNotification = (): Notification => {
      const types = ['purchase', 'viewing', 'stock', 'trending'];
      const type = types[Math.floor(Math.random() * types.length)] as Notification['type'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const name = firstNames[Math.floor(Math.random() * firstNames.length)];
      const timeAgo = Math.floor(Math.random() * 30) + 1;

      let message = '';
      switch (type) {
        case 'purchase':
          message = `${name} from ${city} just purchased ${product}`;
          break;
        case 'viewing':
          const viewers = Math.floor(Math.random() * 50) + 10;
          message = `${viewers} people are viewing ${product} right now`;
          break;
        case 'stock':
          const remaining = Math.floor(Math.random() * 5) + 1;
          message = `Only ${remaining} left in stock for ${product}!`;
          break;
        case 'trending':
          message = `${product} is trending in ${city}`;
          break;
      }

      return {
        id: Date.now().toString() + Math.random(),
        type,
        message,
        location: city,
        product,
        time: `${timeAgo} ${timeAgo === 1 ? 'minute' : 'minutes'} ago`
      };
    };

    // Generate initial notifications
    const initial: Notification[] = [];
    for (let i = 0; i < 5; i++) {
      initial.push(generateNotification());
    }
    setNotifications(initial);

    // Show notifications one by one
    let currentIndex = 0;
    const showNextNotification = () => {
      setCurrentNotification(initial[currentIndex]);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % initial.length;
          if (currentIndex === 0) {
            // Generate new notifications when cycle completes
            const newNotification = generateNotification();
            initial.push(newNotification);
            initial.shift(); // Remove oldest
          }
          showNextNotification();
        }, 500); // Hide animation duration
      }, 5000); // Show for 5 seconds
    };

    showNextNotification();

    return () => {
      setIsVisible(false);
    };
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-5 h-5 text-green-400" />;
      case 'viewing':
        return <Eye className="w-5 h-5 text-blue-400" />;
      case 'stock':
        return <TrendingUp className="w-5 h-5 text-orange-400" />;
      case 'trending':
        return <Users className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'purchase':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/50';
      case 'viewing':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/50';
      case 'stock':
        return 'from-orange-500/20 to-red-500/20 border-orange-500/50';
      case 'trending':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/50';
    }
  };

  if (!currentNotification) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 max-w-md transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div
        className={`bg-gradient-to-r ${getBgColor(currentNotification.type)} backdrop-blur-lg border rounded-lg shadow-2xl p-4`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getIcon(currentNotification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-snug">
              {currentNotification.message}
            </p>
            {currentNotification.time && (
              <p className="text-xs text-gray-400 mt-1">{currentNotification.time}</p>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialProofNotifications;
