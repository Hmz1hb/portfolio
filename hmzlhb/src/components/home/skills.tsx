"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// --- Mock Components (Replace with your actual imports) ---
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">{children}</div>
);

const StarField = ({ starCount, color, speed, scrollFactor }: { starCount: number, color: string, speed: number, scrollFactor: number }) => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Placeholder for StarField */}
    <div className="absolute inset-0 opacity-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
          }}
        />
      ))}
    </div>
    <style jsx>{`
      @keyframes twinkle { 0% { opacity: 0.2; } 100% { opacity: 0.8; } }
    `}</style>
  </div>
);

// --- Interfaces ---
interface Skill {
  name: string;
  level: number; // Kept for potential future use (e.g., in hover details)
  category: string;
  description?: string; // Optional description for hover
}

interface BubbleState {
  id: string;
  skill: Skill;
  x: number; // Position (percentage)
  y: number; // Position (percentage)
  vx: number; // Velocity x
  vy: number; // Velocity y
  radius: number; // Radius (percentage of container width)
  isColliding: boolean; // Flag for collision visual effect
  targetScale: number; // For entrance/collision/pop animation
  isHovered: boolean; // For hover effect
  isPopping: boolean; // Flag for pop animation state
  popCount: number; // Counter for respawns
  respawnTimerId?: NodeJS.Timeout; // Store timeout ID for cleanup
}

// --- Skill Data (Added descriptions) ---
const skills: Skill[] = [
  { name: "React", level: 90, category: "frontend", description: "Building dynamic UIs" },
  { name: "Next.js", level: 85, category: "frontend", description: "SSR & SSG with React" },
  { name: "TypeScript", level: 85, category: "frontend", description: "Strongly-typed JavaScript" },
  { name: "JavaScript", level: 95, category: "frontend", description: "Core web language" },
  { name: "HTML/CSS", level: 95, category: "frontend", description: "Web structure & styling" },
  { name: "Tailwind CSS", level: 90, category: "frontend", description: "Utility-first CSS" },
  { name: "Node.js", level: 85, category: "backend", description: "Server-side JavaScript" },
  { name: "Python", level: 70, category: "backend", description: "Versatile backend language" },
  { name: "Figma", level: 85, category: "design", description: "Collaborative interface design" },
  { name: "Git", level: 85, category: "tools", description: "Version control system" },
  { name: "Docker", level: 70, category: "tools", description: "Containerization platform" },
  { name: "UI/UX", level: 85, category: "other", description: "User Interface & Experience" },
  { name: "Three.js", level: 75, category: "other", description: "3D graphics library" },
];

// --- Constants ---
const BUBBLE_BASE_SIZE_VW = 5;
const BUBBLE_SIZE_VARIATION_VW = 2;
const MIN_DISTANCE_MULTIPLIER = 1.1;
const WALL_PADDING = 1;
const BASE_SPEED = 0.03;
const RESPAWN_DELAY = 1500; // Delay in ms before bubble reappears after pop

// --- Helper Functions ---
const getRandomVelocity = () => (Math.random() - 0.5) * BASE_SPEED * 2;

// --- SkillBubble Component ---
interface SkillBubbleProps {
  bubble: BubbleState;
  containerWidth: number;
  onPop: (id: string) => void;
  onHover: (id: string, isHovering: boolean) => void;
}

