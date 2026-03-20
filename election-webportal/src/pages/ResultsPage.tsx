import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Search, Trophy, BarChart3, Users, MapPin, Clock } from 'lucide-react';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useVoting } from '../context/VotingContext';
import { ecApi } from '../api';
import type { ConstituencyWinner } from '../api';

const ResultsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isVotingClosed } = useVoting();
  const [district, setDistrict] = useState("กรุงเทพมหานคร เขต 1");
  const [realResults, setRealResults] = useState<ConstituencyWinner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a function to fetch and set results
  const fetchResults = async (isFromNavigation = false) => {
    if (!isVotingClosed) {
      setIsLoading(false);
      return;
    }

    try {
      const logPrefix = isFromNavigation ? 'navigation' : 'backup';
      console.log(`🔄 Calling /ec/declare-results API (${logPrefix} call)...`);
      
      const results = await ecApi.declareResults();
      console.log(`✅ Results fetched successfully (${logPrefix}):`, results);
      
      setRealResults(results);
      setError(null);
      
      // Cache results in localStorage
      localStorage.setItem('electionResults', JSON.stringify(results));
      localStorage.setItem('electionResultsTimestamp', new Date().toISOString());
    } catch (err: any) {
      console.error(`❌ Error fetching results (${logPrefix}):`, err);
      setError('เกิดข้อผิดพลาดในการดึงผลการเลือกตั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch results when component mounts
  useEffect(() => {
    const initializeResults = async () => {
      if (!isVotingClosed) {
        setIsLoading(false);
        return;
      }

      // Check if data was just fetched from navigation
      const fetchedFromNav = localStorage.getItem('electionResultsFetched');
      const cachedResults = localStorage.getItem('electionResults');
      const cachedTimestamp = localStorage.getItem('electionResultsTimestamp');
      
      if (fetchedFromNav && cachedResults) {
        console.log('📁 Loading fresh results from navigation cache...');
        setRealResults(JSON.parse(cachedResults));
        setIsLoading(false);
        // Clear the flag
        localStorage.removeItem('electionResultsFetched');
        return;
      }

      // Try to load from cache if available and recent
      if (cachedResults && cachedTimestamp) {
        const cacheAge = Date.now() - new Date(cachedTimestamp).getTime();
        // Use cache if it's less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          console.log('📁 Loading results from cache...');
          setRealResults(JSON.parse(cachedResults));
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      await fetchResults(false);
    };

    initializeResults();
  }, [isVotingClosed]);

  // Calculate overall winner and statistics
  const overallWinner = realResults.length > 0 ? 
    realResults.reduce((prev, current) => 
      current.winner.vote_count > prev.winner.vote_count ? current : prev
    ) : null;

  const totalVotes = realResults.reduce((sum, result) => sum + result.total_votes, 0);

  // Determine the layout role based on authentication status
  const layoutRole = isAuthenticated && user ? user.role : 'public';

  // Redirect if voting is still open
  if (!isVotingClosed) {
    return (
      <BaseLayout role={layoutRole}>
        <div className="max-w-4xl mx-auto space-y-8 text-center py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <h1 className="text-2xl font-bold text-yellow-800">ยังไม่สามารถดูผลได้</h1>
            </div>
            <p className="text-yellow-700 text-lg">
              ผลการเลือกตั้งจะสามารถดูได้เมื่อ EC ประกาศปิดการลงคะแนนเสียงแล้วเท่านั้น
            </p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout role={layoutRole}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-democracy mx-auto mb-4"></div>
            <p className="text-text-secondary">กำลังประกาศผลการเลือกตั้ง...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <h2 className="text-lg font-bold text-red-800 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Content */}
        {!isLoading && !error && (
          <>
            {/* Header & Selector */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-text-primary">รายงานผลการเลือกตั้ง</h1>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>ผลรวมทุกเขต ({realResults.length} เขต)</span>
              <Badge variant={isClosed ? "error" : "success"} className="ml-2">
                {isClosed ? "หีบปิดแล้ว" : "กำลังนับคะแนน"}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="w-64">
              <Input 
                placeholder="ค้นหาเขตเลือกตั้ง..." 
                icon={<Search className="w-4 h-4" />}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Winner Showcase */}
        {overallWinner && (
          <div className="relative overflow-hidden bg-white border-2 border-yellow-400 rounded-lg p-6 shadow-elevation">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Trophy className="w-4 h-4" />
                <span>ผู้ได้คะแนนสูงสุด</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-yellow-100 text-4xl">
                👨‍💼
              </div>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">
                  {overallWinner.winner.title}{overallWinner.winner.first_name} {overallWinner.winner.last_name}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  {overallWinner.winner.party_logo_url && (
                    <img src={overallWinner.winner.party_logo_url} className="w-6 h-6 rounded" alt="party" />
                  )}
                  <span className="text-democracy font-medium">{overallWinner.winner.party_name}</span>
                </div>
                <p className="text-sm text-text-secondary">{overallWinner.province} เขต {overallWinner.district_number}</p>
                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="text-sm text-text-secondary">คะแนนในเขต</p>
                    <p className="text-xl font-bold text-text-primary">{overallWinner.winner.vote_count.toLocaleString()} คะแนน</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">สัดส่วนในเขต</p>
                    <p className="text-xl font-bold text-democracy">
                      {overallWinner.total_votes > 0 ? 
                        ((overallWinner.winner.vote_count / overallWinner.total_votes) * 100).toFixed(1) : '0'
                      }%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results by District */}
        <div className="bg-white rounded-lg border border-surface-border overflow-hidden">
          <div className="p-4 bg-surface-soft border-b border-surface-border">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              ผลการเลือกตั้งแต่ละเขต ({realResults.length} เขต)
            </h3>
          </div>
          <div className="divide-y divide-surface-border">
            {realResults.length > 0 ? (
              realResults.map((result, index) => (
                <div key={result.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-8 text-center font-bold text-text-secondary">
                    #{index + 1}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                    👨‍💼
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-primary truncate">
                      {result.winner.title}{result.winner.first_name} {result.winner.last_name}
                    </p>
                    <p className="text-sm text-text-secondary truncate">
                      {result.winner.party_name} • {result.province} เขต {result.district_number}
                    </p>
                  </div>
                  <div className="hidden md:block w-48">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{result.winner.vote_count.toLocaleString()} คะแนน</span>
                      <span className="font-bold">
                        {result.total_votes > 0 ? 
                          ((result.winner.vote_count / result.total_votes) * 100).toFixed(1) : '0'
                        }%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-democracy h-2 rounded-full transition-all duration-1000" 
                        style={{ 
                          width: `${result.total_votes > 0 ? 
                            ((result.winner.vote_count / result.total_votes) * 100) : 0
                          }%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-text-primary">
                      {result.total_votes > 0 ? 
                        ((result.winner.vote_count / result.total_votes) * 100).toFixed(1) : '0'
                      }%
                    </p>
                    <p className="text-xs text-text-secondary">{result.total_votes.toLocaleString()} คะแนนทั้งหมด</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-text-secondary">
                ไม่พบข้อมูลผลการเลือกตั้ง
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">เขตที่ประกาศผล</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{realResults.length}</p>
            <p className="text-xs text-blue-700">เขตการเลือกตั้ง</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">คะแนนรวมทั้งหมด</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{totalVotes.toLocaleString()}</p>
            <p className="text-xs text-green-700">คะแนนเสียง</p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">คะแนนสูงสุด</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {overallWinner?.winner.vote_count.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-yellow-700">
              {overallWinner ? `${overallWinner.province} เขต ${overallWinner.district_number}` : 'ไม่พบข้อมูล'}
            </p>
          </div>
        </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default ResultsPage;
