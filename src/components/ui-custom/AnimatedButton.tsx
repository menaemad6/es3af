
import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  withArrow?: boolean;
  animationType?: "slide" | "scale" | "glow";
}

const AnimatedButton = ({
  children,
  withArrow = true,
  animationType = "slide",
  className,
  ...props
}: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getAnimationClasses = () => {
    switch (animationType) {
      case "scale":
        return "transform transition-transform duration-300 hover:scale-105 active:scale-95";
      case "glow":
        return "relative overflow-hidden hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow duration-300";
      case "slide":
      default:
        return cn(
          "relative overflow-hidden transition-all duration-300 ease-out group",
          isHovered ? "pl-6 pr-8" : "px-6"
        );
    }
  };
  
  return (
    <Button
      className={cn(
        getAnimationClasses(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {animationType === "slide" ? (
        <>
          <span
            className={cn(
              "inline-block transition-transform duration-300 ease-out",
              isHovered ? "-translate-x-1" : "translate-x-0"
            )}
          >
            {children}
          </span>
          
          {withArrow && (
            <ArrowRight
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 ease-out",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
            />
          )}
        </>
      ) : (
        <>
          <span className="relative z-10">{children}</span>
          
          {withArrow && (
            <ArrowRight className={cn(
              "ml-2 h-4 w-4 transition-transform duration-300",
              isHovered ? "translate-x-1" : "translate-x-0"
            )} />
          )}
          
          {animationType === "glow" && isHovered && (
            <span className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-400/20 animate-gradient-x"></span>
          )}
        </>
      )}
    </Button>
  );
};

export default AnimatedButton;
