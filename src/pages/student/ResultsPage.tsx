
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle2,
  XCircle,
  BarChart,
  ArrowRight,
  Home,
  RefreshCw
} from 'lucide-react';
import {
  getTestAttemptsByUser,
  getTestById,
  getQuestionsByIds
} from '@/services/mockData';
import { TestAttempt, Question, Test } from '@/types';

const ResultsPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [testAttempt, setTestAttempt] = useState<TestAttempt | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    const loadResults = () => {
      if (!testId || !user) return;
      
      try {
        // Find the test attempt
        const userAttempts = getTestAttemptsByUser(user.id);
        const attempt = userAttempts.find(a => a.id === testId);
        
        if (!attempt) {
          toast({
            title: "Test attempt not found",
            description: "We couldn't find the test results you're looking for.",
            variant: "destructive",
          });
          navigate('/student/dashboard');
          return;
        }
        
        setTestAttempt(attempt);
        
        // Get test details
        const testDetails = getTestById(attempt.testId);
        if (!testDetails) {
          toast({
            title: "Test not found",
            description: "We couldn't find the test associated with these results.",
            variant: "destructive",
          });
          navigate('/student/dashboard');
          return;
        }
        
        setTest(testDetails);
        
        // Get questions
        const testQuestions = getQuestionsByIds(testDetails.questions);
        setQuestions(testQuestions);
        
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error loading results",
          description: "There was a problem loading your test results.",
          variant: "destructive",
        });
        navigate('/student/dashboard');
      }
    };
    
    loadResults();
  }, [testId, user, toast, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }
  
  if (!testAttempt || !test || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No results found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/student/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Get correct/incorrect counts
  const getResultStats = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    
    questions.forEach(question => {
      const selectedAnswer = testAttempt.answers[question.id];
      
      if (selectedAnswer === undefined) {
        skipped++;
      } else if (selectedAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });
    
    return { correct, incorrect, skipped };
  };
  
  const { correct, incorrect, skipped } = getResultStats();
  
  // Format the test duration
  const formatDuration = () => {
    if (!testAttempt.startTime || !testAttempt.endTime) return 'N/A';
    
    const durationMs = new Date(testAttempt.endTime).getTime() - new Date(testAttempt.startTime).getTime();
    const durationMin = Math.floor(durationMs / 60000);
    const durationSec = Math.floor((durationMs % 60000) / 1000);
    
    return `${durationMin}m ${durationSec}s`;
  };
  
  // Determine result message based on score
  const getResultMessage = () => {
    const score = testAttempt.score || 0;
    
    if (score >= 90) return "Excellent! You've mastered this subject!";
    if (score >= 70) return "Great job! You're doing well!";
    if (score >= 50) return "Good effort! Keep practicing to improve.";
    return "More practice needed. Don't give up!";
  };
  
  // Determine color class based on score
  const getScoreColorClass = () => {
    const score = testAttempt.score || 0;
    
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-brand-600 dark:text-brand-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Test Results: {test.title}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Completed on {testAttempt.endTime ? new Date(testAttempt.endTime).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Score Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Result Summary</CardTitle>
              <CardDescription>Your performance on this test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`text-5xl font-bold mb-2 ${getScoreColorClass()}`}>
                      {testAttempt.score}%
                    </div>
                    <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-4">
                      {getResultMessage()}
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {correct}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Correct</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {incorrect}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Incorrect</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                          {skipped}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Skipped</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score</span>
                        <span>{testAttempt.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            testAttempt.score && testAttempt.score >= 70
                              ? 'bg-green-600 dark:bg-green-500'
                              : testAttempt.score && testAttempt.score >= 50
                                ? 'bg-amber-500 dark:bg-amber-600'
                                : 'bg-red-600 dark:bg-red-500'
                          }`}
                          style={{ width: `${testAttempt.score || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Test Date</h4>
                        <p className="font-medium">
                          {testAttempt.startTime ? new Date(testAttempt.startTime).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</h4>
                        <p className="font-medium">{formatDuration()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Questions</h4>
                        <p className="font-medium">{questions.length}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</h4>
                        <p className="font-medium capitalize">{test.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild variant="default">
                        <Link to="/student/dashboard" className="flex items-center">
                          <BarChart className="mr-2 h-4 w-4" />
                          View Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to={`/student/test/${test.subject}`} className="flex items-center">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retry Test
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and see correct solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {questions.map((question, index) => {
                  const selectedAnswer = testAttempt.answers[question.id];
                  const isCorrect = selectedAnswer === question.correctAnswer;
                  const isSkipped = selectedAnswer === undefined;
                  
                  return (
                    <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">
                          Question {index + 1}: {question.text}
                        </h3>
                        <div>
                          {isSkipped ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              Skipped
                            </span>
                          ) : isCorrect ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Incorrect
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-4 rounded-lg border ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800'
                                : optionIndex === selectedAnswer && optionIndex !== question.correctAnswer
                                  ? 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800'
                                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              {optionIndex === question.correctAnswer && (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                              )}
                              {optionIndex === selectedAnswer && optionIndex !== question.correctAnswer && (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                              )}
                              {optionIndex !== question.correctAnswer && optionIndex !== selectedAnswer && (
                                <div className="h-5 w-5 mr-3" />
                              )}
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {!isCorrect && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">Correct Answer:</p>
                          <p className="text-gray-700 dark:text-gray-300">{question.options[question.correctAnswer]}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/student/dashboard" className="flex items-center">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;
