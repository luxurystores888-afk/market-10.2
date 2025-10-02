import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add GSAP animation setup
  useEffect(() => {
    gsap.to(element, { scrollTrigger: { ... } });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
