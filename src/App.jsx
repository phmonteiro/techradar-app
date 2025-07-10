import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage/HomePage.jsx'; // Ensure the case matches exactly
import TrendRadar from './pages/TrendRadarPage/TrendRadar';
import LoginPage from './components/Auth/LoginPage';
import AdminDashboard from './pages/AdminDashboardPage/AdminDashboard';
import TechnologiesManagement from './pages/AdminDashboardPage/Technologies/TechnologiesManagement';
import CommentsManagement from './pages/AdminDashboardPage/Comments/CommentsManagement';
import ReferencesManagement from './pages/AdminDashboardPage/References/ReferencesManagement';
import ReferenceForm from './pages/AdminDashboardPage/References/ReferenceForm';
import CreateTechnology from './pages/AdminDashboardPage/Technologies/CreateTechnology';
import CommentForm from './pages/AdminDashboardPage/Comments/CommentForm';
import UnauthorizedPage from './components/Auth/UnauthorizedPage';
import TechnologyView from './pages/TechnologyPage/TechnologyView';
import Technologies from './components/Technologies/Technologies';
import EditTechnology from './pages/AdminDashboardPage/Technologies/EditTechnology';
import TrendView from './pages/TrendPage/TrendView';
import TrendsManagement from './pages/AdminDashboardPage/Trends/TrendsManagement';
import CreateTrend from './pages/AdminDashboardPage/Trends/CreateTrend';
// Import other components as needed

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/trendradar" element={<TrendRadar />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Admin routes - require Admin role */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/technologies" element={
            <ProtectedRoute requiredRole="Admin">
              <TechnologiesManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/technologies/create" element={
            <ProtectedRoute requiredRole="Admin">
              <CreateTechnology />
            </ProtectedRoute>
          } />
          <Route path="/admin/technologies/edit/:label" element={
            <ProtectedRoute requiredRole="Admin">
              <CreateTechnology />
            </ProtectedRoute>
          } />
          <Route path="/admin/trends" element={
            <ProtectedRoute requiredRole="Admin">
              <TrendsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/trends/create" element={
            <ProtectedRoute requiredRole="Admin">
              <CreateTrend />
            </ProtectedRoute>
          } />
          <Route path="/admin/trends/edit/:label" element={
            <ProtectedRoute requiredRole="Admin">
              <CreateTrend />
            </ProtectedRoute>
          } />
          <Route path="/admin/comments" element={
            <ProtectedRoute requiredRole="Admin">
              <CommentsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/comments/create" element={
            <ProtectedRoute requiredRole="Admin">
              <CommentForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/references" element={
            <ProtectedRoute requiredRole="Admin">
              <ReferencesManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/references/create" element={
            <ProtectedRoute requiredRole="Admin">
              <ReferenceForm />
            </ProtectedRoute>
          } />

          <Route path="/admin/references/add/:label" element={
            <ProtectedRoute requiredRole="Admin">
              <ReferenceForm />
            </ProtectedRoute>
          } />
          
          {/* Viewer routes - require at least Viewer role */}
          <Route path="/technologies/:label" element={
            <ProtectedRoute requiredRole="Viewer">
              <TechnologyView />
            </ProtectedRoute>
          } />

          <Route path="/technologies" element={
            <ProtectedRoute requiredRole="Viewer">
              <Technologies />
            </ProtectedRoute>
          } />

          <Route path="/trends/:label" element={
            <ProtectedRoute requiredRole="Viewer">
              <TrendView />
            </ProtectedRoute>
          } />

          
          {/* Add other protected routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;