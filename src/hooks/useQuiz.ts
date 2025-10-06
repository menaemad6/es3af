import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/supabase';
import { Quiz, QuizQuestion, QuizAnswer, QuizResult, QuizCreationData } from '@/types/quiz';

// Database API functions
const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('quizzes')
    .insert([{
      user_id: quizData.user_id,
      title: quizData.title,
      description: quizData.description,
      source: quizData.source,
      source_type: quizData.sourceType,
      questions: quizData.questions,
      recommended_time: quizData.recommendedTime || 15
    }])
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  
  // Transform database response to Quiz type
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source,
    sourceType: data.source_type,
    questions: data.questions,
    recommendedTime: data.recommended_time,
    createdAt: new Date(data.created_at),
    user_id: data.user_id
  } as Quiz;
};

const getUserQuizzes = async (userId: string): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_attempts (
        id,
        total_questions,
        correct_answers,
        incorrect_answers,
        score,
        time_spent,
        answers,
        completed_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data.map(quiz => {
    // Sort attempts by completed_at in descending order to get latest first
    const sortedAttempts = quiz.quiz_attempts?.sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    ) || [];
    
    // Get the latest attempt for backward compatibility
    const latestAttempt = sortedAttempts[0];
    const attempts = sortedAttempts.map(attempt => {
      // Debug logging for attempt answers
      console.log('Processing attempt answers:', {
        attemptId: attempt.id,
        rawAnswers: attempt.answers,
        answersType: typeof attempt.answers,
        answersLength: attempt.answers?.length
      });
      
      return {
        totalQuestions: attempt.total_questions,
        correctAnswers: attempt.correct_answers,
        incorrectAnswers: attempt.incorrect_answers,
        score: attempt.score,
        timeSpent: attempt.time_spent,
        answers: attempt.answers,
        completedAt: new Date(attempt.completed_at)
      };
    });

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      source: quiz.source,
      sourceType: quiz.source_type,
      questions: quiz.questions,
      recommendedTime: quiz.recommended_time,
      createdAt: new Date(quiz.created_at),
      completedAt: latestAttempt ? new Date(latestAttempt.completed_at) : undefined,
      result: latestAttempt ? {
        totalQuestions: latestAttempt.total_questions,
        correctAnswers: latestAttempt.correct_answers,
        incorrectAnswers: latestAttempt.incorrect_answers,
        score: latestAttempt.score,
        timeSpent: latestAttempt.time_spent,
        answers: latestAttempt.answers,
        completedAt: new Date(latestAttempt.completed_at)
      } : undefined,
      attempts
    } as Quiz;
  });
};

