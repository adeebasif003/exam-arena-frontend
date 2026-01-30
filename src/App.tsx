
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/student/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";
import TestEnvironment from "./pages/student/TestEnvironment";
import ResultsPage from "./pages/student/ResultsPage";
import StudentPerformance from "./pages/faculty/StudentPerformance";
import QuestionEditor from "./pages/faculty/QuestionEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole?: 'student' | 'faculty' 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    
    {/* Student Routes */}
    <Route path="/student/dashboard" element={
      <ProtectedRoute requiredRole="student">
        <StudentDashboard />
      </ProtectedRoute>
    } />
    <Route path="/student/test/:subjectId" element={
      <ProtectedRoute requiredRole="student">
        <TestEnvironment />
      </ProtectedRoute>
    } />
    <Route path="/student/results/:testId" element={
      <ProtectedRoute requiredRole="student">
        <ResultsPage />
      </ProtectedRoute>
    } />
    
    {/* Faculty Routes */}
    <Route path="/faculty/dashboard" element={
      <ProtectedRoute requiredRole="faculty">
        <FacultyDashboard />
      </ProtectedRoute>
    } />
    <Route path="/faculty/questions" element={
      <ProtectedRoute requiredRole="faculty">
        <QuestionEditor />
      </ProtectedRoute>
    } />
    <Route path="/faculty/performance" element={
      <ProtectedRoute requiredRole="faculty">
        <StudentPerformance />
      </ProtectedRoute>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
