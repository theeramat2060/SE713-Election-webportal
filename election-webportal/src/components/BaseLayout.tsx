import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Vote, PieChart, User, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVoting } from '../context/VotingContext';
import { ecApi } from '../api';

interface NavLink {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: (e: React.MouseEvent) => void;
}

interface BaseLayoutProps {
  children: React.ReactNode;
  role?: 'voter' | 'ec' | 'admin' | 'public';
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children, role = 'public' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isVotingClosed } = useVoting();
  const [isLoadingResults, setIsLoadingResults] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResultsClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // ป้องกันการ navigate ทันที
    
    setIsLoadingResults(true);
    try {
      console.log('🔄 Calling /ec/declare-results API from navigation...');
      const results = await ecApi.declareResults();
      console.log('✅ Results API called successfully from navigation:', results);
      
      // Cache results for ResultsPage
      localStorage.setItem('electionResults', JSON.stringify(results));
      localStorage.setItem('electionResultsTimestamp', new Date().toISOString());
      localStorage.setItem('electionResultsFetched', 'true'); // Flag for ResultsPage
      
      // Navigate หลังจาก API เสร็จ
      navigate('/results');
    } catch (error) {
      console.error('❌ Error calling declare-results from navigation:', error);
      // Navigate ไปยังหน้า results แม้ API ล้มเหลว เพื่อให้ ResultsPage จัดการ error
      navigate('/results');
    } finally {
      setIsLoadingResults(false);
    }
  };

  const navLinks = {
    public: [
      { name: 'หน้าแรก', path: '/', icon: LayoutDashboard },
      ...(isVotingClosed ? [{ name: 'ผลการเลือกตั้ง', path: '/results', icon: PieChart, onClick: handleResultsClick }] : []),
      { name: 'ข้อมูลพรรคการเมือง', path: '/parties', icon: User },
    ],
    voter: [
      { name: 'ลงคะแนนเสียง', path: '/voter/vote', icon: Vote },
      ...(isVotingClosed ? [{ name: 'ผลการเลือกตั้ง', path: '/results', icon: PieChart, onClick: handleResultsClick }] : []),
    ],
    ec: [
      { name: 'จัดการพรรคการเมือง', path: '/ec/parties', icon: LayoutDashboard },
      { name: 'จัดการผู้สมัคร', path: '/ec/candidates', icon: User },
      { name: 'จัดการกล่องลงคะแนน', path: '/ec/ballots', icon: Vote },
      { name: 'ปิดการลงคะแนน', path: '/ec/close-vote', icon: PieChart },
      ...(isVotingClosed ? [{ name: 'ผลการเลือกตั้ง', path: '/results', icon: BarChart3, onClick: handleResultsClick }] : []),
    ],
    admin: [
      { name: 'จัดการเขตการเลือกตั้ง', path: '/admin/districts', icon: LayoutDashboard },
      { name: 'จัดการผู้ใช้', path: '/admin/users', icon: User },
      ...(isVotingClosed ? [{ name: 'ผลการเลือกตั้ง', path: '/results', icon: BarChart3, onClick: handleResultsClick }] : []),
    ],
  };

  const currentLinks = navLinks[role];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-surface border-b border-surface-border sticky top-0 z-50">
        <div className="container-custom h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🗳️</span>
            <span className="font-bold text-democracy text-lg hidden sm:inline-block">
              SE713 Election
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              // ถ้ามี onClick handler ให้ใช้แทน Link
              if (link.onClick) {
                return (
                  <button
                    key={link.path}
                    onClick={link.onClick}
                    disabled={link.path === '/results' && isLoadingResults}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-democracy' : 'text-text-secondary hover:text-democracy'
                    } ${link.path === '/results' && isLoadingResults ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {link.path === '/results' && isLoadingResults ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    {link.name}
                  </button>
                );
              }
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-democracy' : 'text-text-secondary hover:text-democracy'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {role === 'public' ? (
              <Link to="/login">
                <button className="text-sm font-semibold text-democracy hover:underline">
                  เข้าสู่ระบบ
                </button>
              </Link>
            ) : (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-status-error transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container-custom">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-surface-border py-8">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-secondary text-center md:text-left">
            © 2026 ระบบเลือกตั้งออนไลน์ SE713. พัฒนาขึ้นเพื่อการศึกษา.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-text-secondary hover:text-democracy">คู่มือการใช้งาน</a>
            <a href="#" className="text-sm text-text-secondary hover:text-democracy">ติดต่อสอบถาม</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
