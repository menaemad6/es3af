
import React, { useEffect, useState, useRef } from 'react';

interface ParallaxEffectProps {
  children: React.ReactNode;
  speed?: number;
  sensitivity?: number;
}

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({ 
  children, 
  speed = 0.05,
  sensitivity = 1
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
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
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
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
  }, [mousePosition, scrollY, speed, sensitivity]);
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed pointer-events-none w-10 h-10 -ml-5 -mt-5 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 blur-md z-[999] opacity-0 transition-opacity duration-300"
        style={{ transition: 'left 0.1s ease-out, top 0.1s ease-out' }}
      />
      <div ref={containerRef} className="parallax-container relative">
        {children}
      </div>
    </>
  );
};

export default ParallaxEffect;
