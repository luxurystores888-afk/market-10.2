/**
 * 🚀 CYBERPUNK E-COMMERCE - CENTRALIZED MOCK DATA UTILITY
 * 
 * Consolidated mock data generation functions for consistent development/testing data
 * Reduces code duplication and provides centralized mock data management
 */

import { randomUUID } from "node:crypto";

// 📦 INVENTORY MOCK DATA
export interface MockInventoryItem {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  category: string;
  supplier: string;
  lastRestock: Date;
  cost: number;
}

export interface MockSupplier {
  id: string;
  name: string;
  reliability: number;
  avgDeliveryDays: number;
  contactInfo: string;
  products: string[];
  cyberpunkRating: 'Chrome' | 'Neural' | 'Quantum';
}

export interface MockReorderSuggestion {
  productId: string;
  productName: string;
  currentStock: number;
  suggestedOrderQuantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  reason: string;
}

export interface MockAlert {
  id: string;
  type: 'stock' | 'quality' | 'delivery' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

// 🔒 SECURITY MOCK DATA  
export interface MockThreat {
  id: string;
  type: 'fraud' | 'bot' | 'intrusion' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  timestamp: Date;
  status: 'detected' | 'analyzing' | 'resolved';
}

export interface MockUserProfile {
  id: string;
  userId: string;
  riskScore: number;
  behaviorPattern: string;
  lastActivity: Date;
  flags: string[];
  trustLevel: 'low' | 'medium' | 'high';
}

export interface MockTransaction {
  id: string;
  hash: string;
  amount: number;
  currency: string;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  gasUsed?: number;
  blockNumber?: number;
}

// 🌐 METAVERSE MOCK DATA
export interface MockVirtualWorld {
  id: string;
  name: string;
  theme: string;
  activeUsers: number;
  storeCount: number;
  established: Date;
  cyberpunkLevel: number;
}

export interface MockVirtualStore {
  id: string;
  name: string;
  owner: string;
  world: string;
  products: number;
  visitors: number;
  revenue: number;
}

export interface MockAvatar {
  id: string;
  name: string;
  userId: string;
  augmentations: string[];
  cyberpunkStyle: string;
  lastActive: Date;
}

// 🎯 MOCK DATA GENERATORS

export const generateMockInventoryItems = (count: number = 20): MockInventoryItem[] => {
  const categories = ['Neural Tech', 'Cybernetics', 'Quantum Tech', 'Bio Enhancement', 'AI Assistants'];
  const itemNames = [
    'Neural Interface X1', 'Cyber Arm Pro', 'Quantum Processor', 'Bio-Enhancement Serum',
    'AI Consciousness Core', 'Neural Memory Bank', 'Chrome Plating Kit', 'Augmented Vision Lens',
    'Quantum Encryption Chip', 'Bio-Neural Interface', 'Cyber Brain Module', 'Data Storage Unit'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    name: itemNames[i % itemNames.length],
    currentStock: Math.floor(Math.random() * 100),
    reorderLevel: Math.floor(Math.random() * 20) + 5,
    category: categories[i % categories.length],
    supplier: `CyberCorp-${i % 5 + 1}`,
    lastRestock: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    cost: Math.floor(Math.random() * 5000) + 100
  }));
};

export const generateMockSuppliers = (count: number = 8): MockSupplier[] => {
  const supplierNames = [
    'Arasaka Industries', 'Militech Corp', 'NetWatch Systems', 'Biotechnica',
    'Trauma Team', 'Zetatech', 'Kang Tao', 'Raven Microcyber'
  ];
  
  const cyberpunkRatings: Array<'Chrome' | 'Neural' | 'Quantum'> = ['Chrome', 'Neural', 'Quantum'];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    name: supplierNames[i % supplierNames.length],
    reliability: Math.floor(Math.random() * 40) + 60, // 60-99%
    avgDeliveryDays: Math.floor(Math.random() * 7) + 1,
    contactInfo: `contact@${supplierNames[i % supplierNames.length].toLowerCase().replace(/\s+/g, '')}.corp`,
    products: [`Product-${i}-A`, `Product-${i}-B`, `Product-${i}-C`],
    cyberpunkRating: cyberpunkRatings[i % cyberpunkRatings.length]
  }));
};

