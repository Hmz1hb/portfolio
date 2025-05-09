"use client";

import { useEffect, useRef } from 'react';

// Interface for star properties
interface Star {
  x: number;
  y: number;
  z: number;
  baseSize: number;
  baseOpacity: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
}

// Component props interface
interface StarFieldProps {
  starCount?: number;
  starColorPalette?: string[];
  baseSpeed?: number;
  scrollFactor?: number;
  fov?: number;
  twinkleIntensity?: number;
  backgroundColor?: string;
}

export default function StarField({
  starCount = 800,
  starColorPalette = ['#FFFFFF', '#FFFFE0', '#D4F1F9', '#FFE4C4'],
  baseSpeed = 0.02,
  scrollFactor = 0,
  fov = 300,
  twinkleIntensity = 0.5,
  backgroundColor = '#000000'
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(0);
  
  // Initialize stars on client-side only
  useEffect(() => {
    // Setup canvas and initialize stars
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set initial canvas size
    const updateCanvasSize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    updateCanvasSize();
    
    // Initialize stars
    const initStars = () => {
      starsRef.current = [];
      const maxZ = Math.max(canvas.width, canvas.height);
      
      const seedRandom = (seed: number) => {
        return function() {
          const x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        };
      };
      
      // Use a deterministic random generator with fixed seed
      const random = seedRandom(12345);
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: random() * 2 - 1,
          y: random() * 2 - 1,
          z: random() * maxZ,
          baseSize: random() * 1.5 + 0.5,
          baseOpacity: random() * 0.5 + 0.5,
          color: starColorPalette[Math.floor(random() * starColorPalette.length)],
          twinkleSpeed: random() * 0.03 + 0.01,
          twinkleOffset: random() * Math.PI * 2
        });
      }
      
      starsRef.current.sort((a, b) => a.z - b.z);
    };
    
    initStars();
    
    // Animation function
    const animate = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate projection center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxZ = Math.max(canvas.width, canvas.height);

      // Update and Draw Stars
      starsRef.current.forEach(star => {
        // Move star closer to the viewer
        star.z -= baseSpeed;

        // Reset star if it goes behind the viewer
        if (star.z <= 0) {
          star.z = maxZ;
          star.x = Math.random() * 2 - 1;
          star.y = Math.random() * 2 - 1;
        }

        // Perspective Projection
        const perspectiveFactor = fov / (fov + star.z);

        // Project 3D position to 2D screen coordinates
        const projectedX = star.x * centerX * perspectiveFactor + centerX;
        const projectedY = star.y * centerY * perspectiveFactor + centerY;

        // Calculate size based on perspective and base size
        const projectedSize = star.baseSize * perspectiveFactor;

        // Twinkling Effect
        const twinkleFactor = (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
        const currentOpacity = star.baseOpacity * (1 - twinkleIntensity + twinkleIntensity * twinkleFactor);

        // Draw Star if visible
        if (
          projectedX >= 0 && projectedX <= canvas.width &&
          projectedY >= 0 && projectedY <= canvas.height &&
          projectedSize > 0 && currentOpacity > 0
        ) {
          // Set color and calculated opacity
          const r = parseInt(star.color.slice(1, 3), 16);
          const g = parseInt(star.color.slice(3, 5), 16);
          const b = parseInt(star.color.slice(5, 7), 16);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;

          // Draw the star
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Setup resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
      initStars(); // Re-initialize stars on resize
    });
    
    resizeObserver.observe(canvas);

    // Optional scroll handler
    let scrollListener: (() => void) | null = null;
    if (scrollFactor > 0) {
      scrollListener = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgressRef.current = docHeight > 0 ? scrollY / docHeight : 0;
      };
      window.addEventListener('scroll', scrollListener);
      scrollListener();
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [starCount, starColorPalette, baseSpeed, fov, twinkleIntensity, backgroundColor, scrollFactor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
}