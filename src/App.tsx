import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DailyQuizPage from "./pages/DailyQuizPage";
import LearnWithAIPage from "./pages/LearnWithAIPage";
import PreviousExamsPage from "./pages/PreviousExamsPage";
import StudentsPage from "./pages/StudentsPage";
import VideoLearningPage from "./pages/VideoLearningPage";
import PreviousStudentDashboard from "./pages/PreviousStudentDashboard";
import AuthPage from "./pages/AuthPage";
import GetStartedPage from "./pages/GetStartedPage";
import ProfilePage from "./pages/ProfilePage";
import { MobileNavigation } from "./components/layout/MobileNavigation";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Protected Route Component with role-based routing
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to previous student dashboard if user is a previous student
  if (user && profile?.role === 'previous_student' && window.location.pathname !== '/previous-dashboard') {
    return <Navigate to="/previous-dashboard" replace />;
  }
  
  return user ? <>{children}</> : <Navigate to="/get-started" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Routes>
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/daily-quiz" element={
              <ProtectedRoute>
                <DailyQuizPage />
              </ProtectedRoute>
            } />
            <Route path="/learn-ai" element={
              <ProtectedRoute>
                <LearnWithAIPage />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute>
                <PreviousExamsPage />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            } />
            <Route path="/video-learning" element={
              <ProtectedRoute>
                <VideoLearningPage />
              </ProtectedRoute>
            } />
            <Route path="/previous-dashboard" element={
              <ProtectedRoute>
                <PreviousStudentDashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
