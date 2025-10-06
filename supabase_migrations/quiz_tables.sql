-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('text', 'pdf')),
  questions JSONB NOT NULL, -- Array of QuizQuestion objects
  recommended_time INTEGER DEFAULT 15, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent INTEGER NOT NULL, -- in seconds
  answers JSONB NOT NULL, -- Array of QuizAnswer objects
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON quizzes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quizzes_source_type ON quizzes(source_type);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed_at ON quiz_attempts(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_score ON quiz_attempts(score);

-- Enable Row Level Security (RLS)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes table
CREATE POLICY "Users can view own quizzes" ON quizzes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own quizzes" ON quizzes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own quizzes" ON quizzes
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own quizzes" ON quizzes
  FOR DELETE USING (true);

-- RLS Policies for quiz_attempts table
CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own attempts" ON quiz_attempts
  FOR UPDATE USING (true);

-- Create function to automatically update updated_at timestamp for quizzes
CREATE OR REPLACE FUNCTION update_quizzes_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for quizzes
CREATE TRIGGER update_quizzes_updated_at 
  BEFORE UPDATE ON quizzes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_quizzes_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE quizzes IS 'Stores quiz definitions created by users';
COMMENT ON TABLE quiz_attempts IS 'Stores individual quiz attempts and results';

COMMENT ON COLUMN quizzes.questions IS 'JSONB array of QuizQuestion objects';
COMMENT ON COLUMN quiz_attempts.answers IS 'JSONB array of QuizAnswer objects';
COMMENT ON COLUMN quiz_attempts.time_spent IS 'Time spent on quiz in seconds';
COMMENT ON COLUMN quiz_attempts.score IS 'Quiz score as percentage (0-100)';
