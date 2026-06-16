export interface Collection {
  id: number;
  name: string;
  description?: string;
}

export interface Topic {
  id: number;
  name: string;
  orderIdx?: number;
}

export interface Activity {
  id: number;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  generatedByAi?: boolean;
  personal?: boolean;
  questions?: Question[];
}

export interface Question {
  id?: number;
  statement: string;
  explanation?: string;
  orderIdx?: number;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id?: number;
  text: string;
  correct: boolean;
}

export interface Group {
  id: number;
  name: string;
  code: string;
  studentsCount?: number;
  activitiesCount?: number;
  createdAt?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  avgScore?: number;
  completedActivities?: number;
  progress?: number;
}

export interface TopicStat {
  topicName: string;
  averageScore: number;
}

export interface GroupStat {
  groupCode: string;
  groupName: string;
  topicAverageMap: Record<string, number>;
}

export interface StudentLearningPath {
  studentName: string;
  studentEmail: string;
  collectionName: string;
  currentPercentage: number;
  status: string;
  completedTopics: number;
  totalTopics: number;
  completionRate: number;
}

export interface PdfReport {
  id?: number;
  groupCode: string;
  collectionName: string;
  fileUrl?: string;
  optionalEmail?: string;
  sentTo?: string;
  createdAt?: string;
}
