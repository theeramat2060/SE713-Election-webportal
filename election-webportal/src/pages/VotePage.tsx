import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Check } from 'lucide-react';

interface Candidate {
  id: string;
  number: number;
  name: string;
  party: string;
  partyLogo: string;
  image: string;
}

const VotePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock candidates data
  const candidates: Candidate[] = [
    {
      id: '1',
      number: 1,
      name: 'นายประชา ชูสิทธิ์',
      party: 'พรรคประชาไทย',
      partyLogo: '🇹🇭',
      image: '👨‍💼',
    },
    {
      id: '2',
      number: 2,
      name: 'นางสาววิไล พัฒนา',
      party: 'พรรคอนาคตใหม่',
      partyLogo: '🚀',
      image: '👩‍💼',
    },
    {
      id: '3',
      number: 3,
      name: 'นายอำนาจ เก่งกาจ',
      party: 'พรรคพลังแผ่นดิน',
      partyLogo: '🛡️',
      image: '👨‍💼',
    },
  ];

  const handleVote = () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    
    // Mock voting process
    setTimeout(() => {
      setHasVoted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <BaseLayout role="voter">
      <div className="flex flex-col gap-8">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-democracy/10 rounded-full flex items-center justify-center text-democracy text-2xl">
              📍
            </div>
            <div>
              <h1 className="text-xl font-bold">เขตการเลือกตั้ง: กรุงเทพมหานคร เขต 1</h1>
              <p className="text-sm text-text-secondary">ผู้มีสิทธิ: {user?.fullName}</p>
            </div>
          </div>
          <Badge variant="success" className="px-4 py-1">เปิดหีบลงคะแนน</Badge>
        </div>

        {hasVoted ? (
          <div className="card p-12 text-center flex flex-col items-center gap-4 bg-white">
            <div className="w-20 h-20 bg-democracy/10 rounded-full flex items-center justify-center text-democracy mb-2">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-democracy">ยืนยันการลงคะแนนสำเร็จ</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              ขอบคุณที่ร่วมใช้สิทธิประชาธิปไตย ระบบได้บันทึกคะแนนเสียงของคุณเรียบร้อยแล้ว คุณสามารถกลับมาดูผลการเลือกตั้งได้หลังจากปิดหีบ
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setHasVoted(false)}>
              ดูรายละเอียดคะแนนเสียง
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">ผู้สมัครรับเลือกตั้ง</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อหรือพรรค..."
                    className="pl-10 pr-4 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-democracy/20 focus:border-democracy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate.id)}
                    className={`
                      card cursor-pointer transition-all relative overflow-hidden group
                      ${selectedCandidate === candidate.id ? 'ring-2 ring-democracy border-democracy bg-democracy-light/20' : 'hover:border-democracy/30'}
                    `}
                  >
                    {selectedCandidate === candidate.id && (
                      <div className="absolute top-2 right-2 bg-democracy text-white rounded-full p-1 z-10">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl font-bold text-democracy opacity-20">#{candidate.number}</div>
                        <div className="flex-1 w-24 h-24 bg-surface-soft rounded-full flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                          {candidate.image}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-bold mb-1">{candidate.name}</h3>
                        <div className="flex items-center justify-center gap-1.5 text-text-secondary text-sm">
                          <span>{candidate.partyLogo}</span>
                          <span>{candidate.party}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`
                      py-3 text-center text-sm font-semibold transition-colors
                      ${selectedCandidate === candidate.id ? 'bg-democracy text-white' : 'bg-surface-soft text-text-secondary group-hover:bg-democracy group-hover:text-white'}
                    `}>
                      {selectedCandidate === candidate.id ? 'เลือกแล้ว' : 'เลือกผู้สมัครท่านนี้'}
                    </div>
                  </div>
                ))}

                {/* No Vote Option */}
                <div 
                  onClick={() => setSelectedCandidate('no-vote')}
                  className={`
                    card cursor-pointer transition-all relative overflow-hidden group border-dashed
                    ${selectedCandidate === 'no-vote' ? 'ring-2 ring-text-secondary border-text-secondary bg-surface-soft' : 'hover:border-text-secondary/30 bg-surface-soft/50'}
                  `}
                >
                  {selectedCandidate === 'no-vote' && (
                    <div className="absolute top-2 right-2 bg-text-secondary text-white rounded-full p-1 z-10">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl font-bold text-text-secondary opacity-10">00</div>
                      <div className="flex-1 w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl group-hover:scale-105 transition-transform border border-surface-border">
                        🚫
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-1">ไม่ประสงค์ลงคะแนน</h3>
                      <div className="flex items-center justify-center gap-1.5 text-text-secondary text-sm italic">
                        <span>Abstain / No Vote</span>
                      </div>
                    </div>
                  </div>

                  <div className={`
                    py-3 text-center text-sm font-semibold transition-colors
                    ${selectedCandidate === 'no-vote' ? 'bg-text-secondary text-white' : 'bg-white text-text-secondary group-hover:bg-text-secondary group-hover:text-white'}
                  `}>
                    {selectedCandidate === 'no-vote' ? 'เลือกแล้ว' : 'ยืนยันไม่ลงคะแนนให้ใคร'}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-8 mt-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <Alert 
                type="warning" 
                message="โปรดตรวจสอบการตัดสินใจก่อนกดยืนยัน ระบบอนุญาตให้ลงคะแนนได้เพียงครั้งเดียวในแต่ละเขต"
                className="max-w-2xl shadow-elevation"
              />
              <Button 
                size="lg" 
                className="w-full max-w-sm h-14 text-xl shadow-lg"
                disabled={!selectedCandidate}
                isLoading={isSubmitting}
                onClick={handleVote}
              >
                ยืนยันการลงคะแนน
              </Button>
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default VotePage;
