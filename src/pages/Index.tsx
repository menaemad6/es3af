
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, BrainCircuit, Microscope, MessageSquare, LightbulbIcon, HeartPulse, ShieldPlus, ActivitySquare, Dna, TestTube, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ParallaxEffect from "@/components/ui-custom/ParallaxEffect";
import TypewriterEffect from "@/components/ui-custom/TypewriterEffect";
import { cn } from "@/lib/utils";

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState(40);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  // Track cursor position for custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Generate particle on mouse movement (throttled)
      if (particlesRef.current && Math.random() > 0.7) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 rounded-full bg-primary/40 animate-particle';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particlesRef.current.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (particlesRef.current && particlesRef.current.contains(particle)) {
            particlesRef.current.removeChild(particle);
          }
        }, 1000);
      }
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        const isClickable = e.target.closest('a, button, [role="button"]');
        if (isClickable) {
          setCursorSize(70);
        } else {
          setCursorSize(40);
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  
  // Update cursor position
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;
      cursorRef.current.style.width = `${cursorSize}px`;
      cursorRef.current.style.height = `${cursorSize}px`;
    }
  }, [cursorPosition, cursorSize]);
  
  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Simulate AI typing effect
  useEffect(() => {
    if (showDemo) {
      const message = "Based on the symptoms you've described, this could be indicative of acute myocarditis. I would recommend further cardiac evaluation including an ECG and troponin levels.";
      let i = 0;
      setIsTyping(true);
      
      const typing = setInterval(() => {
        if (i < message.length) {
          setDemoMessage(prev => prev + message.charAt(i));
          i++;
        } else {
          clearInterval(typing);
          setIsTyping(false);
        }
      }, 30);
      
      return () => clearInterval(typing);
    }
  }, [showDemo]);
  
  // Intersection Observer setup for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );
    
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => {
      observerRef.current?.observe(el);
    });
    
    return () => {
      if (observerRef.current) {
        animatedElements.forEach((el) => {
          observerRef.current?.unobserve(el);
        });
      }
    };
  }, []);
  
  const floatingIcons = [
    { icon: HeartPulse, color: "text-red-500", top: "top-20", left: "left-[15%]", animationDelay: "0s", size: 24 },
    { icon: ShieldPlus, color: "text-green-500", top: "top-40", left: "left-[85%]", animationDelay: "1.5s", size: 28 },
    { icon: ActivitySquare, color: "text-blue-500", top: "top-60", left: "left-[10%]", animationDelay: "0.8s", size: 20 },
    { icon: Brain, color: "text-purple-500", top: "top-80", left: "left-[90%]", animationDelay: "2.2s", size: 32 },
    { icon: Dna, color: "text-primary", top: "top-44", left: "left-[50%]", animationDelay: "1.2s", size: 26 },
    { icon: TestTube, color: "text-amber-500", top: "top-32", left: "left-[70%]", animationDelay: "1.7s", size: 22 },
    { icon: Microscope, color: "text-cyan-500", top: "top-72", left: "left-[25%]", animationDelay: "0.5s", size: 30 },
  ];
  
  const features = [
    {
      title: "Advanced Medical AI",
      description: "Powered by cutting-edge neural networks trained on vast medical datasets for accurate diagnostics and recommendations.",
      icon: BrainCircuit,
    },
    {
      title: "Evidence-Based Learning",
      description: "Access the latest peer-reviewed medical research and clinical guidelines to support your education.",
      icon: Microscope,
    },
    {
      title: "Clinical Decision Support",
      description: "Gain deeper understanding of differential diagnoses and treatment approaches in complex medical scenarios.",
      icon: LightbulbIcon,
    },
    {
      title: "Personalized Education",
      description: "Adaptive learning technology that evolves with your knowledge to optimize your medical education journey.",
      icon: Sparkles,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/80 cursor-none">
      {/* Custom cursor */}
      <div 
        ref={cursorRef} 
        className="fixed pointer-events-none -ml-5 -mt-5 rounded-full mix-blend-difference z-[999] bg-gradient-to-r from-primary/30 to-primary/10 blur-md"
        style={{ 
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          transition: 'width 0.3s ease, height 0.3s ease'
        }}
      />
      
      {/* Particles container */}
      <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-[998]"></div>
      
      <Header />
      
      {/* Hero Section with animated background and parallax */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          {/* Animated background */}
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
          
          {/* Dynamic grid pattern */}
          <div className="absolute inset-0 grid-pattern">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className="opacity-30" />
            </svg>
          </div>
            
          {/* Animated glow orbs */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-300/10 dark:bg-blue-400/10 rounded-full blur-[100px] animate-pulse-slow transition-all duration-1000" 
            style={{ animationDelay: "1.5s", transform: `translateY(${scrollY * -0.03}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-green-300/10 dark:bg-green-400/10 rounded-full blur-[100px] animate-pulse-slow transition-all duration-1000" 
            style={{ animationDelay: "2.7s", transform: `translateY(${scrollY * 0.02}px)` }}
          ></div>
          
          {/* Dynamic particles */}
          <div className="particles absolute inset-0 z-0 opacity-50">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="particle absolute w-1 h-1 bg-primary/60 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `floatParticle ${3 + Math.random() * 7}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.8 + 0.2,
                  transform: `translateY(${scrollY * (Math.random() * 0.05)}px)`
                }}
              />
            ))}
          </div>
            
          {/* Neural network lines */}
          <svg className="absolute inset-0 w-full h-full z-0 opacity-30">
            {[...Array(15)].map((_, i) => {
              const x1 = Math.random() * 100;
              const y1 = Math.random() * 100;
              const x2 = Math.random() * 100;
              const y2 = Math.random() * 100;
              return (
                <path 
                  key={i}
                  d={`M${x1}%,${y1}% Q${(x1+x2)/2+Math.random()*20-10}%,${(y1+y2)/2+Math.random()*20-10}% ${x2}%,${y2}%`}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/30 neural-line"
                  style={{
                    animation: `pulseLine ${3 + Math.random() * 4}s infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              );
            })}
          </svg>
            
          {/* Floating icons with parallax */}
          <ParallaxEffect sensitivity={1.5}>
            {floatingIcons.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "absolute opacity-30 animate-float parallax-layer", 
                  item.top, 
                  item.left
                )}
                data-depth={`${(index % 4) + 1}`}
                style={{ 
                  animationDelay: item.animationDelay,
                  animationDuration: `${5 + index % 4}s`
                }}
              >
                <item.icon size={item.size} className={item.color} />
              </div>
            ))}
          </ParallaxEffect>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 max-w-2xl">
                <div className="overflow-hidden">
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1 text-sm border-primary/20 bg-primary/5 text-primary animate-fade-up backdrop-blur-sm" 
                    style={{ animationDelay: "0.1s" }}
                  >
                    AI-Powered Medical Assistant
                  </Badge>
                </div>
                
                <div className="overflow-hidden">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-up" style={{ animationDelay: "0.2s" }}>
                    The Future of 
                    <span className="inline-block ml-2">
                      <TypewriterEffect 
                        words={["AI-Powered", "Intelligent", "Medical"]} 
                        className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600"
                        textGradient={true}
                        cursorStyle="block"
                        cursorClassName="bg-primary-500"
                      />
                    </span>
                    <br/>
                    <span className="relative">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">
                        Healthcare Education
                      </span>
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9C100.667 3.66667 163.667 1 326 3" stroke="url(#paint0_linear)" strokeWidth="5" strokeLinecap="round"/>
                        <defs>
                          <linearGradient id="paint0_linear" x1="3" y1="9" x2="336" y2="9" gradientUnits="userSpaceOnUse">
                            <stop stopColor="hsl(var(--primary-600))"/>
                            <stop offset="1" stopColor="hsl(var(--primary-400))"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </h1>
                </div>
                
                <div className="overflow-hidden">
                  <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-up leading-relaxed" style={{ animationDelay: "0.3s" }}>
                    Es3af combines cutting-edge AI with comprehensive medical knowledge to provide instant, accurate responses to complex medical queries—helping you excel in your medical education journey.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2 overflow-hidden">
                  <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
                    <Link to="/dashboard">
                      <AnimatedButton 
                        size="lg" 
                        className="w-full sm:w-auto shadow-lg hover:shadow-primary/20 group"
                        animationType="glow"
                      >
                        <span className="relative flex items-center">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </AnimatedButton>
                    </Link>
                  </div>
                  
                  <div className="animate-fade-up" style={{ animationDelay: "0.5s" }}>
                    <Link to="/about">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full sm:w-auto group transition-all duration-300 border-primary/30 hover:border-primary hover:bg-primary/5 backdrop-blur-sm"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 h-[400px] lg:h-[500px] overflow-hidden rounded-3xl animate-fade-left relative" style={{ animationDelay: "0.5s" }}>
              {/* Modern AI medical visualization */}
              <div className="absolute inset-0 glass-card glow-border group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10 pointer-events-none transition-all duration-500 group-hover:from-primary/10"></div>
                
                <div className="relative h-full w-full p-6 flex flex-col">
                  {/* Brain neural network visualization */}
                  <div className="flex-1 relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                    {/* Medical neural network animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {/* Brain outline with interactive elements */}
                        <svg viewBox="0 0 200 200" className="w-full h-full opacity-30 brain-outline">
                          <path d="M100,20 C140,20 170,50 170,90 C170,130 140,160 100,160 C60,160 30,130 30,90 C30,50 60,20 100,20 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary animate-pulse-slow" style={{ animationDuration: '5s' }}/>
                          <path d="M100,30 C135,30 160,55 160,90 C160,125 135,150 100,150 C65,150 40,125 40,90 C40,55 65,30 100,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary animate-pulse-slow" style={{ animationDuration: '7s', animationDelay: '0.5s' }}/>
                          <path d="M100,40 C130,40 150,60 150,90 C150,120 130,140 100,140 C70,140 50,120 50,90 C50,60 70,40 100,40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary animate-pulse-slow" style={{ animationDuration: '6s', animationDelay: '1s' }}/>
                          
                          {/* Interactive neural connections that respond to scroll */}
                          {[...Array(8)].map((_, i) => {
                            const startAngle = (i / 8) * Math.PI * 2;
                            const endAngle = ((i + 3) / 8) * Math.PI * 2;
                            const radius = 70;
                            
                            const x1 = 100 + Math.cos(startAngle) * radius;
                            const y1 = 100 + Math.sin(startAngle) * radius;
                            const x2 = 100 + Math.cos(endAngle) * radius;
                            const y2 = 100 + Math.sin(endAngle) * radius;
                            
                            return (
                              <path 
                                key={i}
                                d={`M${x1},${y1} Q${100},${100} ${x2},${y2}`}
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-primary neural-connection"
                                style={{
                                  opacity: 0.5 + Math.sin(scrollY * 0.01 + i) * 0.3,
                                  strokeDasharray: '5,5',
                                  strokeDashoffset: scrollY * 0.2 % 10
                                }}
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Animated nodes with scroll-based pulsing */}
                        {[...Array(20)].map((_, i) => {
                          const angle = (i / 20) * Math.PI * 2;
                          const distance = 30 + Math.random() * 30;
                          const x = 100 + Math.cos(angle) * distance;
                          const y = 100 + Math.sin(angle) * distance;
                          
                          return (
                            <div 
                              key={i}
                              className="absolute w-2 h-2 rounded-full bg-primary animate-pulse neural-node"
                              style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                animationDelay: `${i * 0.2}s`,
                                opacity: 0.3 + Math.sin(scrollY * 0.005 + i) * 0.3,
                                transform: `scale(${1 + Math.sin(scrollY * 0.01 + i * 0.5) * 0.2})`
                              }}
                            />
                          );
                        })}
                          
                        {/* Animated brain icon */}
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary"
                          style={{
                            transform: `translate(-50%, -50%) scale(${1 + Math.sin(scrollY * 0.005) * 0.1})`,
                            filter: `drop-shadow(0 0 ${5 + Math.sin(scrollY * 0.01) * 3}px currentColor)`
                          }}
                        >
                          <BrainCircuit size={64} className="opacity-75" />
                        </div>
                      </div>
                    </div>
                      
                    {/* Interactive data visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end p-4">
                      {[...Array(30)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-[2px] mx-[1px] rounded-t-full bg-primary/60"
                          style={{ 
                            height: `${10 + Math.sin(i/2 + scrollY * 0.02) * 40}%`,
                            opacity: 0.3 + Math.sin(i/5 + scrollY * 0.01) * 0.5
                          }}
                        />
                      ))}
                    </div>
                  </div>
                    
                  {/* Simulated medical data */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-14 rounded-lg glass-card flex flex-col justify-center p-3 group"
                        style={{
                          transform: `translateY(${Math.sin(scrollY * 0.01 + i) * 5}px)`
                        }}
                      >
                        <div className="h-2 w-1/2 bg-primary/20 rounded-full mb-2 group-hover:w-3/4 transition-all duration-500"></div>
                        <div className="h-2 w-3/4 bg-primary/10 rounded-full group-hover:w-1/2 transition-all duration-500"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Chat Demo Section */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800/80"></div>
          <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-block animate-on-scroll fade-up">
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary mb-4">
                Try It Out
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              See <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-blue-500">Es3af</span> In Action
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Experience how Es3af provides accurate, detailed responses to complex medical queries.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto futuristic-card animate-on-scroll fade-up group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-60 group-hover:from-primary/10 transition-all duration-500"></div>
            
            <div className="bg-primary/10 p-3 backdrop-blur-sm flex items-center gap-2 relative">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-2 text-sm font-medium">Es3af Medical Chat</div>
            </div>
            
            <div className="p-6 h-[350px] flex flex-col relative backdrop-blur-sm bg-background/50">
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <div className="flex items-start max-w-[80%] animate-fade-in opacity-100" style={{ animationDuration: "0.5s" }}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0 shadow-sm">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-tl-sm shadow-sm">
                      <p>Hello! I'm Es3af, your medical AI assistant. How can I help you today?</p>
                    </div>
                    <div className="mt-1 ml-1">
                      <span className="text-xs text-gray-500">Es3af AI • Just now</span>
                    </div>
                  </div>
                </div>
                
                {showDemo && (
                  <>
                    <div className="flex justify-end animate-fade-in opacity-100" style={{ animationDuration: "0.5s", animationDelay: "0.2s" }}>
                      <div>
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-white rounded-tr-sm max-w-[80%] shadow-md">
                          <p>I have a 22-year-old patient with chest pain, fever, and elevated troponin levels following a viral illness. What could this be?</p>
                        </div>
                        <div className="mt-1 mr-1 text-right">
                          <span className="text-xs text-gray-500">You • Just now</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start max-w-[80%] animate-fade-in opacity-100" style={{ animationDuration: "0.5s", animationDelay: "0.4s" }}>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0 shadow-sm">
                        <MessageSquare size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-tl-sm shadow-sm">
                          <p>{demoMessage}</p>
                          {isTyping && (
                            <span className="inline-flex gap-1 ml-1">
                              <span className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                              <span className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                              <span className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 ml-1">
                          <span className="text-xs text-gray-500">Es3af AI • {isTyping ? "Typing..." : "Just now"}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="pt-4 border-t mt-4">
                <Button 
                  onClick={() => setShowDemo(true)} 
                  disabled={showDemo}
                  className="w-full transition-all duration-300 hover:shadow-md bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {showDemo ? "Chat Demo Running..." : "Start Chat Demo"}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with scroll-triggered animations */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Powered by <span className="text-primary">Advanced AI Technology</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-on-scroll fade-up">
              Es3af leverages the latest advancements in artificial intelligence to help medical students excel in their education.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="animate-on-scroll fade-up glass-card group h-full" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="p-2 rounded-xl bg-primary/10 w-fit mb-4 transition-all duration-300 group-hover:bg-primary/20">
                    <feature.icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-1">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
          
          {/* Background effect */}
          <div className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          
          {/* Glow effect */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-on-scroll fade-up">
              Ready to Transform Your <span className="text-primary">Medical Education</span>?
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 animate-on-scroll fade-up">
              Join thousands of medical students who are enhancing their learning experience with Es3af's AI-powered assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll fade-up">
              <Link to="/dashboard">
                <AnimatedButton 
                  size="lg" 
                  className="w-full sm:w-auto shadow-lg hover:shadow-primary/20 group"
                  animationType="glow"
                >
                  <span className="relative flex items-center">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </AnimatedButton>
              </Link>
              
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto group transition-all duration-300 border-primary/30 hover:border-primary hover:bg-primary/5"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
