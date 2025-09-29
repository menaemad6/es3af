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

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz | null;
  onCompleteQuiz: (result: QuizResult) => void;
}

type QuizScreen = 'start' | 'question' | 'results';

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
  
  // Use ref to track timeRemaining to avoid dependency issues
  const timeRemainingRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const quizDataRef = useRef({ quiz, currentQuestionIndex, selectedAnswer, timeElapsed, answers, startTime, onCompleteQuiz });

  // Update quizDataRef whenever relevant values change
  useEffect(() => {
    quizDataRef.current = { quiz, currentQuestionIndex, selectedAnswer, timeElapsed, answers, startTime, onCompleteQuiz };
  }, [quiz, currentQuestionIndex, selectedAnswer, timeElapsed, answers, startTime, onCompleteQuiz]);

  // Reset modal state when quiz changes
  useEffect(() => {
    setCurrentScreen('start');
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
    setQuizResult(null);
  }, [quiz?.id]);

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

  // Countdown timer for entire quiz - robust approach
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (currentScreen === 'question' && timeRemainingRef.current !== null && timeRemainingRef.current > 0) {
      intervalRef.current = setInterval(() => {
        const currentTime = timeRemainingRef.current;
        if (currentTime === null || currentTime <= 1) {
          // Time's up! Auto-submit the quiz
          const { quiz: currentQuiz, currentQuestionIndex: currentIndex, selectedAnswer: currentAnswer, timeElapsed: currentTimeElapsed, answers: currentAnswers, startTime: currentStartTime, onCompleteQuiz: currentOnCompleteQuiz } = quizDataRef.current;
          
          if (currentQuiz && currentIndex < currentQuiz.questions.length && currentAnswer) {
            const currentQuestion = currentQuiz.questions[currentIndex];
            const isCorrect = currentAnswer === currentQuestion.correctAnswer;
            
            const newAnswer: QuizAnswer = {
              questionId: currentQuestion.id,
              selectedAnswer: currentAnswer,
              isCorrect,
              timeSpent: currentTimeElapsed
            };
            
            const updatedAnswers = [...currentAnswers, newAnswer];
            setAnswers(updatedAnswers);
            
            // Move to next question or finish
            if (currentIndex + 1 >= currentQuiz.questions.length) {
              const totalTime = currentStartTime ? Math.floor((Date.now() - currentStartTime.getTime()) / 1000) : 0;
              const correctAnswers = updatedAnswers.filter(a => a.isCorrect).length;
              const totalQuestions = currentQuiz.questions.length;
              const score = Math.round((correctAnswers / totalQuestions) * 100);

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
              setCurrentScreen('results');
              currentOnCompleteQuiz(result);
            } else {
              setCurrentQuestionIndex(currentIndex + 1);
              setCurrentQuestionStartTime(new Date());
              setSelectedAnswer('');
              setTimeElapsed(0);
            }
          }
          
          // Clear timer
          timeRemainingRef.current = 0;
          setTimeRemaining(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        
        const newTime = currentTime - 1;
        timeRemainingRef.current = newTime;
        setTimeRemaining(newTime);
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentScreen]); // Only depend on currentScreen

  const handleStartQuiz = () => {
    setSelectedAnswer('');
    setTimeElapsed(0);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(new Date());
    setCurrentQuestionStartTime(new Date());
    setQuizResult(null);
    
    // Set timer based on recommended time
    if (quiz?.recommendedTime) {
      const timeInSeconds = quiz.recommendedTime * 60; // Convert minutes to seconds
      setTimeRemaining(timeInSeconds);
      timeRemainingRef.current = timeInSeconds;
    }
    
    // Move to question screen
    setCurrentScreen('question');
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Add answer to our internal state
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent: timeElapsed
    };
    
    const updatedAnswers = [...answers, newAnswer];
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
      const score = Math.round((correctAnswers / totalQuestions) * 100);

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
      setCurrentScreen('results');
      onCompleteQuiz(result);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestionStartTime(new Date());
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
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full p-3 text-left border rounded-lg transition-colors ${
                              selectedAnswer === option
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
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button 
                      onClick={handleResetQuiz} 
                      variant="outline" 
                      size="lg"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Button>
                    <Button 
                      onClick={onClose} 
                      size="lg"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
