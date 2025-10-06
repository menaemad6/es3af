// BACKUP: This file contains the old localStorage-based quiz storage logic
// This file is kept as a backup during the migration to database-driven storage
// It can be deleted once the migration is complete and tested

import { useState, useEffect, useCallback } from 'react';
import { Quiz, QuizState, QuizStorage, QuizResult, QuizAnswer } from '@/types/quiz';

const QUIZ_STORAGE_KEY = 'mediquick_quiz_storage';

const initialQuizState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  isQuizActive: false,
  isQuizCompleted: false,
  startTime: null,
  currentQuestionStartTime: null,
};

const initialStorage: QuizStorage = {
  quizzes: [],
  currentState: initialQuizState,
};

export function useQuizStorage() {
  const [storage, setStorage] = useState<QuizStorage>(initialStorage);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved) {
        const parsedStorage = JSON.parse(saved);
        // Convert date strings back to Date objects
        if (parsedStorage.currentState.startTime) {
          parsedStorage.currentState.startTime = new Date(parsedStorage.currentState.startTime);
        }
        if (parsedStorage.currentState.currentQuestionStartTime) {
          parsedStorage.currentState.currentQuestionStartTime = new Date(parsedStorage.currentState.currentQuestionStartTime);
        }
        if (parsedStorage.currentState.currentQuiz?.createdAt) {
          parsedStorage.currentState.currentQuiz.createdAt = new Date(parsedStorage.currentState.currentQuiz.createdAt);
        }
        if (parsedStorage.currentState.currentQuiz?.completedAt) {
          parsedStorage.currentState.currentQuiz.completedAt = new Date(parsedStorage.currentState.currentQuiz.completedAt);
        }
        if (parsedStorage.currentState.currentQuiz?.result?.completedAt) {
          parsedStorage.currentState.currentQuiz.result.completedAt = new Date(parsedStorage.currentState.currentQuiz.result.completedAt);
        }
        // Convert dates in quizzes array
        parsedStorage.quizzes = parsedStorage.quizzes.map((quiz: Quiz) => ({
          ...quiz,
          createdAt: new Date(quiz.createdAt),
          completedAt: quiz.completedAt ? new Date(quiz.completedAt) : undefined,
          result: quiz.result ? {
            ...quiz.result,
            completedAt: new Date(quiz.result.completedAt)
          } : undefined,
          attempts: quiz.attempts ? quiz.attempts.map((attempt: QuizResult) => ({
            ...attempt,
            completedAt: new Date(attempt.completedAt)
          })) : []
        }));
        setStorage(parsedStorage);
      }
    } catch (error) {
      console.error('Error loading quiz storage:', error);
    }
  }, []);

  // Save to localStorage whenever storage changes
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Error saving quiz storage:', error);
    }
  }, [storage]);

  const saveQuiz = useCallback((quiz: Quiz) => {
    setStorage(prev => {
      const existingQuiz = prev.quizzes.find(q => q.id === quiz.id);
      
      console.log('Saving quiz:', quiz);
      console.log('Existing quiz:', existingQuiz);
      console.log('Quiz has result:', !!quiz.result);
      
      if (existingQuiz && quiz.result) {
        // If this is a new attempt with a result, add it to the attempts array
        const updatedQuiz: Quiz = {
          ...quiz,
          attempts: [
            quiz.result,
            ...(existingQuiz.attempts || [])
          ]
        };
        
        console.log('Adding new attempt. Updated quiz:', updatedQuiz);
        
        return {
          ...prev,
          quizzes: [updatedQuiz, ...prev.quizzes.filter(q => q.id !== quiz.id)]
        };
      } else if (existingQuiz && !quiz.result) {
        // If this is a retake (no result yet), preserve existing attempts
        const updatedQuiz: Quiz = {
          ...quiz,
          attempts: quiz.attempts || existingQuiz.attempts || [] // Use quiz attempts first, then existing
        };
        
        console.log('Retaking quiz. Preserving attempts:', updatedQuiz);
        console.log('Quiz attempts:', quiz.attempts);
        console.log('Existing attempts:', existingQuiz.attempts);
        
        return {
          ...prev,
          quizzes: [updatedQuiz, ...prev.quizzes.filter(q => q.id !== quiz.id)]
        };
      } else {
        // New quiz or quiz without result
        console.log('New quiz or no existing quiz');
        return {
          ...prev,
          quizzes: [quiz, ...prev.quizzes.filter(q => q.id !== quiz.id)]
        };
      }
    });
  }, []);

  const deleteQuiz = useCallback((quizId: string) => {
    setStorage(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter(q => q.id !== quizId),
      currentState: prev.currentState.currentQuiz?.id === quizId 
        ? initialQuizState 
        : prev.currentState
    }));
  }, []);

  const startQuiz = useCallback((quiz: Quiz) => {
    setStorage(prev => ({
      ...prev,
      currentState: {
        currentQuiz: quiz,
        currentQuestionIndex: 0,
        answers: [],
        isQuizActive: true,
        isQuizCompleted: false,
        startTime: new Date(),
        currentQuestionStartTime: new Date(),
      }
    }));
  }, []);

  const answerQuestion = useCallback((questionId: string, selectedAnswer: string, isCorrect: boolean) => {
    setStorage(prev => {
      if (!prev.currentState.currentQuiz || !prev.currentState.currentQuestionStartTime) {
        return prev;
      }

      const timeSpent = Math.floor((Date.now() - prev.currentState.currentQuestionStartTime.getTime()) / 1000);
      const newAnswer: QuizAnswer = {
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent
      };

      const updatedAnswers = [
        ...prev.currentState.answers.filter(a => a.questionId !== questionId),
        newAnswer
      ];

      const nextQuestionIndex = prev.currentState.currentQuestionIndex + 1;
      const isLastQuestion = nextQuestionIndex >= prev.currentState.currentQuiz.questions.length;

      return {
        ...prev,
        currentState: {
          ...prev.currentState,
          answers: updatedAnswers,
          currentQuestionIndex: nextQuestionIndex,
          isQuizCompleted: isLastQuestion,
          currentQuestionStartTime: isLastQuestion ? null : new Date(),
        }
      };
    });
  }, []);

  const completeQuiz = useCallback((result: QuizResult) => {
    setStorage(prev => {
      if (!prev.currentState.currentQuiz || !prev.currentState.startTime) {
        return prev;
      }

      const completedQuiz: Quiz = {
        ...prev.currentState.currentQuiz,
        completedAt: new Date(),
        result
      };

      return {
        ...prev,
        quizzes: [completedQuiz, ...prev.quizzes.filter(q => q.id !== completedQuiz.id)],
        currentState: {
          ...prev.currentState,
          isQuizActive: false,
          isQuizCompleted: true,
        }
      };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setStorage(prev => ({
      ...prev,
      currentState: initialQuizState
    }));
  }, []);

  const getQuizById = useCallback((quizId: string): Quiz | undefined => {
    return storage.quizzes.find(q => q.id === quizId);
  }, [storage.quizzes]);

  const getCompletedQuizzes = useCallback((): Quiz[] => {
    return storage.quizzes.filter(q => q.completedAt);
  }, [storage.quizzes]);

  const getIncompleteQuizzes = useCallback((): Quiz[] => {
    return storage.quizzes.filter(q => !q.completedAt);
  }, [storage.quizzes]);

  const clearAllQuizzes = useCallback(() => {
    setStorage(prev => ({
      ...prev,
      quizzes: [],
      currentState: initialQuizState
    }));
  }, []);

  return {
    // State
    quizzes: storage.quizzes,
    currentState: storage.currentState,
    
    // Actions
    saveQuiz,
    deleteQuiz,
    startQuiz,
    answerQuestion,
    completeQuiz,
    resetQuiz,
    
    // Getters
    getQuizById,
    getCompletedQuizzes,
    getIncompleteQuizzes,
    clearAllQuizzes,
  };
}
