import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  RotateCcw,
  Home,
  BarChart3,
  Zap,
  Target,
  Brain,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Quiz, QuizQuestion, QuizAnswer, QuizResult } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@clerk/clerk-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz | null;
  onCompleteQuiz: (result: QuizResult) => void;
}

type QuizScreen = 'start' | 'question' | 'results' | 'review' | 'attempts';

export function QuizModal({
  isOpen,
  onClose,
  quiz,
  onCompleteQuiz
}: QuizModalProps) {
  const [currentScreen, setCurrentScreen] = useState<QuizScreen>('start');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<Date | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState<QuizResult | null>(null);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false); // Prevent race conditions
  
  // Use ref to track timeRemaining to avoid dependency issues
  const timeRemainingRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const quizDataRef = useRef({ quiz, currentQuestionIndex, selectedAnswer, timeElapsed, answers, startTime, onCompleteQuiz });
  
  // Get userId from Clerk authentication
  const { userId } = useAuth();
  
  // Initialize useQuiz hook
  const { startQuizAttempt, completeQuizAttempt } = useQuiz({ userId: userId || undefined });
  
  // Use ref for completeQuizAttempt to avoid dependency issues
  const completeQuizAttemptRef = useRef(completeQuizAttempt);

  // Update quizDataRef whenever relevant values change
  useEffect(() => {
    quizDataRef.current = { quiz, currentQuestionIndex, selectedAnswer, timeElapsed, answers, startTime, onCompleteQuiz };
    completeQuizAttemptRef.current = completeQuizAttempt;
  }, [quiz, currentQuestionIndex, selectedAnswer, timeElapsed, answers, startTime, onCompleteQuiz, completeQuizAttempt]);

  // Reset modal state when quiz changes
  useEffect(() => {
    // If quiz has a result, show attempts screen directly
    if (quiz?.result) {
      setCurrentScreen('attempts');
      setQuizResult(quiz.result);
    } else {
      setCurrentScreen('start');
    }
    setSelectedAnswer('');
    setTimeElapsed(0);
    setTimeRemaining(null);
    timeRemainingRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(null);
    setCurrentQuestionStartTime(null);
    setReviewQuestionIndex(0);
    setCurrentAttempt(null);
    setIsCompleting(false); // Reset completion state
    if (!quiz?.result) {
      setQuizResult(null);
    }
  }, [quiz?.id, quiz?.result]);

  // Timer for current question
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentQuestionStartTime && currentScreen === 'question') {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - currentQuestionStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentQuestionStartTime, currentScreen]);

  // Countdown timer for entire quiz - fixed approach
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (currentScreen === 'question' && timeRemaining !== null && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime === null || prevTime <= 1) {
            // Time's up! Auto-submit the quiz
            const { quiz: currentQuiz, currentQuestionIndex: currentIndex, selectedAnswer: currentAnswer, timeElapsed: currentTimeElapsed, answers: currentAnswers, startTime: currentStartTime, onCompleteQuiz: currentOnCompleteQuiz } = quizDataRef.current;
            
            // Prevent race condition - only complete if not already completing
            if (currentQuiz && currentIndex < currentQuiz.questions.length && currentAnswer && !isCompleting) {
              setIsCompleting(true); // Set completion flag to prevent race conditions
              const currentQuestion = currentQuiz.questions[currentIndex];
              // Ensure consistent comparison by normalizing both answers
              const normalizedSelectedAnswer = String(currentAnswer).trim().toUpperCase();
              const normalizedCorrectAnswer = String(currentQuestion.correctAnswer).trim().toUpperCase();
              const isCorrect = normalizedSelectedAnswer === normalizedCorrectAnswer;
              
              // Debug logging for correction logic
              console.log('Correction debug (timeout):', {
                currentAnswer,
                normalizedSelectedAnswer,
                correctAnswer: currentQuestion.correctAnswer,
                normalizedCorrectAnswer,
                isCorrect,
                questionId: currentQuestion.id,
                question: currentQuestion.question
              });
              
              const newAnswer: QuizAnswer = {
                questionId: currentQuestion.id,
                selectedAnswer: currentAnswer,
                isCorrect,
                timeSpent: currentTimeElapsed
              };
              
              // Check if we already have an answer for this question (user went back and changed it)
              const existingAnswerIndex = currentAnswers.findIndex(a => a.questionId === currentQuestion.id);
              let updatedAnswers: QuizAnswer[];
              
              if (existingAnswerIndex >= 0) {
                // Replace existing answer
                updatedAnswers = [...currentAnswers];
                updatedAnswers[existingAnswerIndex] = newAnswer;
              } else {
                // Add new answer
                updatedAnswers = [...currentAnswers, newAnswer];
              }
              
              setAnswers(updatedAnswers);
              
              // Move to next question or finish
              if (currentIndex + 1 >= currentQuiz.questions.length) {
                const totalTime = currentStartTime ? Math.floor((Date.now() - currentStartTime.getTime()) / 1000) : 0;
                const correctAnswers = updatedAnswers.filter(a => a.isCorrect).length;
                const totalQuestions = currentQuiz.questions.length;
                
                // Debug logging to track scoring issues
                console.log('Quiz scoring debug (timeout):', {
                  totalAnswers: updatedAnswers.length,
                  correctAnswers,
                  totalQuestions,
                  answers: updatedAnswers.map(a => ({ questionId: a.questionId, isCorrect: a.isCorrect, selectedAnswer: a.selectedAnswer }))
                });
                console.log('All answers details (timeout):', updatedAnswers);
                
                // Ensure score never exceeds 100% due to any calculation errors
                const score = Math.min(100, Math.round((correctAnswers / totalQuestions) * 100));

                const result: QuizResult = {
                  totalQuestions,
                  correctAnswers,
                  incorrectAnswers: totalQuestions - correctAnswers,
                  score,
                  timeSpent: totalTime,
                  answers: updatedAnswers,
                  completedAt: new Date()
                };

                setQuizResult(result);
                
                // Save the quiz attempt to the database
                if (currentAttemptId) {
                  completeQuizAttemptRef.current(currentAttemptId, result).catch(error => {
                    console.error('Failed to save quiz attempt:', error);
                    // Continue with local completion even if database save fails
                  });
                }
                
                setCurrentScreen('results');
                currentOnCompleteQuiz(result);
              } else {
                setCurrentQuestionIndex(currentIndex + 1);
                setCurrentQuestionStartTime(new Date());
                setSelectedAnswer('');
                setTimeElapsed(0);
                setIsCompleting(false); // Reset completion flag for next question
              }
            }
            
            // Clear timer
            timeRemainingRef.current = 0;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          
          const newTime = prevTime - 1;
          timeRemainingRef.current = newTime;
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentScreen, timeRemaining, currentAttemptId, isCompleting]); // Added isCompleting dependency

  const handleStartQuiz = async () => {
    if (!quiz) return;
    
    if (!userId) {
      console.error('User must be authenticated to start quiz');
      return;
    }
    
    try {
      // Create a new quiz attempt in the database
      const attemptId = await startQuizAttempt(quiz.id);
      setCurrentAttemptId(attemptId);
      
      setSelectedAnswer('');
      setTimeElapsed(0);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setStartTime(new Date());
      setCurrentQuestionStartTime(new Date());
      setQuizResult(null);
      
      // Set timer based on recommended time
      if (quiz.recommendedTime) {
        const timeInSeconds = quiz.recommendedTime * 60; // Convert minutes to seconds
        setTimeRemaining(timeInSeconds);
        timeRemainingRef.current = timeInSeconds;
      } else {
        setTimeRemaining(null);
        timeRemainingRef.current = null;
      }
      
      // Move to question screen
      setCurrentScreen('question');
    } catch (error) {
      console.error('Failed to start quiz attempt:', error);
      // Fallback to local state if database fails
      setSelectedAnswer('');
      setTimeElapsed(0);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setStartTime(new Date());
      setCurrentQuestionStartTime(new Date());
      setQuizResult(null);
      
      if (quiz.recommendedTime) {
        const timeInSeconds = quiz.recommendedTime * 60;
        setTimeRemaining(timeInSeconds);
        timeRemainingRef.current = timeInSeconds;
      } else {
        setTimeRemaining(null);
        timeRemainingRef.current = null;
      }
      
      setCurrentScreen('question');
    }
  };

  const handleAnswerSelect = (answer: string, index: number) => {
    // Store the option letter (A, B, C, D) instead of the full text
    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, etc.
    setSelectedAnswer(optionLetter);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !quiz || isCompleting) return; // Prevent race conditions

    setIsCompleting(true); // Set completion flag to prevent race conditions
    const currentQuestion = quiz.questions[currentQuestionIndex];
    // Ensure consistent comparison by normalizing both answers
    const normalizedSelectedAnswer = String(selectedAnswer).trim().toUpperCase();
    const normalizedCorrectAnswer = String(currentQuestion.correctAnswer).trim().toUpperCase();
    const isCorrect = normalizedSelectedAnswer === normalizedCorrectAnswer;
    
    // Debug logging for correction logic
    console.log('Correction debug (manual):', {
      selectedAnswer,
      normalizedSelectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      normalizedCorrectAnswer,
      isCorrect,
      questionId: currentQuestion.id,
      question: currentQuestion.question
    });
    
    // Create new answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent: timeElapsed
    };
    
    // Check if we already have an answer for this question (user went back and changed it)
    const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    let updatedAnswers: QuizAnswer[];
    
    if (existingAnswerIndex >= 0) {
      // Replace existing answer
      updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      // Add new answer
      updatedAnswers = [...answers, newAnswer];
    }
    
    setAnswers(updatedAnswers);
    setSelectedAnswer('');
    setTimeElapsed(0);

    // Check if this was the last question
    if (currentQuestionIndex + 1 >= quiz.questions.length) {
      // Calculate final result
      const totalTime = startTime 
        ? Math.floor((Date.now() - startTime.getTime()) / 1000)
        : 0;
      
      const correctAnswers = updatedAnswers.filter(a => a.isCorrect).length;
      const totalQuestions = quiz.questions.length;
      
      // Debug logging to track scoring issues
      console.log('Quiz scoring debug:', {
        totalAnswers: updatedAnswers.length,
        correctAnswers,
        totalQuestions,
        answers: updatedAnswers.map(a => ({ questionId: a.questionId, isCorrect: a.isCorrect, selectedAnswer: a.selectedAnswer }))
      });
      console.log('All answers details:', updatedAnswers);
      
      // Ensure score never exceeds 100% due to any calculation errors
      const score = Math.min(100, Math.round((correctAnswers / totalQuestions) * 100));

      const result: QuizResult = {
        totalQuestions,
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        score,
        timeSpent: totalTime,
        answers: updatedAnswers,
        completedAt: new Date()
      };

      setQuizResult(result);
      
      // Save the quiz attempt to the database
      if (currentAttemptId) {
        completeQuizAttempt(currentAttemptId, result).catch(error => {
          console.error('Failed to save quiz attempt:', error);
          // Continue with local completion even if database save fails
        });
      }
      
      setCurrentScreen('results');
      onCompleteQuiz(result);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestionStartTime(new Date());
      setIsCompleting(false); // Reset completion flag for next question
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentQuestionStartTime(new Date());
      setTimeElapsed(0);
      
      // Restore the previous answer if it exists
      const previousAnswer = answers.find(a => a.questionId === quiz?.questions[currentQuestionIndex - 1]?.id);
      setSelectedAnswer(previousAnswer?.selectedAnswer || '');
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswer('');
    setTimeElapsed(0);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(null);
    setCurrentQuestionStartTime(null);
    setQuizResult(null);
    setTimeRemaining(null);
    timeRemainingRef.current = null;
    setCurrentAttemptId(null);
    setIsCompleting(false); // Reset completion flag
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentScreen('start');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (!quiz) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-w-4xl max-h-[90vh] md:max-h-[90vh] h-screen md:h-[90vh] overflow-hidden p-0 w-screen md:w-auto">
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 border-b">
            <div className="mb-4">
              <h2 className="text-base md:text-lg font-bold">{quiz.title}</h2>
            </div>
            
            {/* Progress Section - Only show during quiz */}
            {currentScreen === 'question' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </span>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Question time: {formatTime(timeElapsed)}
                    </span>
                    {timeRemaining !== null && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-muted border">
                        <Clock className="h-3 w-3" />
                        {formatTime(timeRemaining)}
                      </div>
                    )}
                  </div>
                </div>
                <Progress 
                  value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
                  className="h-2"
                />
                {timeRemaining !== null && (
                  <Progress 
                    value={(timeRemaining / (quiz.recommendedTime! * 60)) * 100} 
                    className="h-1"
                  />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {currentScreen === 'start' && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  {/* Hero Section */}
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center">
                      <Brain className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">
                      Ready to Start?
                    </h3>
                    <p className="text-muted-foreground">
                      Test your knowledge with {quiz.questions.length} carefully crafted questions
                    </p>
                  </div>

                  {/* Quiz Info */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{quiz.questions.length}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{quiz.recommendedTime || 15}</div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleStartQuiz} 
                      size="lg" 
                      className="w-full max-w-sm"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Quiz
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-muted/50 border rounded-lg p-4 max-w-md mx-auto">
                    <h4 className="font-semibold mb-2">Instructions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                      <li>• Read each question carefully</li>
                      <li>• Select the best answer</li>
                      <li>• Take your time</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentScreen === 'question' && (
              <div className="p-4 md:p-6">
                <div className="max-w-3xl mx-auto">
                  {/* Question */}
                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {quiz.questions[currentQuestionIndex]?.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {quiz.questions[currentQuestionIndex]?.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(option, index)}
                            className={`w-full p-3 text-left border rounded-lg transition-colors ${
                              selectedAnswer === String.fromCharCode(65 + index)
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <span className="font-medium mr-3">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <Button 
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {currentQuestionIndex + 1 === quiz.questions.length 
                        ? 'Finish Quiz' 
                        : 'Next Question'
                      }
                      {currentQuestionIndex + 1 < quiz.questions.length && (
                        <ChevronRight className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentScreen === 'results' && quizResult && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  {/* Hero Section */}
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center">
                      <Trophy className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">
                      {quizResult.score >= 80 ? 'Great Job!' : 
                       quizResult.score >= 60 ? 'Well Done!' : 'Keep Learning!'}
                    </h3>
                    <p className="text-muted-foreground">
                      {quizResult.score >= 80 
                        ? 'You\'ve mastered this topic!' 
                        : quizResult.score >= 60 
                          ? 'You\'re on the right track!'
                          : 'Review the material and try again.'}
                    </p>
                  </div>

                  {/* Score Display */}
                  <div className="bg-muted/50 border rounded-lg p-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-primary">
                        {quizResult.score}%
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold">Final Score</p>
                        <p className="text-muted-foreground">
                          {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                    
                    {/* Performance Badge */}
                    <div className="flex justify-center">
                      <Badge 
                        variant={getScoreBadgeVariant(quizResult.score)}
                        className="text-sm px-4 py-2"
                      >
                        {quizResult.score >= 90 ? 'Master' :
                         quizResult.score >= 80 ? 'Excellent' :
                         quizResult.score >= 70 ? 'Good' :
                         quizResult.score >= 60 ? 'Fair' : 'Needs Practice'}
                      </Badge>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-primary">{quizResult.correctAnswers}</p>
                      <p className="text-sm text-muted-foreground">Correct</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-primary">{quizResult.incorrectAnswers}</p>
                      <p className="text-sm text-muted-foreground">Incorrect</p>
                    </div>
                  </div>

                  {/* Time Stats */}
                  <div className="bg-muted/50 border rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Time Spent</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{formatTime(quizResult.timeSpent)}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(quizResult.timeSpent / quizResult.totalQuestions)}s average per question
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleResetQuiz} 
                        variant="outline" 
                        size="lg"
                        className="w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retake Quiz
                      </Button>
                      <Button 
                        onClick={() => {
                          setCurrentAttempt(quizResult);
                          setCurrentScreen('review');
                        }} 
                        variant="secondary" 
                        size="lg"
                        className="w-full"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Review Answers
                      </Button>
                    </div>
                    <Button 
                      onClick={onClose} 
                      size="lg"
                      className="w-full"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentScreen === 'attempts' && quizResult && (
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Attempts Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Quiz Attempts</h3>
                    <p className="text-muted-foreground">
                      Review your quiz attempts and performance
                    </p>
                  </div>

                  {/* All Attempts */}
                  <div className="space-y-4">
                    {/* Latest Attempt */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Latest Attempt
                        </CardTitle>
                        <CardDescription>
                          Completed on {quizResult.completedAt ? new Date(quizResult.completedAt).toLocaleDateString() : 'Unknown date'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">{quizResult.score}%</div>
                            <div className="text-sm text-muted-foreground">Score</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">{quizResult.correctAnswers}</div>
                            <div className="text-sm text-muted-foreground">Correct</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">{Math.floor(quizResult.timeSpent / 60)}m {quizResult.timeSpent % 60}s</div>
                            <div className="text-sm text-muted-foreground">Time</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <Button 
                            onClick={() => {
                              setCurrentAttempt(quizResult);
                              setCurrentScreen('review');
                            }}
                            size="lg"
                            className="w-full"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Review Answers
                          </Button>
                          <Button 
                            onClick={() => setCurrentScreen('results')} 
                            variant="outline"
                            size="lg"
                            className="w-full"
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Previous Attempts */}
                    {quiz?.attempts && quiz.attempts.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold">Previous Attempts</h4>
                        {quiz.attempts.map((attempt, index) => (
                          <Card key={index} className="border-l-4 border-l-muted">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Attempt #{index + 1}</span>
                                  <Badge 
                                    variant={attempt.score >= 80 ? 'default' : 
                                           attempt.score >= 60 ? 'secondary' : 'destructive'}
                                  >
                                    {attempt.score}%
                                  </Badge>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(attempt.completedAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                <div className="text-center">
                                  <div className="font-medium">{attempt.correctAnswers}/{attempt.totalQuestions}</div>
                                  <div className="text-muted-foreground">Correct</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">{Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s</div>
                                  <div className="text-muted-foreground">Time</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">{Math.round(attempt.timeSpent / attempt.totalQuestions)}s</div>
                                  <div className="text-muted-foreground">Avg/Question</div>
                                </div>
                              </div>
                              
                              <Button 
                                onClick={() => {
                                  setCurrentAttempt(attempt);
                                  setCurrentScreen('review');
                                }}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Review This Attempt
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Back to Dashboard */}
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={onClose} 
                      variant="outline"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            )}

             {currentScreen === 'review' && currentAttempt && (() => {
               // Debug info
               console.log('Review screen - currentAttempt:', currentAttempt);
               console.log('Review screen - currentAttempt.answers:', currentAttempt.answers);
               console.log('Review screen - answers type:', typeof currentAttempt.answers);
               console.log('Review screen - answers length:', currentAttempt.answers?.length);
               console.log('Review screen - first answer:', currentAttempt.answers?.[0]);
              
              return (
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    {/* Review Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">Review Your Answers</h3>
                      <p className="text-muted-foreground">
                        Question {reviewQuestionIndex + 1} of {quiz.questions.length}
                      </p>
                    </div>

                  {/* Question Card */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {quiz.questions[reviewQuestionIndex]?.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {quiz.questions[reviewQuestionIndex]?.options.map((option, index) => {
                          const userAnswer = currentAttempt.answers.find(a => a.questionId === quiz.questions[reviewQuestionIndex].id);
                          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, etc.
                          const correctAnswer = String(quiz.questions[reviewQuestionIndex].correctAnswer).trim().toUpperCase();
                          const userSelectedAnswer = String(userAnswer?.selectedAnswer || '').trim().toUpperCase();
                          
                          const isCorrectAnswer = optionLetter === correctAnswer;
                          const isUserAnswer = optionLetter === userSelectedAnswer;
                          const isCorrect = userSelectedAnswer === correctAnswer;
                          
                          // Debug logging for review screen
                          console.log(`Review option ${optionLetter}:`, {
                            optionLetter,
                            correctAnswer: quiz.questions[reviewQuestionIndex].correctAnswer,
                            correctAnswerNormalized: correctAnswer,
                            userSelectedAnswer: userAnswer?.selectedAnswer,
                            userSelectedAnswerNormalized: userSelectedAnswer,
                            isCorrectAnswer,
                            isUserAnswer,
                            isCorrect,
                            userAnswer
                          });
                          
                          let buttonClass = "w-full p-3 text-left border rounded-lg transition-colors ";
                          
                          if (isCorrectAnswer) {
                            // Correct answer - always green
                            buttonClass += "border-green-500 bg-green-50 text-green-800 font-medium";
                          } else if (isUserAnswer && !isCorrect) {
                            // User selected wrong answer - red
                            buttonClass += "border-red-500 bg-red-50 text-red-800 font-medium";
                          } else if (isUserAnswer && isCorrect) {
                            // User selected correct answer - green (same as correct answer)
                            buttonClass += "border-green-500 bg-green-50 text-green-800 font-medium";
                          } else {
                            // Other options - muted
                            buttonClass += "border-border bg-muted/30 text-muted-foreground";
                          }

                          return (
                            <div key={index} className="relative">
                              <div className={buttonClass}>
                                <span className="font-medium mr-3">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                                {isCorrectAnswer && (
                                  <div className="absolute top-2 right-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  </div>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <div className="absolute top-2 right-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Explanation */}
                      {quiz.questions[reviewQuestionIndex]?.explanation && (
                        <div className="mt-4 p-4 bg-muted/50 border rounded-lg">
                          <h4 className="font-semibold mb-2">Explanation:</h4>
                          <p className="text-sm text-muted-foreground">
                            {quiz.questions[reviewQuestionIndex].explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="space-y-4">
                    {/* Question Navigation Poll */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quiz.questions.map((_, index) => {
                        const userAnswer = currentAttempt.answers.find(a => a.questionId === quiz.questions[index].id);
                        const correctAnswer = String(quiz.questions[index].correctAnswer).trim().toUpperCase();
                        const userSelectedAnswer = String(userAnswer?.selectedAnswer || '').trim().toUpperCase();
                        const isCorrect = userSelectedAnswer === correctAnswer;
                        const isCurrent = index === reviewQuestionIndex;
                        
                        // Additional validation for large quizzes
                        const hasAnswer = userAnswer && userAnswer.selectedAnswer;
                        
                        // Debug logging for navigation poll
                        console.log(`Question ${index + 1} navigation:`, {
                          questionId: quiz.questions[index].id,
                          userAnswer,
                          isCorrect,
                          isCurrent,
                          hasAnswer
                        });
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setReviewQuestionIndex(index)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                              isCurrent 
                                ? 'bg-primary text-primary-foreground' 
                                : hasAnswer && isCorrect === true
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : hasAnswer && isCorrect === false
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Previous/Next Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setReviewQuestionIndex(Math.max(0, reviewQuestionIndex - 1))}
                        disabled={reviewQuestionIndex === 0}
                        variant="outline"
                        size="lg"
                        className="flex-1"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <Button 
                        onClick={() => setReviewQuestionIndex(Math.min(quiz.questions.length - 1, reviewQuestionIndex + 1))}
                        disabled={reviewQuestionIndex === quiz.questions.length - 1}
                        variant="outline"
                        size="lg"
                        className="flex-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Back to Attempts */}
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={() => setCurrentScreen('attempts')} 
                      variant="outline"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Back to Attempts
                    </Button>
                  </div>
                </div>
              </div>
              );
            })()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
