import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  Filter,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

interface Candidate {
  id: string;
  number: number;
  name: string;
  party: string;
  district: string;
  photoUrl: string;
  platform: string;
  status: 'Qualified' | 'Pending' | 'Disqualified';
}

const ECCandidatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const candidates: Candidate[] = [
    {
      id: "1",
      number: 1,
      name: "ดร. สมชาย มั่นคง",
      party: "พรรคก้าวไกลหน้า",
      district: "กรุงเทพมหานคร เขต 1",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
      platform: "มุ่งเน้นการปฏิรูปเศรษฐกิจฐานราก และสร้างโอกาสทางการศึกษาที่เท่าเทียมสำหรับทุกคน",
      status: "Qualified"
    },
    {
      id: "2",
      number: 2,
      name: "นางสาววิไลลักษณ์ ดีศรี",
      party: "พรรครวมพลังรักษ์โลก",
      district: "กรุงเทพมหานคร เขต 1",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      platform: "พลังสะอาดเพื่อสิ่งแวดล้อม และสวัสดิการถ้วนหน้าสำหรับผู้สูงวัยในชุมชนเมือง",
      status: "Qualified"
    },
    {
      id: "3",
      number: 3,
      name: "นายอาคม สมบัติ",
      party: "พรรคพัฒนาชาติไทย",
      district: "กรุงเทพมหานคร เขต 2",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      platform: "สร้างสมาร์ทซิตี้ด้วยเทคโนโลยีสมัยใหม่ ลดความเหลื่อมล้ำด้วยเศรษฐกิจดิจิทัล",
      status: "Qualified"
    }
  ];

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">จัดการผู้สมัครสส.</h1>
            <p className="text-text-secondary">ระบบจัดการข้อมูลและตรวจสอบสิทธิผู้สมัครเลือกตั้ง</p>
          </div>
          <Link to="/ec/candidates/add">
            <Button variant="authority" className="flex items-center gap-2">
              <Plus size={20} />
              เพิ่มผู้สมัครใหม่
            </Button>
          </Link>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg border border-surface-border shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                icon={<Search size={20} />}
                placeholder="ค้นหาชื่อผู้สมัคร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 h-12 rounded border border-surface-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-authority">
                <option>ทุกพรรคการเมือง</option>
                <option>พรรคก้าวไกลหน้า</option>
                <option>พรรครวมพลังรักษ์โลก</option>
              </select>
              <select className="px-4 h-12 rounded border border-surface-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-authority">
                <option>ทุกเขตเลือกตั้ง</option>
                <option>กทม. เขต 1</option>
                <option>กทม. เขต 2</option>
              </select>
              <Button variant="outline" className="p-3">
                <Filter size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-lg border border-surface-border overflow-hidden shadow-card">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-soft border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary w-16">#</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">ผู้สมัคร</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">พรรค / เขต</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary hidden md:table-cell">แนวคิดนโยบาย</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">สถานะ</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-text-secondary font-medium">{candidate.number}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={candidate.photoUrl} alt={candidate.name} className="w-10 h-10 rounded-full border border-surface-border object-cover" />
                      <span className="font-bold text-text-primary">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-authority">{candidate.party}</p>
                      <p className="text-xs text-text-secondary">{candidate.district}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary hidden md:table-cell max-w-sm">
                    <p className="line-clamp-2">{candidate.platform}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success" className="flex items-center gap-1 w-fit">
                      <CheckCircle2 size={12} />
                      {candidate.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-text-secondary hover:text-authority transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-text-secondary hover:text-status-error transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-text-secondary">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ECCandidatesPage;
