import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Clock,
  ChevronRight,
  Search,
  Download
} from 'lucide-react';

const ECBallotsManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(true);

  const handleCloseVote = () => {
    setIsVotingOpen(false);
    setShowCloseConfirm(false);
  };

  const districts = [
    { id: '1', name: 'กรุงเทพมหานคร เขต 1', status: 'Reporting', turnout: '68%', ballotsTotal: 15000, ballotsCast: 10200 },
    { id: '2', name: 'กรุงเทพมหานคร เขต 2', status: 'Completed', turnout: '82%', ballotsTotal: 14500, ballotsCast: 11890 },
    { id: '3', name: 'เชียงใหม่ เขต 1', status: 'Live', turnout: '45%', ballotsTotal: 20000, ballotsCast: 9000 },
    { id: '4', name: 'ขอนแก่น เขต 1', status: 'Pending', turnout: '0%', ballotsTotal: 18000, ballotsCast: 0 },
  ];

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">ระบบจัดการบัตรเลือกตั้ง</h1>
            <p className="text-text-secondary mt-1">ติดตามจำนวนบัตร ยอดการลงคะแนน และสถานะการรายงานผลทั่วประเทศ</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <Button variant="outline" className="flex items-center gap-2">
                <Download size={18} />
                ส่งออกรายงาน
             </Button>
             
             {isVotingOpen ? (
               !showCloseConfirm ? (
                 <Button 
                   variant="danger" 
                   className="flex items-center gap-2"
                   onClick={() => setShowCloseConfirm(true)}
                 >
                   <Clock size={18} />
                   ปิดการลงคะแนน
                 </Button>
               ) : (
                 <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                   <Button variant="danger" size="sm" onClick={handleCloseVote}>ยืนยันปิด</Button>
                   <Button variant="outline" size="sm" onClick={() => setShowCloseConfirm(false)}>ยกเลิก</Button>
                 </div>
               )
             ) : (
               <Badge variant="error" className="py-2 px-4 text-sm font-bold">
                 ปิดการลงคะแนนแล้ว
               </Badge>
             )}

             <Button variant="authority" className="flex items-center gap-2">
                <ShieldCheck size={18} />
                ตรวจสอบความปลอดภัย
             </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox 
            label="ยอดผู้ออกมาใช้สิทธิ" 
            value={isVotingOpen ? "72.4%" : "72.4% (Final)"} 
            icon={<TrendingUp className="text-status-success" />} 
            trend={isVotingOpen ? "+2.1% จากปี 66" : "ปิดหีบสำเร็จ"}
          />
          <StatBox 
            label="จำนวนบัตรทั้งหมด" 
            value="52.4M" 
            icon={<FileText className="text-authority" />} 
            trend="จัดส่งครบ 100%"
          />
          <StatBox 
            label="เขตที่รายงานผลแล้ว" 
            value="142/400" 
            icon={<BarChart3 className="text-navigation" />} 
            trend="35.5% ของทั้งหมด"
          />
          <StatBox 
            label="บัตรที่พบปัญหา" 
            value="124" 
            icon={<AlertCircle className="text-status-error" />} 
            trend="รอชุดเคลื่อนที่เร็ว"
          />
        </div>

        {/* Main Management Section */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
               <Users size={20} className="text-authority" />
               ความคืบหน้ารายเขตพื้นที่
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text" 
                placeholder="ค้นหาเขตพื้นที่..."
                className="w-full pl-10 pr-4 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-soft border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-text-secondary">เขตพื้นที่</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-secondary">สถานะ</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-secondary">การใช้สิทธิ</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-secondary">จำนวนบัตร (ลงแล้ว/ทั้งหมด)</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">แอคชั่น</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {districts.map((district) => (
                  <tr key={district.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-primary">{district.name}</p>
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                        <Clock size={12} />
                        อัปเดตล่าสุด: 2 นาทีที่แล้ว
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        district.status === 'Completed' ? 'success' : 
                        district.status === 'Reporting' ? 'info' : 
                        district.status === 'Live' ? 'warning' : 'info'
                      }>
                        {district.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-authority" 
                             style={{ width: district.turnout }}
                           />
                        </div>
                        <span className="text-sm font-bold">{district.turnout}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{district.ballotsCast.toLocaleString()}</span>
                      <span className="text-sm text-text-secondary"> / {district.ballotsTotal.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-text-secondary hover:text-authority hover:bg-authority/5 rounded-full transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

const StatBox: React.FC<{ label: string, value: string, icon: React.ReactNode, trend: string }> = ({ label, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-3">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-surface-soft rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <p className="text-2xl font-black text-text-primary">{value}</p>
      <p className="text-[10px] font-medium text-text-secondary">{trend}</p>
    </div>
  </div>
);

export default ECBallotsManagementPage;
