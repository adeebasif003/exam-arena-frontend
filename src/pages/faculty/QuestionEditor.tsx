
import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  getQuestionsBySubject, 
  getSubjects, 
  updateQuestion 
} from '@/services/mockData';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Question as QuestionType } from '@/types';

const QuestionEditor = () => {
  const { user } = useAuth();
  const subjects = getSubjects();
  const { toast } = useToast();
  
  const [activeSubject, setActiveSubject] = useState(subjects[0].id);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionType | null>(null);
  
  // Form state
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  
  // Load questions for the active subject
  useEffect(() => {
    const loadQuestions = () => {
      const subjectQuestions = getQuestionsBySubject(activeSubject);
      setQuestions(subjectQuestions);
    };
    
    loadQuestions();
  }, [activeSubject]);
  
  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => 
    question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.options.some(option => option.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle subject change
  const handleSubjectChange = (value: string) => {
    setActiveSubject(value);
    setSearchQuery('');
  };
  
  // Open dialog for editing or creating a question
  const openQuestionDialog = (question?: QuestionType) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionText(question.text);
      setOptions([...question.options]);
      setCorrectAnswer(question.correctAnswer);
    } else {
      setEditingQuestion(null);
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
    }
    
    setIsDialogOpen(true);
  };
  
  // Handle saving a question
  const handleSaveQuestion = () => {
    // Validate form
    if (questionText.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Question text cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    if (options.some(option => option.trim() === '')) {
      toast({
        title: "Validation Error",
        description: "All options must have a value.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedQuestion: QuestionType = {
        id: editingQuestion?.id || `${activeSubject}-${Date.now()}`,
        subject: activeSubject,
        text: questionText,
        options: [...options],
        correctAnswer,
      };
      
      const result = updateQuestion(updatedQuestion);
      
      // Update the local questions list
      if (editingQuestion) {
        setQuestions(questions.map(q => q.id === result.id ? result : q));
      } else {
        setQuestions([...questions, result]);
      }
      
      toast({
        title: "Success",
        description: editingQuestion ? "Question updated successfully." : "Question added successfully.",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the question. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Question Editor
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Create and manage questions for tests
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={activeSubject} onValueChange={handleSubjectChange}>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <TabsList className="mb-4 md:mb-0">
                {subjects.map(subject => (
                  <TabsTrigger key={subject.id} value={subject.id}>
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => openQuestionDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>
            
            {subjects.map(subject => (
              <TabsContent key={subject.id} value={subject.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{subject.name} Questions</CardTitle>
                    <CardDescription>
                      Manage questions for {subject.name.toLowerCase()} tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {filteredQuestions.map((question, index) => (
                          <Card key={question.id} className="card-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-medium">Q{index + 1}. {question.text}</CardTitle>
                                <div className="flex space-x-1">
                                  <Button size="sm" variant="ghost" onClick={() => openQuestionDialog(question)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex}
                                    className={`p-2 rounded-md text-sm ${
                                      optIndex === question.correctAnswer 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                    {optIndex === question.correctAnswer && (
                                      <span className="ml-2 text-xs font-medium">(Correct)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        {searchQuery ? (
                          <div className="text-gray-500 dark:text-gray-400">
                            <Search className="mx-auto h-8 w-8 mb-2" />
                            <p className="mb-2">No questions found for "{searchQuery}"</p>
                            <Button variant="outline" onClick={() => setSearchQuery('')}>
                              Clear Search
                            </Button>
                          </div>
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">
                            <Plus className="mx-auto h-8 w-8 mb-2" />
                            <p className="mb-2">No questions yet for this subject</p>
                            <Button onClick={() => openQuestionDialog()}>
                              Add First Question
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      {/* Edit/Add Question Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion 
                ? 'Update this question and its answer options.' 
                : 'Create a new question for this subject.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea 
                id="question-text" 
                placeholder="Enter the question text..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Answer Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correct-answer">Correct Answer</Label>
              <Select value={correctAnswer.toString()} onValueChange={(value) => setCorrectAnswer(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      Option {String.fromCharCode(65 + index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>
              <Save className="h-4 w-4 mr-2" />
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default QuestionEditor;
