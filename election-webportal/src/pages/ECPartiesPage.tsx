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
  LayoutGrid, 
  Map as MapIcon,
  Filter
} from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, subtext, icon }) => (
  <div className="bg-white p-6 rounded-lg border border-surface-border shadow-card space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <div className="text-authority/20">
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold text-text-primary">{value}</p>
    {subtext && <p className="text-xs text-text-secondary">{subtext}</p>}
  </div>
);

const ECPartiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const parties = [
    {
      id: "1",
      name: "พรรคอนาคตใหม่",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100",
      policy: "Economic reform, digital transformation, and education...",
      candidates: 124,
      status: "Active"
    },
    {
      id: "2",
      name: "พรรคก้าวไกล",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100",
      policy: "Democratic values, human rights, and social justice...",
      candidates: 156,
      status: "Active"
    },
    {
      id: "3",
      name: "พรรคประชาธิปัตย์",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100",
      policy: "Traditional values, conservative policies...",
      candidates: 89,
      status: "Active"
    }
  ];

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-text-primary">จัดการพรรคการเมือง</h1>
          <Link to="/ec/parties/add">
            <Button variant="authority" className="flex items-center gap-2">
              <Plus size={20} />
              เพิ่มพรรคการเมืองใหม่
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            label="พรรคการเมืองทั้งหมด" 
            value="156" 
            subtext="+3 ในเดือนนี้"
            icon={<LayoutGrid size={24} />} 
          />
          <StatsCard 
            label="ผู้สมัครสส. ทั้งหมด" 
            value="4,280" 
            subtext="ลงทะเบียนแล้ว 92%"
            icon={<Users size={24} />} 
          />
          <StatsCard 
            label="เขตพื้นที่เลือกตั้ง" 
            value="77" 
            subtext="ครบทุกจังหวัด"
            icon={<MapIcon size={24} />} 
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-surface-soft p-4 rounded-lg border border-surface-border">
          <div className="flex-1 w-full">
            <Input 
              icon={<Search size={20} />}
              placeholder="ค้นหาชื่อพรรค หรือนโยบาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
            <Filter size={18} />
            ตัวกรองขั้นสูง
          </Button>
        </div>

        {/* Party Management Table */}
        <div className="bg-white rounded-lg border border-surface-border overflow-hidden shadow-card">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-soft border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">โลโก้</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">ชื่อพรรค</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary hidden md:table-cell">สรุปนโยบาย</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">ผู้สมัคร</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">สถานะ</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {parties.map((party) => (
                <tr key={party.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={party.logo} alt={party.name} className="w-10 h-10 rounded border border-surface-border object-contain" />
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary">{party.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary hidden md:table-cell max-w-xs truncate">
                    {party.policy}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                       <Users size={16} className="text-text-secondary" />
                       {party.candidates} คน
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-text-secondary hover:text-authority transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-status-error transition-colors">
                      <Trash2 size={18} />
                    </button>
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

export default ECPartiesPage;
