import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Search, Trophy, BarChart3, Users, MapPin, Clock, Loader2, AlertTriangle, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useVoting } from '../context/VotingContext';
import { ecApi, partiesApi } from '../api';
import type { ConstituencyWinner, PartyOverview } from '../api';

const ResultsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isVotingClosed } = useVoting();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [voteResults, setVoteResults] = useState<ConstituencyWinner[]>([]);
  const [partyStats, setPartyStats] = useState<PartyOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all candidates (always available)
  const fetchAllCandidates = async () => {
    try {
      console.log('📋 Fetching all constituencies with candidates...');
      const candidates = await partiesApi.getConstituenciesWithCandidates();
      setAllCandidates(candidates);
      console.log(`✅ Loaded ${candidates.length} constituencies`);
      return candidates;
    } catch (err: any) {
      console.error('❌ Error fetching candidates:', err);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลผู้สมัคร');
      throw err;
    }
  };

  // Fetch vote results (only if voting is closed)
  const fetchVoteResults = async () => {
    if (!isVotingClosed) {
      setVoteResults([]);
      setPartyStats(null);
      return;
    }

    try {
      console.log('🗳️ Fetching vote results...');
      const [results, overview] = await Promise.all([
        partiesApi.getResults(),
        partiesApi.getOverview()
      ]);
      
      setVoteResults(results);
      setPartyStats(overview);
      
      // Cache results in localStorage
      localStorage.setItem('electionResults', JSON.stringify(results));
      localStorage.setItem('partyOverview', JSON.stringify(overview));
      localStorage.setItem('electionResultsTimestamp', new Date().toISOString());
      console.log(`✅ Vote results loaded: ${results.length} constituencies`);
    } catch (err: any) {
      console.error('❌ Error fetching vote results:', err);
      // Don't fail if vote results unavailable - still show candidates
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Always fetch candidates
        await fetchAllCandidates();
        
        // Fetch vote results if voting is closed
        await fetchVoteResults();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [isVotingClosed]);

  // Merge candidate and vote data
  const displayResults = allCandidates.map(constituency => {
    const voteData = voteResults.find(v => v.id === constituency.id);
    return {
      ...constituency,
      total_votes: voteData?.total_votes || 0,
      winner: voteData?.winner || null,
      is_closed: voteData ? true : false,
    };
  });

  // Filter results by search term
  const filteredResults = displayResults.filter(r => {
    if (!r) return false;
    const province = r.province?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return province.includes(search);
  });

  // Winning party (party with most seats from closed constituencies)
  const winningParty = partyStats?.parties && partyStats.parties.length > 0 
    ? partyStats.parties[0] // Sorted by seats in backend
    : null;

  // Determine the layout role based on authentication status
  const layoutRole = isAuthenticated && user ? user.role : 'public';

  return (
    <BaseLayout role={layoutRole}>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-democracy animate-spin" />
            <p className="text-text-secondary font-medium text-lg">กำลังโหลดข้อมูลผลการเลือกตั้ง...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center shadow-sm">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>ลองใหม่อีกครั้ง</Button>
          </div>
        )}

        {/* Results Content */}
        {!isLoading && !error && (
          <>
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-text-primary">ผลการเลือกตั้ง</h1>
                <div className="flex items-center flex-wrap gap-2 text-text-secondary">
                  <div className="flex items-center gap-1 bg-surface-soft px-3 py-1 rounded-full border border-surface-border">
                    <MapPin className="w-3 h-3 text-democracy" />
                    <span className="text-xs font-bold">สรุปผล {displayResults.length} เขตเลือกตั้ง</span>
                  </div>
                  {isVotingClosed ? (
                    <Badge variant="error" className="px-3 py-1 font-bold">หีบปิดแล้ว</Badge>
                  ) : (
                    <Badge variant="warning" className="px-3 py-1 font-bold">การเลือกตั้งยังอยู่ระหว่างดำเนินการ</Badge>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-72">
                <Input 
                  placeholder="ค้นหาจังหวัด..." 
                  icon={<Search size={18} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Party Standings & Top Winner */}
              <div className="lg:col-span-1 space-y-8">
                {/* Winner Party Card */}
                {isVotingClosed && winningParty && (
                  <div className="bg-democracy text-white rounded-2xl p-6 shadow-elevation relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Trophy size={120} />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/80">พรรคที่ได้ที่นั่งสูงสุด</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                          <img src={winningParty.logoUrl} className="w-full h-full object-contain" alt={winningParty.name} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black leading-tight">{winningParty.name}</h2>
                          <p className="text-white/80 font-bold">{winningParty.seats} ที่นั่ง (สส.เขต)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Party Standings List */}
                {isVotingClosed && partyStats?.parties && partyStats.parties.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
                    <div className="p-4 bg-surface-soft border-b border-surface-border flex items-center justify-between">
                      <h3 className="font-bold text-text-primary flex items-center gap-2 text-sm">
                        <LayoutGrid size={16} className="text-democracy" />
                        จำนวนที่นั่งรายพรรค
                      </h3>
                    </div>
                    <div className="divide-y divide-surface-border">
                      {partyStats.parties.map((party, idx) => (
                        <div key={party.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-text-secondary w-4">{idx + 1}</span>
                            <img src={party.logoUrl} className="w-8 h-8 rounded object-contain border border-surface-border" alt={party.name} />
                            <span className="text-sm font-bold text-text-primary">{party.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-democracy">{party.seats}</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase">ที่นั่ง</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !isVotingClosed ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 font-medium">จำนวนที่นั่งจะปรากฏหลังจากปิดการเลือกตั้ง</p>
                  </div>
                ) : null}
              </div>

              {/* Right Column: Detailed District Results */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
                  <div className="p-6 border-b border-surface-border bg-surface-soft flex items-center justify-between">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-democracy" />
                      ผลการเลือกตั้งรายเขต ({filteredResults.length} เขต)
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-surface-border">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result, index) => (
                        <div key={result.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-4 flex-1">
                            {result.candidates && result.candidates.length > 0 ? (
                              <>
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                  {result.candidates[0].image_url ? (
                                    <img src={result.candidates[0].image_url} alt={result.candidates[0].first_name} />
                                  ) : (
                                    <span>👨‍💼</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-text-primary text-lg truncate group-hover:text-democracy transition-colors">
                                    {result.candidates[0].title}{result.candidates[0].first_name} {result.candidates[0].last_name}
                                  </p>
                                  <div className="flex items-center flex-wrap gap-2 mt-0.5">
                                    {result.candidates[0].party_logo_url ? (
                                      <span className="text-xs font-black text-democracy bg-democracy-light/10 px-2 py-0.5 rounded flex items-center gap-1">
                                        <img src={result.candidates[0].party_logo_url} className="w-3 h-3 object-contain" alt="" />
                                        {result.candidates[0].party_name}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-text-secondary font-bold">ไม่มีข้อมูลพรรค</span>
                                    )}
                                    <span className="text-xs text-text-secondary font-bold">
                                      {result.province} เขต {result.district_number}
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex-1">
                                <p className="text-text-secondary font-medium">ไม่มีข้อมูลผู้สมัคร</p>
                              </div>
                            )}
                          </div>

                          {/* Vote Results - Only show if voting is closed */}
                          {isVotingClosed && result.is_closed ? (
                            <div className="flex items-center gap-6 sm:w-64">
                              <div className="flex-1">
                                {result.winner ? (
                                  <>
                                    <div className="flex justify-between text-[10px] mb-1">
                                      <span className="font-bold text-text-secondary">{result.winner.vote_count.toLocaleString()} คะแนน</span>
                                      <span className="font-black text-democracy">
                                        {result.total_votes > 0 ? 
                                          ((result.winner.vote_count / result.total_votes) * 100).toFixed(1) : '0'
                                        }%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 shadow-inner">
                                      <div 
                                        className="bg-democracy h-full rounded-full transition-all duration-1000 shadow-sm" 
                                        style={{ 
                                          width: `${result.total_votes > 0 ? 
                                            ((result.winner.vote_count / result.total_votes) * 100) : 0
                                          }%` 
                                        }}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center py-2">
                                    <p className="text-xs text-text-secondary">ยังไม่มีข้อมูลคะแนน</p>
                                  </div>
                                )}
                              </div>
                              {result.winner && (
                                <div className="text-right whitespace-nowrap">
                                  <p className="font-black text-democracy text-lg">
                                    {result.total_votes > 0 ? 
                                      ((result.winner.vote_count / result.total_votes) * 100).toFixed(1) : '0'
                                    }%
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 sm:w-64 text-center justify-center">
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <p className="text-sm text-yellow-700 font-medium">ยังไม่มีข้อมูลคะแนน</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-16 text-center">
                        <Search className="w-12 h-12 text-text-secondary opacity-20 mx-auto mb-4" />
                        <p className="text-text-secondary font-medium">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Global Stats Grid - Only show if voting closed */}
                {isVotingClosed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">จำนวนผู้มาใช้สิทธิรวม</p>
                        <p className="text-3xl font-black text-blue-900">
                          {voteResults.reduce((sum, r) => sum + (r?.total_votes || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <Users className="text-blue-200 w-12 h-12" />
                    </div>
                    <div className="p-6 bg-green-50 border border-green-100 rounded-2xl shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">เขตที่รายงานผลสำเร็จ</p>
                        <p className="text-3xl font-black text-green-900">{voteResults.length} / {displayResults.length}</p>
                      </div>
                      <CheckCircle2 className="text-green-200 w-12 h-12" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default ResultsPage;
