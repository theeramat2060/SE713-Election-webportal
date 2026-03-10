import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { ChevronDown, ChevronUp, Users, FileText, ArrowRight } from 'lucide-react';

interface CandidateSummary {
  name: string;
  district: string;
}

interface Party {
  id: string;
  name: string;
  number: number;
  logoUrl: string;
  description: string;
  policySummary: string;
  candidates: CandidateSummary[];
}

const mockParties: Party[] = [
  {
    id: "1",
    name: "พรรคก้าวไกลหน้า",
    number: 1,
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100",
    description: "มุ่งเน้นการปฏิรูปโครงสร้างเศรษฐกิจเพื่อความเท่าเทียมและการกระจายอำนาจ",
    policySummary: "มุ่งเน้นการปฏิรูปโครงสร้างเศรษฐกิจเพื่อความเท่าเทียม การพัฒนาระบบขนส่งสาธารณะที่เชื่อมต่อถึงกันทั้งประเทศ และการกระจายอำนาจสู่ท้องถิ่นอย่างแท้จริง รวมถึงการผลักดันรัฐสวัสดิการถ้วนหน้าสำหรับพลเมืองทุกช่วงวัย",
    candidates: [
      { name: "นิพัทธ์ ส.", district: "เขต 1" },
      { name: "มาลี ร.", district: "เขต 2" },
      { name: "กานต์ ต.", district: "เขต 3" }
    ]
  },
  {
    id: "2",
    name: "พรรครวมพลังรักษ์โลก",
    number: 5,
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100",
    description: "นโยบายเน้นสิ่งแวดล้อมและความยั่งยืน พลังงานสะอาดเพื่อคนไทย",
    policySummary: "เรามุ่งเน้นการแก้ปัญหาสภาวะโลกร้อนด้วยนโยบายพลังงานสะอาด ลดภาษีสำหรับธุรกิจสีเขียว และเพิ่มพื้นที่ป่าชุมชนทั่วประเทศ เพื่อคุณภาพชีวิตที่ยั่งยืนของลูกหลานเรา",
    candidates: [
      { name: "สมชาย จ.", district: "เขต 1" },
      { name: "สายใจ ม.", district: "เขต 4" }
    ]
  },
  {
    id: "3",
    name: "พรรคพัฒนาชาติไทย",
    number: 9,
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100",
    description: "สร้างชาติด้วยการศึกษาและเทคโนโลยี เพื่อไทยก้าวไกลระดับโลก",
    policySummary: "การศึกษาคือรากฐานของชาติ เราจะลงทุนในระบบการศึกษาดิจิทัล สร้างศูนย์วิจัยและพัฒนาในทุกจังหวัด และสนับสนุนสตาร์ทอัพไทยให้แข่งขันได้ในระดับสากล",
    candidates: [
      { name: "วิชัย ก.", district: "เขต 1" }
    ]
  }
];

const PartiesPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-democracy-light border border-democracy/20 rounded-lg p-8 shadow-sm text-center space-y-4">
          <h1 className="text-4xl font-bold text-democracy-dark">ข้อมูลพรรคการเมือง</h1>
          <p className="text-lg text-democracy/90 max-w-2xl mx-auto">
            ร่วมสร้างสรรค์ระบอบประชาธิปไตยผ่านการศึกษาข้อมูลและนโยบายของพรรคการเมือง 
            เพื่อการตัดสินใจเลือกตัวแทนที่ตรงใจคุณที่สุด
          </p>
        </div>

        {/* Party List */}
        <div className="space-y-4">
          {mockParties.map((party) => (
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
                    <img src={party.logoUrl} alt={party.name} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">{party.name}</h2>
                    <p className="text-democracy font-medium">หมายเลข {party.number}</p>
                    {expandedId !== party.id && (
                      <p className="text-text-secondary line-clamp-1 mt-1">{party.description}</p>
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
                      <p className="text-text-secondary leading-relaxed">
                        {party.policySummary}
                      </p>
                      <button className="flex items-center gap-2 text-navigation font-medium hover:underline">
                        อ่านนโยบายฉบับเต็ม
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    {/* Candidates */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                        <Users className="w-5 h-5 text-democracy" />
                        ผู้สมัครแนะนำในเขต
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {party.candidates.map((candidate, idx) => (
                          <div key={idx} className="p-3 bg-surface-soft rounded border border-surface-border flex justify-between items-center">
                            <span className="font-medium text-text-primary">{candidate.name}</span>
                            <span className="text-xs px-2 py-1 bg-white rounded-full border border-surface-border text-text-secondary">
                              {candidate.district}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};

export default PartiesPage;
