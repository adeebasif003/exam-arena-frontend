import { Question, Test, TestAttempt, Subject, StudentPerformanceData } from '@/types';

// Mock Subject Data
export const subjects: Subject[] = [
  {
    id: 'python',
    name: 'Python',
    description: 'Test your Python programming language skills',
    imageUrl: 'https://i0.wp.com/junilearning.com/wp-content/uploads/2020/06/python-programming-language.webp?fit=1920%2C1920&ssl=1',
  },
  {
    id: 'datastructure',
    name: 'Data Structure',
    description: 'Test your knowledge of algorithms and data structures',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800',
  },
  {
    id: 'dbms',
    name: 'Database Management',
    description: 'Test your database concepts and SQL knowledge',
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800',
  },
];

// Mock Question Data
export const questions: Question[] = [
  // Python Questions
  {
    id: 'python-1',
    subject: 'python',
    text: 'What is the output of print(2**3)?',
    options: ['6', '8', '9', 'Error'],
    correctAnswer: 1,
  },
  {
    id: 'python-2',
    subject: 'python',
    text: 'Which of the following is not a Python data type?',
    options: ['List', 'Dictionary', 'Array', 'Tuple'],
    correctAnswer: 2,
  },
  {
    id: 'python-3',
    subject: 'python',
    text: 'What does the function len() do in Python?',
    options: ['Returns the length of an object', 'Returns the largest item in an iterable', 'Returns the smallest item in an iterable', 'Rounds off a number'],
    correctAnswer: 0,
  },
  {
    id: 'python-4',
    subject: 'python',
    text: 'How do you create a list in Python?',
    options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
    correctAnswer: 1,
  },
  {
    id: 'python-5',
    subject: 'python',
    text: 'Which of the following is used for comments in Python?',
    options: ['//', '/* */', '#', '<!-- -->'],
    correctAnswer: 2,
  },
  {
    id: 'python-6',
    subject: 'python',
    text: 'What is the correct file extension for Python files?',
    options: ['.py', '.pt', '.python', '.p'],
    correctAnswer: 0,
  },
  {
    id: 'python-7',
    subject: 'python',
    text: 'How do you create a function in Python?',
    options: ['function myFunction():', 'def myFunction():', 'create myFunction():', 'func myFunction():'],
    correctAnswer: 1,
  },
  {
    id: 'python-8',
    subject: 'python',
    text: 'What is the correct way to import a module named "math" in Python?',
    options: ['import math', '#include math', 'using math', 'include math'],
    correctAnswer: 0,
  },
  {
    id: 'python-9',
    subject: 'python',
    text: 'Which method is used to add an element at the end of a list?',
    options: ['append()', 'push()', 'add()', 'insert()'],
    correctAnswer: 0,
  },
  {
    id: 'python-10',
    subject: 'python',
    text: 'Which of the following is not a valid variable name in Python?',
    options: ['my_var', '_myvar', '2myvar', 'myVar'],
    correctAnswer: 2,
  },

  // Data Structure Questions
  {
    id: 'datastructure-1',
    subject: 'datastructure',
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
  },
  {
    id: 'datastructure-2',
    subject: 'datastructure',
    text: 'Which data structure follows the LIFO principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctAnswer: 1,
  },
  {
    id: 'datastructure-3',
    subject: 'datastructure',
    text: 'What is the worst-case time complexity of quicksort?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'],
    correctAnswer: 2,
  },
  {
    id: 'datastructure-4',
    subject: 'datastructure',
    text: 'Which of these is not a linear data structure?',
    options: ['Array', 'Linked List', 'Queue', 'Tree'],
    correctAnswer: 3,
  },
  {
    id: 'datastructure-5',
    subject: 'datastructure',
    text: 'What is the minimum number of nodes in a binary tree of height h?',
    options: ['h', 'h+1', '2^h - 1', '2^(h+1) - 1'],
    correctAnswer: 1,
  },
  {
    id: 'datastructure-6',
    subject: 'datastructure',
    text: 'Which sorting algorithm has the best average-case performance?',
    options: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Merge Sort'],
    correctAnswer: 3,
  },
  {
    id: 'datastructure-7',
    subject: 'datastructure',
    text: 'What is the primary disadvantage of using arrays?',
    options: ['Slow access time', 'Fixed size', 'Memory inefficiency', 'Difficult traversal'],
    correctAnswer: 1,
  },
  {
    id: 'datastructure-8',
    subject: 'datastructure',
    text: 'Which data structure is used for implementing priority queue?',
    options: ['Stack', 'Queue', 'Heap', 'Linked List'],
    correctAnswer: 2,
  },
  {
    id: 'datastructure-9',
    subject: 'datastructure',
    text: 'In a hash table, what is used to generate an index from a key?',
    options: ['Hash Function', 'Encryption Function', 'Sorting Algorithm', 'Search Function'],
    correctAnswer: 0,
  },
  {
    id: 'datastructure-10',
    subject: 'datastructure',
    text: 'Which traversal of binary tree gives nodes in ascending order?',
    options: ['Preorder', 'Inorder', 'Postorder', 'Level Order'],
    correctAnswer: 1,
  },

  // Database Management Questions
  {
    id: 'dbms-1',
    subject: 'dbms',
    text: 'Which of the following is not a type of SQL command?',
    options: ['DDL', 'DML', 'DCL', 'DQL'],
    correctAnswer: 3,
  },
  {
    id: 'dbms-2',
    subject: 'dbms',
    text: 'Which normal form deals with removing transitive dependencies?',
    options: ['First Normal Form', 'Second Normal Form', 'Third Normal Form', 'Boyce-Codd Normal Form'],
    correctAnswer: 2,
  },
  {
    id: 'dbms-3',
    subject: 'dbms',
    text: 'Which of the following is not an ACID property?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Duplication'],
    correctAnswer: 3,
  },
  {
    id: 'dbms-4',
    subject: 'dbms',
    text: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Structured Question Language', 'System Query Language'],
    correctAnswer: 0,
  },
  {
    id: 'dbms-5',
    subject: 'dbms',
    text: 'Which command is used to remove a table from a database?',
    options: ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'TRUNCATE TABLE'],
    correctAnswer: 2,
  },
  {
    id: 'dbms-6',
    subject: 'dbms',
    text: 'Which constraint is used to ensure that every value in a column is unique?',
    options: ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK'],
    correctAnswer: 2,
  },
  {
    id: 'dbms-7',
    subject: 'dbms',
    text: 'What is the default order of results in an SQL query?',
    options: ['Ascending order', 'Descending order', 'Random order', 'No specific order'],
    correctAnswer: 3,
  },
  {
    id: 'dbms-8',
    subject: 'dbms',
    text: 'Which SQL statement is used to update data in a database?',
    options: ['SAVE', 'MODIFY', 'UPDATE', 'CHANGE'],
    correctAnswer: 2,
  },
  {
    id: 'dbms-9',
    subject: 'dbms',
    text: 'Which statement is used to add rows to a table?',
    options: ['ADD', 'CREATE', 'INSERT', 'MAKE'],
    correctAnswer: 2,
  },
  {
    id: 'dbms-10',
    subject: 'dbms',
    text: 'What is a view in SQL?',
    options: ['A physical table', 'A virtual table', 'A temporary table', 'A system table'],
    correctAnswer: 1,
  },
];

