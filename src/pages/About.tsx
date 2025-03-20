
import { useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Book, Heart, Users, Code, Shield } from "lucide-react";

const About = () => {
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
      title: "Concept Development",
      description: "The idea for Es3af was born from recognizing the need for accessible medical information for students.",
    },
    {
      year: "2023",
      title: "Research Phase",
      description: "Extensive research into medical education needs and AI capabilities to ensure a valuable tool.",
    },
    {
      year: "2024",
      title: "Beta Launch",
      description: "Initial release to select medical schools for testing and feedback gathering.",
    },
    {
      year: "2024",
      title: "Public Release",
      description: "Es3af becomes available to medical students worldwide, beginning its mission to enhance medical education.",
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Our Story
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              About Es3af
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              Es3af is an innovative AI-powered medical assistant designed to revolutionize how medical students learn and understand complex medical concepts.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>
      
      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6">
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
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-subtle animate-on-scroll fade-left">
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
      
      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
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
              <Card key={index} className="border-none shadow-subtle animate-on-scroll fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
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
          
          <div className="max-w-3xl mx-auto">
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-6">
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className="mb-12 ml-8 animate-on-scroll fade-left"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="absolute w-6 h-6 bg-primary rounded-full -left-3 border-4 border-white dark:border-gray-900"></div>
                  <div className="absolute -left-16 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{item.year}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-subtle">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 animate-on-scroll fade-up">
              Behind Es3af
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll fade-up">
              Our Team
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 animate-on-scroll fade-up">
              Es3af is developed by a dedicated team of medical professionals, AI specialists, and education experts committed to advancing medical education.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-subtle max-w-3xl mx-auto animate-on-scroll fade-up">
            <h3 className="text-xl font-semibold mb-4">Join Our Team</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're always looking for talented individuals who share our passion for medical education and technological innovation. If you're interested in contributing to Es3af's mission, we'd love to hear from you.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Contact us at <a href="mailto:careers@es3af.com" className="text-primary hover:underline">careers@es3af.com</a> to learn about current opportunities.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
