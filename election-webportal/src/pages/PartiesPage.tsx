import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { ChevronDown, ChevronUp, Users, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { partiesApi } from '../api/parties';
import type { PartyDetails } from '../api/types';

const PartiesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAllPartiesData = async () => {
      try {
        setLoading(true);
        // 1. Get all basic party info
        const basicParties = await partiesApi.getAll();
        
        // 2. Fetch full details for each party to get policies and candidates
        const detailedParties = await Promise.all(
          basicParties.map(p => partiesApi.getById(p.id))
        );
        
        setParties(detailedParties);
        if (detailedParties.length > 0) {
          setExpandedId(detailedParties[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch parties:', err);
        setError('ไม่สามารถโหลดข้อมูลพรรคการเมืองได้ในขณะนี้');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPartiesData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Determine the layout role based on authentication status
  const layoutRole = isAuthenticated && user ? user.role : 'public';

  return (
    <BaseLayout role={layoutRole}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-democracy-light border border-democracy/20 rounded-lg p-8 shadow-sm text-center space-y-4">
          <h1 className="text-4xl font-bold text-democracy-dark">ข้อมูลพรรคการเมือง</h1>
          <p className="text-lg text-democracy/90 max-w-2xl mx-auto">
            ร่วมสร้างสรรค์ระบอบประชาธิปไตยผ่านการศึกษาข้อมูลและนโยบายของพรรคการเมือง 
            เพื่อการตัดสินใจเลือกตัวแทนที่ตรงใจคุณที่สุด
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-democracy animate-spin" />
            <p className="text-text-secondary font-medium">กำลังโหลดข้อมูลพรรคการเมือง...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
            <p className="font-bold text-lg mb-2">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        ) : (
          /* Party List */
          <div className="space-y-4">
            {parties.map((party) => (
              <div 
                key={party.id}
                className={`bg-white border rounded-lg transition-all duration-300 ${
                  expandedId === party.id 
                    ? 'border-democracy shadow-elevation ring-1 ring-democracy/10' 
                    : 'border-surface-border shadow-card hover:border-democracy/30'
                }`}
              >
                {/* Header (Always Visible) */}
                <button 
                  onClick={() => toggleExpand(party.id)}
                  className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 flex items-center justify-center bg-surface-soft rounded-lg border border-surface-border overflow-hidden">
                      <img src={party.logo_url} alt={party.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">{party.name}</h2>
                      <p className="text-democracy font-medium">หมายเลข {party.id}</p>
                      {expandedId !== party.id && (
                        <p className="text-text-secondary line-clamp-1 mt-1">{party.policy.substring(0, 100)}...</p>
                      )}
                    </div>
                  </div>
                  <div className="text-text-secondary">
                    {expandedId === party.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                {/* Expandable Content */}
                {expandedId === party.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-surface-border/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Policy Summary */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                          <FileText className="w-5 h-5 text-democracy" />
                          สรุปนโยบายพรรค
                        </h3>
                        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                          {party.policy}
                        </p>
                      </div>

                      {/* Candidates */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                          <Users className="w-5 h-5 text-democracy" />
                          ผู้สมัครแนะนำในเขต
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {party.candidates && party.candidates.length > 0 ? (
                            party.candidates.map((candidate) => (
                              <div key={candidate.id} className="p-3 bg-surface-soft rounded border border-surface-border flex flex-col gap-2">
                                {/* Candidate Photo */}
                                <div className="flex items-center gap-3">
                                  <img src={candidate.image_url} alt={candidate.first_name} className="w-12 h-12 rounded-full object-cover border border-surface-border" />
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-text-primary block truncate">
                                      {candidate.title}{candidate.first_name} {candidate.last_name}
                                    </span>
                                    <span className="text-xs text-text-secondary">
                                      {candidate.province} เขต {candidate.district_number}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-text-secondary italic col-span-2">ไม่มีข้อมูลผู้สมัคร</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default PartiesPage;
