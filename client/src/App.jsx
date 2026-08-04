import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MentorChat from './pages/MentorChat';
import Roadmap from './pages/Roadmap';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './routes/ProtectedRoute';

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
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
