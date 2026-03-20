import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Modal, ModalFooter } from '../components/Modal';
import { 
  Lock,
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';
import { hasPermission } from '../utils/permissions';
import { useAuth } from '../context/AuthContext';
import { useVoting } from '../context/VotingContext';
import { ecApi } from '../api';

interface ElectionStats {
  totalRegistered: number;
  totalVoted: number;
  turnoutPercentage: number;
  activeStations: number;
  totalStations: number;
}

const ECCloseVotePage: React.FC = () => {
  const { user } = useAuth();
  const { isVotingClosed, closedAt, closeVoting, openVoting } = useVoting();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  // Mock data - replace with real API calls
  const electionStats: ElectionStats = {
    totalRegistered: 45678900,
    totalVoted: 32456780,
    turnoutPercentage: 71.1,
    activeStations: 85432,
    totalStations: 95678
  };

  const canCloseVote = user?.role === 'ec' && hasPermission(user.role, 'close_vote') || user?.role === 'admin';

  const handleCloseVoting = async () => {
    try {
      console.log('Attempting to close voting via API...');
      
      // Call backend API to close voting using update-voting endpoint
      await ecApi.updateVotingStatus({
        action: 'close',
        closedBy: user?.name || 'EC Official',
        closedAt: new Date().toISOString(),
      });

      console.log('✅ Voting closed successfully via API');

      // Update local state only after successful API call
      if (user?.name) {
        closeVoting(user.name);
      } else {
        closeVoting('EC Official');
      }
      setIsCloseModalOpen(false);
      
    } catch (error) {
      console.error('❌ Error closing voting:', error);
      // You might want to show an error message to the user here
      alert('เกิดข้อผิดพลาดในการปิดการลงคะแนน กรุณาลองใหม่');
    }
  };

  const handleOpenVoting = async () => {
    try {
      console.log('Attempting to reopen voting via API...');
      
      // Call backend API to reopen voting using update-voting endpoint
      await ecApi.updateVotingStatus({
        action: 'open',
        closedBy: user?.name || 'EC Official',
        closedAt: new Date().toISOString(),
      });

      console.log('✅ Voting reopened successfully via API');

      // Update local state only after successful API call
      openVoting();
      
    } catch (error) {
      console.error('❌ Error reopening voting:', error);
      alert('เกิดข้อผิดพลาดในการเปิดการลงคะแนน กรุณาลองใหม่');
    }
  };

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">ปิดการลงคะแนนเสียง</h1>
            <p className="text-text-secondary">ตรวจสอบสถิติและปิดการลงคะแนนเสียงอย่างเป็นทางการ</p>
          </div>

          <div className="flex items-center gap-3">
            {isVotingClosed ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <Lock size={20} className="text-red-600" />
                <span className="text-red-800 font-medium">การลงคะแนนถูกปิดแล้ว</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 size={20} className="text-green-600" />
                <span className="text-green-800 font-medium">การลงคะแนนเปิดอยู่</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        {closedAt && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Lock size={24} className="text-red-600" />
                <h3 className="text-lg font-bold text-red-900">การลงคะแนนเสียงถูกปิดแล้ว</h3>
              </div>
              <Button 
                onClick={handleOpenVoting} 
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                เปิดการลงคะแนนใหม่
              </Button>
            </div>
            <div className="flex items-center gap-2 text-red-700">
              <Calendar size={16} />
              <span>ปิดการลงคะแนนเมื่อ: {closedAt.toLocaleDateString('th-TH')} เวลา {closedAt.toLocaleTimeString('th-TH')}</span>
            </div>
          </div>
        )}

        {/* Election Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary">ผู้มีสิทธิ์เลือกตั้ง</h3>
              <Users size={20} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{electionStats.totalRegistered.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">คน</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary">ผู้มาลงคะแนน</h3>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{electionStats.totalVoted.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">คน</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary">เปอร์เซ็นต์การมาลงคะแนน</h3>
              <BarChart3 size={20} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{electionStats.turnoutPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${electionStats.turnoutPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary">หน่วยเลือกตั้ง</h3>
              <Clock size={20} className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{electionStats.activeStations.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">จาก {electionStats.totalStations.toLocaleString()} หน่วย</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-lg border border-surface-border shadow-sm p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-2">ปิดการลงคะแนนเสียงอย่างเป็นทางการ</h3>
              <p className="text-text-secondary">
                เมื่อปิดการลงคะแนนแล้ว จะไม่สามารถเปลี่ยนแปลงผลการเลือกตั้งได้อีก
                <br />
                กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {!canCloseVote && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertTriangle size={16} />
                  <span>คุณไม่มีสิทธิ์ปิดการลงคะแนน</span>
                </div>
              )}
              
              <Button 
                variant="danger" 
                size="lg"
                className="flex items-center gap-2"
                onClick={() => setIsCloseModalOpen(true)}
                disabled={!canCloseVote || isVotingClosed}
              >
                <Lock size={18} />
                {isVotingClosed ? 'การลงคะแนนถูกปิดแล้ว' : 'ปิดการลงคะแนนเสียง'}
              </Button>
            </div>
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
            <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-text-primary font-medium mb-2">
                คุณต้องการปิดการลงคะแนนเสียงหรือไม่?
              </p>
              <p className="text-sm text-text-secondary">
                การดำเนินการนี้ไม่สามารถย้อนกลับได้ และจะส่งผลต่อการลงคะแนนเสียงทั้งหมดในระบบ
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">ผลที่ตามมา:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• ผู้ลงคะแนนจะไม่สามารถลงคะแนนได้อีก</li>
              <li>• ระบบจะเริ่มนับคะแนนเสียงอัตโนมัติ</li>
              <li>• ไม่สามารถแก้ไขข้อมูลการเลือกตั้งได้</li>
            </ul>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={handleCloseVoting}>
            <Lock size={16} className="mr-2" />
            ปิดการลงคะแนนเสียง
          </Button>
        </ModalFooter>
      </Modal>
    </BaseLayout>
  );
};

export default ECCloseVotePage;