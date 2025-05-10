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
  imagePath: string;
  link: string;
  category: string;
}

// Project data
const projects: Project[] = [
  {
    id: "mariem-mberroho",
    title: "Marie Mberroho Portfolio",
    description: "Professional portfolio website for an artist showcasing their work and achievements.",
    tags: ["WordPress", "UI/UX", "Web Design"],
    imagePath: "/images/marie-mberroho.webp",
    link: "https://mariemberroho.com",
    category: "WordPress"
  },
  {
    id: "africa-tree",
    title: "Africa Tree Foundation",
    description: "Donation collection platform for environmental conservation efforts across Africa.",
    tags: ["WordPress", "Donation Platform", "Non-profit"],
    imagePath: "/images/africa-tree.webp",
    link: "https://africatree.org",
    category: "WordPress"
  },
  {
    id: "tangier-tours",
    title: "Tangier Day Tours",
    description: "Booking platform for guided tours with integrated payment processing system.",
    tags: ["PHP", "MySQL", "Stripe API", "JavaScript"],
    imagePath: "/images/tangier-tours.webp",
    link: "#",
    category: "Custom PHP"
  },
  {
    id: "mundi-media",
    title: "Mundi Media",
    description: "Showcase website for a film production company featuring their portfolio and services.",
    tags: ["HTML", "JavaScript", "PHP", "MySQL", "SASS"],
    imagePath: "/images/mundi-media.webp",
    link: "#",
    category: "Web Development"
  },
  {
    id: "daddy-shop",
    title: "Daddy Shop",
    description: "Catalog website with custom media upload functionality and folder display systems.",
    tags: ["TypeScript", "React", "Node.js"],
    imagePath: "/images/daddy-shop.webp",
    link: "#",
    category: "TypeScript"
  },
  {
    id: "boutique-street",
    title: "Boutique Street",
    description: "E-commerce clothing website with product catalogs, cart functionality, and secure checkout.",
    tags: ["Shopify", "E-commerce", "Custom Theme"],
    imagePath: "/images/boutique-street.webp",
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
      {/* Opaque background shield */}
      <div className="absolute inset-0 bg-black" style={{ zIndex: 5 }}></div>
      
      <section 
        id="projects" 
        ref={sectionRef}
        className="py-20 md:py-28 bg-black text-white relative"
        style={{ zIndex: 6, position: 'relative' }}
      >
        <Container>
          {/* Section Header - Minimalist Style */}
          <div className="mb-20 border-b border-zinc-800 pb-4">
            <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wider uppercase">
              Projects
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Selected works and recent projects
            </p>
          </div>
          
          {/* Projects Grid - Modern, Minimalist Layout */}
          <div 
            ref={projectsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" 
          >
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card flex flex-col opacity-0 group"
              >
                {/* Image container - Cleaner style with proper aspect ratio */}
                <div className="relative aspect-[4/3] w-full mb-4 overflow-hidden bg-zinc-900 border border-zinc-800">
                  {/* Fallback display */}
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-light z-0">
                    {project.title}
                  </div>
                  
                  {/* Image with hover effect */}
                  <Image 
                    src={project.imagePath}
                    alt={`Project: ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 z-10"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Text content - Minimalist style */}
                <div className="flex-1 flex flex-col">
                  {/* Project Number + Title */}
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xs text-zinc-500 font-mono">
                      {(projects.indexOf(project) + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-light text-white">
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* Tags */}
                  <div className="text-xs text-zinc-500 mb-2 font-light">
                    {project.tags.slice(0, 3).join(' • ')}
                  </div>

                  {/* Link - Minimal style */}
                  {project.link && project.link !== "#" ? (
                    <Link 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-xs font-light text-zinc-400 hover:text-white hover:underline transition-colors group inline-flex items-center"
                    >
                      View Project
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /> 
                      </svg>
                    </Link>
                  ) : (
                    <span className="mt-auto text-xs font-light text-zinc-600">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Button - Minimalist style */}
          <div className="mt-20 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-2 border border-zinc-800 rounded-none text-sm font-light text-zinc-300 hover:bg-zinc-800 transition-all duration-300 group tracking-wide"
            >
              View All Work
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1}
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