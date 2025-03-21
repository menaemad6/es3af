
import React, { useEffect, useState, useRef } from 'react';

interface ParallaxEffectProps {
  children: React.ReactNode;
  speed?: number;
  sensitivity?: number;
  backgroundElements?: boolean;
}

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({ 
  children, 
  speed = 0.05,
  sensitivity = 1,
  backgroundElements = false
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
        
        // Update cursor effect position
        if (cursorRef.current) {
          cursorRef.current.style.left = `${e.clientX}px`;
          cursorRef.current.style.top = `${e.clientY}px`;
          
          // Add a small delay for trailing effect
          setTimeout(() => {
            if (cursorRef.current) {
              cursorRef.current.style.opacity = '1';
            }
          }, 50);
        }
      }
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    // Create floating background elements if enabled
    if (backgroundElements && bgElementsRef.current) {
      const shapes = ['circle', 'square', 'triangle', 'hexagon', 'plus'];
      const colors = ['primary', 'blue', 'cyan', 'indigo', 'teal'];
      
      // Create 15-25 random background elements
      const numElements = Math.floor(Math.random() * 10) + 15;
      
      for (let i = 0; i < numElements; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.floor(Math.random() * 40) + 10; // 10-50px
        const opacity = (Math.random() * 0.15) + 0.05; // 0.05-0.2
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const animDuration = `${Math.random() * 20 + 10}s`; // 10-30s
        const animDelay = `${Math.random() * 5}s`;
        const zIndex = Math.floor(Math.random() * 5) - 10; // -10 to -6
        
        const element = document.createElement('div');
        element.className = `absolute rounded-lg bg-${color}-500/10 backdrop-blur-3xl floating-element`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = left;
        element.style.top = top;
        element.style.opacity = opacity.toString();
        element.style.zIndex = zIndex.toString();
        element.style.animation = `float ${animDuration} ease-in-out infinite`;
        element.style.animationDelay = animDelay;
        
        // Apply different shapes
        if (shape === 'circle') {
          element.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
          element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        } else if (shape === 'hexagon') {
          element.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        } else if (shape === 'plus') {
          element.style.clipPath = 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)';
        }
        
        bgElementsRef.current.appendChild(element);
      }
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [backgroundElements]);
  
  useEffect(() => {
    if (containerRef.current) {
      const layers = containerRef.current.querySelectorAll('.parallax-layer');
      
      layers.forEach((layer: Element) => {
        const depthStr = (layer as HTMLElement).dataset.depth || "1";
        const depth = parseFloat(depthStr);
        const movement = depth * speed * sensitivity;
        
        const translateX = mousePosition.x * movement;
        const translateY = mousePosition.y * movement;
        const translateZ = scrollY * (depth * 0.02); // Scroll-based Z movement
        
        (layer as HTMLElement).style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
      });
    }
    
    // Update floating background elements
    if (bgElementsRef.current) {
      const elements = bgElementsRef.current.querySelectorAll('.floating-element');
      elements.forEach((el: Element) => {
        const depth = Math.random() * 0.2 + 0.1; // Random depth between 0.1-0.3
        const moveX = mousePosition.x * depth * 0.01;
        const moveY = mousePosition.y * depth * 0.01;
        
        (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    }
  }, [mousePosition, scrollY, speed, sensitivity]);
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed pointer-events-none w-10 h-10 -ml-5 -mt-5 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 blur-md z-[999] opacity-0 transition-opacity duration-300"
        style={{ transition: 'left 0.1s ease-out, top 0.1s ease-out' }}
      />
      {backgroundElements && (
        <div ref={bgElementsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating background elements will be injected here */}
        </div>
      )}
      <div ref={containerRef} className="parallax-container relative">
        {children}
      </div>
    </>
  );
};

export default ParallaxEffect;
