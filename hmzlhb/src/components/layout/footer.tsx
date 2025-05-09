"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyFooter() {
  const [currentTime, setCurrentTime] = useState("");
  const [timezone, setTimezone] = useState("");
  
  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      setCurrentTime(`${hours}:${minutes}`);
      
      // Get timezone offset
      const offset = -now.getTimezoneOffset() / 60;
      const tzString = `GMT${offset >= 0 ? '+' : ''}${offset}`;
      setTimezone(tzString);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-100 dark:border-gray-900 bg-background/80 backdrop-blur-md z-40 flex items-center">
      <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-xs tracking-wider uppercase opacity-70">Morocco</span>
          </div>
        </div>
        
        <div className="text-xs tracking-wider opacity-70">
          {currentTime} {timezone}
        </div>
        
        <div className="flex items-center gap-8">
          <Link 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs tracking-wider uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            LINKEDIN
          </Link>
          <Link 
            href="https://behance.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs tracking-wider uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            BEHANCE
          </Link>
        </div>
      </div>
    </footer>
  );
}