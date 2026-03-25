import React, { useState, useEffect } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal, ModalFooter } from '../components/Modal';
import { Alert } from '../components/Alert';
import { 
  Search,
  Clock,
  Loader,
  Eye,
  Filter,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { adminApi, AuditLog } from '../api/admin';

const AdminAuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failure'>('all');
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Date range for filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch audit logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAuditLogs(
        page, 
        pageSize, 
        actionFilter || undefined,
        startDate || undefined,
        endDate || undefined
      );
      
      if (response.success && response.data) {
        setLogs(response.data.items);
        setTotalLogs(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        const errorMsg = typeof response.error === 'string' ? response.error : 'ไม่สามารถโหลดข้อมูลบันทึกการเข้าถึงได้';
        setError(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, actionFilter, statusFilter, startDate, endDate]);

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (searchTerm && !log.userId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH') + ' ' + date.toLocaleTimeString('th-TH');
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('login')) return 'info';
    if (action.includes('create') || action.includes('add')) return 'success';
    if (action.includes('delete') || action.includes('remove')) return 'error';
    if (action.includes('close') || action.includes('close-voting')) return 'warning';
    return 'info';
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">บันทึกการเข้าถึงระบบ (Audit Logs)</h1>
          <p className="text-text-secondary">ติดตามและตรวจสอบกิจกรรมของผู้ใช้ในระบบ ({totalLogs} รายการ)</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg border border-surface-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input 
              placeholder="ค้นหา User ID..." 
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="!h-10 text-sm"
            />
            
            <select 
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-surface-border rounded-lg text-sm"
            >
              <option value="">ทั้งหมด (กิจกรรม)</option>
              <option value="login">เข้าสู่ระบบ</option>
              <option value="create">สร้าง</option>
              <option value="update">แก้ไข</option>
              <option value="delete">ลบ</option>
              <option value="vote">ลงคะแนน</option>
              <option value="close-voting">ปิดการลงคะแนน</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
              className="px-3 py-2 border border-surface-border rounded-lg text-sm"
            >
              <option value="all">ทั้งหมด (สถานะ)</option>
              <option value="success">สำเร็จ</option>
              <option value="failure">ล้มเหลว</option>
            </select>

            <Button variant="outline" className="flex items-center justify-center gap-2">
              <Filter size={18} />
              ตัวกรองขั้นสูง
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">วันที่เริ่มต้น</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-surface-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">วันที่สิ้นสุด</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-surface-border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg border border-surface-border shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-text-secondary mb-2" size={32} />
              <p className="text-text-secondary">ไม่พบบันทึก</p>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-surface-soft border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">วันที่เวลา</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">User ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">กิจกรรม</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">IP Address</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-center">สถานะ</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-text-primary">{log.userId}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary font-mono">{log.ipAddress}</td>
                      <td className="px-6 py-4 text-center">
                        {log.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-status-success text-xs">
                            <CheckCircle size={14} />
                            สำเร็จ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-status-error text-xs">
                            <AlertCircle size={14} />
                            ล้มเหลว
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedLog(log); setIsDetailModalOpen(true); }}
                          className="p-2 text-text-secondary hover:text-authority hover:bg-surface-soft rounded-lg transition-all" 
                          title="ดูรายละเอียด">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    หน้า {page} จาก {totalPages} | แสดง {filteredLogs.length} จาก {totalLogs} รายการ
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
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
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

      {/* Detail Modal */}
      {selectedLog && (
        <Modal 
          isOpen={isDetailModalOpen} 
          onClose={() => { setIsDetailModalOpen(false); setSelectedLog(null); }}
          title="รายละเอียดบันทึก"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary uppercase">ID</p>
                <p className="font-mono text-sm text-text-primary">{selectedLog.id}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase">วันที่เวลา</p>
                <p className="text-sm text-text-primary">{formatDate(selectedLog.timestamp)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary uppercase">User ID</p>
                <p className="font-mono text-sm text-text-primary">{selectedLog.userId}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase">กิจกรรม</p>
                <Badge variant={getActionBadgeColor(selectedLog.action)}>
                  {selectedLog.action}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary uppercase">IP Address</p>
                <p className="font-mono text-xs text-text-primary">{selectedLog.ipAddress}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase">สถานะ</p>
                {selectedLog.status === 'success' ? (
                  <span className="inline-flex items-center gap-1 text-status-success text-xs">
                    <CheckCircle size={14} />
                    สำเร็จ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-status-error text-xs">
                    <AlertCircle size={14} />
                    ล้มเหลว
                  </span>
                )}
              </div>
            </div>

            {selectedLog.details && (
              <div>
                <p className="text-xs text-text-secondary uppercase">รายละเอียดเพิ่มเติม</p>
                <p className="text-sm text-text-primary bg-surface-soft p-3 rounded border border-surface-border">
                  {selectedLog.details}
                </p>
              </div>
            )}

            {selectedLog.constituencyId && (
              <div>
                <p className="text-xs text-text-secondary uppercase">Constituency ID</p>
                <p className="font-mono text-sm text-text-primary">{selectedLog.constituencyId}</p>
              </div>
            )}

            <ModalFooter>
              <Button variant="outline" onClick={() => { setIsDetailModalOpen(false); setSelectedLog(null); }}>ปิด</Button>
            </ModalFooter>
          </div>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default AdminAuditLogsPage;