const getQuizById = async (quizId: string): Promise<Quiz> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_attempts (
        id,
        total_questions,
        correct_answers,
        incorrect_answers,
        score,
        time_spent,
        answers,
        completed_at
      )
    `)
    .eq('id', quizId)
    .single();

  if (error) throw new Error(error.message);

  // Sort attempts by completed_at in descending order to get latest first
  const sortedAttempts = data.quiz_attempts?.sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  ) || [];
  
  const latestAttempt = sortedAttempts[0];
  const attempts = sortedAttempts.map(attempt => ({
    totalQuestions: attempt.total_questions,
    correctAnswers: attempt.correct_answers,
    incorrectAnswers: attempt.incorrect_answers,
    score: attempt.score,
    timeSpent: attempt.time_spent,
    answers: attempt.answers,
    completedAt: new Date(attempt.completed_at)
  }));

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source,
    sourceType: data.source_type,
    questions: data.questions,
    recommendedTime: data.recommended_time,
    createdAt: new Date(data.created_at),
    completedAt: latestAttempt ? new Date(latestAttempt.completed_at) : undefined,
    result: latestAttempt ? {
      totalQuestions: latestAttempt.total_questions,
      correctAnswers: latestAttempt.correct_answers,
      incorrectAnswers: latestAttempt.incorrect_answers,
      score: latestAttempt.score,
      timeSpent: latestAttempt.time_spent,
      answers: latestAttempt.answers,
      completedAt: new Date(latestAttempt.completed_at)
    } : undefined,
    attempts
  } as Quiz;
};

const deleteQuiz = async (quizId: string) => {
  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', quizId);

  if (error) throw new Error(error.message);
};

const createQuizAttempt = async (quizId: string, userId: string) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([{
      quiz_id: quizId,
      user_id: userId,
      total_questions: 0,
      correct_answers: 0,
      incorrect_answers: 0,
      score: 0,
      time_spent: 0,
      answers: []
    }])
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const updateQuizAttempt = async (attemptId: string, result: QuizResult) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .update({
      total_questions: result.totalQuestions,
      correct_answers: result.correctAnswers,
      incorrect_answers: result.incorrectAnswers,
      score: result.score,
      time_spent: result.timeSpent,
      answers: result.answers,
      completed_at: result.completedAt.toISOString()
    })
    .eq('id', attemptId)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getQuizAttempts = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .order('completed_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data.map(attempt => {
    // Debug logging for quiz attempts
    console.log('Processing quiz attempt:', {
      attemptId: attempt.id,
      rawAnswers: attempt.answers,
      answersType: typeof attempt.answers,
      answersLength: attempt.answers?.length
    });
    
    return {
      totalQuestions: attempt.total_questions,
      correctAnswers: attempt.correct_answers,
      incorrectAnswers: attempt.incorrect_answers,
      score: attempt.score,
      timeSpent: attempt.time_spent,
      answers: attempt.answers,
      completedAt: new Date(attempt.completed_at)
    };
  }) as QuizResult[];
};

// Hook interface
interface UseQuizOptions {
  userId?: string;
}

interface UseQuizReturn {
  // State
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  isLoading: boolean;
  error: string | null;

  // Quiz Management
  createQuiz: (quizData: QuizCreationData & { user_id: string; questions?: QuizQuestion[]; recommendedTime?: number }) => Promise<Quiz>;
  getUserQuizzes: () => Promise<Quiz[]>;
  getQuizById: (quizId: string) => Promise<Quiz>;
  deleteQuiz: (quizId: string) => Promise<void>;

  // Quiz Attempts
  startQuizAttempt: (quizId: string) => Promise<string>; // Returns attempt ID
  completeQuizAttempt: (attemptId: string, result: QuizResult) => Promise<QuizResult>;
  getQuizAttempts: (quizId: string) => Promise<QuizResult[]>;

  // Utility
  resetQuiz: () => void;
}

export function useQuiz(options: UseQuizOptions = {}): UseQuizReturn {
  const { userId } = options;
  const queryClient = useQueryClient();
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Queries
  const { data: quizzes = [], isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['quizzes', userId],
    queryFn: () => getUserQuizzes(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createQuizMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: (newQuiz) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', userId] });
      setCurrentQuiz(newQuiz);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', userId] });
      setCurrentQuiz(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const startQuizAttemptMutation = useMutation({
    mutationFn: ({ quizId, userId }: { quizId: string; userId: string }) => 
      createQuizAttempt(quizId, userId),
    onError: (error) => {
      setError(error.message);
    },
  });

  const completeQuizAttemptMutation = useMutation({
    mutationFn: ({ attemptId, result }: { attemptId: string; result: QuizResult }) =>
      updateQuizAttempt(attemptId, result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', userId] });
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Actions
  const handleCreateQuiz = useCallback(async (quizData: QuizCreationData & { user_id: string; questions?: QuizQuestion[]; recommendedTime?: number }) => {
    const quizToCreate = {
      user_id: quizData.user_id,
      title: quizData.title,
      description: quizData.description,
      source: quizData.source,
      sourceType: quizData.sourceType,
      questions: quizData.questions || [], // Use provided questions or empty array
      recommendedTime: quizData.recommendedTime || 15
    };
    
    return createQuizMutation.mutateAsync(quizToCreate);
  }, [createQuizMutation]);

  const handleGetUserQuizzes = useCallback(async () => {
    if (!userId) throw new Error('User ID is required');
    return getUserQuizzes(userId);
  }, [userId]);

  const handleGetQuizById = useCallback(async (quizId: string) => {
    const quiz = await getQuizById(quizId);
    setCurrentQuiz(quiz);
    return quiz;
  }, []);

  const handleDeleteQuiz = useCallback(async (quizId: string) => {
    await deleteQuizMutation.mutateAsync(quizId);
  }, [deleteQuizMutation]);

  const handleStartQuizAttempt = useCallback(async (quizId: string) => {
    if (!userId) throw new Error('User ID is required');
    const attempt = await startQuizAttemptMutation.mutateAsync({ quizId, userId });
    return attempt.id;
  }, [userId, startQuizAttemptMutation]);

  const handleCompleteQuizAttempt = useCallback(async (attemptId: string, result: QuizResult) => {
    await completeQuizAttemptMutation.mutateAsync({ attemptId, result });
    return result;
  }, [completeQuizAttemptMutation]);

  const handleGetQuizAttempts = useCallback(async (quizId: string) => {
    return getQuizAttempts(quizId);
  }, []);

  const handleResetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setError(null);
  }, []);

  return {
    // State
    quizzes,
    currentQuiz,
    isLoading: isLoadingQuizzes || createQuizMutation.isPending || deleteQuizMutation.isPending,
    error,

    // Quiz Management
    createQuiz: handleCreateQuiz,
    getUserQuizzes: handleGetUserQuizzes,
    getQuizById: handleGetQuizById,
    deleteQuiz: handleDeleteQuiz,

    // Quiz Attempts
    startQuizAttempt: handleStartQuizAttempt,
    completeQuizAttempt: handleCompleteQuizAttempt,
    getQuizAttempts: handleGetQuizAttempts,

    // Utility
    resetQuiz: handleResetQuiz,
  };
}
