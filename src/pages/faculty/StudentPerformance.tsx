
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  getStudentPerformance, 
  getSubjects, 
  getTests 
} from '@/services/mockData';
import {
  Search,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Users
} from 'lucide-react';

const StudentPerformance = () => {
  const { user } = useAuth();
  const students = getStudentPerformance();
  const subjects = getSubjects();
  const tests = getTests();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get stats for visualization
  const getSubjectStatistics = () => {
    // Calculate average score by subject across all students
    return subjects.map(subject => {
      const scores = students.map(student => student.subjectScores[subject.id] || 0).filter(score => score > 0);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const participationRate = (scores.length / students.length) * 100;
      
      return {
        subject: subject.name,
        averageScore: Math.round(averageScore),
        participationRate: Math.round(participationRate),
      };
    });
  };
  
  const subjectStats = getSubjectStatistics();

  // Calculate performance distribution
  const getPerformanceDistribution = () => {
    const distribution = {
      'Excellent (90-100%)': 0,
      'Good (70-89%)': 0,
      'Average (50-69%)': 0,
      'Needs Improvement (0-49%)': 0,
    };
    
    students.forEach(student => {
      const score = selectedSubject === 'all'
        ? student.averageScore
        : student.subjectScores[selectedSubject] || 0;
        
      if (score >= 90) distribution['Excellent (90-100%)']++;
      else if (score >= 70) distribution['Good (70-89%)']++;
      else if (score >= 50) distribution['Average (50-69%)']++;
      else distribution['Needs Improvement (0-49%)']++;
    });
    
    return distribution;
  };
  
  const performanceDistribution = getPerformanceDistribution();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Performance Analysis
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Track and analyze student test results
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Class Average</CardTitle>
                    <CardDescription>Overall test performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="text-5xl font-bold text-brand-600 dark:text-brand-400 mr-4">
                        {Math.round(students.reduce((sum, student) => sum + student.averageScore, 0) / students.length)}%
                      </div>
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Test Attempts</CardTitle>
                    <CardDescription>All tests taken by students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="text-5xl font-bold text-brand-600 dark:text-brand-400 mr-4">
                        {students.reduce((sum, student) => sum + student.testsTaken, 0)}
                      </div>
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Students</CardTitle>
                    <CardDescription>Students who have taken tests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="text-5xl font-bold text-brand-600 dark:text-brand-400 mr-4">
                        {students.filter(student => student.testsTaken > 0).length}
                      </div>
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Subject Performance */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectStats.map(stat => (
                      <div key={stat.subject} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{stat.subject}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({stat.participationRate}% participation)
                            </span>
                          </div>
                          <span className="font-medium">{stat.averageScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              stat.averageScore >= 70
                                ? 'bg-green-600 dark:bg-green-500'
                                : stat.averageScore >= 50
                                  ? 'bg-amber-500 dark:bg-amber-600'
                                  : 'bg-red-600 dark:bg-red-500'
                            }`}
                            style={{ width: `${stat.averageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Performance Distribution */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance Distribution</CardTitle>
                      <CardDescription>Student score ranges</CardDescription>
                    </div>
                    <Select 
                      value={selectedSubject} 
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900 mb-3">
                        <div className="h-3 w-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {performanceDistribution['Excellent (90-100%)']}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Excellent<br/>(90-100%)</div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-3">
                        <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {performanceDistribution['Good (70-89%)']}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Good<br/>(70-89%)</div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-100 dark:bg-amber-900 mb-3">
                        <div className="h-3 w-3 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {performanceDistribution['Average (50-69%)']}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Average<br/>(50-69%)</div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-100 dark:bg-red-900 mb-3">
                        <div className="h-3 w-3 bg-red-600 dark:bg-red-400 rounded-full"></div>
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {performanceDistribution['Needs Improvement (0-49%)']}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Needs Improvement<br/>(0-49%)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Students Tab */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>Student Results</CardTitle>
                      <CardDescription>Individual student performance</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <div className="relative w-full md:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                          type="search"
                          placeholder="Search students..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Student</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Tests Taken</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Score</th>
                          {subjects.map(subject => (
                            <th 
                              key={subject.id}
                              className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                            >
                              {subject.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredStudents.map(student => (
                          <tr key={student.userId}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                              {student.email}
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
                            {subjects.map(subject => (
                              <td 
                                key={subject.id}
                                className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300"
                              >
                                {student.subjectScores[subject.id] 
                                  ? (
                                    <span className={`font-medium ${
                                      student.subjectScores[subject.id] >= 70
                                        ? 'text-green-600 dark:text-green-400'
                                        : student.subjectScores[subject.id] >= 50
                                          ? 'text-amber-600 dark:text-amber-400'
                                          : 'text-red-600 dark:text-red-400'
                                    }`}>
                                      {student.subjectScores[subject.id]}%
                                    </span>
                                  )
                                  : '-'
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No students found matching your search</p>
                      <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-4">
                        Clear Search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map(subject => {
                  const subjectScores = students.map(s => s.subjectScores[subject.id]).filter(Boolean);
                  const avgScore = subjectScores.length > 0
                    ? Math.round(subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length)
                    : 0;
                  
                  return (
                    <Card key={subject.id} className="card-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{subject.name}</CardTitle>
                            <CardDescription>{subject.description}</CardDescription>
                          </div>
                          <div className={`text-2xl font-bold ${
                            avgScore >= 70
                              ? 'text-green-600 dark:text-green-400'
                              : avgScore >= 50
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                          }`}>
                            {avgScore}%
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Average Score</span>
                              <span>{avgScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  avgScore >= 70
                                    ? 'bg-green-600 dark:bg-green-500'
                                    : avgScore >= 50
                                      ? 'bg-amber-500 dark:bg-amber-600'
                                      : 'bg-red-600 dark:bg-red-500'
                                }`}
                                style={{ width: `${avgScore}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <p><span className="font-medium">Students Attempted:</span> {subjectScores.length} of {students.length}</p>
                            <p className="mt-1">
                              <span className="font-medium">Participation Rate:</span> {Math.round((subjectScores.length / students.length) * 100)}%
                            </p>
                          </div>
                          
                          <div className="text-sm">
                            <p className="font-medium mb-1">Performance Distribution:</p>
                            <div className="grid grid-cols-4 gap-1">
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
                                <div className="text-green-800 dark:text-green-300 font-medium">
                                  {subjectScores.filter(score => score >= 90).length}
                                </div>
                                <div className="text-xs text-green-800 dark:text-green-300">90%+</div>
                              </div>
                              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-center">
                                <div className="text-blue-800 dark:text-blue-300 font-medium">
                                  {subjectScores.filter(score => score >= 70 && score < 90).length}
                                </div>
                                <div className="text-xs text-blue-800 dark:text-blue-300">70-89%</div>
                              </div>
                              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded text-center">
                                <div className="text-amber-800 dark:text-amber-300 font-medium">
                                  {subjectScores.filter(score => score >= 50 && score < 70).length}
                                </div>
                                <div className="text-xs text-amber-800 dark:text-amber-300">50-69%</div>
                              </div>
                              <div className="bg-red-100 dark:bg-red-900 p-2 rounded text-center">
                                <div className="text-red-800 dark:text-red-300 font-medium">
                                  {subjectScores.filter(score => score < 50).length}
                                </div>
                                <div className="text-xs text-red-800 dark:text-red-300">0-49%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentPerformance;
