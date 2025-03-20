
import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  withArrow?: boolean;
}

const AnimatedButton = ({
  children,
  withArrow = true,
  className,
  ...props
}: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out group",
        isHovered ? "pl-6 pr-8" : "px-6",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
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
    </Button>
  );
};

export default AnimatedButton;
