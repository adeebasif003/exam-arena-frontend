
export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Test {
  id: string;
  subject: string;
  title: string;
  description: string;
  timeLimit: number; // In minutes
  questions: string[]; // Array of question IDs
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  answers: Record<string, number>; // questionId -> selected answer index
  score?: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface StudentPerformanceData {
  userId: string;
  name: string;
  email: string;
  testsTaken: number;
  averageScore: number;
  subjectScores: Record<string, number>;
}
