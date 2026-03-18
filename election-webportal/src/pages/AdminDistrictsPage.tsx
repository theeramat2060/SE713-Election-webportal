import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AddDistrictModal } from '../components/AddDistrictModal';
import { 
  MapPin, 
  Users, 
  Home, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  MoreVertical
} from 'lucide-react';

interface District {
  code: string;
  name: string;
  province: string;
  voters: number;
  stations: number;
}

const AdminDistrictsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [districts, setDistricts] = useState<District[]>([
    {
      code: "CM-01",
      name: "Chiang Mai Central",
      province: "Chiang Mai",
      voters: 45200,
      stations: 128
    },
    {
      code: "CM-02",
      name: "Mae Rim District",
      province: "Chiang Mai",
      voters: 38150,
      stations: 94
    },
    {
      code: "HD-01",
      name: "Hang Dong North",
      province: "Chiang Mai",
      voters: 29800,
      stations: 72
    }
  ]);

  const handleAddDistrict = (newDistrict: Omit<District, 'code' | 'voters' | 'stations'>) => {
    // Auto-generate district code based on province
    const generateDistrictCode = (province: string) => {
      const provinceCodeMap: Record<string, string> = {
        'กรุงเทพมหานคร': 'BK',
        'เชียงใหม่': 'CM',
        'นครราชสีมา': 'NR',
        'ขอนแก่น': 'KK',
        'สงขลา': 'SK'
      };
      
      const provinceCode = provinceCodeMap[province] || province.substring(0, 2).toUpperCase();
      const existingDistricts = districts.filter(d => d.code.startsWith(provinceCode));
      const nextNumber = String(existingDistricts.length + 1).padStart(2, '0');
      return `${provinceCode}-${nextNumber}`;
    };

    const district: District = {
      ...newDistrict,
      code: generateDistrictCode(newDistrict.province),
      voters: 0,
      stations: 0
    };
    
    setDistricts(prev => [...prev, district]);
  };

  const filteredDistricts = districts.filter(district => 
    district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BaseLayout role="admin">
      <div className="space-y-8">
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
            <Button variant="authority" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
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
              {filteredDistricts.map((d) => (
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

      {/* Add District Modal */}
      <AddDistrictModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDistrict}
      />
    </BaseLayout>
  );
};

export default AdminDistrictsPage;
