"use client";

import { useEffect, useRef, useCallback } from 'react';

// Interface for star properties
interface Star {
  x: number; // 3D X position
  y: number; // 3D Y position
  z: number; // 3D Z position (depth)
  baseSize: number; // Intrinsic size
  baseOpacity: number; // Intrinsic opacity/brightness
  color: string; // Star color
  twinkleSpeed: number; // Speed of twinkle effect
  twinkleOffset: number; // Phase offset for twinkling
}

// Component props interface
interface StarFieldProps {
  starCount?: number; // Number of stars
  starColorPalette?: string[]; // Array of possible star colors
  baseSpeed?: number; // Base speed for star drift animation
  scrollFactor?: number; // How much scroll affects rotation/movement (optional)
  fov?: number; // Field of View for perspective projection
  twinkleIntensity?: number; // How much stars twinkle (0 to 1)
  backgroundColor?: string; // Canvas background color (e.g., 'rgba(0, 0, 10, 0.1)' for trails, '#000000' for solid black)
}

export default function StarField({
  starCount = 800, // Increased default for a denser field
  starColorPalette = ['#FFFFFF', '#FFFFE0', '#D4F1F9', '#FFE4C4'], // White, pale yellow, light blue, bisque
  baseSpeed = 0.02, // Slow drift speed
  scrollFactor = 0, // Set to 0 to disable scroll effect by default, or e.g., 0.1 to enable
  fov = 300, // Field of view - lower means more perspective distortion
  twinkleIntensity = 0.5, // Moderate twinkling
  backgroundColor = '#000000' // Default to solid black for better realism
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  // Using ref for scroll progress to avoid re-triggering useEffect on scroll
  const scrollProgressRef = useRef<number>(0);

  // Initialize or re-initialize stars
  const initStars = useCallback(() => {
    starsRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maxZ = Math.max(canvas.width, canvas.height); // Use canvas size for Z range

    for (let i = 0; i < starCount; i++) {
      starsRef.current.push({
        x: Math.random() * 2 - 1, // Normalized coordinates (-1 to 1)
        y: Math.random() * 2 - 1, // Normalized coordinates (-1 to 1)
        z: Math.random() * maxZ,   // Depth from 0 up to maxZ
        baseSize: Math.random() * 1.5 + 0.5, // Base size (0.5 to 2.0)
        baseOpacity: Math.random() * 0.5 + 0.5, // Base opacity (0.5 to 1.0)
        color: starColorPalette[Math.floor(Math.random() * starColorPalette.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.01, // Random twinkle speed
        twinkleOffset: Math.random() * Math.PI * 2 // Random start phase for twinkle
      });
    }
    // Sort stars by Z initially (optional, can help with occlusion if needed)
    starsRef.current.sort((a, b) => a.z - b.z);
  }, [starCount, starColorPalette]); // Dependencies for star initialization

  // Animation loop
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Clear canvas ---
    // Use the specified background color. For trails, use rgba with low alpha.
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Calculate projection center ---
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxZ = Math.max(canvas.width, canvas.height); // Consistent Z range

    // --- Update and Draw Stars ---
    starsRef.current.forEach(star => {
      // Move star closer to the viewer (or further if baseSpeed is negative)
      star.z -= baseSpeed;

      // --- Reset star if it goes behind the viewer or too far ---
      // If star moves behind the viewer (z <= 0), reset it to the back.
      if (star.z <= 0) {
        star.z = maxZ; // Reset to the furthest depth
        star.x = Math.random() * 2 - 1; // Give it a new random X position
        star.y = Math.random() * 2 - 1; // Give it a new random Y position
      }
      // Optional: Reset if it goes beyond maxZ (if baseSpeed is negative)
      // if (star.z > maxZ) {
      //   star.z = 0;
      //   star.x = Math.random() * 2 - 1;
      //   star.y = Math.random() * 2 - 1;
      // }


      // --- Perspective Projection ---
      // Avoid division by zero or very small numbers when star is close to FOV plane
      const perspectiveFactor = fov / (fov + star.z);

      // Project 3D position to 2D screen coordinates
      // The star's normalized x/y (-1 to 1) are scaled by the largest dimension and perspective
      const projectedX = star.x * centerX * perspectiveFactor + centerX;
      const projectedY = star.y * centerY * perspectiveFactor + centerY;

      // Calculate size based on perspective and base size
      const projectedSize = star.baseSize * perspectiveFactor;

      // --- Twinkling Effect ---
      // Use sine wave based on time and star's speed/offset for smooth twinkling
      const twinkleFactor = (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2; // Range 0 to 1
      const currentOpacity = star.baseOpacity * (1 - twinkleIntensity + twinkleIntensity * twinkleFactor);

      // --- Draw Star ---
      // Only draw if the star is visible (within bounds and has positive size/opacity)
      if (
        projectedX >= 0 && projectedX <= canvas.width &&
        projectedY >= 0 && projectedY <= canvas.height &&
        projectedSize > 0 && currentOpacity > 0
      ) {
        // Set color and calculated opacity
        // Convert base hex color and apply calculated opacity
        const r = parseInt(star.color.slice(1, 3), 16);
        const g = parseInt(star.color.slice(3, 5), 16);
        const b = parseInt(star.color.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;

        // Draw the star (circle)
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(animate);

  }, [baseSpeed, fov, twinkleIntensity, backgroundColor]); // Dependencies for animation logic

  // Effect for initialization, resize handling, and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize observer is generally better than window resize listener for canvas
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        // Re-initialize stars on resize to adapt Z range and prevent stretching
        initStars();
      }
    });

    resizeObserver.observe(canvas);

    // --- Scroll Handling (Optional) ---
    let scrollListener: (() => void) | null = null;
    if (scrollFactor > 0) { // Only add listener if scrollFactor is used
        scrollListener = () => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          scrollProgressRef.current = docHeight > 0 ? scrollY / docHeight : 0;
          // Note: Scroll effect logic (like rotation) was removed for simplicity,
          // but could be added back here, modifying star.x/y/z based on scrollProgressRef.current
        };
        window.addEventListener('scroll', scrollListener);
        scrollListener(); // Initial call
    }


    // --- Start Animation ---
    // Pass performance.now() or Date.now() initially if needed by animate function
    animationFrameRef.current = requestAnimationFrame(animate);

    // --- Cleanup ---
    return () => {
      resizeObserver.disconnect();
      if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
    // initStars should be called within the effect after canvas dimensions are set
    // but since ResizeObserver handles initial size, we call it there.
    // If not using ResizeObserver, call initStars() here after setting initial size.

  }, [initStars, animate, scrollFactor]); // Add scrollFactor dependency

  return (
    <canvas
      ref={canvasRef}
      // Ensure canvas stretches to fill its container.
      // The parent element should define the actual size and position.
      // Using fixed positioning and z-index to place it behind other content.
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
      // Style is applied directly for background transparency if needed,
      // but background is now handled by fillRect in animate.
      // style={{ backgroundColor: 'transparent' }} // Keep if parent needs to show through
    />
  );
}
