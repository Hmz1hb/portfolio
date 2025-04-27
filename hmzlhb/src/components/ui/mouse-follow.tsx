"use client";

import { useEffect, useState } from "react";

interface MouseFollowProps {
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  delay?: number;
}

export default function MouseFollow({
  size = 250,
  color = "#3b82f6",
  blur = 100,
  opacity = 0.15,
  delay = 0.08,
}: MouseFollowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);
      
      // Reset the timeout on each mouse move
      clearTimeout(moveTimeout);
      isMoving = true;
      
      // Set a timeout to detect when movement stops
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const animate = () => {
      // Only update position if the cursor is moving
      if (isMoving || Math.abs(mouseX - cursorX) > 0.1 || Math.abs(mouseY - cursorY) > 0.1) {
        // Calculate the distance to move based on delay (easing)
        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;
        
        // Update the state with the new position
        setPosition({ x: cursorX, y: cursorY });
      }
      
      requestAnimationFrame(animate);
    };

    // Start animation loop
    const animationFrame = requestAnimationFrame(animate);
    
    // Add event listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Clean up event listeners and animation frame on unmount
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(moveTimeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: color,
        opacity: opacity,
        filter: `blur(${blur}px)`,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}