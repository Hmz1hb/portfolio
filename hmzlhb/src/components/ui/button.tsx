import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  external?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  external = false,
}: ButtonProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Detect dark mode
  useEffect(() => {
    // Initial check
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Create observer to watch for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
  
  // Base styles
  const baseStyles = "rounded-full font-medium transition-colors inline-flex items-center justify-center";
  
  // Size variations
  const sizeStyles = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3",
  };
  
  // Light mode variant styles
  const lightVariantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white hover:text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900",
    outline: "border-2 border-gray-500 hover:border-gray-500 bg-transparent hover:bg-gray-100 text-gray-800 hover:text-gray-900",
  };
  
  // Dark mode variant styles
  const darkVariantStyles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white hover:text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white hover:text-white",
    outline: "border-2 border-gray-400 hover:border-gray-300 bg-transparent hover:bg-gray-800 text-white hover:text-white",
  };
  
  // Choose the right variant based on current mode
  const variantStyles = isDarkMode ? darkVariantStyles : lightVariantStyles;
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  
  // Disabled styles
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  // If href is provided, render as Link
  if (href) {
    const linkProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
      
    return (
      <Link 
        href={href}
        className={`${buttonStyles} ${disabledStyles}`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button
      type={type}
      className={`${buttonStyles} ${disabledStyles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}