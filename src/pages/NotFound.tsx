import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileQuestion, AlertCircle, MoveLeft, Home, CloudOff, Compass, MapPin, Coffee } from "lucide-react";

// Define animation styles in your global CSS instead of using jsx style tags
// Add this to your CSS file:
// @keyframes float {
//   0% { transform: translateY(0px) rotate(0deg); }
//   50% { transform: translateY(-20px) rotate(5deg); }
//   100% { transform: translateY(0px) rotate(0deg); }
// }
// .animate-float {
//   animation-name: float;
//   animation-timing-function: ease-in-out;
//   animation-iteration-count: infinite;
// }

interface FloatingIconProps {
  Icon: React.ElementType;
  size: number;
  delay: number;
  duration: number;
  x: number;
  y: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ Icon, size, delay, duration, x, y }) => {
  return (
    <div 
      className="absolute text-primary/20 dark:text-primary/10"
      style={{
        top: `${y}%`, 
        left: `${x}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <Icon size={size} />
    </div>
  );
};

const NotFound: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Generate floating icons
  const floatingIcons = [
    { Icon: FileQuestion, size: 56, delay: 0, duration: 15, x: 15, y: 20 },
    { Icon: CloudOff, size: 48, delay: 2, duration: 18, x: 80, y: 15 },
    { Icon: Compass, size: 42, delay: 1, duration: 12, x: 65, y: 65 },
    { Icon: MapPin, size: 36, delay: 4, duration: 16, x: 25, y: 75 },
    { Icon: Coffee, size: 32, delay: 3, duration: 14, x: 85, y: 80 },
    { Icon: AlertCircle, size: 38, delay: 5, duration: 17, x: 10, y: 40 }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4 sm:px-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-60 h-60 rounded-full bg-primary/20 blur-3xl"></div>
        
        {/* Floating icons */}
        {floatingIcons.map((icon, index) => (
          <FloatingIcon key={index} {...icon} />
        ))}
      </div>

      <div className={`glass-card p-6 sm:p-8 md:p-12 w-full max-w-md text-center ${isVisible ? 'animate-on-scroll active' : 'animate-on-scroll fade-up'}`}>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary mb-2">404</h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-4 sm:mb-6"></div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <a 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-primary hover:bg-primary-600 text-primary-foreground font-medium rounded-lg hover-float"
          >
            <Home size={18} />
            <span>Return to Home</span>
          </a>
          
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-secondary hover:bg-accent text-secondary-foreground font-medium rounded-lg hover-float"
          >
            <MoveLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-5 sm:mt-6 text-xs sm:text-sm text-muted-foreground truncate px-2">
          <p>Error at: <span className="font-mono">{location.pathname}</span></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;