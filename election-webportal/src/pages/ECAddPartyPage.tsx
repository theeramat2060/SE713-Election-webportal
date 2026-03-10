import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { ArrowLeft, Upload, Save, X, Info } from 'lucide-react';

const ECAddPartyPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nameTh: '',
    nameEn: '',
    leader: '',
    policy: '',
    foundedDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call to save party
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/ec/parties'), 2000);
    }, 1500);
  };

  return (
    <BaseLayout role="ec">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Link 
          to="/ec/parties" 
          className="inline-flex items-center gap-2 text-text-secondary hover:text-authority mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>กลับไปยังรายการพรรคการเมือง</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">เพิ่มพรรคการเมืองใหม่</h1>
            <p className="text-text-secondary mt-1">กรอกข้อมูลพื้นฐานและนโยบายเพื่อลงทะเบียนพรรคการเมืองในระบบ</p>
          </div>
        </div>

        {success && (
          <Alert 
            type="success" 
            message="บันทึกข้อมูลพรรคการเมืองสำเร็จ! ระบบกำลังนำคุณกลับไปยังหน้ารายการ..." 
            className="mb-8 animate-in fade-in slide-in-from-top-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Card */}
          <div className="card p-8 bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                id="nameTh"
                name="nameTh"
                label="ชื่อพรรคการเมือง (ภาษาไทย)"
                placeholder="เช่น พรรคประชาธิปไตยใหม่"
                value={formData.nameTh}
                onChange={handleChange}
                required
              />
              <Input 
                id="nameEn"
                name="nameEn"
                label="Party Name (English)"
                placeholder="e.g. New Democracy Party"
                value={formData.nameEn}
                onChange={handleChange}
                required
              />
              <Input 
                id="leader"
                name="leader"
                label="ชื่อหัวหน้าพรรค"
                placeholder="ชื่อ-นามสกุล"
                value={formData.leader}
                onChange={handleChange}
                required
              />
              <Input 
                id="foundedDate"
                name="foundedDate"
                type="date"
                label="วันที่ก่อตั้งพรรค"
                value={formData.foundedDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">สรุปนโยบายพรรค (Policy Summary)</label>
              <textarea 
                name="policy"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority transition-all resize-none"
                placeholder="ระบุใจความสำคัญของนโยบายพรรค..."
                value={formData.policy}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mock Logo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">โลโก้พรรคการเมือง</label>
              <div className="border-2 border-dashed border-surface-border rounded-xl p-8 flex flex-col items-center justify-center bg-surface-soft hover:bg-white hover:border-authority transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-card group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-authority" />
                </div>
                <p className="text-sm font-medium text-text-primary">คลิกเพื่ออัปโหลดไฟล์</p>
                <p className="text-xs text-text-secondary mt-1">PNG, JPG ขนาดไม่เกิน 2MB (แนะนำขนาด 400x400px)</p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between p-6 bg-surface-soft rounded-xl border border-surface-border">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Info className="w-4 h-4 text-authority" />
              <span>ข้อมูลทั้งหมดจะถูกตรวจสอบโดย กกต. ก่อนเผยแพร่</span>
            </div>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="px-6"
                onClick={() => navigate('/ec/parties')}
              >
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                variant="authority" 
                className="px-8 flex items-center gap-2"
                isLoading={isLoading}
              >
                <Save className="w-4 h-4" />
                บันทึกข้อมูลพรรค
              </Button>
            </div>
          </div>
        </form>
      </div>
    </BaseLayout>
  );
};

export default ECAddPartyPage;
