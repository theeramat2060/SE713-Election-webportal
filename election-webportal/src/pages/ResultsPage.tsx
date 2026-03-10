import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Search, Trophy, BarChart3, Users, MapPin } from 'lucide-react';
import { Input } from '../components/Input';

interface CandidateResult {
  rank: number;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  photoUrl: string;
  partyLogoUrl: string;
}

const mockResults: CandidateResult[] = [
  {
    rank: 1,
    name: "นายสมศักดิ์ รักชาติ",
    party: "พรรคก้าวไกลพัฒนา",
    votes: 45230,
    percentage: 42.5,
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    partyLogoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100"
  },
  {
    rank: 2,
    name: "น.ส. วิมลวรรณ สุขใจ",
    party: "พรรคประชาสามัคคี",
    votes: 32150,
    percentage: 30.2,
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    partyLogoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100"
  },
  {
    rank: 3,
    name: "นายเกียรติศักดิ์ มั่นคง",
    party: "พรรคเสรีประชาราษฎร์",
    votes: 18440,
    percentage: 17.3,
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    partyLogoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100"
  }
];

const ResultsPage: React.FC = () => {
  const [district, setDistrict] = useState("กรุงเทพมหานคร เขต 1");
  const [isClosed, setIsClosed] = useState(true);

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary">รายงานผลการเลือกตั้ง</h1>
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span>{district}</span>
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
        {isClosed && mockResults[0] && (
          <div className="relative overflow-hidden bg-white border-2 border-yellow-400 rounded-lg p-6 shadow-elevation">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Trophy className="w-4 h-4" />
                <span>อันดับ 1 (ผู้ชนะ)</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img 
                src={mockResults[0].photoUrl} 
                alt={mockResults[0].name}
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-100"
              />
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">{mockResults[0].name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <img src={mockResults[0].partyLogoUrl} className="w-6 h-6 rounded" alt="party" />
                  <span className="text-democracy font-medium">{mockResults[0].party}</span>
                </div>
                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="text-sm text-text-secondary">คะแนนทั้งหมด</p>
                    <p className="text-xl font-bold text-text-primary">{mockResults[0].votes.toLocaleString()} คะแนน</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">สัดส่วน</p>
                    <p className="text-xl font-bold text-democracy">{mockResults[0].percentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ranked List */}
        <div className="bg-white rounded-lg border border-surface-border overflow-hidden">
          <div className="p-4 bg-surface-soft border-b border-surface-border">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              ลำดับผู้สมัครตามคะแนน
            </h3>
          </div>
          <div className="divide-y divide-surface-border">
            {mockResults.map((candidate) => (
              <div key={candidate.rank} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 text-center font-bold text-text-secondary">
                  #{candidate.rank}
                </div>
                <img 
                  src={candidate.photoUrl} 
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-primary truncate">{candidate.name}</p>
                  <p className="text-sm text-text-secondary truncate">{candidate.party}</p>
                </div>
                <div className="hidden md:block w-48">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{candidate.votes.toLocaleString()} votes</span>
                    <span className="font-bold">{candidate.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-democracy h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${candidate.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-text-primary">{candidate.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">ผู้มาใช้สิทธิ</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">82.4%</p>
            <p className="text-xs text-blue-700">106,420 จาก 129,150 คน</p>
          </div>
          {/* Add more stats if needed */}
        </div>
      </div>
    </BaseLayout>
  );
};

export default ResultsPage;
