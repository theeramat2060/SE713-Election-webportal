import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal, ModalFooter } from '../components/Modal';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canManageResource } from '../utils/permissions';
import { ecApi, CandidatePagination } from '../api/ec';
import { partiesApi, constituenciesApi } from '../api';
import type { Candidate, Party, Constituency } from '../api';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  Filter,
  MoreVertical,
  CheckCircle2,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload
} from 'lucide-react';

const ECCandidatesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<CandidatePagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [parties, setParties] = useState<Party[]>([]);
  const [districts, setDistricts] = useState<Constituency[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check EC Staff admin-level permissions for candidates
  const candidatePermissions = canManageResource(user?.role || 'voter', 'candidate');

  const fetchCandidates = async (page: number) => {
    try {
      setLoading(true);
      const res = await ecApi.getCandidates(page, 10, searchTerm, selectedPartyId, selectedDistrictId);
      if (res.success) {
        setCandidates(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError('ไม่สามารถโหลดข้อมูลผู้สมัครได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [partiesRes, districtsRes] = await Promise.all([
        partiesApi.getAll(),
        constituenciesApi.getAll()
      ]);
      setParties(partiesRes);
      setDistricts(districtsRes);
    } catch (err) {
      console.error('Failed to fetch dropdown data:', err);
    }
  };

  useEffect(() => {
    fetchCandidates(currentPage);
    fetchDropdownData();
  }, [currentPage, searchTerm, selectedPartyId, selectedDistrictId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณต้องการลบผู้สมัครนี้ใช่หรือไม่?')) return;
    
    try {
      await ecApi.deleteCandidate(id);
      fetchCandidates(currentPage);
    } catch (err) {
      console.error('Failed to delete candidate:', err);
      alert('ไม่สามารถลบข้อมูลผู้สมัครได้');
    }
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    console.log('📝 Submitting candidate update:', {
      id: editingCandidate.id,
      party_id: editingCandidate.party_id,
      constituency_id: editingCandidate.constituency_id,
      party_type: typeof editingCandidate.party_id
    });

    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append('title', editingCandidate.title || '');
      formData.append('first_name', editingCandidate.first_name || '');
      formData.append('last_name', editingCandidate.last_name || '');
      formData.append('number', String(editingCandidate.number ?? ''));
      formData.append('party_id', String(editingCandidate.party_id ?? ''));
      formData.append('constituency_id', String(editingCandidate.constituency_id ?? ''));
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (editingCandidate.image_url) {
        formData.append('image_url', editingCandidate.image_url);
      }

      await ecApi.updateCandidate(editingCandidate.id, formData);
      setIsEditModalOpen(false);
      setEditingCandidate(null);
      setSelectedFile(null);
      fetchCandidates(currentPage);
    } catch (err: any) {
      console.error('Failed to update candidate:', err);
      const errorMsg = err.response?.data?.error || err.message || 'ไม่สามารถแก้ไขข้อมูลผู้สมัครได้';
      alert(`ไม่สามารถแก้ไขข้อมูลผู้สมัครได้: ${errorMsg}`);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <BaseLayout role="ec">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">จัดการผู้สมัครสส.</h1>
            <p className="text-text-secondary">
              ระบบจัดการข้อมูลและตรวจสอบสิทธิผู้สมัครเลือกตั้ง
              {candidatePermissions.create && (
                <span className="inline-flex items-center gap-1 ml-2 text-green-600 text-sm">
                  <Shield size={14} />
                  สิทธิ์แอดมิน: สร้าง/แก้ไข/ลบ
                </span>
              )}
            </p>
          </div>
          
          {candidatePermissions.create ? (
            <Link to="/ec/candidates/add">
              <Button variant="authority" className="flex items-center gap-2">
                <Plus size={20} />
                เพิ่มผู้สมัครใหม่
              </Button>
            </Link>
          ) : (
            <div className="text-text-secondary text-sm">
              ไม่มีสิทธิ์เพิ่มผู้สมัคร
            </div>
          )}
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
              <select 
                className="px-4 h-12 rounded border border-surface-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-authority"
                value={selectedPartyId}
                onChange={(e) => {
                  setSelectedPartyId(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">ทุกพรรคการเมือง</option>
                {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select 
                className="px-4 h-12 rounded border border-surface-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-authority"
                value={selectedDistrictId}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">ทุกเขตเลือกตั้ง</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.province} เขต {d.district_number}</option>)}
              </select>
              <Button 
                variant="outline" 
                className="p-3"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPartyId("");
                  setSelectedDistrictId("");
                  setCurrentPage(1);
                }}
              >
                <Filter size={20} />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-authority animate-spin" />
            <p className="text-text-secondary font-medium">กำลังโหลดข้อมูลผู้สมัคร...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
            <p className="font-bold text-lg mb-2">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
            <Button variant="outline" onClick={() => fetchCandidates(currentPage)} className="mt-4">ลองใหม่</Button>
          </div>
        ) : (
          <>
            {/* Candidates Table */}
            <div className="bg-white rounded-lg border border-surface-border overflow-hidden shadow-card">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-soft border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-text-secondary w-16">#</th>
                    <th className="px-6 py-4 text-sm font-semibold text-text-secondary">ผู้สมัคร</th>
                    <th className="px-6 py-4 text-sm font-semibold text-text-secondary">พรรค / เขต</th>
                    <th className="px-6 py-4 text-sm font-semibold text-text-secondary">สถานะ</th>
                    <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-text-secondary font-medium">{candidate.number}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-text-primary">{candidate.title}{candidate.first_name} {candidate.last_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {candidate.party_logo_url && (
                                <img 
                                  src={candidate.party_logo_url} 
                                  alt={candidate.party_name} 
                                  className="w-6 h-6 rounded border border-surface-border object-contain"
                                />
                              )}
                              <p className="text-sm font-medium text-authority">{candidate.party_name}</p>
                            </div>
                            <p className="text-xs text-text-secondary">{candidate.province} เขต {candidate.district_number}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="success" className="flex items-center gap-1 w-fit">
                            <CheckCircle2 size={12} />
                            Qualified
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {candidatePermissions.update && (
                              <button 
                                onClick={() => handleEditClick(candidate)}
                                className="p-2 text-text-secondary hover:text-authority transition-colors" 
                                title="แก้ไข"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                            {candidatePermissions.delete && (
                              <button 
                                onClick={() => handleDelete(candidate.id)}
                                className="p-2 text-text-secondary hover:text-status-error transition-colors" 
                                title="ลบ"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                            <button className="p-2 text-text-secondary" title="ตัวเลือกเพิ่มเติม">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-text-secondary">
                        ไม่พบข้อมูลผู้สมัคร
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

      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="แก้ไขข้อมูลผู้สมัคร"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary block">คำนำหน้า</label>
                <select 
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={editingCandidate.title}
                  onChange={(e) => setEditingCandidate({...editingCandidate, title: e.target.value})}
                  required
                >
                  <option value="">-- เลือกคำนำหน้า --</option>
                  <option value="Mr.">Mr. (นาย)</option>
                  <option value="Mrs.">Mrs. (นาง)</option>
                  <option value="Ms.">Ms. (นางสาว)</option>
                  <option value="Dr.">Dr. (ด.ร.)</option>
                </select>
              </div>
              <Input
                label="หมายเลขผู้สมัคร"
                type="number"
                value={editingCandidate.number}
                onChange={(e) => setEditingCandidate({...editingCandidate, number: parseInt(e.target.value)})}
                required
              />
              <Input
                label="ชื่อ"
                value={editingCandidate.first_name}
                onChange={(e) => setEditingCandidate({...editingCandidate, first_name: e.target.value})}
                required
              />
              <Input
                label="นามสกุล"
                value={editingCandidate.last_name}
                onChange={(e) => setEditingCandidate({...editingCandidate, last_name: e.target.value})}
                required
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary block">พรรคการเมือง</label>
                <select 
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={editingCandidate.party_id}
                  onChange={(e) => setEditingCandidate({...editingCandidate, party_id: parseInt(e.target.value)})}
                  required
                >
                  {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary block">เขตเลือกตั้ง</label>
                <select 
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={editingCandidate.constituency_id}
                  onChange={(e) => setEditingCandidate({...editingCandidate, constituency_id: parseInt(e.target.value)})}
                  required
                >
                  {districts.map(d => <option key={d.id} value={d.id}>{d.province} เขต {d.district_number}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary block">รูปถ่ายผู้สมัคร</label>
              <div className="flex items-center gap-4">
                <img src={editingCandidate.image_url} alt="current" className="w-16 h-16 rounded-full border border-surface-border object-cover" />
                <div className="flex-1">
                  <input 
                    type="file" 
                    id="edit-photo" 
                    className="hidden" 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                  <label 
                    htmlFor="edit-photo"
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-surface-border rounded-lg hover:border-authority cursor-pointer transition-colors text-sm font-medium text-text-secondary"
                  >
                    <Upload size={16} />
                    {selectedFile ? selectedFile.name : "เปลี่ยนรูปถ่าย"}
                  </label>
                </div>
              </div>
            </div>

            <ModalFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={editLoading}>
                ยกเลิก
              </Button>
              <Button type="submit" variant="authority" isLoading={editLoading}>
                บันทึกการเปลี่ยนแปลง
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default ECCandidatesPage;
