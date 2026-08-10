import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MentorChat from './pages/MentorChat';
import Roadmap from './pages/Roadmap';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';
import JobBoard from './pages/JobBoard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyApplications from './pages/MyApplications';
import SkillAnalytics from './pages/SkillAnalytics';
import AdminPanel from './pages/AdminPanel';
import MockInterview from './pages/MockInterview';
import Resources from './pages/Resources';

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/resume"
      element={
        <ProtectedRoute>
          <ResumeAnalyzer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mentor"
      element={
        <ProtectedRoute>
          <MentorChat />
        </ProtectedRoute>
      }
    />
    <Route
      path="/roadmap"
      element={
        <ProtectedRoute>
          <Roadmap />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mock-interview"
      element={
        <ProtectedRoute>
          <MockInterview />
        </ProtectedRoute>
      }
    />
    <Route
      path="/resources"
      element={
        <ProtectedRoute>
          <Resources />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs"
      element={
        <ProtectedRoute>
          <JobBoard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/applications"
      element={
        <ProtectedRoute>
          <MyApplications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruiter-dashboard"
      element={
        <RoleProtectedRoute allowedRoles={["recruiter"]}>
          <RecruiterDashboard />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <SkillAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <RoleProtectedRoute allowedRoles={["recruiter"]}>
          <AdminPanel />
        </RoleProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
