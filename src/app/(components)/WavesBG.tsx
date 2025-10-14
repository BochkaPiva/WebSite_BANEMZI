"use client";
import { useEffect, useState } from 'react';

export default function WavesBG() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD166">
              {mounted && (<animate attributeName="offset" values="0;0.1;0" dur="8s" repeatCount="indefinite" />)}
            </stop>
            <stop offset="50%" stopColor="#FF9A3C">
              {mounted && (<animate attributeName="offset" values="0.5;0.6;0.5" dur="8s" repeatCount="indefinite" />)}
            </stop>
            <stop offset="100%" stopColor="#FF6B00">
              {mounted && (<animate attributeName="offset" values="1;0.9;1" dur="8s" repeatCount="indefinite" />)}
            </stop>
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        <path d="M-100 200 C 200 50, 600 350, 900 150 S 1500 -50, 1700 200 L 1700 0 L -100 0 Z" fill="url(#grad1)" filter="url(#blur)" opacity="0.4">
          {mounted && (<animate attributeName="d" dur="12s" repeatCount="indefinite" values="M-100 200 C 200 50, 600 350, 900 150 S 1500 -50, 1700 200 L 1700 0 L -100 0 Z; M-100 220 C 220 120, 620 280, 920 200 S 1500 0, 1700 180 L 1700 0 L -100 0 Z; M-100 200 C 200 50, 600 350, 900 150 S 1500 -50, 1700 200 L 1700 0 L -100 0 Z" />)}
        </path>
        <path d="M-100 800 C 200 650, 600 950, 900 750 S 1500 550, 1700 800 L 1700 900 L -100 900 Z" fill="url(#grad1)" filter="url(#blur)" opacity="0.35">
          {mounted && (<animate attributeName="d" dur="14s" repeatCount="indefinite" values="M-100 800 C 200 650, 600 950, 900 750 S 1500 550, 1700 800 L 1700 900 L -100 900 Z; M-100 780 C 210 700, 610 900, 920 820 S 1500 600, 1700 820 L 1700 900 L -100 900 Z; M-100 800 C 200 650, 600 950, 900 750 S 1500 550, 1700 800 L 1700 900 L -100 900 Z" />)}
        </path>
      </svg>
    </div>
  );
}


