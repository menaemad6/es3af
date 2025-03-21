
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  loop?: boolean;
  cursorClassName?: string;
  cursorStyle?: 'block' | 'underscore' | 'pipe';
  textGradient?: boolean;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
  loop = true,
  cursorClassName,
  cursorStyle = 'pipe',
  textGradient = false
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timer = setTimeout(() => {
      // Typing
      if (!isDeleting && currentText !== word) {
        setCurrentText(word.substring(0, currentText.length + 1));
        setIsBlinking(false);
      } 
      // Start deleting
      else if (!isDeleting && currentText === word) {
        setIsBlinking(true);
        timerRef.current = setTimeout(() => {
          setIsBlinking(false);
          setIsDeleting(true);
        }, pauseTime);
      }
      // Deleting
      else if (isDeleting && currentText !== '') {
        setCurrentText(word.substring(0, currentText.length - 1));
      } 
      // Move to next word
      else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        if (loop || currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => {
      clearTimeout(timer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentText, currentWordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseTime, loop]);
  
  const getCursorChar = () => {
    switch (cursorStyle) {
      case 'block': return '█';
      case 'underscore': return '_';
      case 'pipe':
      default: return '|';
    }
  };
  
  return (
    <span className={cn(
      'inline-flex items-center',
      textGradient && 'bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600',
      className
    )}>
      {currentText}
      <span className={cn(
        'typing-cursor',
        isBlinking && 'animate-blink',
        cursorClassName
      )}>
        {getCursorChar()}
      </span>
    </span>
  );
};

export default TypewriterEffect;
