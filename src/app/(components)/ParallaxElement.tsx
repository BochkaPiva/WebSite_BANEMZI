"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  offset?: [string, string];
}

export default function ParallaxElement({ 
  children, 
  speed = 0.5, 
  direction = 'up',
  className = '',
  offset = ['start end', 'end start']
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset
  });

  // Вычисляем направление движения
  const upTransform = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const downTransform = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const leftTransform = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const rightTransform = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const baseTransform = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  
  const getTransform = () => {
    switch (direction) {
      case 'up':
        return upTransform;
      case 'down':
        return downTransform;
      case 'left':
        return leftTransform;
      case 'right':
        return rightTransform;
      default:
        return baseTransform;
    }
  };

  const y = direction === 'up' || direction === 'down' ? getTransform() : 0;
  const x = direction === 'left' || direction === 'right' ? getTransform() : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: direction === 'up' || direction === 'down' ? y : 0,
        x: direction === 'left' || direction === 'right' ? x : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
