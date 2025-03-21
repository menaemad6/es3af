
import React, { useEffect, useState, useRef } from 'react';

interface ParallaxEffectProps {
  children: React.ReactNode;
  speed?: number;
}

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({ 
  children, 
  speed = 0.05 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
      }
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    if (containerRef.current) {
      const layers = containerRef.current.querySelectorAll('.parallax-layer');
      
      layers.forEach((layer: Element) => {
        const depth = (layer as HTMLElement).dataset.depth || 1;
        const movement = parseFloat(depth) * speed;
        
        const translateX = mousePosition.x * movement;
        const translateY = mousePosition.y * movement;
        
        (layer as HTMLElement).style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });
    }
  }, [mousePosition, speed]);
  
  return (
    <div ref={containerRef} className="parallax-container">
      {children}
    </div>
  );
};

export default ParallaxEffect;
