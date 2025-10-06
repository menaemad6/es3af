# Quiz System Migration Plan: localStorage to Database

## Overview
This document outlines the migration from localStorage-based quiz storage to a proper database-driven system using Supabase. The migration will create new database tables and replace the current `useQuizStorage` hook with a new `useQuiz` hook that handles all quiz operations through the database.

## Current State Analysis

### Current localStorage Implementation
- **Storage Key**: `mediquick_quiz_storage`
- **Data Structure**: 
  - `quizzes`: Array of Quiz objects
  - `currentState`: QuizState object for active quiz session
- **Issues**:
  - Data not persistent across devices
  - No user association
  - Limited scalability
  - No data backup/recovery

### Current Quiz Types
- `Quiz`: Main quiz object with questions, metadata, and results
- `QuizQuestion`: Individual question with options and correct answer
- `QuizAnswer`: User's answer to a question
- `QuizResult`: Complete quiz attempt results
- `QuizState`: Current quiz session state

## Migration Steps

### ✅ Step 1: Database Schema Design
**Status**: In Progress

#### New Tables to Create:

1. **`quizzes` table**
   ```sql
   CREATE TABLE quizzes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     source TEXT NOT NULL,
     source_type TEXT NOT NULL CHECK (source_type IN ('text', 'pdf')),
     questions JSONB NOT NULL,
     recommended_time INTEGER DEFAULT 15,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **`quiz_attempts` table**
   ```sql
   CREATE TABLE quiz_attempts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
     user_id TEXT NOT NULL,
     total_questions INTEGER NOT NULL,
     correct_answers INTEGER NOT NULL,
     incorrect_answers INTEGER NOT NULL,
     score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
     time_spent INTEGER NOT NULL, -- in seconds
     answers JSONB NOT NULL,
     completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

#### RLS Policies:
- Users can only access their own quizzes and attempts
- Full CRUD operations for own data
- No access to other users' data

### ⏳ Step 2: Create Database Tables
**Status**: Pending

- Create SQL migration files
- Implement RLS policies
- Add indexes for performance
- Test table creation

### ⏳ Step 3: Create New useQuiz Hook
**Status**: Pending

#### New Hook Features:
- Database operations instead of localStorage
- User authentication integration
- Optimistic updates
- Error handling
- Caching with React Query

#### API Functions:
- `createQuiz(quizData)`
- `getUserQuizzes(userId)`
- `getQuizById(quizId)`
- `startQuizAttempt(quizId, userId)`
- `submitQuizAnswer(attemptId, answer)`
- `completeQuizAttempt(attemptId, result)`
- `getQuizAttempts(quizId)`
- `deleteQuiz(quizId)`

### ⏳ Step 4: Update Components
**Status**: Pending

#### Components to Update:
- `QuizSection.tsx` - Replace useQuizStorage with useQuiz
- `QuizModal.tsx` - Update quiz state management
- `QuizCreationForm.tsx` - Update quiz creation flow

#### Changes Required:
- Remove localStorage dependencies
- Update state management
- Add loading states
- Handle database errors
- Implement optimistic updates

### ⏳ Step 5: Data Migration
**Status**: Pending

#### Migration Strategy:
- Create migration utility to move existing localStorage data
- Preserve user quiz history
- Handle data validation
- Provide rollback mechanism

### ⏳ Step 6: Testing & Validation
**Status**: Pending

#### Test Cases:
- Quiz creation and storage
- Quiz attempts and scoring
- Data persistence across sessions
- User isolation
- Performance testing
- Error handling

### ⏳ Step 7: Cleanup
**Status**: Pending

#### Cleanup Tasks:
- Remove useQuizStorage hook
- Remove localStorage logic
- Update documentation
- Remove migration utilities

## Database Schema Details

### Quizzes Table
```sql
CREATE TABLE quizzes (
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

-- Indexes
CREATE INDEX idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at DESC);

-- RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quizzes" ON quizzes
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own quizzes" ON quizzes
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own quizzes" ON quizzes
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own quizzes" ON quizzes
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));
```

### Quiz Attempts Table
```sql
CREATE TABLE quiz_attempts (
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

-- Indexes
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at DESC);

-- RLS
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own attempts" ON quiz_attempts
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));
```

## New useQuiz Hook Interface

```typescript
interface UseQuizReturn {
  // State
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentAttempt: QuizAttempt | null;
  isLoading: boolean;
  error: string | null;

  // Quiz Management
  createQuiz: (quizData: CreateQuizData) => Promise<Quiz>;
  getUserQuizzes: (userId: string) => Promise<Quiz[]>;
  getQuizById: (quizId: string) => Promise<Quiz>;
  deleteQuiz: (quizId: string) => Promise<void>;

  // Quiz Attempts
  startQuizAttempt: (quizId: string) => Promise<QuizAttempt>;
  submitAnswer: (attemptId: string, answer: QuizAnswer) => Promise<void>;
  completeQuizAttempt: (attemptId: string, result: QuizResult) => Promise<QuizResult>;
  getQuizAttempts: (quizId: string) => Promise<QuizAttempt[]>;

  // Utility
  resetQuiz: () => void;
}
```

## Migration Benefits

1. **Data Persistence**: Quizzes and attempts persist across devices
2. **User Association**: Proper user-quiz relationships
3. **Scalability**: Database can handle large amounts of data
4. **Backup & Recovery**: Data is backed up automatically
5. **Analytics**: Can track user progress and quiz performance
6. **Multi-device Sync**: Users can access quizzes from any device
7. **Data Integrity**: Database constraints ensure data consistency

## Risk Mitigation

1. **Backup Strategy**: Export localStorage data before migration
2. **Rollback Plan**: Keep old localStorage logic as fallback
3. **Gradual Migration**: Migrate users in batches
4. **Data Validation**: Validate all migrated data
5. **Testing**: Comprehensive testing before deployment

## Timeline

- **Day 1**: Database schema design and table creation
- **Day 2**: Create new useQuiz hook and API functions
- **Day 3**: Update components to use new hook
- **Day 4**: Data migration and testing
- **Day 5**: Cleanup and deployment

## Success Criteria

- [ ] All quiz data migrated to database
- [ ] No localStorage dependencies remain
- [ ] All existing functionality preserved
- [ ] Performance maintained or improved
- [ ] User data properly isolated
- [ ] Error handling implemented
- [ ] Tests passing
- [ ] Documentation updated
