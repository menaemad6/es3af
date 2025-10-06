export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; // percentage
  timeSpent: number; // total time in seconds
  answers: QuizAnswer[];
  completedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  source: string; // the original source material
  sourceType: 'text' | 'pdf';
  questions: QuizQuestion[];
  recommendedTime?: number; // in minutes
  createdAt: Date;
  completedAt?: Date;
  result?: QuizResult;
}

export interface QuizCreationData {
  title: string;
  description?: string;
  source: string;
  sourceType: 'text' | 'pdf';
  pdfFile?: File;
  isNonMedical?: boolean;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  startTime: Date | null;
  currentQuestionStartTime: Date | null;
}

export interface QuizStorage {
  quizzes: Quiz[];
  currentState: QuizState;
}
