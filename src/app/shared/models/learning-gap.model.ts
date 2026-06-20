export interface LearningPathNode {
  topicName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'CRITICAL' | 'PENDING';
  score: number; // Porcentaje de 0 a 100
}

export interface StudentLearningPath {
  studentName: string;
  studentEmail: string;
  collectionName: string;
  completionRate: number; // % general en la colección
  nodes: LearningPathNode[];
}

export interface GroupPerformance {
  groupCode: string;
  // Mapa dinámico para el BarChart
  topicAverages: Record<string, number>; 
}