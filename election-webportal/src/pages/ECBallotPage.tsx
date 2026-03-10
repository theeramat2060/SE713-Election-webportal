import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Activity, 
  BarChart, 
  Clock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

const ECBallotPage: React.FC = () => {
  const [isBallotOpen, setIsBallotOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseBallot = () => {
    setIsBallotOpen(false);
    setShowConfirm(false);
  };

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">ศูนย์ควบคุมการลงคะแนน (Ballot Control)</h1>
          <p className="text-text-secondary">ระบบเฝ้าระวังและควบคุมสถานะการเลือกตั้งแบบเรียลไทม์</p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-sm font-medium text-text-secondary">อัตราผู้มาใช้สิทธิ (Turnout)</span>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * 0.28} className="text-authority" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">72%</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <TrendingUp size={14} className="text-status-success" />
              +12% จากชั่วโมงที่แล้ว
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm space-y-2 flex flex-col justify-center">
            <span className="text-sm font-medium text-text-secondary">คะแนนที่ลงแล้ว (Votes Cast)</span>
            <p className="text-4xl font-black text-text-primary">1,240,582</p>
            <p className="text-sm text-text-secondary">คะแนนทั้งหมดในระบบ</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm space-y-2 flex flex-col justify-center">
            <span className="text-sm font-medium text-text-secondary">บัตรเสีย (Invalid Ballots)</span>
            <p className="text-4xl font-black text-status-error">4,102</p>
            <p className="text-sm text-text-secondary flex items-center gap-1 text-status-error">
              <AlertTriangle size={14} />
              0.33% ของคะแนนทั้งหมด
            </p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg border-2 border-surface-border overflow-hidden shadow-elevation">
          <div className="bg-surface-soft p-4 border-b border-surface-border flex items-center gap-2">
            <Activity size={20} className="text-authority" />
            <h2 className="font-bold text-text-primary">แผงควบคุมสถานะหีบเลือกตั้ง</h2>
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${isBallotOpen ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'}`}>
                  {isBallotOpen ? <Unlock size={32} /> : <Lock size={32} />}
                </div>
                <div>
                  <p className="text-sm text-text-secondary">สถานะปัจจุบัน</p>
                  <p className={`text-2xl font-bold ${isBallotOpen ? 'text-status-success' : 'text-status-error'}`}>
                    {isBallotOpen ? 'เปิดรับคะแนน (Open)' : 'ปิดหีบสำเร็จ (Closed)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  เปิดเมื่อ 08:00 AM
                </div>
                <div className="flex items-center gap-1 text-authority">
                  <CheckCircle2 size={16} />
                  เขตที่รายงานผลแล้ว: 32/77
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {!showConfirm ? (
                <Button 
                  variant={isBallotOpen ? "danger" : "outline"} 
                  size="lg"
                  className="w-full md:w-64"
                  onClick={() => isBallotOpen && setShowConfirm(true)}
                  disabled={!isBallotOpen}
                >
                  <Lock size={20} className="mr-2" />
                  {isBallotOpen ? 'ปิดหีบเลือกตั้ง' : 'หีบปิดแล้ว'}
                </Button>
              ) : (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-sm text-red-800 font-bold flex items-center gap-2">
                    <AlertTriangle size={16} />
                    คุณกำลังจะปิดการลงคะแนนถาวร?
                  </p>
                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={handleCloseBallot}>ยืนยันปิดหีบ</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>ยกเลิก</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* District Progress */}
        <div className="bg-white rounded-lg border border-surface-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-surface-border">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <BarChart size={20} className="text-authority" />
              ความคืบหน้าการส่งผลรายจังหวัด
            </h3>
          </div>
          <div className="divide-y divide-surface-border">
             {[
               { name: "จังหวัดกรุงเทพมหานคร", progress: 100, status: "Complete" },
               { name: "จังหวัดเชียงใหม่", progress: 45, status: "Reporting" },
               { name: "จังหวัดนครราชสีมา", progress: 12, status: "Pending" }
             ].map((district, idx) => (
               <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-text-primary">{district.name}</span>
                  <div className="flex items-center gap-4 w-64">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ${district.progress === 100 ? 'bg-status-success' : 'bg-authority'}`}
                         style={{ width: `${district.progress}%` }}
                       />
                    </div>
                    <span className="text-xs font-bold w-8">{district.progress}%</span>
                    <Badge variant={district.status === "Complete" ? "success" : "info"}>{district.status}</Badge>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ECBallotPage;
