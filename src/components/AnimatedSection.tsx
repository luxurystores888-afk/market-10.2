import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add GSAP animation setup
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        // Add any other properties needed
      }
    });
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
