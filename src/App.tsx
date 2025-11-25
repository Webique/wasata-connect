import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "@/i18n/config";
import Index from "./pages/Index";
import About from "./pages/About";
import Help from "./pages/Help";
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";
import JobDetail from "./pages/JobDetail";
import UserRegister from "./pages/auth/UserRegister";
import UserLogin from "./pages/auth/UserLogin";
import CompanyRegister from "./pages/auth/CompanyRegister";
import CompanyLogin from "./pages/auth/CompanyLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import UserDashboard from "./pages/dashboard/UserDashboard";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              
              {/* Auth Routes */}
              <Route path="/register/user" element={<UserRegister />} />
              <Route path="/login/user" element={<UserLogin />} />
              <Route path="/register/company" element={<CompanyRegister />} />
              <Route path="/login/company" element={<CompanyLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Dashboard Routes */}
              <Route
                path="/dashboard/user"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/company"
                element={
                  <ProtectedRoute requiredRole="company">
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
