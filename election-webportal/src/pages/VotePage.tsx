import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { useVoting } from '../context/VotingContext';
import { Search, MapPin, Check } from 'lucide-react';
import { electionApi, constituenciesApi, voterApi } from '../api';
import type { CandidateResult, Constituency } from '../api';

const VotePage: React.FC = () => {
  const { user } = useAuth();
  const { isVotingClosed, getConstituencyStatus, isConstituencyOpen } = useVoting();
  const [selectedCandidate, setSelectedCandidate] = useState<number | 'abstain' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [constituency, setConstituency] = useState<Constituency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConstituencyVotingClosed, setIsConstituencyVotingClosed] = useState(false);

  useEffect(() => {
    const fetchVoterContext = async () => {
      if (!user?.id) {
        setError('ไม่พบข้อมูลผู้ใช้งาน');
        setIsLoading(false);
        return;
      }

      try {
        // 0. Check if user has already voted
        const myVoteRes = await voterApi.getMyVote();
        if (myVoteRes.success && myVoteRes.data) {
          setHasVoted(true);
          setIsLoading(false);
          return;
        }

        // 1. Fetch Candidates (This endpoint returns candidates for the user's assigned constituency)
        const candRes = await electionApi.getCandidatesByUserId(user.id);
        
        // 2. Fetch Constituency Details (Using districtId from user session if available)
        let constData: Constituency | null = null;
        if (user.districtId) {
          try {
            const allConst = await constituenciesApi.getAll();
            constData = allConst.find(c => c.id === Number(user.districtId)) || null;
          } catch (e) {
            console.error('Failed to fetch constituency list', e);
          }
        }

        if (candRes.success && Array.isArray(candRes.data)) {
          setCandidates(candRes.data);
          
          // If we couldn't find constituency from the list, extract it from the candidate record
          if (!constData && candRes.data.length > 0) {
            const first = candRes.data[0];
            constData = {
              id: (first as any).constituency_id || first.id,
              province: first.province,
              district_number: first.district_number,
              is_closed: first.is_closed
            };
          }
          setConstituency(constData);
          
          // Check constituency-specific voting status
          if (constData) {
            const constituencyStatus = getConstituencyStatus(constData.province, constData.district_number);
            if (constituencyStatus) {
              setIsConstituencyVotingClosed(constituencyStatus.is_closed);
            } else {
              // If not found in status, check if globally closed or use constituency data
              setIsConstituencyVotingClosed(isVotingClosed || constData.is_closed);
            }
          }
        } else {
          const errMsg = typeof candRes.error === 'object' ? candRes.error.message : (candRes.error ?? 'เกิดข้อผิดพลาดในการโหลดรายชื่อผู้สมัคร');
          setError(errMsg);
        }
      } catch (err: any) {
        const errMsg = err.response?.data?.error?.message || err.response?.data?.error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoterContext();
  }, [user]);

  // Clear selection and show notification when voting is closed  
  useEffect(() => {
    if (isConstituencyVotingClosed && selectedCandidate) {
      setSelectedCandidate(null);
      setError('การลงคะแนนเสียงในเขตของคุณถูกปิดแล้ว การเลือกของคุณถูกยกเลิก');
    }
  }, [isConstituencyVotingClosed, selectedCandidate]);

  const handleVote = async () => {
    // Check if voting is closed in this constituency
    if (isConstituencyVotingClosed) {
      setError('การลงคะแนนเสียงในเขตของคุณสิ้นสุดแล้ว ไม่สามารถลงคะแนนได้');
      return;
    }

    if (selectedCandidate === null || !user?.id || !constituency?.id) {
      if (!constituency?.id) setError('ไม่พบข้อมูลรหัสเขตเลือกตั้งของคุณ');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const payload = {
        userId: user.id,
        candidateId: selectedCandidate === 'abstain' ? null : selectedCandidate,
        constituencyId: constituency.id
      };
      const res = await electionApi.vote(payload);
      
      if (res.success) {
        setHasVoted(true);
      } else {
        const errMsg = typeof res.error === 'object' ? res.error.message : (res.error ?? 'การลงคะแนนล้มเหลว กรุณาลองใหม่อีกครั้ง');
        setError(errMsg);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.response?.data?.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.party_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BaseLayout role="voter">
      <div className="flex flex-col gap-8">
        {/* Voting Status Alert */}
        {isConstituencyVotingClosed && (
          <Alert 
            type="error" 
            message={`การลงคะแนนเสียงในเขต${constituency?.province || ''} เขต ${constituency?.district_number || ''} ได้ปิดแล้ว ไม่สามารถลงคะแนนเพิ่มเติมได้ คุณสามารถดูผลการเลือกตั้งได้ในเมนู ผลการเลือกตั้ง`} 
          />
        )}

        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-democracy/10 rounded-full flex items-center justify-center text-democracy text-2xl">
              📍
            </div>
            <div>
              <h1 className="text-xl font-bold">
                เขตการเลือกตั้ง: {constituency ? `${constituency.province} เขต ${constituency.district_number}` : 'กำลังโหลด...'}
              </h1>
              <p className="text-sm text-text-secondary">ผู้มีสิทธิ : {  user?. fullName}</p>
            </div>
          </div>
          <Badge variant={constituency?.is_closed ? "error" : "success"} className="px-4 py-1">
            {constituency?.is_closed ? "ปิดหีบลงคะแนนแล้ว" : "เปิดหีบลงคะแนน"}
          </Badge>
        </div>

        {error && <Alert type="error" message={error} />}

        {hasVoted ? (
          <div className="card p-12 text-center flex flex-col items-center gap-4 bg-white">
            <div className="w-20 h-20 bg-democracy/10 rounded-full flex items-center justify-center text-democracy mb-2">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-democracy">ยืนยันการลงคะแนนสำเร็จ</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              ขอบคุณที่ร่วมใช้สิทธิประชาธิปไตย ระบบได้บันทึกคะแนนเสียงของคุณเรียบร้อยแล้ว คุณสามารถกลับมาดูผลการเลือกตั้งได้หลังจากปิดหีบ
            </p>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-democracy/20 focus:border-democracy"
                  />
                </div>
              </div>

              {/* Abstain Option Banner */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <p className="text-sm font-medium text-blue-900">
                    💡 หากท่านไม่ต้องการลงคะแนนให้ใครสามารถเลือก "ไม่ประสงค์ลงคะแนน" ด้านล่าง
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="py-20 text-center text-text-secondary">กำลังโหลดรายชื่อผู้สมัคร...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <div 
                        key={candidate.id}
                        onClick={() => !isConstituencyVotingClosed && setSelectedCandidate(candidate.id)}
                        className={`
                          card transition-all relative overflow-hidden group
                           ${isConstituencyVotingClosed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${selectedCandidate === candidate.id ? 'ring-2 ring-democracy border-democracy bg-democracy-light/20' : isConstituencyVotingClosed ? '' : 'hover:border-democracy/30'}
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
                            <div className="flex-1 w-24 sm:w-28 md:w-32 lg:w-40 aspect-[3/4] bg-surface-soft rounded-lg flex items-center justify-center overflow-hidden border border-surface-border group-hover:scale-105 transition-transform">
                              {candidate.image_url ? (
                                 <img 
                                   src={candidate.image_url} 
                                   alt={candidate.first_name} 
                                   className="w-full h-full object-cover"
                                   loading="lazy"
                                 />
                              ) : (
                                 <span className="text-5xl">👨‍💼</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <h3 className="text-lg font-bold mb-1">{candidate.title}{candidate.first_name} {candidate.last_name}</h3>
                            <div className="flex items-center justify-center gap-1.5 text-text-secondary text-sm">
                              {candidate.party_logo_url && <img src={candidate.party_logo_url} className="w-4 h-4 object-contain" alt="" />}
                              <span>{candidate.party_name}</span>
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
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-text-secondary bg-surface-soft rounded-2xl border border-dashed border-surface-border">
                      ไม่พบรายชื่อผู้สมัครที่ค้นหา
                    </div>
                  )}

                  {/* No Vote Option */}
                  <div 
                    onClick={() => !isConstituencyVotingClosed && setSelectedCandidate('abstain')}
                    className={`
                      card transition-all relative overflow-hidden group border-2
                      ${isConstituencyVotingClosed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${selectedCandidate === 'abstain' ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 shadow-lg shadow-blue-200' : isConstituencyVotingClosed ? 'bg-surface-soft/50 border-surface-border' : 'hover:border-blue-400 bg-blue-50 border-blue-200 hover:shadow-md hover:shadow-blue-100'}
                    `}
                  >
                    {selectedCandidate === 'abstain' && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl font-bold text-blue-300 opacity-30">--</div>
                        <div className="flex-1 w-24 sm:w-28 md:w-32 lg:w-40 aspect-[3/4] bg-white rounded-lg flex items-center justify-center text-5xl group-hover:scale-105 transition-transform border-2 border-blue-200">
                          🚫
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-bold mb-1 text-blue-900">ไม่ประสงค์ลงคะแนน</h3>
                        <div className="flex items-center justify-center gap-1.5 text-blue-700 text-sm italic font-medium">
                          <span>Abstain / No Vote</span>
                        </div>
                      </div>
                    </div>

                    <div className={`
                      py-3 text-center text-sm font-semibold transition-colors
                      ${selectedCandidate === 'abstain' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900 group-hover:bg-blue-400 group-hover:text-white'}
                    `}>
                      {selectedCandidate === 'abstain' ? 'เลือกแล้ว ✓' : 'คลิกเพื่อเลือก'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-8 mt-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <Alert 
                type={isVotingClosed ? "error" : "warning"} 
                message={isVotingClosed ? "การลงคะแนนเสียงสิ้นสุดแล้ว ไม่สามารถลงคะแนนได้อีก" : "โปรดตรวจสอบการตัดสินใจก่อนกดยืนยัน ระบบอนุญาตให้ลงคะแนนได้เพียงครั้งเดียวในแต่ละเขต"}
                className="max-w-2xl shadow-elevation"
              />
              <Button 
                size="lg" 
                className="w-full max-w-sm h-14 text-xl shadow-lg"
                disabled={!selectedCandidate || isSubmitting || isConstituencyVotingClosed}
                isLoading={isSubmitting}
                onClick={handleVote}
              >
                {isConstituencyVotingClosed ? 'การลงคะแนนสิ้นสุดแล้ว' : 'ยืนยันการลงคะแนน'}
              </Button>
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default VotePage;
