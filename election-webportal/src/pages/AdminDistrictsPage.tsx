import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal, ModalFooter } from '../components/Modal';
import { Alert } from '../components/Alert';
import { 
  MapPin, 
  Users, 
  Home, 
  Search, 
  Plus, 
  Loader,
  Edit2, 
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { adminApi, District } from '../api/admin';

const AdminDistrictsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDistricts, setTotalDistricts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    province: '',
    district_number: 1
  });

  // Fetch districts
  const fetchDistricts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAllDistricts(page, pageSize, searchTerm || undefined);
      
      if (response.success && response.data) {
        setDistricts(response.data.items);
        setTotalDistricts(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        const errorMsg = typeof response.error === 'string' ? response.error : 'ไม่สามารถโหลดข้อมูลเขตได้';
        setError(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, [page, pageSize, searchTerm]);

  // Handle add district
  const handleAddDistrict = async () => {
    if (!formData.province || !formData.district_number) {
      setError('กรุณากรอกข้อมูลที่จำเป็นทั้งหมด');
      return;
    }

    try {
      // API endpoint for creating district (if available)
      // For now, just refresh after form submit
      setIsAddModalOpen(false);
      setFormData({ province: '', district_number: 1 });
      setPage(1);
      await fetchDistricts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  // Handle delete district
  const handleDeleteDistrict = async () => {
    if (!selectedDistrict) return;
    try {
      // API endpoint for deleting district (if available)
      setIsDeleteModalOpen(false);
      setSelectedDistrict(null);
      await fetchDistricts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <BaseLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-8">
        {error && (
          <Alert 
            type="error" 
            title="ข้อผิดพลาด"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">จัดการเขตเลือกตั้ง</h1>
            <p className="text-text-secondary">บริหารจัดการขอบเขตพื้นที่ ({totalDistricts} เขต)</p>
          </div>
          <Button variant="authority" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            เพิ่มเขตใหม่
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg border border-surface-border">
          <div className="w-full md:w-96">
            <Input 
              placeholder="ค้นหาจังหวัดหรือเขต..." 
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="!h-10 text-sm"
            />
          </div>
        </div>

        {/* Districts Table */}
        <div className="bg-white rounded-lg border border-surface-border shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : districts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">ไม่พบเขตเลือกตั้ง</p>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-soft border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">เขตที่</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">จังหวัด</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">ผู้มีสิทธิ</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">คะแนนแล้ว</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-center">สถานะ</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {districts.map((district) => (
                    <tr key={district.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-bold text-text-primary">{district.district_number}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-text-primary">{district.province}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-primary">
                          <Users size={14} className="text-text-secondary" />
                          {district.total_voters ? district.total_voters.toLocaleString() : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {district.total_votes_cast ? district.total_votes_cast.toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={district.is_closed ? 'authority' : 'info'}>
                          {district.is_closed ? 'ปิดแล้ว' : 'เปิด'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedDistrict(district); setIsDetailModalOpen(true); }}
                            className="p-2 text-text-secondary hover:text-authority hover:bg-surface-soft rounded-lg transition-all" 
                            title="ดูรายละเอียด">
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedDistrict(district); setIsDeleteModalOpen(true); }}
                            className="p-2 text-text-secondary hover:text-status-error hover:bg-red-50 rounded-lg transition-all" 
                            title="ลบเขต">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    หน้า {page} จาก {totalPages} | แสดง {districts.length} จาก {totalDistricts} รายการ
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    ย้อนกลับ
                  </Button>
                  <div className="flex items-center gap-2">
                    <select 
                      value={pageSize} 
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                      className="px-3 py-2 border border-surface-border rounded-lg text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page === totalPages}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add District Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="เพิ่มเขตเลือกตั้งใหม่"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Input 
            placeholder="จังหวัด"
            value={formData.province}
            onChange={(e) => setFormData({...formData, province: e.target.value})}
            className="text-sm"
          />

          <Input 
            type="number"
            placeholder="เขตที่"
            min="1"
            value={formData.district_number}
            onChange={(e) => setFormData({...formData, district_number: Number(e.target.value)})}
            className="text-sm"
          />

          <ModalFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>ยกเลิก</Button>
            <Button variant="authority" onClick={handleAddDistrict}>เพิ่มเขต</Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Detail Modal */}
      {selectedDistrict && (
        <Modal 
          isOpen={isDetailModalOpen} 
          onClose={() => { setIsDetailModalOpen(false); setSelectedDistrict(null); }}
          title="รายละเอียดเขตเลือกตั้ง"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-secondary uppercase">จังหวัด</p>
              <p className="font-bold text-text-primary">{selectedDistrict.province}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">เขตที่</p>
              <p className="font-bold text-text-primary">{selectedDistrict.district_number}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">ผู้มีสิทธิ</p>
              <p className="text-text-primary">{selectedDistrict.total_voters ? selectedDistrict.total_voters.toLocaleString() : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">คะแนนแล้ว</p>
              <p className="text-text-primary">{selectedDistrict.total_votes_cast ? selectedDistrict.total_votes_cast.toLocaleString() : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">สถานะ</p>
              <Badge variant={selectedDistrict.is_closed ? 'authority' : 'info'}>
                {selectedDistrict.is_closed ? 'ปิดแล้ว' : 'เปิด'}
              </Badge>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => { setIsDetailModalOpen(false); setSelectedDistrict(null); }}>ปิด</Button>
            </ModalFooter>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {selectedDistrict && (
        <Modal 
          isOpen={isDeleteModalOpen} 
          onClose={() => { setIsDeleteModalOpen(false); setSelectedDistrict(null); }}
          title="ยืนยันการลบ"
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <AlertTriangle className="text-status-error flex-shrink-0" size={24} />
              <div>
                <p className="font-bold text-text-primary">ยืนยันการลบเขต</p>
                <p className="text-text-secondary text-sm">
                  คุณแน่ใจหรือว่าต้องการลบ {selectedDistrict.province} เขต {selectedDistrict.district_number}?
                </p>
              </div>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedDistrict(null); }}>ยกเลิก</Button>
              <Button variant="danger" onClick={handleDeleteDistrict}>ลบเขต</Button>
            </ModalFooter>
          </div>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default AdminDistrictsPage;
