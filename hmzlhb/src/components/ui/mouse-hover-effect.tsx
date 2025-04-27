"use client";

import { useEffect, useRef, useState } from "react";

interface MouseHoverEffectProps {
  className?: string;
  hoverElementsSelector?: string;
  hoverScale?: number;
  magneticEffect?: boolean;
}

export default function MouseHoverEffect({
  className = "",
  hoverElementsSelector = "a, button, .hover-effect",
  hoverScale = 1.5,
  magneticEffect = true,
}: MouseHoverEffectProps) {
  const [cursorType, setCursorType] = useState<"default" | "hover">("default");
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Update cursor position
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const addMagneticEffect = (element: Element) => {
      if (!magneticEffect) return;

      element.addEventListener("mousemove", (e: MouseEvent) => {
        const { left, top, width, height } = (element as HTMLElement).getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        // Calculate distance from mouse to center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        // Move the element slightly towards the cursor (magnetic effect)
        const element_strength = 10; // Lower = stronger pull
        (element as HTMLElement).style.transform = `translate(${distanceX / element_strength}px, ${distanceY / element_strength}px)`;
      });

      element.addEventListener("mouseleave", () => {
        // Reset position on mouse leave
        (element as HTMLElement).style.transform = "";
      });
    };

    const handleMouseEnter = () => {
      setCursorType("hover");
    };

    const handleMouseLeave = () => {
      setCursorType("default");
    };

    window.addEventListener("mousemove", onMouseMove);

    // Apply event listeners to all hoverable elements
    const hoverElements = document.querySelectorAll(hoverElementsSelector);
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      addMagneticEffect(element);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      hoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [hoverElementsSelector, magneticEffect]);

  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-300 rounded-full will-change-transform ${className}`}
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
        transform: `translate(-50%, -50%) scale(${cursorType === "hover" ? hoverScale : 1})`,
        width: "12px",
        height: "12px",
        backgroundColor: "white",
      }}
    />
  );
}