export interface Activity {
  id: number;
  title: string;
  description?: string;
  type: 'QUIZ' | 'FLASHCARD';
  status: 'ACTIVE' | 'DRAFT' | 'INACTIVE';
  generatedByAi: boolean;  // Para el StatusBadge morado
  topicId: number;
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