import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface DemoComponentProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
}

export default function DemoComponent({ title, description, icon: Icon = Brain }: DemoComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex items-center justify-center p-8"
    >
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          {title}
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          {description}
        </p>
        <div className="text-cyan-400 text-sm">
          <Sparkles className="h-4 w-4 inline mr-2" />
          Advanced cyberpunk technology coming soon
          <Sparkles className="h-4 w-4 inline ml-2" />
        </div>
      </div>
    </motion.div>
  );
}