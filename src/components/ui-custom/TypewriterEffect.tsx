
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      // Typing
      if (!isDeleting && currentText !== word) {
        setCurrentText(word.substring(0, currentText.length + 1));
      } 
      // Start deleting
      else if (!isDeleting && currentText === word) {
        setTimeout(() => {
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
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseTime]);
  
  return (
    <span className={cn('typing-animation', className)}>
      {currentText}
    </span>
  );
};

export default TypewriterEffect;
