import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VotingProvider } from './context/VotingContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleBasedRedirect } from './components/RoleBasedRedirect'
import { LoginGuard } from './components/LoginGuard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VotePage from './pages/VotePage'
import ResultsPage from './pages/ResultsPage'
import PartiesPage from './pages/PartiesPage'
import ECPartiesPage from './pages/ECPartiesPage'
import ECCandidatesPage from './pages/ECCandidatesPage'
import ECBallotPage from './pages/ECBallotPage'
import AdminDistrictsPage from './pages/AdminDistrictsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminLoginPage from './pages/AdminLoginPage'
import ECAddPartyPage from './pages/ECAddPartyPage'
import ECAddCandidatePage from './pages/ECAddCandidatePage'

function App() {
  return (
    <AuthProvider>
      <VotingProvider>
        <Router>
        <Routes>
          {/* Root Route with Role-based Redirect */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Public Routes */}
          <Route path="/login" element={
            <LoginGuard>
              <LoginPage />
            </LoginGuard>
          } />
          <Route path="/admin-login" element={
            <LoginGuard>
              <AdminLoginPage />
            </LoginGuard>
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/parties" element={<PartiesPage />} />
          
          {/* Voter-only Routes */}
          <Route path="/voter/vote" element={
            <ProtectedRoute allowedRoles={['voter']}>
              <VotePage />
            </ProtectedRoute>
          } />
          
          {/* EC Official Routes */}
          <Route path="/ec/parties" element={
            <ProtectedRoute allowedRoles={['ec']}>
              <ECPartiesPage />
            </ProtectedRoute>
          } />
          <Route path="/ec/parties/add" element={
            <ProtectedRoute allowedRoles={['ec']}>
              <ECAddPartyPage />
            </ProtectedRoute>
          } />
          <Route path="/ec/candidates" element={
            <ProtectedRoute allowedRoles={['ec']}>
              <ECCandidatesPage />
            </ProtectedRoute>
          } />
          <Route path="/ec/candidates/add" element={
            <ProtectedRoute allowedRoles={['ec']}>
              <ECAddCandidatePage />
            </ProtectedRoute>
          } />
          <Route path="/ec/ballot" element={
            <ProtectedRoute allowedRoles={['ec']}>
              <ECBallotPage />
            </ProtectedRoute>
          } />
          
          {/* Admin-only Routes */}
          <Route path="/admin/districts" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDistrictsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      </VotingProvider>
    </AuthProvider>
  )
}

export default App