export const generateMockReorderSuggestions = (count: number = 10): MockReorderSuggestion[] => {
  const products = ['Neural Interface', 'Cyber Arm', 'Quantum Core', 'Bio Serum', 'AI Module'];
  const urgencyLevels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const reasons = [
    'Stock below reorder level', 'High demand detected', 'Supplier promotion available',
    'Quality issues with current batch', 'Seasonal demand increase'
  ];

  return Array.from({ length: count }, (_, i) => ({
    productId: randomUUID(),
    productName: products[i % products.length],
    currentStock: Math.floor(Math.random() * 10),
    suggestedOrderQuantity: Math.floor(Math.random() * 50) + 10,
    urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
    estimatedCost: Math.floor(Math.random() * 10000) + 500,
    reason: reasons[i % reasons.length]
  }));
};

export const generateMockAlerts = (count: number = 12): MockAlert[] => {
  const types: Array<'stock' | 'quality' | 'delivery' | 'system'> = ['stock', 'quality', 'delivery', 'system'];
  const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const messages = [
    'Neural Interface stock critically low',
    'Quality issue detected in Cyber Arms batch #2077',
    'Delivery delay from Arasaka Industries',
    'System maintenance required on AI cores',
    'Bio Enhancement serum expiring soon',
    'Quantum processor temperature anomaly detected'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    type: types[Math.floor(Math.random() * types.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    message: messages[i % messages.length],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    resolved: Math.random() > 0.3
  }));
};

export const generateMockThreats = (count: number = 15): MockThreat[] => {
  const types: Array<'fraud' | 'bot' | 'intrusion' | 'anomaly'> = ['fraud', 'bot', 'intrusion', 'anomaly'];
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const statuses: Array<'detected' | 'analyzing' | 'resolved'> = ['detected', 'analyzing', 'resolved'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: `IP-${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    description: `Security threat ${i + 1} detected in the neural network`,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export const generateMockUserProfiles = (count: number = 25): MockUserProfile[] => {
  const trustLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const behaviorPatterns = ['aggressive', 'cautious', 'normal', 'suspicious', 'loyal'];
  const possibleFlags = ['multiple_devices', 'unusual_hours', 'high_value_transactions', 'new_account', 'vpn_usage'];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    userId: `user-${randomUUID()}`,
    riskScore: Math.floor(Math.random() * 100),
    behaviorPattern: behaviorPatterns[i % behaviorPatterns.length],
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    flags: possibleFlags.slice(0, Math.floor(Math.random() * 3)),
    trustLevel: trustLevels[Math.floor(Math.random() * trustLevels.length)]
  }));
};

export const generateMockTransactions = (count: number = 30): MockTransaction[] => {
  const currencies = ['ETH', 'BTC', 'MATIC', 'ADA', 'SOL'];
  const statuses: Array<'pending' | 'confirmed' | 'failed'> = ['pending', 'confirmed', 'failed'];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    hash: `0x${Math.random().toString(16).substring(2, 66)}`,
    amount: Math.floor(Math.random() * 10000) / 100,
    currency: currencies[i % currencies.length],
    from: `0x${Math.random().toString(16).substring(2, 42)}`,
    to: `0x${Math.random().toString(16).substring(2, 42)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    gasUsed: Math.floor(Math.random() * 100000),
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000
  }));
};

export const generateMockVirtualWorlds = (count: number = 8): MockVirtualWorld[] => {
  const worldNames = [
    'Neo Tokyo District', 'Chrome City', 'Neural Nexus', 'Quantum Realm',
    'Cyber Downtown', 'Digital Underworld', 'Neon Paradise', 'Data Haven'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    name: worldNames[i % worldNames.length],
    theme: `Cyberpunk-${i + 1}`,
    activeUsers: Math.floor(Math.random() * 10000) + 100,
    storeCount: Math.floor(Math.random() * 500) + 10,
    established: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    cyberpunkLevel: Math.floor(Math.random() * 10) + 1
  }));
};

