
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Clock, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save
} from 'lucide-react';
import { 
  createTestAttempt, 
  completeTestAttempt, 
  getTests, 
  getQuestionsByIds 
} from '@/services/mockData';
import { Question } from '@/types';

const TestEnvironment = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Load test and questions
  useEffect(() => {
    const loadTest = () => {
      if (!subjectId || !user) return;
      
      try {
        // Find test for the given subject
        const tests = getTests();
        const test = tests.find(t => t.subject === subjectId);
        
        if (!test) {
          toast({
            title: "Test not found",
            description: "We couldn't find the test you're looking for.",
            variant: "destructive",
          });
          navigate('/student/dashboard');
          return;
        }
        
        // Create a new test attempt
        const attempt = createTestAttempt(test.id, user.id);
        setAttemptId(attempt.id);
        
        // Get questions for the test
        const testQuestions = getQuestionsByIds(test.questions);
        setQuestions(testQuestions);
        
        // Set initial time
        setTimeLeft(test.timeLimit * 60);
        
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error loading test",
          description: "There was a problem loading the test questions.",
          variant: "destructive",
        });
        navigate('/student/dashboard');
      }
    };
    
    loadTest();
  }, [subjectId, user, toast, navigate]);
  
  // Timer effect
  useEffect(() => {
    if (loading) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUpDialogOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading]);
  
  // Handle answer selection
  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Submit test
  const handleSubmitTest = () => {
    if (!attemptId) return;
    
    try {
      const completedAttempt = completeTestAttempt(attemptId, selectedAnswers);
      
      if (completedAttempt) {
        toast({
          title: "Test submitted successfully",
          description: "Redirecting you to your results...",
        });
        
        navigate(`/student/results/${attemptId}`);
      }
    } catch (error) {
      toast({
        title: "Error submitting test",
        description: "There was a problem submitting your answers.",
        variant: "destructive",
      });
    }
  };
  
  // Handle forced submission when time is up
  const handleTimeUp = () => {
    handleSubmitTest();
    setIsTimeUpDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion ? selectedAnswers[currentQuestion.id] !== undefined : false;
  
  // Calculate progress percentage
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = (answeredCount / questions.length) * 100;
  
  // Time warning threshold (2 minutes)
  const isTimeWarning = timeLeft <= 120;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {subjectId ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1) : ''} Test
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Progress indicator */}
            <div className="hidden md:block">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {answeredCount} of {questions.length} answered
              </div>
              <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                <div
                  className="h-2 bg-brand-600 dark:bg-brand-400 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`flex items-center ${isTimeWarning ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-600 dark:text-gray-400'}`}>
              <Clock className="h-5 w-5 mr-1" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
            
            {/* Submit button */}
            <Button 
              onClick={() => setIsSubmitDialogOpen(true)} 
              variant="default"
            >
              <Save className="h-4 w-4 mr-2" />
              Submit Test
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Question navigation sidebar */}
        <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="font-medium mb-4">Question Navigator</h2>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium
                    ${currentQuestionIndex === index ? 'ring-2 ring-brand-500 dark:ring-brand-400' : ''}
                    ${
                      selectedAnswers[question.id] !== undefined 
                        ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300' 
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Question and answers */}
        <div className="flex-grow">
          {currentQuestion && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <h2 className="text-xl font-medium">{currentQuestion.text}</h2>
                </div>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-4 rounded-lg border transition-colors
                        ${
                          selectedAnswers[currentQuestion.id] === index
                            ? 'bg-brand-100 border-brand-300 dark:bg-brand-900 dark:border-brand-700'
                            : 'bg-white hover:bg-gray-50 border-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-gray-700'
                        }`}
                      onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-5 w-5 mr-3 rounded-full border ${
                          selectedAnswers[currentQuestion.id] === index
                            ? 'border-brand-600 bg-brand-600 dark:border-brand-400 dark:bg-brand-400'
                            : 'border-gray-300 dark:border-gray-600'
                          } flex items-center justify-center`}
                        >
                          {selectedAnswers[currentQuestion.id] === index && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button 
              onClick={handlePreviousQuestion} 
              variant="outline" 
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button 
                onClick={handleNextQuestion} 
                variant={isAnswered ? "default" : "outline"}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => setIsSubmitDialogOpen(true)} 
                variant={answeredCount === questions.length ? "default" : "outline"}
              >
                <Save className="h-4 w-4 mr-2" />
                Submit Test
              </Button>
            )}
          </div>
        </div>
      </main>
      
      {/* Submit confirmation dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your test?</DialogTitle>
            <DialogDescription>
              You've answered {answeredCount} out of {questions.length} questions.
              {answeredCount < questions.length && (
                <div className="mt-2 flex items-center text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>You have {questions.length - answeredCount} unanswered questions.</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Continue Testing
            </Button>
            <Button onClick={handleSubmitTest}>
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Time's up dialog */}
      <Dialog open={isTimeUpDialogOpen} onOpenChange={setIsTimeUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time's Up!</DialogTitle>
            <DialogDescription>
              Your time for this test has ended. Your answers will be submitted automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleTimeUp}>
              View Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestEnvironment;
