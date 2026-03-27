import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Modal, ModalFooter } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canManageResource } from '../utils/permissions';
import { ecApi, PartyPagination } from '../api/ec';
import { partiesApi } from '../api/parties';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  LayoutGrid, 
  Map as MapIcon,
  Filter,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Party {
  id: number;
  name: string;
  logo_url: string;
  policy: string;
  candidates_count: number;
}

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PartyPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStats, setTotalStats] = useState({ totalParties: 0, totalCandidates: 0 });
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [editName, setEditName] = useState("");
  const [editPolicy, setEditPolicy] = useState("");
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);

  // Check EC Staff admin-level permissions for parties
  const partyPermissions = canManageResource(user?.role || 'voter', 'party');

  const fetchParties = async (page: number) => {
    try {
      setLoading(true);
      const res = await ecApi.getParties(page);
      if (res.success) {
        setParties(res.data as unknown as Party[]);
        setPagination(res.pagination);
        
        // Use overview to get some stats, or just use pagination total
        setTotalStats({
          totalParties: res.pagination.total,
          totalCandidates: (res.data as unknown as Party[]).reduce((sum, p) => sum + (p.candidates_count || 0), 0)
        });
      }
    } catch (err) {
      console.error('Failed to fetch parties:', err);
      setError('ไม่สามารถโหลดข้อมูลพรรคการเมืองได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณต้องการลบพรรคการเมืองนี้ใช่หรือไม่? การลบจะลบผู้สมัครทั้งหมดของพรรคนี้ด้วย')) return;
    
    try {
      await ecApi.deleteParty(id);
      // Refresh list
      fetchParties(currentPage);
    } catch (err) {
      console.error('Failed to delete party:', err);
      alert('ไม่สามารถลบพรรคการเมืองได้');
    }
  };

  const handleEditClick = (party: Party) => {
    setEditingParty(party);
    setEditName(party.name);
    setEditPolicy(party.policy);
    setEditLogoPreview(party.logo_url);
    setEditLogoFile(null);
    setIsEditModalOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Logo file selected:', file?.name, file?.size, file?.type);
    if (file) {
      setEditLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log('FileReader loaded, preview length:', result?.length);
        setEditLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = async () => {
    if (!editingParty || !editName || !editPolicy) {
      alert('กรุณากรอกข้อมูลทั้งหมด');
      return;
    }

    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('policy', editPolicy);
      
      console.log('Updating party with:', {
        id: editingParty.id,
        name: editName,
        hasLogoFile: !!editLogoFile,
        logoFileName: editLogoFile?.name,
        logoPreviewLength: editLogoPreview?.length,
      });

      if (editLogoFile) {
        console.log('Appending new logo file to formData');
        formData.append('logo', editLogoFile);
      } else {
        console.log('Using existing logo URL:', editLogoPreview);
        formData.append('logo_url', editLogoPreview);
      }

      await ecApi.updateParty(editingParty.id, formData);
      setIsEditModalOpen(false);
      fetchParties(currentPage);
      alert('แก้ไขพรรคการเมืองสำเร็จ');
    } catch (err) {
      console.error('Failed to update party:', err);
      alert('ไม่สามารถแก้ไขพรรคการเมืองได้');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredParties = parties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.policy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">จัดการพรรคการเมือง</h1>
            {partyPermissions.create && (
              <p className="text-text-secondary flex items-center gap-1 mt-1">
                <Shield size={14} className="text-green-600" />
                <span className="text-green-600 text-sm">สิทธิ์แอดมิน: สร้าง/แก้ไข/ลบพรรคการเมือง</span>
              </p>
            )}
          </div>
          
          {partyPermissions.create ? (
            <Link to="/ec/parties/add">
              <Button variant="authority" className="flex items-center gap-2">
                <Plus size={20} />
                เพิ่มพรรคการเมืองใหม่
              </Button>
            </Link>
          ) : (
            <div className="text-text-secondary text-sm">
              ไม่มีสิทธิ์เพิ่มพรรคการเมือง
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            label="พรรคการเมืองทั้งหมด" 
            value={totalStats.totalParties.toString()} 
            subtext="ลงทะเบียนแล้ว"
            icon={<LayoutGrid size={24} />} 
          />
          <StatsCard 
            label="ผู้สมัครสส. (ในหน้านี้)" 
            value={totalStats.totalCandidates.toString()} 
            subtext="ลงทะเบียนแล้ว"
            icon={<Users size={24} />} 
          />
          <StatsCard 
            label="เขตพื้นที่เลือกตั้ง" 
            value="400" 
            subtext="ทั่วประเทศ"
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-authority animate-spin" />
            <p className="text-text-secondary font-medium">กำลังโหลดข้อมูลพรรคการเมือง...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
            <p className="font-bold text-lg mb-2">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
            <Button variant="outline" onClick={() => fetchParties(currentPage)} className="mt-4">ลองใหม่</Button>
          </div>
        ) : (
          <>
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
                  {filteredParties.length > 0 ? (
                    filteredParties.map((party) => (
                      <tr key={party.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <img src={party.logo_url} alt={party.name} className="w-10 h-10 rounded border border-surface-border object-contain" />
                        </td>
                        <td className="px-6 py-4 font-bold text-text-primary">{party.name}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary hidden md:table-cell max-w-xs truncate">
                          {party.policy}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex items-center gap-2">
                             <Users size={16} className="text-text-secondary" />
                             {party.candidates_count} คน
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="success">Active</Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                             onClick={() => handleEditClick(party)}
                             className="p-2 text-text-secondary hover:text-authority transition-colors"
                             title="แก้ไข"
                           >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(party.id)}
                            className="p-2 text-text-secondary hover:text-status-error transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-text-secondary">
                        ไม่พบข้อมูลพรรคการเมือง
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-text-secondary">
                  แสดงหน้า {pagination.page} จาก {pagination.totalPages} (ทั้งหมด {pagination.total} รายการ)
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    ก่อนหน้า
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="flex items-center gap-1"
                  >
                    ถัดไป
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Party Modal */}
      {editingParty && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="แก้ไขพรรคการเมือง"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            {/* Party Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ชื่อพรรค
              </label>
              <Input
                placeholder="ชื่อพรรค"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            {/* Party Policy */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                นโยบาย
              </label>
              <textarea
                placeholder="นโยบายของพรรค"
                value={editPolicy}
                onChange={(e) => setEditPolicy(e.target.value)}
                className="w-full px-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-authority text-sm"
                rows={4}
              />
            </div>

            {/* Logo Preview */}
            {editLogoPreview && (
              <div className="flex justify-center">
                <img
                  src={editLogoPreview}
                  alt="Logo Preview"
                  className="h-20 w-20 rounded border border-surface-border object-contain"
                />
              </div>
            )}

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                โลโก้พรรค (ไม่บังคับ)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-4 py-2 border border-surface-border rounded-lg text-sm"
              />
            </div>

            {/* Modal Footer */}
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={editLoading}
              >
                ยกเลิก
              </Button>
              <Button
                variant="authority"
                onClick={handleEditSave}
                disabled={editLoading}
              >
                {editLoading ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default ECPartiesPage;
