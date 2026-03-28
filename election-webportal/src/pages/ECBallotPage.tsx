import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal, ModalFooter } from '../components/Modal';
import { 
  Lock, 
  Unlock, 
  Activity, 
  BarChart3, 
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar,
  Loader2,
  RefreshCw,
  Search,
  Download,
  ShieldCheck,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVoting } from '../context/VotingContext';
import { ecApi, constituenciesApi } from '../api';
import type { ElectionStats } from '../api';
import { hasPermission } from '../utils/permissions';

interface DistrictProgress {
  id: number;
  name: string;
  progress: number;
  status: 'Complete' | 'Reporting' | 'Pending' | 'Live';
  province: string;
  district_number: number;
  ballotsTotal: number;
  ballotsCast: number;
  lastUpdated: string;
}

const ECBallotPage: React.FC = () => {
  const { user } = useAuth();
  const { isVotingClosed, closedAt, closeVoting, openVoting, refreshStatus } = useVoting();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState<DistrictProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<ElectionStats | null>(null);
  const [constituencyData, setConstituencyData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const itemsPerPage = 10;

  const canCloseVote = user?.role === 'ec' && hasPermission(user.role, 'close_vote') || user?.role === 'admin';
  
  // Determine actual voting status based on fetched data
  // If all constituencies are closed, the system is closed
  const actualVotingClosed = constituencyData.length > 0 && 
    constituencyData.every(c => c.is_closed === true);
  
  // Use the more reliable actualVotingClosed if we have data, otherwise fall back to context
  const displayVotingClosed = constituencyData.length > 0 ? actualVotingClosed : isVotingClosed;

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching election stats...');
      const data = await ecApi.getElectionStats();
      setStats(data);
      console.log('✅ Election stats fetched');
    } catch (error) {
      console.error('❌ Failed to fetch election stats:', error);
      throw error; // Re-throw to propagate error
    }
  };

  const fetchDistricts = async () => {
    try {
      console.log('🗳️  Fetching ballot statistics...');
      // Use the new ballot statistics endpoint instead of mocking data
      const ballotStats = await ecApi.getBallotStatistics();
      console.log(`✅ Ballot statistics fetched (${ballotStats.length} districts)`);
      
      console.log('🗺️  Fetching constituency data...');
      // Store raw constituency data for voting status check
      const data = await constituenciesApi.getAll();
      setConstituencyData(data);
      console.log(`✅ Constituency data fetched (${data.length} constituencies)`);
      
      // Map ballot statistics to district progress format
      console.log('🔄 Mapping ballot data to UI format...');
      const mapped: DistrictProgress[] = ballotStats.map((stat: any) => ({
        id: stat.id,
        name: stat.name,
        province: stat.province,
        district_number: stat.district_number,
        progress: stat.progress,
        status: stat.status,
        ballotsTotal: stat.ballotsTotal,
        ballotsCast: stat.ballotsCast,
        lastUpdated: stat.lastUpdated || '2 นาทีที่แล้ว'
      }));
      
      setDistricts(mapped);
      console.log(`✅ Districts ready for display (${mapped.length} districts)`);
    } catch (error) {
      console.error('❌ Failed to fetch districts:', error);
      throw error; // Re-throw to propagate error
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Starting fetchData...');
      await Promise.all([fetchDistricts(), fetchStats()]);
      console.log('✅ All data fetched successfully');
    } catch (error) {
      console.error('❌ fetchData failed:', error);
      throw error; // Re-throw to allow caller to handle
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseVoting = async () => {
    try {
      setIsLoading(true);
      console.log('🔒 Attempting to close voting...');
      
      console.log('📡 Calling updateVotingStatus API...');
      await ecApi.updateVotingStatus({
        action: 'close',
        closedBy: user?.fullName || 'EC Official',
        closedAt: new Date().toISOString(),
      });
      console.log('✅ API call succeeded');

      setIsCloseModalOpen(false);
      
      // Wait to ensure backend state is persisted
      console.log('⏳ Waiting for backend persistence...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch fresh data
      console.log('📊 Fetching ballot statistics...');
      await fetchData();
      console.log('✅ Ballot statistics fetched');
      
      // Refresh voting status from backend state (this is the source of truth)
      console.log('🔄 Refreshing voting status...');
      await refreshStatus();
      console.log('✅ Voting status refreshed');
    } catch (error) {
      console.error('❌ Error in handleCloseVoting:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert('เกิดข้อผิดพลาดในการปิดการลงคะแนน กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenVoting = async () => {
    if (!window.confirm('คุณต้องการเปิดการลงคะแนนใหม่ใช่หรือไม่?')) return;
    
    try {
      setIsLoading(true);
      console.log('🔓 Attempting to open voting...');
      
      console.log('📡 Calling updateVotingStatus API...');
      await ecApi.updateVotingStatus({
        action: 'open',
      });
      console.log('✅ API call succeeded');

      // Wait to ensure backend state is persisted
      console.log('⏳ Waiting for backend persistence...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch fresh data
      console.log('📊 Fetching ballot statistics...');
      await fetchData();
      console.log('✅ Ballot statistics fetched');
      
      // Refresh voting status from backend state (this is the source of truth)
      console.log('🔄 Refreshing voting status...');
      await refreshStatus();
      console.log('✅ Voting status refreshed');
    } catch (error) {
      console.error('❌ Error in handleOpenVoting:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert('เกิดข้อผิดพลาดในการเปิดการลงคะแนน กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDistricts = districts.filter(d =>
    d.province.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);
  const paginatedDistricts = filteredDistricts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setPageInput('');
  };

  const handlePageJump = () => {
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageInput('');
    }
  };

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-text-primary">ศูนย์ควบคุมการเลือกตั้ง (Election Control Center)</h1>
            <p className="text-text-secondary">ระบบบริหารจัดการและควบคุมสถานะการลงคะแนนแบบเบ็ดเสร็จ</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="authority" size="sm" className="flex items-center gap-2">
              <ShieldCheck size={16} />
              ตรวจสอบความปลอดภัย
            </Button>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatBox 
            label="อัตราผู้มาใช้สิทธิ" 
            value={stats ? `${stats.turnoutPercentage}%` : '...'} 
            icon={<TrendingUp className="text-status-success" />} 
            trend={!displayVotingClosed ? "+2.4% จากชั่วโมงที่แล้ว" : "สรุปผลการลงคะแนน"}
            subValue={
              <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-status-success h-full" style={{ width: stats ? `${stats.turnoutPercentage}%` : '0%' }} />
              </div>
            }
          />
          <StatBox 
            label="คะแนนที่ลงแล้ว" 
            value={stats ? stats.totalVoted.toLocaleString() : '...'} 
            icon={<Users className="text-blue-500" />} 
            trend={stats ? `จากผู้มีสิทธิ ${stats.totalRegistered.toLocaleString()} คน` : 'กำลังโหลด...'}
          />
          <StatBox 
            label="ไม่ประสงค์ลงคะแนน (No Vote)" 
            value={stats ? stats.userNoVote.toLocaleString() : '...'} 
            icon={<FileText className="text-status-error" />} 
            trend={stats && stats.totalVoted > 0 ? `${((stats.userNoVote / stats.totalVoted) * 100).toFixed(2)}% ของทั้งหมด` : "รวบรวมข้อมูล"}
          />
        </div>

        {/* Central Control Panel */}
        <div className={`bg-white rounded-2xl border-2 overflow-hidden shadow-elevation transition-all duration-500 ${displayVotingClosed ? 'border-red-200' : 'border-authority/20'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${displayVotingClosed ? 'bg-red-50 border-red-100' : 'bg-authority/5 border-authority/10'}`}>
            <div className="flex items-center gap-2">
              <Activity size={20} className={displayVotingClosed ? 'text-red-600' : 'text-authority'} />
              <h2 className="font-bold text-text-primary uppercase tracking-tight">System Operational Status</h2>
            </div>
            {displayVotingClosed ? (
              <Badge variant="error" className="animate-pulse">CLOSED</Badge>
            ) : (
              <Badge variant="success">LIVE</Badge>
            )}
          </div>
          
          <div className="p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`p-6 rounded-3xl transition-all duration-500 ${!displayVotingClosed ? 'bg-status-success/10 text-status-success shadow-inner' : 'bg-status-error/10 text-status-error shadow-inner'}`}>
                {!displayVotingClosed ? <Unlock size={48} /> : <Lock size={48} />}
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase mb-1">Voting Status</p>
                <p className={`text-4xl font-black ${!displayVotingClosed ? 'text-status-success' : 'text-status-error'}`}>
                  {!displayVotingClosed ? 'OPEN' : 'TERMINATED'}
                </p>
                {closedAt && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    ประทับเวลาปิดหีบ: {closedAt.toLocaleString('th-TH')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {!displayVotingClosed ? (
                <Button 
                  variant="danger" 
                  size="lg"
                  className="w-full lg:w-72 h-16 text-lg font-bold shadow-lg shadow-red-100 hover:shadow-red-200 transition-all"
                  onClick={() => setIsCloseModalOpen(true)}
                  disabled={!canCloseVote || isLoading}
                >
                  <Lock size={22} className="mr-2" />
                  ปิดการลงคะแนนถาวร
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full lg:w-72 h-16 text-lg font-bold border-green-600 text-green-600 hover:bg-green-50 shadow-sm"
                  onClick={handleOpenVoting}
                  disabled={!canCloseVote || isLoading}
                >
                  <Unlock size={22} className="mr-2" />
                  เปิดการลงคะแนนใหม่
                </Button>
              )}
              {!canCloseVote && (
                <p className="text-[10px] text-red-500 text-center flex items-center justify-center gap-1 bg-red-50 py-1 rounded">
                  <AlertTriangle size={10} />
                  สิทธิ์ของคุณไม่เพียงพอสำหรับการควบคุมสถานะหีบเลือกตั้ง
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Progress Section */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-surface-border bg-surface-soft flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
               <Users size={20} className="text-authority" />
               ความคืบหน้าการลงคะแนนรายเขตพื้นที่
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อจังหวัด หรือเขตพื้นที่..."
                className="w-full pl-10 pr-4 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">เขตพื้นที่</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">การมาใช้สิทธิ</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">จำนวนบัตร (ลงแล้ว/ทั้งหมด)</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">แอคชั่น</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredDistricts.length > 0 ? (
                  paginatedDistricts.map((district) => (
                    <tr key={district.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-text-primary">{district.name}</p>
                        <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-1 font-medium">
                          <Clock size={10} />
                          อัปเดตล่าสุด: {district.lastUpdated}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          district.status === 'Complete' ? 'success' : 
                          district.status === 'Reporting' ? 'info' : 
                          district.status === 'Live' ? 'warning' : 'info'
                        }>
                          {district.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full transition-all duration-1000 ${district.progress === 100 ? 'bg-status-success' : 'bg-authority'}`}
                               style={{ width: `${district.progress}%` }}
                             />
                          </div>
                          <span className="text-sm font-bold text-text-primary">{district.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-text-primary">{district.ballotsCast.toLocaleString()}</span>
                        <span className="text-xs text-text-secondary font-medium"> / {district.ballotsTotal.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-text-secondary hover:text-authority hover:bg-authority/5 rounded-full transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-secondary italic">
                      ไม่พบข้อมูลที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredDistricts.length > 0 && totalPages > 1 && (
            <div className="p-6 border-t border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  แสดงรายการที่ {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredDistricts.length)} จาก {filteredDistricts.length} เขต
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      ก่อนหน้า
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="flex items-center gap-1"
                    >
                      ถัดไป
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-text-secondary font-medium">
                    หน้า {currentPage} จาก {totalPages}
                  </p>
                </div>
              </div>
              
              {/* Page Jump Input */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-text-secondary">ไปที่หน้า:</label>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePageJump()}
                  placeholder="ระบุหมายเลขหน้า"
                  className="w-20 px-3 py-2 border border-surface-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePageJump}
                  disabled={!pageInput || parseInt(pageInput) < 1 || parseInt(pageInput) > totalPages}
                >
                  ไป
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isCloseModalOpen} 
        onClose={() => setIsCloseModalOpen(false)} 
        title="ยืนยันการปิดการลงคะแนนเสียง"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-text-primary font-bold mb-1">
                คุณกำลังจะปิดการลงคะแนนเสียงทั้งประเทศ?
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                การดำเนินการนี้จะทำให้ผู้มีสิทธิ์เลือกตั้งไม่สามารถลงคะแนนได้อีกต่อไป และระบบจะเริ่มเข้าสู่กระบวนการสรุปผลทันที
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <h4 className="font-bold text-red-900 text-sm mb-2 flex items-center gap-1">
              <Activity size={14} />
              สิ่งที่ระบบจะดำเนินการ:
            </h4>
            <ul className="text-xs text-red-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />
                ระงับการเข้าถึงเมนูลงคะแนนสำหรับ Voter ทุกคน
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />
                ล็อกฐานข้อมูลคะแนนดิบเพื่อป้องกันการแก้ไข
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />
                เปิดระบบนับคะแนนและประกาศผล (Declare Results) สำหรับ EC Staff
              </li>
            </ul>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsCloseModalOpen(false)} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={handleCloseVoting} disabled={isLoading}>
            {isLoading ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <Lock size={16} className="mr-2" />
            )}
            ยืนยันปิดการลงคะแนน
          </Button>
        </ModalFooter>
      </Modal>
    </BaseLayout>
  );
};

const StatBox: React.FC<{ label: string, value: string, icon: React.ReactNode, trend: string, subValue?: React.ReactNode }> = ({ label, value, icon, trend, subValue }) => (
  <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-3 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-surface-soft rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</span>
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-black text-text-primary tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-text-secondary flex items-center gap-1">{trend}</p>
      {subValue}
    </div>
  </div>
);

export default ECBallotPage;
