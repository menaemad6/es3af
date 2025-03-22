import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Book, Heart, Users, Code, Shield, ArrowRight, ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const About = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState(40);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  // Track cursor position for custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Generate multiple particles on mouse movement
      if (particlesRef.current) {
        // Increase particle generation probability (reduced threshold from 0.7 to 0.3)
        if (Math.random() > 0.3) {
          // Generate 3-5 particles instead of just one
          const particleCount = Math.floor(Math.random() * 10) + 3;
          
          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Random size for variety (between 1-3px)
            const size = Math.random() * 2 + 1;
            
            // Random offset from cursor position (within 15px radius)
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            
            // Random opacity for visual interest
            const opacity = Math.random() * 0.5 + 0.2;
            
            // Apply styles
            particle.className = 'absolute rounded-full bg-primary animate-particle';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${e.clientX + offsetX}px`;
            particle.style.top = `${e.clientY + offsetY}px`;
            particle.style.opacity = `${opacity}`;
            
            particlesRef.current.appendChild(particle);
            
            // Remove particle after animation (with random duration for variety)
            const duration = 800 + Math.random() * 400; // 800-1200ms
            setTimeout(() => {
              if (particlesRef.current && particlesRef.current.contains(particle)) {
                particlesRef.current.removeChild(particle);
              }
            }, duration);
          }
        }
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





  
  const values = [
    {
      title: "Accuracy",
      description: "We're committed to providing medically accurate information based on the latest research and guidelines.",
      icon: Brain,
    },
    {
      title: "Education",
      description: "Our mission is to enhance medical education through accessible, high-quality information.",
      icon: Book,
    },
    {
      title: "Empathy",
      description: "We understand the challenges of medical education and design our platform with students' needs in mind.",
      icon: Heart,
    },
    {
      title: "Community",
      description: "We believe in fostering a supportive community of medical learners and professionals.",
      icon: Users,
    },
    {
      title: "Innovation",
      description: "We continuously improve our AI to better serve the evolving needs of medical education.",
      icon: Code,
    },
    {
      title: "Privacy",
      description: "We prioritize the security and confidentiality of all user interactions on our platform.",
      icon: Shield,
    },
  ];
  
  const timeline = [
    {
      year: "2023",
      quarter: "Q1",
      title: "Concept Development",
      description: "The idea for Es3af was born from recognizing the need for accessible medical information for students.",
    },
    {
      year: "2023",
      quarter: "Q2",
      title: "Research Phase",
      description: "Extensive research into medical education needs and AI capabilities to ensure a valuable tool.",
    },
    {
      year: "2023",
      quarter: "Q4",
      title: "Beta Development",
      description: "Building and refining our AI model with medical experts to ensure accuracy and relevance.",
    },
    {
      year: "2024",
      quarter: "Q1",
      title: "Beta Launch",
      description: "Initial release to select medical schools for testing and feedback gathering.",
    },
    {
      year: "2024",
      quarter: "Q2",
      title: "Public Release",
      description: "Es3af becomes available to medical students worldwide, beginning its mission to enhance medical education.",
    },
  ];
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "4th Year Medical Student",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      quote: "Es3af has revolutionized how I study for exams. The ability to get instant, accurate answers to complex questions has saved me countless hours of research.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Neurology Resident",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      quote: "Even as a resident, I find Es3af incredibly useful for quickly reviewing concepts and staying up-to-date with the latest medical knowledge.",
      rating: 5,
    },
    {
      name: "Aisha Patel",
      role: "2nd Year Medical Student",
      image: "https://images.unsplash.com/photo-1551836022-aadb801c60e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      quote: "As a visual learner, I appreciate how Es3af explains complex medical concepts clearly and comprehensively. It's like having a tutor available 24/7.",
      rating: 4,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col cursor-none">
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
      
      {/* Hero Section with moving background */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background"></div>
        <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-300/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-green-300/10 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Our Story
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              About <span className="text-primary">Es3af</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              Es3af is an innovative AI-powered medical assistant designed to revolutionize how medical students learn and understand complex medical concepts.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission Section with animated elements */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-1 bg-primary mb-6 animate-on-scroll fade-up"></div>
                <h2 className="text-3xl font-bold mb-6 animate-on-scroll fade-up">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 animate-on-scroll fade-up">
                  At Es3af, our mission is to democratize access to accurate medical knowledge, making it easier for medical students to learn, retain, and apply complex medical concepts.
                </p>
                <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
                  We believe that by leveraging the power of artificial intelligence, we can create a tool that serves as a reliable study companion, helping future healthcare professionals build a strong foundation of medical knowledge.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-subtle animate-on-scroll fade-left border border-gray-100 dark:border-gray-700 relative group">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-primary/20 rounded-md"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-primary/20 rounded-md"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100"></div>
                
                <h3 className="text-xl font-semibold mb-4">Why "Es3af"?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The name "Es3af" means "Ambulance" in Arabic, symbolizing our commitment to providing rapid, reliable assistance when medical students need it most.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Just as an ambulance delivers timely medical care in emergencies, Es3af delivers timely medical information when students face challenging concepts or questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section with hover effects */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 animate-on-scroll fade-up">
              What We Stand For
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Our Core Values
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              These principles guide everything we do at Es3af, from the development of our AI to our interactions with users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="border-none shadow-subtle hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-on-scroll fade-up group" 
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CardContent className="p-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </CardContent>
                <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-primary/5 rounded-full transform scale-0 group-hover:scale-150 transition-all duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline Section with animated progress */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 animate-on-scroll fade-up">
              Our Journey
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              The Es3af Timeline
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              From concept to reality, follow the evolution of Es3af as we work to transform medical education.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary to-primary/40 ml-px md:-ml-px"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "relative flex flex-col md:flex-row md:items-center animate-on-scroll",
                    index % 2 === 0 ? "md:flex-row-reverse text-left md:text-right fade-left" : "fade-right"
                  )}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {/* Center dot */}
                  <div className="absolute left-[15px] md:left-1/2 top-0 w-8 h-8 bg-primary rounded-full transform -translate-x-1/2 shadow-lg border-4 border-white dark:border-gray-900 z-10"></div>
                  
                  {/* Date card */}
                  <div className={cn(
                    "w-full md:w-[45%] pb-8 md:pb-0",
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12 order-2 md:order-none"
                  )}>
                    <div className="ml-12 md:ml-0 bg-primary text-white px-4 py-2 rounded-lg inline-block shadow-subtle">
                      <div className="font-bold">{item.year} {item.quarter}</div>
                    </div>
                  </div>
                  
                  {/* Content card */}
                  <div className={cn(
                    "w-full md:w-[45%]",
                    index % 2 === 0 ? "md:pr-12 order-1 md:order-none" : "md:pl-12"
                  )}>
                    <div className="ml-12 md:ml-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-subtle border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with carousel */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 animate-on-scroll fade-up">
              User Experiences
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              What Students Say
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Hear from medical students about how Es3af is transforming their learning experience.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-subtle">
              <div className="flex transition-all duration-500" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="md:w-1/3 flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/10">
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 text-center md:text-left">
                        <div className="flex justify-center md:justify-start mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-5 h-5", 
                                i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              )} 
                            />
                          ))}
                        </div>
                        
                        <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setActiveTestimonial(prev => (prev > 0 ? prev - 1 : testimonials.length - 1))}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        activeTestimonial === index ? "bg-primary w-6" : "bg-gray-300 dark:bg-gray-600"
                      )}
                      onClick={() => setActiveTestimonial(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setActiveTestimonial(prev => (prev < testimonials.length - 1 ? prev + 1 : 0))}
                  className="rounded-full"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-400 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4 animate-on-scroll fade-up">
              Behind Es3af
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Our Team
            </h2>
            
            <p className="opacity-90 animate-on-scroll fade-up">
              Es3af is developed by a dedicated team of medical professionals, AI specialists, and education experts committed to advancing medical education.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-3xl mx-auto animate-on-scroll fade-up hover:bg-white/20 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Join Our Team</h3>
            <p className="mb-4">
              We're always looking for talented individuals who share our passion for medical education and technological innovation. If you're interested in contributing to Es3af's mission, we'd love to hear from you.
            </p>
            <p>
              Contact us at <a href="mailto:careers@es3af.com" className="text-white underline hover:text-white/80 transition-colors">careers@es3af.com</a> to learn about current opportunities.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