// Mock Test Data
export const tests: Test[] = [
  {
    id: 'python-test',
    subject: 'python',
    title: 'Python Assessment',
    description: 'Test your Python programming skills with 10 questions',
    timeLimit: 10, // 10 minutes
    questions: questions.filter(q => q.subject === 'python').map(q => q.id),
  },
  {
    id: 'datastructure-test',
    subject: 'datastructure',
    title: 'Data Structure Assessment',
    description: 'Test your knowledge of algorithms and data structures with 10 questions',
    timeLimit: 10, // 10 minutes
    questions: questions.filter(q => q.subject === 'datastructure').map(q => q.id),
  },
  {
    id: 'dbms-test',
    subject: 'dbms',
    title: 'Database Management Assessment',
    description: 'Test your database and SQL knowledge with 10 questions',
    timeLimit: 10, // 10 minutes
    questions: questions.filter(q => q.subject === 'dbms').map(q => q.id),
  },
];

// Mock Test Attempts
export const testAttempts: TestAttempt[] = [
  {
    id: 'attempt-1',
    testId: 'python-test',
    userId: '1', // student user ID
    startTime: new Date('2025-04-05T10:00:00'),
    endTime: new Date('2025-04-05T10:08:30'),
    answers: {
      'python-1': 1,
      'python-2': 1,
      'python-3': 0,
      'python-4': 0,
      'python-5': 1,
      'python-6': 1,
      'python-7': 2, // wrong
      'python-8': 2,
      'python-9': 1,
      'python-10': 2,
    },
    score: 90, // 9/10 correct
  },
  {
    id: 'attempt-2',
    testId: 'datastructure-test',
    userId: '1', // student user ID
    startTime: new Date('2025-04-04T14:00:00'),
    endTime: new Date('2025-04-04T14:09:45'),
    answers: {
      'datastructure-1': 1,
      'datastructure-2': 1,
      'datastructure-3': 0,
      'datastructure-4': 0,
      'datastructure-5': 1,
      'datastructure-6': 1,
      'datastructure-7': 2, // wrong
      'datastructure-8': 2,
      'datastructure-9': 1,
      'datastructure-10': 2,
    },
    score: 90, // 9/10 correct
  },
  {
    id: 'attempt-3',
    testId: 'dbms-test',
    userId: '1', // student user ID
    startTime: new Date('2025-04-03T12:00:00'),
    endTime: new Date('2025-04-03T12:09:45'),
    answers: {
      'dbms-1': 1,
      'dbms-2': 1,
      'dbms-3': 0,
      'dbms-4': 0,
      'dbms-5': 1,
      'dbms-6': 1,
      'dbms-7': 2, // wrong
      'dbms-8': 2,
      'dbms-9': 1,
      'dbms-10': 2,
    },
    score: 90, // 9/10 correct
  },
];

