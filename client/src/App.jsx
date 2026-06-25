import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ReportIssue from './pages/ReportIssue';
import IssueDetail from './pages/IssueDetail';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import AuthorityPanel from './pages/AuthorityPanel';
import SetupProfile from './pages/SetupProfile';

// Blocks unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Blocks non-authority users
const AuthorityRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'authority' && user.role !== 'moderator') {
    return <Navigate to="/" replace />
  }
  return children
}

// Redirect logged-in users away from login
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />

      {/* New user profile setup */}
      <Route path="/setup-profile" element={
        <ProtectedRoute><SetupProfile /></ProtectedRoute>
      } />

      {/* Citizen routes */}
      <Route path="/" element={
        <ProtectedRoute><Home /></ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute><ReportIssue /></ProtectedRoute>
      } />
      <Route path="/issue/:id" element={
        <ProtectedRoute><IssueDetail /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute><Leaderboard /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Authority only */}
      <Route path="/authority" element={
        <AuthorityRoute><AuthorityPanel /></AuthorityRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}