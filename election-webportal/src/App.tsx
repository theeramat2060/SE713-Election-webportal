import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VotePage from './pages/VotePage'
import ResultsPage from './pages/ResultsPage'
import PartiesPage from './pages/PartiesPage'
import ECPartiesPage from './pages/ECPartiesPage'
import ECCandidatesPage from './pages/ECCandidatesPage'
import ECBallotPage from './pages/ECBallotPage'
import ECCloseVotePage from './pages/ECCloseVotePage'
import AdminDistrictsPage from './pages/AdminDistrictsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminLoginPage from './pages/AdminLoginPage'
import ECAddPartyPage from './pages/ECAddPartyPage'
import ECAddCandidatePage from './pages/ECAddCandidatePage'
import ECBallotsManagementPage from './pages/ECBallotsManagementPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/voter/vote" element={<VotePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/parties" element={<PartiesPage />} />
          <Route path="/ec/parties" element={<ECPartiesPage />} />
          <Route path="/ec/parties/add" element={<ECAddPartyPage />} />
          <Route path="/ec/candidates" element={<ECCandidatesPage />} />
          <Route path="/ec/candidates/add" element={<ECAddCandidatePage />} />
          <Route path="/ec/ballot" element={<ECBallotPage />} />
          <Route path="/ec/ballots" element={<ECBallotsManagementPage />} />
          <Route path="/ec/close-vote" element={<ECCloseVotePage />} />
          <Route path="/admin/districts" element={<AdminDistrictsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
