"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ClientOnly from "../ui/client-only";
import StarField from "../3d/StarField";

// Mock Container component
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">{children}</div>
);

// Skill interface
interface Skill {
  name: string;
  level: number;
  category: string;
  description?: string;
}

interface BubbleState {
  id: string;
  skill: Skill;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isColliding: boolean;
  targetScale: number;
  isHovered: boolean;
  isPopping: boolean;
  popCount: number;
  respawnTimerId?: NodeJS.Timeout;
}

// Skill data
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

// Constants
const BUBBLE_BASE_SIZE_VW = 5;
const BUBBLE_SIZE_VARIATION_VW = 2;
const MIN_DISTANCE_MULTIPLIER = 1.1;
const WALL_PADDING = 1;
const BASE_SPEED = 0.03;
const RESPAWN_DELAY = 1500;

// Helper function
const getRandomVelocity = () => (Math.random() - 0.5) * BASE_SPEED * 2;

// SkillBubble Component
interface SkillBubbleProps {
  bubble: BubbleState;
  containerWidth: number;
  onPop: (id: string) => void;
  onHover: (id: string, isHovering: boolean) => void;
}

const SkillBubble: React.FC<SkillBubbleProps> = React.memo(({ bubble, containerWidth, onPop, onHover }) => {
  const { id, skill, x, y, radius, isColliding, targetScale, isHovered, isPopping, popCount } = bubble;

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.type === 'click' && (e.detail === 0 || e.detail > 1)) {
       return;
    }
    if (!isPopping) {
      onPop(id);
    }
  };

  const handleMouseEnter = () => {
    if (!isPopping) {
        onHover(id, true);
    }
  };

  const handleMouseLeave = () => {
    onHover(id, false);
  };

  // Calculate size and position
  const sizePx = (radius * 2 * containerWidth) / 100;
  const displaySize = Math.max(sizePx, 30);
  const leftPos = `calc(${x}% - ${displaySize / 2}px)`;
  const topPos = `calc(${y}% - ${displaySize / 2}px)`;

  return (
    <div
      className={`absolute cursor-pointer group transition-transform,opacity duration-300 ease-out ${
         isPopping ? 'pointer-events-none' : ''
      }`}
      style={{
        left: leftPos,
        top: topPos,
        width: `${displaySize}px`,
        height: `${displaySize}px`,
        transform: `scale(${targetScale})`,
        opacity: isPopping ? 0 : 1,
        zIndex: isHovered ? 10 : (isPopping ? 0 : 1),
        transitionDelay: isPopping ? '0ms' : '0ms',
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
          group-hover:from-blue-500/20 group-hover:via-blue-600/40 group-hover:to-blue-800/60`}
      >
        {/* Inner highlight */}
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-white/20 rounded-full blur-md"></div>

        {/* Skill Name Text */}
        <span
          className={`text-center text-xs sm:text-sm font-medium text-white transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-70' : 'opacity-100'
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
           <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
});
SkillBubble.displayName = 'SkillBubble';

// Main Skills Component
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const animationFrameRef = useRef<number>();
  const [containerWidth, setContainerWidth] = useState(0);
  const [clientSide, setClientSide] = useState(false);

  // Set clientSide to true after mount
  useEffect(() => {
    setClientSide(true);
  }, []);

  // Initialize bubbles only on client-side
  useEffect(() => {
    if (!clientSide) return;
    
    const initialBubbles: BubbleState[] = [];
    const maxAttempts = skills.length * 20;
    const tempContainerWidth = containerRef.current?.offsetWidth || window.innerWidth;

    skills.forEach((skill, index) => {
      let placed = false;
      for (let i = 0; i < maxAttempts && !placed; i++) {
        const radiusVW = BUBBLE_BASE_SIZE_VW + (Math.random() - 0.5) * 2 * BUBBLE_SIZE_VARIATION_VW;
        const radiusPercent = (radiusVW * window.innerWidth) / tempContainerWidth / 2;

        const newBubble: Omit<BubbleState, 'respawnTimerId'> = {
          id: `skill-${index}-${skill.name}`,
          skill,
          x: WALL_PADDING + radiusPercent + Math.random() * (100 - 2 * WALL_PADDING - 2 * radiusPercent),
          y: WALL_PADDING + radiusPercent + Math.random() * (100 - 2 * WALL_PADDING - 2 * radiusPercent),
          vx: getRandomVelocity(),
          vy: getRandomVelocity(),
          radius: radiusPercent,
          isColliding: false,
          targetScale: 0,
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
          initialBubbles.push(newBubble as BubbleState);
          placed = true;
        }
      }
      if (!placed) {
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

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        bubbles.forEach(bubble => {
            if (bubble.respawnTimerId) {
                clearTimeout(bubble.respawnTimerId);
            }
        });
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [clientSide]);

  // Animation Loop
  const runAnimation = useCallback(() => {
    setBubbles(prevBubbles => {
      const nextBubbles = prevBubbles.map(b => ({ ...b, isColliding: false }));

      // Update positions & collisions
      for (let i = 0; i < nextBubbles.length; i++) {
        const bubble = nextBubbles[i];
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
  }, []);

  // Start animation loop when ready
  useEffect(() => {
    if (clientSide && bubbles.length > 0 && containerWidth > 0) {
        animationFrameRef.current = requestAnimationFrame(runAnimation);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [clientSide, bubbles.length, containerWidth, runAnimation]);

  // Event Handlers
  const handleHover = useCallback((id: string, isHovering: boolean) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, isHovered: isHovering } : b));
  }, []);

  const handlePop = useCallback((id: string) => {
    setBubbles(prev => {
        let respawnTimerId: NodeJS.Timeout | undefined;
        const newBubbles = prev.map(b => {
            if (b.id === id && !b.isPopping) {
                if (b.respawnTimerId) {
                    clearTimeout(b.respawnTimerId);
                }
                respawnTimerId = setTimeout(() => {
                    setBubbles(currentBubbles => currentBubbles.map(cb =>
                        cb.id === id ? { ...cb, isPopping: false, targetScale: 1, vx: getRandomVelocity(), vy: getRandomVelocity() }
                        : cb
                    ));
                }, RESPAWN_DELAY);

                return {
                    ...b,
                    isPopping: true,
                    targetScale: 0,
                    popCount: b.popCount + 1,
                    isHovered: false,
                    vx: 0,
                    vy: 0,
                    respawnTimerId: respawnTimerId
                };
            }
            return b;
        });
        return newBubbles;
    });
  }, []);

  return (
    <section
      id="skills-animated"
      className="py-24 md:py-32 min-h-screen relative overflow-hidden bg-black text-white"
    >
      {/* Wrap StarField with ClientOnly component */}
      <ClientOnly>
        <StarField starCount={500} color="#3b82f6" speed={0.05} scrollFactor={0.2} />
      </ClientOnly>
      
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
          {/* Only render bubbles on client-side */}
          {clientSide && containerWidth > 0 && bubbles.map((bubble) => (
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