"use client";

import { useEffect, useRef } from "react";
import Image from "next/image"; // Keep Image import if you plan to use it
import Link from "next/link";
import { useInView } from "react-intersection-observer";
// Assuming Container is a simple wrapper component like <div className="container mx-auto px-4">{children}</div>
// If not, adjust styling within Container or replace it with standard divs.
// import Container from "../ui/container"; 
// Assuming animations are defined elsewhere
// import { fadeInUp, staggerElements } from "@/lib/animations"; 

// Define project type (assuming this interface is correct)
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string; // Placeholder image URL for now
  link: string;
  category: string; // Used for filtering or display
}

// Project data (using placeholders for imageUrl)
const projects: Project[] = [
  {
    id: "marie-mberroho",
    title: "Marie Mberroho Portfolio",
    description: "Professional portfolio website for an artist showcasing their work and achievements.",
    tags: ["WordPress", "UI/UX", "Web Design"],
    // Replace with actual image paths or use placeholders
    imageUrl: "https://placehold.co/600x400/18181b/a3e635?text=Marie+Mberroho", 
    link: "https://mariemberroho.com",
    category: "WordPress"
  },
  {
    id: "africa-tree",
    title: "Africa Tree Foundation",
    description: "Donation collection platform for environmental conservation efforts across Africa.",
    tags: ["WordPress", "Donation Platform", "Non-profit"],
    imageUrl: "https://placehold.co/600x400/18181b/a3e635?text=Africa+Tree",
    link: "https://africatree.org",
    category: "WordPress"
  },
  {
    id: "tangier-tours",
    title: "Tangier Day Tours",
    description: "Booking platform for guided tours with integrated payment processing system.",
    tags: ["PHP", "MySQL", "Stripe API", "JavaScript"],
    imageUrl: "https://placehold.co/600x400/18181b/a3e635?text=Tangier+Tours",
    link: "#", // Use actual link if available
    category: "Custom PHP"
  },
  {
    id: "mundi-media",
    title: "Mundi Media",
    description: "Showcase website for a film production company featuring their portfolio and services.",
    tags: ["HTML", "JavaScript", "PHP", "MySQL", "SASS"],
    imageUrl: "https://placehold.co/600x400/18181b/a3e635?text=Mundi+Media",
    link: "#", // Use actual link if available
    category: "Web Development"
  },
  {
    id: "daddy-shop",
    title: "Daddy Shop",
    description: "Catalog website with custom media upload functionality and folder display systems.",
    tags: ["TypeScript", "React", "Node.js"],
    imageUrl: "https://placehold.co/600x400/18181b/a3e635?text=Daddy+Shop",
    link: "#", // Use actual link if available
    category: "TypeScript"
  },
  {
    id: "boutique-street",
    title: "Boutique Street",
    description: "E-commerce clothing website with product catalogs, cart functionality, and secure checkout.",
    tags: ["Shopify", "E-commerce", "Custom Theme"],
    imageUrl: "https://placehold.co/600x400/18181b/a3e635?text=Boutique+Street",
    link: "https://boutiquestreet.store",
    category: "Shopify"
  },
  // Add other projects similarly...
];

// Dummy animation functions if not imported
const fadeInUp = (element: HTMLElement) => {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
  element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
};

const staggerElements = (elements: NodeListOf<HTMLElement>, animationFn: (el: HTMLElement) => void, delayIncrement: number) => {
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      animationFn(el);
    }, index * delayIncrement * 1000); // delayIncrement in seconds
  });
};

// Dummy Container component if not imported
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);


export default function Projects() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const projectsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Trigger animation when the section is in view
    if (inView && projectsRef.current) {
      const projectElements = projectsRef.current.querySelectorAll('.project-card');
      // Apply stagger animation effect
      staggerElements(projectElements as NodeListOf<HTMLElement>, fadeInUp, 0.1);
    }
  }, [inView]);
  
  return (
    // Section container with dark background and padding
    <section 
      id="projects" 
      ref={sectionRef}
      // Prioritize dark theme from reference image, light theme uses dark gray
      className="py-20 md:py-28 bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left md:flex md:justify-between md:items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wide">
              Our Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
              A selection of our most loved and passionate work.
            </p>
          </div>
          {/* Optional: Add a link/button on the right for larger screens if needed */}
        </div>
        
        {/* Projects Grid */}
        <div 
          ref={projectsRef}
          // Responsive grid layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" 
        >
          {projects.map((project) => (
            <div 
              key={project.id} 
              // Project card styling: dark background, rounded corners, subtle border
              // Initial state for animation: opacity-0
              className="project-card flex flex-col bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-lime-500/10 transition-all duration-300 opacity-0 group"
            >
              {/* Image container */}
              <div className="relative h-60 w-full overflow-hidden">
                {/* Use Next Image or standard img tag */}
                 {/* Using standard img for simplicity with placeholder */}
                 <img 
                   src={project.imageUrl}
                   alt={`Image for ${project.title}`}
                   // Basic error handling for images
                   onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/ef4444/ffffff?text=Image+Error')}
                   className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                 />
                {/* Uncomment and configure Next Image if preferred and setup */}
                {/* <Image 
                  src={project.imageUrl} // Ensure these paths are correct in your project
                  alt={project.title}
                  fill // Use fill for responsive images within a relative container
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  // Optional: Add placeholder and blurDataURL for better loading
                  // placeholder="blur" 
                  // blurDataURL="data:image/png;base64,..." // Generate a base64 placeholder
                /> */}
              </div>
              
              {/* Text content container */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  {/* Project Title */}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  
                  {/* Tags/Categories - styled like reference image */}
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider font-medium">
                    {project.tags.join(' • ')} 
                    {/* Display category if needed, separated or integrated */}
                    {/* {project.category && ` • ${project.category}`} */}
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                {/* View Project Link */}
                <Link 
                  href={project.link}
                  // Open external links in new tab
                  target={project.link.startsWith('http') ? "_blank" : "_self"}
                  rel={project.link.startsWith('http') ? "noopener noreferrer" : ""}
                  // Link styling: subtle text color, bright green on hover
                  className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-lime-500 dark:hover:text-lime-400 transition-colors group" // Added group for potential icon hover effects
                >
                  View Project
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" // Move arrow on hover
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2} // Use strokeWidth (lowercase w)
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /> 
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Optional: View All Projects Button */}
        <div className="mt-16 text-center">
          <Link
            href="/projects" // Link to your full projects page
            // Button styling: outlined, white/gray text, green hover effect
            className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-lime-500 hover:text-black dark:hover:bg-lime-400 dark:hover:text-black hover:border-lime-500 dark:hover:border-lime-400 transition-all duration-300 group"
          >
            View All Projects
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" // Move arrow on hover
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2} // Use strokeWidth (lowercase w)
            >
               <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
