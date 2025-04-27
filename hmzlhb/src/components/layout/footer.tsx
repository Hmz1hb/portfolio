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
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      // Get timezone offset
      const offset = -now.getTimezoneOffset() / 60;
      const tzString = `GMT${offset >= 0 ? '+' : ''}${offset}`;
      setTimezone(tzString);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 dark:border-gray-800 bg-background z-40 flex items-center">
      <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-sm">CANADA</span>
          </div>
        </div>
        
        <div className="text-sm">
          {currentTime} {timezone}
        </div>
        
        <div className="flex items-center gap-8">
          <Link 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-blue-600 transition-colors"
          >
            LINKEDIN
          </Link>
          <Link 
            href="https://behance.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-blue-600 transition-colors"
          >
            BEHANCE
          </Link>
        </div>
      </div>
    </footer>
  );
}