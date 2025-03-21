
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/80">
      <Header />
      
      {/* Hero Section with animated background and parallax */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          {/* Animated background */}
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
          
          {/* Neural network pattern */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
                <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="currentColor"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
            
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-300/5 dark:bg-blue-400/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-green-300/5 dark:bg-green-400/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2.7s" }}></div>
          
          {/* Moving particles */}
          <div className="particles absolute inset-0 z-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="particle absolute w-1 h-1 bg-primary/40 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 7}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            ))}
          </div>
            
          {/* Floating icons with parallax */}
          <ParallaxEffect>
            {floatingIcons.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "absolute opacity-20 animate-float parallax-layer", 
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
                    className="px-3 py-1 text-sm border-primary/20 bg-primary/5 text-primary animate-fade-up" 
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
              <div className="absolute inset-0 glass-card glow-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10 pointer-events-none"></div>
                
                <div className="relative h-full w-full p-6 flex flex-col">
                  {/* Brain neural network visualization */}
                  <div className="flex-1 relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                    {/* Medical neural network animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {/* Brain outline */}
                        <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
                          <path d="M100,20 C140,20 170,50 170,90 C170,130 140,160 100,160 C60,160 30,130 30,90 C30,50 60,20 100,20 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary"/>
                          <path d="M100,30 C135,30 160,55 160,90 C160,125 135,150 100,150 C65,150 40,125 40,90 C40,55 65,30 100,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                          <path d="M100,40 C130,40 150,60 150,90 C150,120 130,140 100,140 C70,140 50,120 50,90 C50,60 70,40 100,40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                        </svg>
                        
                        {/* Animated nodes */}
                        {[...Array(20)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${20 + Math.random() * 60}%`,
                              animationDelay: `${Math.random() * 3}s`,
                              opacity: 0.3 + Math.random() * 0.7
                            }}
                          />
                        ))}
                        
                        {/* Animated connections */}
                        <svg className="absolute inset-0 w-full h-full">
                          {[...Array(30)].map((_, i) => {
                            const x1 = 20 + Math.random() * 60;
                            const y1 = 20 + Math.random() * 60;
                            const x2 = 20 + Math.random() * 60;
                            const y2 = 20 + Math.random() * 60;
                            
                            return (
                              <path 
                                key={i}
                                d={`M${x1},${y1} L${x2},${y2}`}
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-primary/30"
                                style={{
                                  animation: `pulse 3s infinite`,
                                  animationDelay: `${Math.random() * 3}s`
                                }}
                              />
                            );
                          })}
                        </svg>
                          
                        {/* Central brain icon */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
                          <BrainCircuit size={64} className="opacity-75 animate-pulse" style={{ animationDuration: '3s' }} />
                        </div>
                      </div>
                    </div>
                      
                    {/* Data visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end p-4">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-[3px] mx-[2px] rounded-t-full bg-primary/60"
                          style={{ 
                            height: `${10 + Math.sin(i/3) * 50}%`,
                            animation: 'animate-pulse',
                            animationDelay: `${i * 0.1}s`
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
                        className="h-14 rounded-lg glass-card flex flex-col justify-center p-3"
                      >
                        <div className="h-2 w-1/2 bg-primary/20 rounded-full mb-2"></div>
                        <div className="h-2 w-3/4 bg-primary/10 rounded-full"></div>
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
        <div className="absolute inset-0 -z-10">
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
          
          <div className="max-w-4xl mx-auto futuristic-card animate-on-scroll fade-up">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent opacity-60"></div>
            
            <div className="bg-primary/10 p-3 backdrop-blur-sm flex items-center gap-2 relative">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-2 text-sm font-medium">Es3af Medical Chat</div>
            </div>
            
            <div className="p-6 h-[350px] flex flex-col relative">
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
                          <span className="text-xs text-gray-500">Es3af AI • Typing...</span>
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
                  className="w-full transition-all duration-300 hover:shadow-md bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                >
                  {showDemo ? "Chat Demo Running..." : "Start Chat Demo"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with scroll-triggered animations */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background to-primary/5"></div>
          <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block animate-on-scroll fade-up">
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary mb-4">
                Powerful Features
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">Medical Knowledge</span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Es3af combines cutting-edge AI technology with comprehensive medical knowledge to provide an invaluable resource for medical students and professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="animate-on-scroll fade-up scale-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="h-full futuristic-card group hover:translate-y-[-8px]">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-500 shadow-sm">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section with animations */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800/80"></div>
          <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block animate-on-scroll fade-up">
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary mb-4">
                Simple Process
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              How <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">Es3af</span> Works
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Getting accurate medical information has never been easier. Es3af provides a seamless experience from question to answer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Ask Your Question",
                description: "Type your medical query in natural language, just as you would ask a professor or colleague."
              },
              {
                step: 2,
                title: "AI Processing",
                description: "Our advanced AI analyzes your question and searches through validated medical knowledge."
              },
              {
                step: 3,
                title: "Receive Accurate Answer",
                description: "Get a detailed, evidence-based response that helps deepen your understanding of the topic."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="animate-on-scroll fade-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="h-full futuristic-card group hover:translate-y-[-8px]">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400"></div>
          <div className="absolute w-full h-full bg-grid-pattern opacity-10"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up drop-shadow-md">
              Ready to Enhance Your Medical Knowledge?
            </h2>
            
            <p className="text-xl opacity-90 mb-8 animate-on-scroll fade-up drop-shadow-sm" style={{ animationDelay: "0.1s" }}>
              Join medical students worldwide who are using Es3af to study more effectively and gain deeper insights.
            </p>
            
            <div className="animate-on-scroll fade-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-primary hover:text-primary-600 bg-white hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 px-8 py-6 rounded-full text-lg font-medium"
                >
                  Start Using Es3af Now
                  <ArrowRight className="ml-2 h-5 w-5" />
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
