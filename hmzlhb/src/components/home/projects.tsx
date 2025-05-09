"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import Container from "../ui/container";

// Define project type
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imagePath: string; // Path to image in public directory
  link: string;
  category: string;
}

// Project data with correct image paths
const projects: Project[] = [
  {
    id: "marie-mberroho",
    title: "Marie Mberroho Portfolio",
    description: "Professional portfolio website for an artist showcasing their work and achievements.",
    tags: ["WordPress", "UI/UX", "Web Design"],
    imagePath: "/image.png", // Placeholder until real images are added
    link: "https://mariemberroho.com",
    category: "WordPress"
  },
  {
    id: "africa-tree",
    title: "Africa Tree Foundation",
    description: "Donation collection platform for environmental conservation efforts across Africa.",
    tags: ["WordPress", "Donation Platform", "Non-profit"],
    imagePath: "/placeholder.jpg",
    link: "https://africatree.org",
    category: "WordPress"
  },
  {
    id: "tangier-tours",
    title: "Tangier Day Tours",
    description: "Booking platform for guided tours with integrated payment processing system.",
    tags: ["PHP", "MySQL", "Stripe API", "JavaScript"],
    imagePath: "/placeholder.jpg",
    link: "#", // Using hash to avoid invalid URL issues
    category: "Custom PHP"
  },
  {
    id: "mundi-media",
    title: "Mundi Media",
    description: "Showcase website for a film production company featuring their portfolio and services.",
    tags: ["HTML", "JavaScript", "PHP", "MySQL", "SASS"],
    imagePath: "/placeholder.jpg",
    link: "#",
    category: "Web Development"
  },
  {
    id: "daddy-shop",
    title: "Daddy Shop",
    description: "Catalog website with custom media upload functionality and folder display systems.",
    tags: ["TypeScript", "React", "Node.js"],
    imagePath: "/placeholder.jpg",
    link: "#",
    category: "TypeScript"
  },
  {
    id: "boutique-street",
    title: "Boutique Street",
    description: "E-commerce clothing website with product catalogs, cart functionality, and secure checkout.",
    tags: ["Shopify", "E-commerce", "Custom Theme"],
    imagePath: "/placeholder.jpg",
    link: "https://boutiquestreet.store",
    category: "Shopify"
  },
];

// Animation functions
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
    }, index * delayIncrement * 1000);
  });
};

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
      staggerElements(projectElements as NodeListOf<HTMLElement>, fadeInUp, 0.1);
    }
  }, [inView]);
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-100 dark:bg-black" style={{ zIndex: 5 }}></div>
      
      <section 
        id="projects" 
        ref={sectionRef}
        className="py-20 md:py-28 bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 relative"
        style={{ zIndex: 6, position: 'relative' }}
      >
        <Container>
          <div className="mb-16 text-center md:text-left md:flex md:justify-between md:items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wide">
                Our Projects
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
                A selection of our most loved and passionate work.
              </p>
            </div>
          </div>
          
          <div 
            ref={projectsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" 
          >
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card flex flex-col bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-lime-500/10 transition-all duration-300 opacity-0 group"
              >
                {/* Image container */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {/* Temporary display: Use a div with project title until images are properly set up */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg font-medium">
                    {project.title}
                  </div>
                  
                  {/* Commented out Next Image component until image URLs are fixed */}
                  {/* 
                  <Image 
                    src={project.imagePath}
                    alt={`Project: ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={90}
                    priority={projects.indexOf(project) < 2}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  */}
                </div>
                
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider font-medium">
                      {project.tags.join(' • ')} 
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-base leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Link element - Ensure URL is valid */}
                  {project.link && project.link !== "#" ? (
                    <Link 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-lime-500 dark:hover:text-lime-400 transition-colors group"
                    >
                      View Project
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /> 
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center text-sm font-medium text-gray-400 dark:text-gray-500">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-lime-500 hover:text-black dark:hover:bg-lime-400 dark:hover:text-black hover:border-lime-500 dark:hover:border-lime-400 transition-all duration-300 group"
            >
              View All Projects
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}