export const generateMockVirtualStores = (count: number = 20): MockVirtualStore[] => {
  const storeNames = [
    'Chrome Boutique', 'Neural Emporium', 'Cyber Gear Shop', 'Quantum Trading Post',
    'Bio-Enhancement Store', 'AI Assistant Hub', 'Neon Fashion', 'Data Market'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    name: storeNames[i % storeNames.length],
    owner: `Owner-${i + 1}`,
    world: `World-${Math.floor(i / 3) + 1}`,
    products: Math.floor(Math.random() * 200) + 10,
    visitors: Math.floor(Math.random() * 5000) + 50,
    revenue: Math.floor(Math.random() * 100000) + 1000
  }));
};

export const generateMockAvatars = (count: number = 15): MockAvatar[] => {
  const augmentations = [
    'Neural Interface', 'Cyber Eyes', 'Enhanced Reflexes', 'Bio-Enhancement',
    'Quantum Brain', 'Chrome Arm', 'Data Processing Unit', 'Sensory Boost'
  ];
  
  const cyberpunkStyles = [
    'Street Samurai', 'Corporate Agent', 'Netrunner', 'Solo Operative',
    'Tech Specialist', 'Bio-Enhanced', 'Chrome Warrior', 'Data Ghost'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    name: `Avatar-${i + 1}`,
    userId: `user-${randomUUID()}`,
    augmentations: augmentations.slice(0, Math.floor(Math.random() * 4) + 1),
    cyberpunkStyle: cyberpunkStyles[i % cyberpunkStyles.length],
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));
};

// 🎯 PRODUCT MOCK DATA GENERATORS
export const getExampleProductIdeas = (): string[] => {
  return [
    "smart coffee maker with AI barista",
    "wireless charging mat with holographic display",
    "bluetooth headphones with neural translation",
    "smart mirror with AR fashion try-on",
    "robotic pet with emotional AI",
    "quantum-encrypted smartphone",
    "bio-luminescent plant mood lighting",
    "neural-linked gaming controller",
    "autonomous delivery drone",
    "holographic keyboard projector",
    "ai-powered fitness tracker",
    "quantum storage device",
    "bio-enhanced contact lenses",
    "neural memory expansion chip",
    "cyber-secured wallet implant",
    "ai consciousness backup drive",
    "quantum tunneling communicator",
    "bio-reactive skin sensors",
    "neural dream recorder",
    "cyber-enhanced reality goggles"
  ];
};

// 🔧 UTILITY FUNCTIONS
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateMockId = (): string => randomUUID();

export const getRandomCyberpunkName = (): string => {
  const prefixes = ['Neural', 'Cyber', 'Quantum', 'Bio', 'Chrome', 'Neo', 'Digital', 'Virtual'];
  const suffixes = ['Tech', 'Ware', 'Core', 'Unit', 'System', 'Device', 'Interface', 'Module'];
  
  return `${getRandomItem(prefixes)}-${getRandomItem(suffixes)}`;
};

/**
 * 🎯 CENTRALIZED MOCK DATA EXPORT
 * All mock data functions consolidated in one place for better maintainability
 */
export const mockDataGenerators = {
  inventory: generateMockInventoryItems,
  suppliers: generateMockSuppliers,
  reorderSuggestions: generateMockReorderSuggestions,
  alerts: generateMockAlerts,
  threats: generateMockThreats,
  userProfiles: generateMockUserProfiles,
  transactions: generateMockTransactions,
  virtualWorlds: generateMockVirtualWorlds,
  virtualStores: generateMockVirtualStores,
  avatars: generateMockAvatars,
  productIdeas: getExampleProductIdeas
} as const;