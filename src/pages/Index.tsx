
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Stethoscope, Microscope, BookOpen, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThreeJsAmbulance from "@/components/ui-custom/ThreeJsAmbulance";
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
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
      
      {/* Hero Section with animated background */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-300/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-green-300/10 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  Medical AI Assistant
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  Your AI-Powered 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">
                    {" Medical Assistant"}
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  Es3af is an AI-powered chat platform designed for medical students to ask complex medical questions and receive accurate, instant answers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                  <Link to="/dashboard">
                    <AnimatedButton size="lg" className="w-full sm:w-auto">
                      Get Started
                    </AnimatedButton>
                  </Link>
                  
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto group transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 h-[400px] lg:h-[500px] overflow-hidden rounded-3xl glass-card animate-fade-left" style={{ animationDelay: "0.5s" }}>
              <ThreeJsAmbulance />
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Chat Demo Section */}
      <section className="py-16 lg:py-20 relative overflow-hidden bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-on-scroll fade-up">
              Try It Out
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              See Es3af In Action
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Experience how Es3af provides accurate, detailed responses to complex medical queries.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-subtle overflow-hidden animate-on-scroll fade-up">
            <div className="bg-primary/10 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-2 text-sm font-medium">Es3af Medical Chat</div>
            </div>
            
            <div className="p-6 h-[300px] flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <div className="flex items-start max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="p-3 rounded-2xl bg-primary/5 rounded-tl-sm">
                      <p>Hello! I'm Es3af, your medical AI assistant. How can I help you today?</p>
                    </div>
                  </div>
                </div>
                
                {showDemo && (
                  <>
                    <div className="flex justify-end">
                      <div className="p-3 rounded-2xl bg-primary text-white rounded-tr-sm max-w-[80%]">
                        <p>I have a 22-year-old patient with chest pain, fever, and elevated troponin levels following a viral illness. What could this be?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <MessageSquare size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="p-3 rounded-2xl bg-primary/5 rounded-tl-sm">
                          <p>{demoMessage}</p>
                          {isTyping && <span className="inline-block h-3 w-3 bg-gray-500 rounded-full animate-pulse ml-1"></span>}
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
                  className="w-full transition-all duration-300 hover:shadow-md"
                >
                  {showDemo ? "Chat Demo Running..." : "Start Chat Demo"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with scroll-triggered animations */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-on-scroll fade-up">
              Powerful Features
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Elevate Your Medical Knowledge
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Es3af combines cutting-edge AI technology with comprehensive medical knowledge to provide an invaluable resource for medical students and professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-none shadow-none bg-white dark:bg-gray-800 animate-on-scroll fade-up overflow-hidden group hover:shadow-subtle transition-all duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CardContent className="p-6 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
                <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-primary/5 rounded-full transition-all duration-500 group-hover:scale-150"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section with animations */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-on-scroll fade-up">
              Simple Process
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              How Es3af Works
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Getting accurate medical information has never been easier. Es3af provides a seamless experience from question to answer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-on-scroll fade-up bg-white dark:bg-gray-800 p-8 rounded-xl shadow-subtle hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-md">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask Your Question</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Type your medical query in natural language, just as you would ask a professor or colleague.
              </p>
            </div>
            
            <div className="text-center animate-on-scroll fade-up bg-white dark:bg-gray-800 p-8 rounded-xl shadow-subtle hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-md">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI analyzes your question and searches through validated medical knowledge.
              </p>
            </div>
            
            <div className="text-center animate-on-scroll fade-up bg-white dark:bg-gray-800 p-8 rounded-xl shadow-subtle hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-md">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Accurate Answer</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get a detailed, evidence-based response that helps deepen your understanding of the topic.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Ready to Enhance Your Medical Knowledge?
            </h2>
            
            <p className="text-xl opacity-90 mb-8 animate-on-scroll fade-up" style={{ animationDelay: "0.1s" }}>
              Join medical students worldwide who are using Es3af to study more effectively and gain deeper insights.
            </p>
            
            <Link to="/dashboard" className="animate-on-scroll fade-up" style={{ animationDelay: "0.2s" }}>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-primary hover:text-primary-600 transition-colors hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Start Using Es3af Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
