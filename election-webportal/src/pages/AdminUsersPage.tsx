import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal, ModalFooter } from '../components/Modal';
import { Alert } from '../components/Alert';
import { 
  UserPlus, 
  Search, 
  Shield, 
  Key, 
  MoreVertical, 
  Mail, 
  Clock,
  AlertCircle,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Loader,
  Trash2,
  Edit,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { adminApi, User, CreateUserPayload } from '../api/admin';

const AdminUsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'VOTER' | 'EC' | 'ADMIN'>('All');
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateUserPayload>({
    nationalId: '',
    password: '',
    title: '',
    firstName: '',
    lastName: '',
    address: '',
    role: 'VOTER'
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const role = activeTab === 'All' ? undefined : activeTab;
      const response = await adminApi.getAllUsers(page, pageSize, role, searchTerm || undefined);
      
      if (response.success && response.data) {
        setUsers(response.data.items);
        setTotalUsers(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        const errorMsg = typeof response.error === 'string' ? response.error : 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้';
        setError(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, activeTab, searchTerm]);

  // Handle add user
  const handleAddUser = async () => {
    if (!formData.nationalId || !formData.password || !formData.firstName || !formData.lastName) {
      setError('กรุณากรอกข้อมูลที่จำเป็นทั้งหมด');
      return;
    }

    try {
      const response = await adminApi.createUser(formData);
      if (response.success) {
        setUsers([...users, response.data!]);
        setIsAddModalOpen(false);
        setFormData({
          nationalId: '', password: '', title: '', firstName: '',
          lastName: '', address: '', role: 'VOTER'
        });
        setPage(1);
        await fetchUsers();
      } else {
        const errorMsg = typeof response.error === 'string' ? response.error : 'ไม่สามารถสร้างผู้ใช้ได้';
        setError(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await adminApi.deleteUser(selectedUser.id);
      if (response.success) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      } else {
        const errorMsg = typeof response.error === 'string' ? response.error : 'ไม่สามารถลบผู้ใช้ได้';
        setError(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };
  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'VOTER': 'ผู้ลงคะแนน',
      'EC': 'เจ้าหน้าที่การเลือกตั้ง',
      'ADMIN': 'ผู้ดูแลระบบ'
    };
    return labels[role] || role;
  };

  const getLastLoginText = (lastLogin?: string) => {
    if (!lastLogin) return 'ยังไม่เข้าสู่ระบบ';
    const date = new Date(lastLogin);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
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

        {/* Header and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">จัดการผู้ใช้งานและสิทธิ</h1>
            <p className="text-text-secondary">ควบคุมการเข้าถึงและรักษาความปลอดภัยของระบบ ({totalUsers} ผู้ใช้)</p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
              <div className="text-blue-500"><UserPlus size={24} /></div>
              <div>
                <p className="text-xl font-bold text-blue-900">{totalUsers}</p>
                <p className="text-[10px] text-blue-700">ผู้ใช้ทั้งหมด</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar & Filtering */}
        <div className="bg-white p-4 rounded-lg border border-surface-border shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex bg-surface-soft p-1 rounded-lg border border-surface-border w-full md:w-auto">
              {(['All', 'VOTER', 'EC', 'ADMIN'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'All' ? 'ทั้งหมด' : roleLabel(tab)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="flex-1 md:w-64">
                <Input 
                  icon={<Search size={18} />}
                  placeholder="ค้นหาชื่อหรือเลขประชาชน..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="!h-10 text-sm"
                />
              </div>
              <Button variant="authority" className="px-4 py-2 h-10 min-h-0 text-sm flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
                <UserPlus size={18} />
                เพิ่มบัญชี
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-surface-border shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">ไม่พบผู้ใช้</p>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-soft border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">ข้อมูลผู้ใช้</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-center">บทบาท</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">เข้าสู่ระบบล่าสุด</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-text-primary flex items-center gap-1">
                            {user.title} {user.firstName} {user.lastName}
                            {user.role === 'ADMIN' && <ShieldCheck size={14} className="text-authority" />}
                          </p>
                          <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                            <Mail size={12} />
                            {user.nationalId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={user.role === 'ADMIN' ? 'authority' : 'info'}>
                          {roleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {getLastLoginText(user.lastLogin)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedUser(user); setIsDetailModalOpen(true); }}
                            className="p-2 text-text-secondary hover:text-authority hover:bg-surface-soft rounded-lg transition-all" 
                            title="ดูรายละเอียด">
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                            className="p-2 text-text-secondary hover:text-status-error hover:bg-red-50 rounded-lg transition-all" 
                            title="ลบผู้ใช้">
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
                    หน้า {page} จาก {totalPages} | แสดง {users.length} จาก {totalUsers} รายการ
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

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="เพิ่มผู้ใช้ใหม่"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Input 
              placeholder="คำนำหน้า"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="text-sm"
            />
            <Input 
              placeholder="ชื่อ"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="text-sm"
            />
            <Input 
              placeholder="นามสกุล"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="text-sm"
            />
          </div>

          <Input 
            placeholder="เลขประชาชน"
            value={formData.nationalId}
            onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
            className="text-sm"
          />

          <Input 
            type="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="text-sm"
          />

          <Input 
            placeholder="ที่อยู่"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="text-sm"
          />

          <select 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as 'VOTER' | 'EC' | 'ADMIN'})}
            className="w-full px-3 py-2 border border-surface-border rounded-lg text-sm"
          >
            <option value="VOTER">ผู้ลงคะแนน</option>
            <option value="EC">เจ้าหน้าที่การเลือกตั้ง</option>
            <option value="ADMIN">ผู้ดูแลระบบ</option>
          </select>

          <ModalFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>ยกเลิก</Button>
            <Button variant="authority" onClick={handleAddUser}>สร้างบัญชี</Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Detail Modal */}
      {selectedUser && (
        <Modal 
          isOpen={isDetailModalOpen} 
          onClose={() => { setIsDetailModalOpen(false); setSelectedUser(null); }}
          title="รายละเอียดผู้ใช้"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-secondary uppercase">ชื่อ</p>
              <p className="font-bold text-text-primary">{selectedUser.title} {selectedUser.firstName} {selectedUser.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">เลขประชาชน</p>
              <p className="font-bold text-text-primary">{selectedUser.nationalId}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">บทบาท</p>
              <Badge variant={selectedUser.role === 'ADMIN' ? 'authority' : 'info'}>
                {roleLabel(selectedUser.role)}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">ที่อยู่</p>
              <p className="text-text-primary">{selectedUser.address || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase">วันที่สร้าง</p>
              <p className="text-text-primary">{new Date(selectedUser.createdAt).toLocaleDateString('th-TH')}</p>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => { setIsDetailModalOpen(false); setSelectedUser(null); }}>ปิด</Button>
            </ModalFooter>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {selectedUser && (
        <Modal 
          isOpen={isDeleteModalOpen} 
          onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
          title="ยืนยันการลบ"
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <AlertTriangle className="text-status-error flex-shrink-0" size={24} />
              <div>
                <p className="font-bold text-text-primary">ยืนยันการลบผู้ใช้</p>
                <p className="text-text-secondary text-sm">
                  คุณแน่ใจหรือว่าต้องการลบ {selectedUser.firstName} {selectedUser.lastName} ออกจากระบบ?
                </p>
              </div>
            </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}>ยกเลิก</Button>
            <Button variant="danger" onClick={handleDeleteUser}>ลบผู้ใช้</Button>
          </ModalFooter>
          </div>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default AdminUsersPage;
