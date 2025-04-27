// Animation utility functions for the portfolio

// Add fadeIn animation to an element
export function fadeIn(element: HTMLElement, delay: number = 0) {
    element.style.opacity = '0';
    element.style.transition = `opacity 1s ease ${delay}s`;
    
    // Force a reflow to ensure the initial state is applied
    void element.offsetWidth;
    
    element.style.opacity = '1';
  }
  
  // Add fadeInUp animation to an element
  export function fadeInUp(element: HTMLElement, delay: number = 0, distance: number = 30) {
    element.style.opacity = '0';
    element.style.transform = `translateY(${distance}px)`;
    element.style.transition = `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`;
    
    // Force a reflow to ensure the initial state is applied
    void element.offsetWidth;
    
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }
  
  // Add staggered animation to a set of elements
  export function staggerElements(
    elements: NodeListOf<HTMLElement> | HTMLElement[], 
    animationFn: (el: HTMLElement, delay: number) => void, 
    staggerDelay: number = 0.15
  ) {
    Array.from(elements).forEach((element, index) => {
      const delay = index * staggerDelay;
      animationFn(element, delay);
    });
  }
  
  // Intersection Observer helper for scroll-triggered animations
  export function createScrollAnimation(
    selector: string,
    animationFn: (el: HTMLElement) => void,
    options: IntersectionObserverInit = { threshold: 0.2 }
  ) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animationFn(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe all elements matching the selector
    document.querySelectorAll<HTMLElement>(selector).forEach(element => {
      observer.observe(element);
    });
    
    return observer;
  }