"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ProjectGalleryModalProps {
  isOpen: boolean;
  images: string[];
  projectTitle: string;
  onClose: () => void;
}

export default function ProjectGalleryModal({
  isOpen,
  images,
  projectTitle,
  onClose,
}: ProjectGalleryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reset current image when gallery opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setCurrentImageIndex(prev => 
            prev === 0 ? images.length - 1 : prev - 1
          );
          break;
        case "ArrowRight":
          setCurrentImageIndex(prev => 
            prev === images.length - 1 ? 0 : prev + 1
          );
          break;
        case "Escape":
          onClose();
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length, onClose]);
  
  if (!isOpen) return null;
  
  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full mx-auto bg-zinc-900 border border-zinc-700 rounded"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-lg font-light text-white">{projectTitle}</h3>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close gallery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Gallery main image */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={`${projectTitle} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              unoptimized={images[currentImageIndex].endsWith('.webp') || images[currentImageIndex].endsWith('.gif')}
            />
            
            {/* Animated indicator for WebP or GIF */}
            {(images[currentImageIndex].includes('.webp') || images[currentImageIndex].includes('.gif')) && (
              <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Animated</span>
              </div>
            )}
          </div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="p-4 border-t border-zinc-800 overflow-x-auto">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 flex-shrink-0 border-2 transition-all ${
                    currentImageIndex === index 
                      ? "border-blue-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${projectTitle} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={image.endsWith('.webp') || image.endsWith('.gif')}
                  />
                  {/* Animated indicator for WebP or GIF thumbnails */}
                  {(image.includes('.webp') || image.includes('.gif')) && (
                    <div className="absolute bottom-0 right-0 bg-black/70 p-0.5 rounded-tl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Image counter */}
        <div className="absolute top-4 right-16 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}