// Mock Student Performance Data for Faculty View
export const studentPerformance: StudentPerformanceData[] = [
  {
    userId: '1',
    name: 'Student Demo',
    email: 'student@example.com',
    testsTaken: 3,
    averageScore: 85,
    subjectScores: {
      'python': 90,
      'datastructure': 90,
      'dbms': 90,
    },
  },
  {
    userId: '3',
    name: 'John Smith',
    email: 'john@example.com',
    testsTaken: 3,
    averageScore: 78,
    subjectScores: {
      'python': 70,
      'datastructure': 85,
      'dbms': 80,
    },
  },
  {
    userId: '4',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    testsTaken: 3,
    averageScore: 92,
    subjectScores: {
      'python': 95,
      'datastructure': 90,
      'dbms': 90,
    },
  },
];

// Service Functions
export const getSubjects = (): Subject[] => {
  return subjects;
};

export const getTests = (): Test[] => {
  return tests;
};

export const getTestById = (id: string): Test | undefined => {
  return tests.find(test => test.id === id);
};

export const getQuestionsByIds = (ids: string[]): Question[] => {
  return questions.filter(question => ids.includes(question.id));
};

export const getQuestionsBySubject = (subject: string): Question[] => {
  return questions.filter(question => question.subject === subject);
};

export const getTestAttemptsByUser = (userId: string): TestAttempt[] => {
  return testAttempts.filter(attempt => attempt.userId === userId);
};

export const getStudentPerformance = (): StudentPerformanceData[] => {
  return studentPerformance;
};

// Function to create a new test attempt
export const createTestAttempt = (testId: string, userId: string): TestAttempt => {
  const newAttempt: TestAttempt = {
    id: `attempt-${testAttempts.length + 1}`,
    testId,
    userId,
    startTime: new Date(),
    answers: {},
  };
  
  testAttempts.push(newAttempt);
  return newAttempt;
};

// Function to complete a test attempt
export const completeTestAttempt = (
  attemptId: string, 
  answers: Record<string, number>
): TestAttempt | undefined => {
  const attemptIndex = testAttempts.findIndex(a => a.id === attemptId);
  
  if (attemptIndex === -1) return undefined;
  
  const attempt = testAttempts[attemptIndex];
  const test = getTestById(attempt.testId);
  
  if (!test) return undefined;
  
  // Calculate score
  const testQuestions = getQuestionsByIds(test.questions);
  let correctAnswers = 0;
  
  Object.entries(answers).forEach(([questionId, answerIndex]) => {
    const question = testQuestions.find(q => q.id === questionId);
    if (question && question.correctAnswer === answerIndex) {
      correctAnswers++;
    }
  });
  
  const score = Math.round((correctAnswers / test.questions.length) * 100);
  
  // Update attempt
  const updatedAttempt: TestAttempt = {
    ...attempt,
    endTime: new Date(),
    answers,
    score,
  };
  
  testAttempts[attemptIndex] = updatedAttempt;
  return updatedAttempt;
};

// Function to update a question
export const updateQuestion = (updatedQuestion: Question): Question => {
  const index = questions.findIndex(q => q.id === updatedQuestion.id);
  
  if (index !== -1) {
    questions[index] = updatedQuestion;
    return updatedQuestion;
  }
  
  // If question doesn't exist, create it
  const newQuestion = {
    ...updatedQuestion,
    id: updatedQuestion.id || `${updatedQuestion.subject}-${questions.length + 1}`,
  };
  
  questions.push(newQuestion);
  return newQuestion;
};