const SkillBubble: React.FC<SkillBubbleProps> = React.memo(({ bubble, containerWidth, onPop, onHover }) => {
  const { id, skill, x, y, radius, isColliding, targetScale, isHovered, isPopping, popCount } = bubble;

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent click event from triggering immediately after drag/selection (optional)
    if (e.type === 'click' && (e.detail === 0 || e.detail > 1)) {
       return;
    }
    if (!isPopping) { // Prevent popping again while already popping/respawning
      onPop(id);
    }
  };

  const handleMouseEnter = () => {
    if (!isPopping) { // Don't show hover details while popping
        onHover(id, true);
    }
  };

  const handleMouseLeave = () => {
    onHover(id, false);
  };

  // Calculate size and position
  const sizePx = (radius * 2 * containerWidth) / 100;
  const displaySize = Math.max(sizePx, 30); // Min 30px diameter
  const leftPos = `calc(${x}% - ${displaySize / 2}px)`;
  const topPos = `calc(${y}% - ${displaySize / 2}px)`;

  return (
    <div
      className={`absolute cursor-pointer group transition-transform,opacity duration-300 ease-out ${
         isPopping ? 'pointer-events-none' : '' // Disable events during pop animation
      }`}
      style={{
        left: leftPos,
        top: topPos,
        width: `${displaySize}px`,
        height: `${displaySize}px`,
        transform: `scale(${targetScale})`, // Scale for animations
        opacity: isPopping ? 0 : 1, // Fade out on pop
        zIndex: isHovered ? 10 : (isPopping ? 0 : 1), // Bring hovered bubble to front
        transitionDelay: isPopping ? '0ms' : '0ms', // Control delays if needed
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={isPopping ? -1 : 0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick(e)}
      aria-label={`${skill.name} skill bubble, popped ${popCount} times`}
    >
      {/* Bubble Visual */}
      <div
        className={`relative w-full h-full rounded-full border flex items-center justify-center shadow-xl transition-all duration-300 ease-out overflow-visible
          ${isColliding ? 'border-blue-300 border-2 scale-105' : 'border-blue-500/50 border'}
          bg-gradient-radial from-blue-500/10 via-blue-600/30 to-blue-800/50 backdrop-blur-sm
          group-hover:from-blue-500/20 group-hover:via-blue-600/40 group-hover:to-blue-800/60`} // Use group-hover
      >
        {/* Inner highlight */}
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-white/20 rounded-full blur-md"></div>

        {/* Skill Name Text (always visible inside bubble) */}
        <span
          className={`text-center text-xs sm:text-sm font-medium text-white transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-70' : 'opacity-100' // Slightly dim text on hover to make tooltip clearer
          }`}
        >
          {skill.name}
        </span>

         {/* Pop Count Badge */}
         {popCount > 0 && (
             <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none shadow-md">
                 {popCount}
             </span>
         )}

        {/* Hover Tooltip */}
        <div
          className={`absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg pointer-events-none transition-all duration-200 ease-out origin-bottom
            ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}
          `}
        >
          <p className="font-semibold">{skill.name}</p>
          {skill.description && <p className="text-gray-300">{skill.description}</p>}
          {/* You could add skill.level or category here too */}
           <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div> {/* Tooltip arrow */}
        </div>
      </div>
    </div>
  );
});
SkillBubble.displayName = 'SkillBubble';

// --- Main Skills Component ---
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const animationFrameRef = useRef<number>();
  const [containerWidth, setContainerWidth] = useState(0);

  // --- Initialization ---
  useEffect(() => {
    const initialBubbles: BubbleState[] = [];
    const maxAttempts = skills.length * 20;
    const tempContainerWidth = containerRef.current?.offsetWidth || window.innerWidth;

    skills.forEach((skill, index) => {
      let placed = false;
      for (let i = 0; i < maxAttempts && !placed; i++) {
        const radiusVW = BUBBLE_BASE_SIZE_VW + (Math.random() - 0.5) * 2 * BUBBLE_SIZE_VARIATION_VW;
        const radiusPercent = (radiusVW * window.innerWidth) / tempContainerWidth / 2;

        const newBubble: Omit<BubbleState, 'respawnTimerId'> = { // Omit timer initially
          id: `skill-${index}-${skill.name}`,
          skill,
          x: WALL_PADDING + radiusPercent + Math.random() * (100 - 2 * WALL_PADDING - 2 * radiusPercent),
          y: WALL_PADDING + radiusPercent + Math.random() * (100 - 2 * WALL_PADDING - 2 * radiusPercent),
          vx: getRandomVelocity(),
          vy: getRandomVelocity(),
          radius: radiusPercent,
          isColliding: false,
          targetScale: 0, // Start scaled down
          isHovered: false,
          isPopping: false,
          popCount: 0,
        };

        let collision = false;
        for (const existingBubble of initialBubbles) {
          const dx = newBubble.x - existingBubble.x;
          const dy = newBubble.y - existingBubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (newBubble.radius + existingBubble.radius) * MIN_DISTANCE_MULTIPLIER;
          if (distance < minDistance) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          initialBubbles.push(newBubble as BubbleState); // Add as BubbleState
          placed = true;
        }
      }
      if (!placed) { // Fallback if placement fails
         const radiusVW = BUBBLE_BASE_SIZE_VW + (Math.random() - 0.5) * 2 * BUBBLE_SIZE_VARIATION_VW;
         const radiusPercent = (radiusVW * window.innerWidth) / tempContainerWidth / 2;
         initialBubbles.push({
            id: `skill-${index}-${skill.name}`, skill,
            x: 50, y: 50, vx: getRandomVelocity(), vy: getRandomVelocity(),
            radius: radiusPercent, isColliding: false, targetScale: 0,
            isHovered: false, isPopping: false, popCount: 0,
         } as BubbleState);
      }
    });

    setBubbles(initialBubbles);

    // Entrance animation
    setTimeout(() => {
        setBubbles(prev => prev.map(b => ({ ...b, targetScale: 1 })));
    }, 100);

    // Resize handler
    const handleResize = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup timers on unmount
    return () => {
        window.removeEventListener('resize', handleResize);
        // Clear any active respawn timers
        bubbles.forEach(bubble => {
            if (bubble.respawnTimerId) {
                clearTimeout(bubble.respawnTimerId);
            }
        });
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for init only


  // --- Animation Loop ---
  const runAnimation = useCallback(() => {
    setBubbles(prevBubbles => {
      const nextBubbles = prevBubbles.map(b => ({ ...b, isColliding: false }));

      // Update positions & collisions
      for (let i = 0; i < nextBubbles.length; i++) {
        const bubble = nextBubbles[i];
        // Skip movement if popping
        if (bubble.isPopping) continue;

        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Wall collisions
        if (bubble.x - bubble.radius < WALL_PADDING || bubble.x + bubble.radius > 100 - WALL_PADDING) {
          bubble.vx *= -1;
          bubble.x = Math.max(bubble.radius + WALL_PADDING, Math.min(bubble.x, 100 - bubble.radius - WALL_PADDING));
          bubble.isColliding = true;
        }
        if (bubble.y - bubble.radius < WALL_PADDING || bubble.y + bubble.radius > 100 - WALL_PADDING) {
          bubble.vy *= -1;
          bubble.y = Math.max(bubble.radius + WALL_PADDING, Math.min(bubble.y, 100 - bubble.radius - WALL_PADDING));
          bubble.isColliding = true;
        }
      }

      // Bubble-bubble collisions
      for (let i = 0; i < nextBubbles.length; i++) {
        if (nextBubbles[i].isPopping) continue;
        for (let j = i + 1; j < nextBubbles.length; j++) {
          if (nextBubbles[j].isPopping) continue;

          const b1 = nextBubbles[i];
          const b2 = nextBubbles[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = b1.radius + b2.radius;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const adjustX = (dx / distance) * overlap * 0.5;
            const adjustY = (dy / distance) * overlap * 0.5;
            b1.x -= adjustX; b1.y -= adjustY;
            b2.x += adjustX; b2.y += adjustY;
            [b1.vx, b2.vx] = [b2.vx, b1.vx];
            [b1.vy, b2.vy] = [b2.vy, b1.vy];
            b1.isColliding = true; b2.isColliding = true;
          }
        }
      }
      return nextBubbles;
    });

    animationFrameRef.current = requestAnimationFrame(runAnimation);
  }, []); // No dependencies needed if only using setBubbles updater form

  // Start animation loop
  useEffect(() => {
    if (bubbles.length > 0 && containerWidth > 0) { // Ensure bubbles & container are ready
        animationFrameRef.current = requestAnimationFrame(runAnimation);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bubbles.length, containerWidth, runAnimation]);

  // --- Event Handlers ---
  const handleHover = useCallback((id: string, isHovering: boolean) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, isHovered: isHovering } : b));
  }, []);

  const handlePop = useCallback((id: string) => {
    setBubbles(prev => {
        let respawnTimerId: NodeJS.Timeout | undefined;
        const newBubbles = prev.map(b => {
            if (b.id === id && !b.isPopping) { // Ensure not already popping
                // Clear previous timer if it exists (e.g., rapid clicks)
                if (b.respawnTimerId) {
                    clearTimeout(b.respawnTimerId);
                }
                // Set timer for respawn
                respawnTimerId = setTimeout(() => {
                    setBubbles(currentBubbles => currentBubbles.map(cb =>
                        cb.id === id ? { ...cb, isPopping: false, targetScale: 1, vx: getRandomVelocity(), vy: getRandomVelocity() } // Respawn: reset state
                        : cb
                    ));
                }, RESPAWN_DELAY);

                // Return popped state
                return {
                    ...b,
                    isPopping: true,
                    targetScale: 0, // Animate scale down
                    popCount: b.popCount + 1,
                    isHovered: false, // Hide hover on pop
                    vx: 0, // Stop movement while popped
                    vy: 0,
                    respawnTimerId: respawnTimerId // Store timer ID
                };
            }
            return b; // Return unchanged bubble
        });
        return newBubbles; // Return updated array
    });
  }, []);


  return (
    <section
      id="skills-animated"
      className="py-24 md:py-32 min-h-screen relative overflow-hidden bg-black text-white"
    >
      <StarField starCount={500} color="#3b82f6" speed={0.05} scrollFactor={0.2} />
      <Container>
        <div className="mb-16 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-light mb-6 uppercase tracking-wide">
            SKILL CLOUD
          </h2>
          <p className="text-lg text-blue-400 max-w-2xl mx-auto">
            HOVER FOR DETAILS, CLICK TO POP & RESPAWN
          </p>
        </div>
        <div
          ref={containerRef}
          className="relative h-[60vh] md:h-[70vh] w-full max-w-5xl mx-auto z-10 border border-blue-900/30 rounded-lg"
        >
          {containerWidth > 0 && bubbles.map((bubble) => (
            <SkillBubble
              key={bubble.id}
              bubble={bubble}
              containerWidth={containerWidth}
              onPop={handlePop}
              onHover={handleHover}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

// Add CSS Gradient definition if not globally available via Tailwind config
/*
@layer utilities {
  .bg-gradient-radial {
    background-image: radial-gradient(circle, var(--tw-gradient-stops));
  }
}
*/
