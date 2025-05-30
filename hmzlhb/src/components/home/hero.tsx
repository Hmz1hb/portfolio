"use client";

import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Container from "../ui/container";
import ComputerObject from "../3d/ComputerObject";
import StarField from "../3d/StarField";
import ClientOnly from "../ui/client-only";
import { fadeInUp, staggerElements } from "@/lib/animations";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  // Add scroll and animation effects
  useEffect(() => {
    // Initial animations
    const title = titleRef.current;
    const description = descriptionRef.current;
    const buttons = buttonsRef.current?.querySelectorAll('a');
    
    if (title) fadeInUp(title, 0.2, 30);
    if (description) fadeInUp(description, 0.5, 30);
    if (buttons) staggerElements(buttons, fadeInUp, 0.2);
    
    // Scroll observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const heroElement = heroRef.current;
    if (heroElement) {
      observer.observe(heroElement);
    }
    
    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  }, []);
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center opacity-0 transition-all duration-1000"
    >
      {/* Add StarField background wrapped in ClientOnly */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ClientOnly>
          <StarField 
            starCount={400} 
            baseSpeed={0.015} 
            twinkleIntensity={0.6}
            backgroundColor="transparent" 
          />
        </ClientOnly>
      </div>
      
      {/* 3D Object Container - positioned behind content on mobile, to the right on desktop */}
      <div className="absolute inset-0 z-1 flex items-center justify-center md:justify-end">
        <div className="w-full md:w-1/2 h-full opacity-30 md:opacity-100">
          <ComputerObject />
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <Container className="pt-20 pb-16 relative z-10">
        <div className="max-w-4xl relative">
          <h1 
            ref={titleRef}
            className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tight mb-6 opacity-0"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Hamza
          </h1>
          
          <p 
            ref={descriptionRef}
            className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md opacity-0 bg-background/70 dark:bg-background/70 backdrop-blur-sm md:backdrop-blur-none md:bg-transparent dark:md:bg-transparent p-2 md:p-0 rounded"
          >
            HELLO THERE — I'M HAMZA, A DEVELOPER & AI ARTIST
            MERGING TECHNOLOGY WITH CREATIVITY TO BUILD 
            AWARD-WINNING DIGITAL EXPERIENCES
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              href="/#projects" 
              variant="outline" 
              size="lg"
              className="border-black dark:border-white hover:bg-transparent group"
            >
              <span className="mr-2">SCROLL TO EXPLORE</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Small decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 text-black dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 text-black dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L15 9H22L16 14L18 22L12 17L6 22L8 14L2 9H9L12 1Z" />
        </svg>
      </div>
    </section>
  );
}