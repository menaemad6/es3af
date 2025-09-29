import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  FileText, 
  Clock, 
  Trophy, 
  Trash2, 
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
  Target,
  Zap,
  Brain,
  Award,
  TrendingUp
} from 'lucide-react';
import { QuizCreationForm } from './QuizCreationForm';
import { QuizModal } from './QuizModal';
import { useQuizGeneration } from '@/hooks/useQuizGeneration';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import { QuizCreationData, Quiz, QuizResult } from '@/types/quiz';
import { toast } from 'sonner';

export function QuizSection() {
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showRetakeConfirmation, setShowRetakeConfirmation] = useState<Quiz | null>(null);

  const { generateQuizQuestions, isGenerating, error: generationError } = useQuizGeneration({
    questionsPerChunk: 12,
    maxChunkSize: 5000, // Reduced chunk size to trigger chunking more easily
    temperature: 0.3,
    maxTokens: 4000
  });
  
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const {
    quizzes,
    saveQuiz,
    deleteQuiz,
    getCompletedQuizzes,
    getIncompleteQuizzes
  } = useQuizStorage();

  const handleCreateQuiz = async (data: QuizCreationData) => {
    try {
      // Set processing state for PDF files
      if (data.sourceType === 'pdf' && data.pdfFile) {
        setIsProcessingPDF(true);
        toast.info('Processing PDF... Using OCR for optimal text extraction (may take a moment).');
      }
      
      const result = await generateQuizQuestions(data);
      
      if (result.success && result.questions) {
        const newQuiz: Quiz = {
          id: `quiz_${Date.now()}`,
          title: result.title || 'Generated Quiz',
          description: result.description || 'Test your knowledge with this AI-generated quiz',
          source: data.source,
          sourceType: data.sourceType,
          questions: result.questions,
          recommendedTime: result.recommendedTime || 15,
          createdAt: new Date()
        };

        saveQuiz(newQuiz);
        setShowCreationForm(false);
        
        // Show different success messages based on extraction method
        if (result.extractionMethod === 'ocr') {
          toast.success('Quiz created successfully! (OCR extraction)', {
            description: 'Your PDF was processed using Optical Character Recognition for optimal text extraction.'
          });
        } else {
          toast.success('Quiz created successfully! (PDF.js fallback)', {
            description: 'Your PDF was processed using standard text extraction as OCR fallback.'
          });
        }
        
        // Automatically open the quiz modal for the newly created quiz
        setSelectedQuiz(newQuiz);
        setShowQuizModal(true);
      } else {
        toast.error(result.error || 'Failed to generate quiz questions');
      }
    } catch (error) {
      toast.error('An error occurred while creating the quiz');
      console.error('Quiz creation error:', error);
    } finally {
      setIsProcessingPDF(false);
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
    // Don't start the quiz yet - wait for user to click start in the modal
  };

  const handleRetakeQuiz = (quiz: Quiz) => {
    setShowRetakeConfirmation(quiz);
  };

  const confirmRetakeQuiz = () => {
    if (showRetakeConfirmation) {
      // Reset the quiz result to allow retaking
      const updatedQuiz = {
        ...showRetakeConfirmation,
        result: undefined,
        completedAt: undefined
      };
      saveQuiz(updatedQuiz);
      setShowRetakeConfirmation(null);
      
      // Close modal first
      setSelectedQuiz(null);
      setShowQuizModal(false);
      
      // Then open the modal with the reset quiz
      setTimeout(() => {
        setSelectedQuiz(updatedQuiz);
        setShowQuizModal(true);
      }, 100);
      
      toast.success('Quiz reset! Starting fresh attempt.');
    }
  };

  const handleCompleteQuiz = (result: QuizResult) => {
    // Update the quiz with the result
    if (selectedQuiz) {
      const updatedQuiz = {
        ...selectedQuiz,
        result,
        completedAt: new Date()
      };
      saveQuiz(updatedQuiz);
    }
    toast.success(`Quiz completed! Score: ${result.score}%`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(quizId);
      toast.success('Quiz deleted successfully');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const completedQuizzes = getCompletedQuizzes();
  const incompleteQuizzes = getIncompleteQuizzes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Source to Quiz
          </h2>
          <p className="text-muted-foreground">
            Create quizzes from your source material using AI
          </p>
        </div>
        <Button 
          onClick={() => setShowCreationForm(true)}
          size="lg"
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Quiz
        </Button>
      </div>

      {/* Creation Form */}
      {showCreationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Create New Quiz</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCreationForm(false)}
                >
                  ×
                </Button>
              </div>
              <QuizCreationForm
                onSubmit={handleCreateQuiz}
                isLoading={isGenerating || isProcessingPDF}
                error={generationError || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizModal
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedQuiz(null);
          }}
          quiz={selectedQuiz}
          onCompleteQuiz={handleCompleteQuiz}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quizzes.length}</p>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedQuizzes.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{incompleteQuizzes.length}</p>
                <p className="text-sm text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quizzes Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first quiz from source material to get started.
            </p>
            <Button 
              onClick={() => setShowCreationForm(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Your Quiz Collection
          </h3>
          <div className="space-y-4">
            {quizzes.map((quiz, index) => (
              <Card 
                key={quiz.id} 
                className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/20 overflow-hidden animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  
                  <div className="relative p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative flex-shrink-0 bg-primary">
                            {quiz.result ? (
                              <CheckCircle className="h-6 w-6 text-primary-foreground" />
                            ) : (
                              <Brain className="h-6 w-6 text-primary-foreground" />
                            )}
                            {quiz.result && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-muted border rounded-full flex items-center justify-center">
                                <Star className="h-2 w-2 text-foreground fill-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors break-words">
                              {quiz.title}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {quiz.questions.length} Questions
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {quiz.recommendedTime || 15} min
                              </Badge>
                              {quiz.result && (
                                <Badge 
                                  variant={quiz.result.score >= 80 ? 'default' : 
                                         quiz.result.score >= 60 ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  <Award className="h-3 w-3 mr-1" />
                                  {quiz.result.score >= 90 ? 'Master' :
                                   quiz.result.score >= 80 ? 'Excellent' :
                                   quiz.result.score >= 70 ? 'Good' :
                                   quiz.result.score >= 60 ? 'Fair' : 'Practice'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {quiz.description && (
                          <CardDescription className="text-base text-muted-foreground mb-4 line-clamp-2">
                            {quiz.description}
                          </CardDescription>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quiz Stats and Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Created {formatDate(quiz.createdAt)}</span>
                        </div>
                        
                        {quiz.result && (
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">
                                {quiz.result.correctAnswers}/{quiz.result.totalQuestions} correct
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">
                                {Math.floor(quiz.result.timeSpent / 60)}m {quiz.result.timeSpent % 60}s
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">
                                {Math.round(quiz.result.timeSpent / quiz.result.totalQuestions)}s avg
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {quiz.result ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            {/* Score Display */}
                            <div className="text-center sm:text-right">
                              <div className="text-2xl font-bold text-primary">
                                {quiz.result.score}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {quiz.result.score >= 80 ? 'Excellent' : 
                                 quiz.result.score >= 60 ? 'Good' : 'Needs Practice'}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleRetakeQuiz(quiz)}
                                className="flex-1 sm:flex-none"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Retake
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleStartQuiz(quiz)}
                                className="flex-1 sm:flex-none"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleStartQuiz(quiz)}
                            size="lg"
                            className="w-full sm:w-auto"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Start Quiz
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Completed Quizzes */}
                    {quiz.result && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="font-medium">{quiz.result.score}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500 bg-primary"
                            style={{ width: `${quiz.result.score}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Retake Confirmation Dialog */}
      <Dialog open={!!showRetakeConfirmation} onOpenChange={() => setShowRetakeConfirmation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Retake Quiz
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to retake "{showRetakeConfirmation?.title}"? 
              This will reset your previous score and start a fresh attempt.
            </DialogDescription>
          </DialogHeader>
          
          {showRetakeConfirmation && (
            <div className="py-4">
              <div className="bg-muted/50 border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Previous Score:</span>
                  <Badge 
                    variant={showRetakeConfirmation.result?.score && showRetakeConfirmation.result.score >= 80 ? 'default' : 
                           showRetakeConfirmation.result?.score && showRetakeConfirmation.result.score >= 60 ? 'secondary' : 'destructive'}
                  >
                    {showRetakeConfirmation.result?.score}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{showRetakeConfirmation.result?.correctAnswers}/{showRetakeConfirmation.result?.totalQuestions} correct</span>
                  <span>{showRetakeConfirmation.result?.timeSpent && Math.floor(showRetakeConfirmation.result.timeSpent / 60)}m {showRetakeConfirmation.result?.timeSpent && showRetakeConfirmation.result.timeSpent % 60}s</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowRetakeConfirmation(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmRetakeQuiz}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Fresh Attempt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
