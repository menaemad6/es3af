
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Stethoscope, Microscope, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThreeJsAmbulance from "@/components/ui-custom/ThreeJsAmbulance";
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Intersection Observer setup for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observerRef.current?.unobserve(entry.target);
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
      
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
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
                    <Button variant="outline" size="lg" className="w-full sm:w-auto group">
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
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
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
              <Card key={index} className="border-none shadow-none bg-white dark:bg-gray-800 animate-on-scroll fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
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
            <div className="text-center animate-on-scroll fade-up">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask Your Question</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Type your medical query in natural language, just as you would ask a professor or colleague.
              </p>
            </div>
            
            <div className="text-center animate-on-scroll fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI analyzes your question and searches through validated medical knowledge.
              </p>
            </div>
            
            <div className="text-center animate-on-scroll fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
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
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-400">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Ready to Enhance Your Medical Knowledge?
            </h2>
            
            <p className="text-xl opacity-90 mb-8 animate-on-scroll fade-up" style={{ animationDelay: "0.1s" }}>
              Join medical students worldwide who are using Es3af to study more effectively and gain deeper insights.
            </p>
            
            <Link to="/dashboard" className="animate-on-scroll fade-up" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" variant="secondary" className="text-primary hover:text-primary-600 transition-colors">
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
