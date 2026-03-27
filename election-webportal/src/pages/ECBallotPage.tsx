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
  ChevronRight
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

  const canCloseVote = user?.role === 'ec' && hasPermission(user.role, 'close_vote') || user?.role === 'admin';
  
  // Determine actual voting status based on fetched data
  // If all constituencies are closed, the system is closed
  const actualVotingClosed = constituencyData.length > 0 && 
    constituencyData.every(c => c.is_closed === true);
  
  // Use the more reliable actualVotingClosed if we have data, otherwise fall back to context
  const displayVotingClosed = constituencyData.length > 0 ? actualVotingClosed : isVotingClosed;

  const fetchStats = async () => {
    try {
      const data = await ecApi.getElectionStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch election stats:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const data = await constituenciesApi.getAll();
      setConstituencyData(data); // Store raw constituency data
      
      const mapped: DistrictProgress[] = data.map(c => {
        const turnoutNum = c.is_closed ? 100 : Math.floor(Math.random() * 90);
        const total = 15000 + Math.floor(Math.random() * 5000);
        return {
          id: c.id,
          name: `${c.province} เขต ${c.district_number}`,
          province: c.province,
          district_number: c.district_number,
          progress: turnoutNum,
          status: c.is_closed ? 'Complete' : (turnoutNum > 0 ? 'Reporting' : 'Pending'),
          ballotsTotal: total,
          ballotsCast: Math.floor(total * (turnoutNum / 100)),
          lastUpdated: '2 นาทีที่แล้ว'
        };
      });
      
      setDistricts(mapped);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchDistricts(), fetchStats()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseVoting = async () => {
    try {
      setIsLoading(true);
      await ecApi.updateVotingStatus({
        action: 'close',
        closedBy: user?.fullName || 'EC Official',
        closedAt: new Date().toISOString(),
      });

      setIsCloseModalOpen(false);
      
      // Wait to ensure backend state is persisted
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch fresh data
      await fetchData();
      
      // Refresh voting status from backend state (this is the source of truth)
      await refreshStatus();
    } catch (error) {
      console.error('Error closing voting:', error);
      alert('เกิดข้อผิดพลาดในการปิดการลงคะแนน กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenVoting = async () => {
    if (!window.confirm('คุณต้องการเปิดการลงคะแนนใหม่ใช่หรือไม่?')) return;
    
    try {
      setIsLoading(true);
      await ecApi.updateVotingStatus({
        action: 'open',
        closedBy: user?.fullName || 'EC Official',
        closedAt: new Date().toISOString(),
      });

      // Wait to ensure backend state is persisted
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch fresh data
      await fetchData();
      
      // Refresh voting status from backend state (this is the source of truth)
      await refreshStatus();
    } catch (error) {
      console.error('Error reopening voting:', error);
      alert('เกิดข้อผิดพลาดในการเปิดการลงคะแนน กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDistricts = districts.filter(d => 
    d.province.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={16} />
              ส่งออกรายงาน
            </Button>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  filteredDistricts.map((district) => (
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
