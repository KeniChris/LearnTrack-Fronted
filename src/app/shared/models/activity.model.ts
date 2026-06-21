// QUIZZES (ACTIVITIES)
export interface Activity {
  id?: number;
  title: string;
  description?: string;
  type: 'QUIZ' | 'FLASHCARD';
  status: 'ACTIVE' | 'DRAFT' | 'INACTIVE';
  generatedByAi: boolean;
  topicId?: number;
  questions?: Question[];
}

export interface Question {
  id?: number;
  statement: string;
  explanation?: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  id?: number;
  text: string;
  correct: boolean;
}

// FLASHCARDS
export interface FlashcardSet {
  id?: number;
  title: string;
  description?: string;
  generatedByAi: boolean;
  topicId?: number;
  flashcards: Flashcard[];
}

export interface Flashcard {
  id?: number;
  term: string;
  definition: string;
}