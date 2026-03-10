import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  MapPin, 
  Users, 
  Home, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  MoreVertical,
  ChevronRight,
  Globe
} from 'lucide-react';

interface District {
  code: string;
  name: string;
  province: string;
  region: string;
  voters: number;
  stations: number;
}

const AdminDistrictsPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState("Central");
  const [searchTerm, setSearchTerm] = useState("");

  const districts: District[] = [
    {
      code: "CM-01",
      name: "Chiang Mai Central",
      province: "Chiang Mai",
      region: "North",
      voters: 45200,
      stations: 128
    },
    {
      code: "CM-02",
      name: "Mae Rim District",
      province: "Chiang Mai",
      region: "North",
      voters: 38150,
      stations: 94
    },
    {
      code: "HD-01",
      name: "Hang Dong North",
      province: "Chiang Mai",
      region: "North",
      voters: 29800,
      stations: 72
    }
  ];

  return (
    <BaseLayout role="admin">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Selector */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">ภูมิภาค (Regions)</h2>
            <nav className="space-y-1">
              {["Central", "North", "Northeast", "South"].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedRegion === region 
                      ? 'bg-text-primary text-white shadow-lg' 
                      : 'text-text-secondary hover:bg-surface-soft'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    {region}
                  </div>
                  {selectedRegion === region && <ChevronRight size={14} />}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 bg-surface-soft rounded-lg border border-surface-border">
            <h3 className="text-xs font-bold text-text-secondary uppercase mb-3">สรุปข้อมูลภาค</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xl font-bold text-text-primary">12,450</p>
                <p className="text-[10px] text-text-secondary">หน่วยเลือกตั้งทั้งหมด</p>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-authority w-2/3" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">จัดการเขตเลือกตั้ง</h1>
              <p className="text-text-secondary">บริหารจัดการขอบเขตพื้นที่และสถิติประชากรผู้มีสิทธิ</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={18} />
                นำเข้า CSV
              </Button>
              <Button variant="authority" className="flex items-center gap-2">
                <Plus size={18} />
                เพิ่มเขตใหม่
              </Button>
            </div>
          </div>

          {/* District Table */}
          <div className="bg-white rounded-lg border border-surface-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-surface-border bg-surface-soft flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-primary font-bold">
                <MapPin size={18} className="text-authority" />
                รายชื่อเขตเลือกตั้ง
              </div>
              <div className="w-64">
                <Input 
                  size={12} 
                  placeholder="ค้นหาเขต..." 
                  icon={<Search size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!h-9 text-sm"
                />
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">รหัสเขต</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">ชื่อเขต / จังหวัด</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">ผู้มีสิทธิ</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">หน่วยฯ</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {districts.map((d) => (
                  <tr key={d.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-text-secondary">{d.code}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-text-primary">{d.name}</p>
                        <p className="text-xs text-text-secondary">จังหวัด {d.province}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <Users size={14} className="text-text-secondary" />
                        {d.voters.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      <div className="flex items-center gap-2">
                        <Home size={14} className="text-text-secondary" />
                        {d.stations}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-text-secondary hover:bg-surface-soft rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-text-secondary hover:bg-surface-soft rounded-lg">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default AdminDistrictsPage;
