
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
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  getStudentPerformance, 
  getSubjects, 
  getTests, 
  questions 
} from '@/services/mockData';
import { 
  Users, 
  BookOpen, 
  TrendingUp,
  FileQuestion,
  BarChart,
  PlusCircle,
  Edit,
  ExternalLink
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const studentPerformance = getStudentPerformance();
  const subjects = getSubjects();
  const tests = getTests();
  
  // Calculate overall stats
  const totalStudents = studentPerformance.length;
  const totalQuestions = questions.length;
  const totalTests = tests.length;
  const averageScore = Math.round(
    studentPerformance.reduce((sum, student) => sum + student.averageScore, 0) / 
    totalStudents
  );

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your test content and view student performance
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Total Students</CardDescription>
                <CardTitle className="text-3xl">{totalStudents}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-700 dark:text-blue-300">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Total Questions</CardDescription>
                <CardTitle className="text-3xl">{totalQuestions}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-700 dark:text-green-300">
                  <FileQuestion className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Tests Created</CardDescription>
                <CardTitle className="text-3xl">{totalTests}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-700 dark:text-purple-300">
                  <BookOpen className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Average Score</CardDescription>
                <CardTitle className="text-3xl">{averageScore}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center justify-center p-2 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-700 dark:text-amber-300">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for managing your tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-24 flex flex-col">
                  <Link to="/faculty/questions">
                    <Edit className="h-6 w-6 mb-2" />
                    <span>Edit Questions</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex flex-col">
                  <Link to="/faculty/performance">
                    <BarChart className="h-6 w-6 mb-2" />
                    <span>Student Performance</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex flex-col">
                  <Link to="#">
                    <PlusCircle className="h-6 w-6 mb-2" />
                    <span>Create New Test</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Subject Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subject Management</CardTitle>
              <CardDescription>Manage questions by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjects.map(subject => {
                  const subjectQuestions = questions.filter(q => q.subject === subject.id);
                  
                  return (
                    <Card key={subject.id} className="card-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <CardDescription>{subjectQuestions.length} questions</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <img 
                          src={subject.imageUrl} 
                          alt={subject.name} 
                          className="w-full h-32 object-cover rounded-md mb-4"
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/faculty/questions" className="flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link to="/faculty/performance" className="flex items-center">
                            <BarChart className="h-4 w-4 mr-1" />
                            Performance
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Student Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
              <CardDescription>Latest results from all students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Student</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Tests Taken</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Score</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Mathematics</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Science</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">English</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {studentPerformance.map(student => (
                      <tr key={student.userId}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {student.testsTaken}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          <span className={`font-medium ${
                            student.averageScore >= 70
                              ? 'text-green-600 dark:text-green-400'
                              : student.averageScore >= 50
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                          }`}>
                            {student.averageScore}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {student.subjectScores.math ? `${student.subjectScores.math}%` : '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {student.subjectScores.science ? `${student.subjectScores.science}%` : '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {student.subjectScores.english ? `${student.subjectScores.english}%` : '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          <Button asChild size="sm" variant="ghost">
                            <Link to="/faculty/performance">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link to="/faculty/performance" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Performance Data
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FacultyDashboard;
