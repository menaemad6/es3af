
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Stethoscope, Microscope, BookOpen, MessageSquare, LightbulbIcon, HeartPulse, ShieldPlus, ActivitySquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThreeJsAmbulance from "@/components/ui-custom/ThreeJsAmbulance";
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
    { icon: Stethoscope, color: "text-primary", top: "top-44", left: "left-[50%]", animationDelay: "1.2s", size: 26 },
  ];
  
  const features = [
    {
      title: "Accurate Medical Guidance",
      description: "Get precise answers to complex medical questions powered by advanced AI technology.",
      icon: Brain,
    },
    {
      title: "Learning Resources",
      description: "Access a wealth of medical knowledge and educational content to enhance your studies.",
      icon: BookOpen,
    },
    {
      title: "Clinical Insights",
      description: "Gain deeper understanding of clinical scenarios and diagnostic approaches.",
      icon: Stethoscope,
    },
    {
      title: "Evidence-Based Answers",
      description: "Receive information grounded in the latest medical research and guidelines.",
      icon: Microscope,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section with animated background and parallax */}
      <ParallaxEffect>
        <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute w-full h-full bg-gradient-to-b from-background via-primary/5 to-background"></div>
            <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
            
            {/* Animated glowing orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-300/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-green-300/10 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
            
            {/* Floating icons with parallax */}
            {floatingIcons.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "absolute opacity-20 animate-float", 
                  item.top, 
                  item.left,
                  `parallax-layer parallax-depth-${(index % 4) + 1}`
                )}
                style={{ 
                  animationDelay: item.animationDelay,
                  transform: `translateY(${scrollY * 0.05 * (index % 3 + 1)}px)` 
                }}
              >
                <item.icon size={item.size} className={item.color} />
              </div>
            ))}
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="space-y-6 max-w-xl">
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
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up" style={{ animationDelay: "0.2s" }}>
                      Your 
                      <span className="inline-block ml-2">
                        <TypewriterEffect 
                          words={["AI-Powered", "Intelligent", "Advanced"]} 
                          className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600"
                        />
                      </span>
                      <br/>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">
                        Medical Assistant
                      </span>
                    </h1>
                  </div>
                  
                  <div className="overflow-hidden">
                    <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                      Es3af is an AI-powered chat platform designed for medical students to ask complex medical questions and receive accurate, instant answers.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2 overflow-hidden">
                    <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
                      <Link to="/dashboard">
                        <AnimatedButton 
                          size="lg" 
                          className="w-full sm:w-auto modern-button group shadow-md hover:shadow-primary/20"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300 group-hover:opacity-90"></span>
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
                          className="w-full sm:w-auto group transition-all duration-300 border-primary/30 hover:border-primary hover:bg-primary/5"
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 h-[400px] lg:h-[500px] overflow-hidden rounded-3xl glass-card glow-border animate-fade-left relative" style={{ animationDelay: "0.5s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10 pointer-events-none"></div>
                <ThreeJsAmbulance />
              </div>
            </div>
          </div>
        </section>
      </ParallaxEffect>
      
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
