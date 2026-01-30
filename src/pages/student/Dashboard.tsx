
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getSubjects, getTestAttemptsByUser, getTests } from '@/services/mockData';
import { 
  BookOpen, 
  Clock, 
  Award, 
  BarChart, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const subjects = getSubjects();
  const testAttempts = user ? getTestAttemptsByUser(user.id) : [];
  const tests = getTests();
  
  // Get subject details by ID
  const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
  };
  
  // Get test details by ID
  const getTestById = (id: string) => {
    return tests.find(test => test.id === id);
  };
  
  // Get test attempts grouped by subject
  const testAttemptsBySubject = testAttempts.reduce<Record<string, typeof testAttempts>>((acc, attempt) => {
    const test = getTestById(attempt.testId);
    if (test) {
      if (!acc[test.subject]) {
        acc[test.subject] = [];
      }
      acc[test.subject].push(attempt);
    }
    return acc;
  }, {});
  
  // Calculate average score by subject
  const averageScoreBySubject = Object.entries(testAttemptsBySubject).reduce<Record<string, number>>((acc, [subject, attempts]) => {
    const total = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    acc[subject] = Math.round(total / attempts.length);
    return acc;
  }, {});
  
  // Get upcoming tests (tests not yet attempted)
  const attemptedTestIds = testAttempts.map(attempt => attempt.testId);
  const upcomingTests = tests.filter(test => !attemptedTestIds.includes(test.id));

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {/* Dashboard Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Continue your test preparation journey
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tests">Available Tests</TabsTrigger>
              <TabsTrigger value="performance">My Performance</TabsTrigger>
              <TabsTrigger value="history">Test History</TabsTrigger>
            </TabsList>
            
            {/* Available Tests Tab */}
            <TabsContent value="tests">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {subjects.map((subject) => (
                  <Card key={subject.id} className="card-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-brand-700 dark:text-brand-400">
                        {subject.name}
                      </CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={subject.imageUrl} 
                        alt={subject.name} 
                        className="w-full h-36 object-cover rounded-md mb-4"
                      />
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>10 minute test</span>
                        <span className="mx-2">•</span>
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>10 questions</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/student/test/${subject.id}`}>Start Test</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="space-y-6 mt-6">
                {/* Overall Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Performance</CardTitle>
                    <CardDescription>Your average scores across all subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">
                          {testAttempts.length}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tests Completed</div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">
                          {Object.values(averageScoreBySubject).length > 0 
                            ? Math.round(
                                Object.values(averageScoreBySubject).reduce((a, b) => a + b, 0) / 
                                Object.values(averageScoreBySubject).length
                              ) 
                            : 0}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Average Score</div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">
                          {Object.values(averageScoreBySubject).length}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Subjects Attempted</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Subject Performance</h3>
                      {Object.entries(averageScoreBySubject).length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(averageScoreBySubject).map(([subjectId, score]) => {
                            const subject = getSubjectById(subjectId);
                            return (
                              <div key={subjectId} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{subject?.name}</span>
                                  <span className="font-medium">{score}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div 
                                    className="bg-brand-600 dark:bg-brand-400 h-2.5 rounded-full" 
                                    style={{ width: `${score}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p>Complete your first test to see performance data</p>
                          <Button asChild variant="outline" className="mt-4">
                            <Link to="#tests">View Available Tests</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* History Tab */}
            <TabsContent value="history">
              <div className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test History</CardTitle>
                    <CardDescription>Your recent test attempts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {testAttempts.length > 0 ? (
                      <div className="space-y-4">
                        {testAttempts.map((attempt) => {
                          const test = getTestById(attempt.testId);
                          const subject = test ? getSubjectById(test.subject) : undefined;
                          
                          return (
                            <div key={attempt.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-start space-x-4">
                                <div className={`p-2 rounded-md ${attempt.score && attempt.score >= 70 ? 'bg-green-100 dark:bg-green-900' : 'bg-amber-100 dark:bg-amber-900'}`}>
                                  {attempt.score && attempt.score >= 70 ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">{test?.title || 'Unknown Test'}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{subject?.name || 'Unknown Subject'}</p>
                                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {attempt.endTime ? new Date(attempt.endTime).toLocaleDateString() : 'In Progress'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {attempt.score !== undefined && (
                                  <div className="text-center">
                                    <div className={`text-xl font-bold ${attempt.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                      {attempt.score}%
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                                  </div>
                                )}
                                {attempt.score !== undefined && (
                                  <Button asChild variant="outline" size="sm">
                                    <Link to={`/student/results/${attempt.id}`}>View Results</Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p>No test attempts yet</p>
                        <Button asChild variant="outline" className="mt-4">
                          <Link to="#tests">Take Your First Test</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
