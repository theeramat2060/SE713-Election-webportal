import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { ArrowLeft, Upload, Save, UserPlus, Info } from 'lucide-react';

const ECAddCandidatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    number: '',
    fullName: '',
    partyId: '',
    districtId: '',
    platform: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call to save candidate
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/ec/candidates'), 2000);
    }, 1500);
  };

  return (
    <BaseLayout role="ec">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Link 
          to="/ec/candidates" 
          className="inline-flex items-center gap-2 text-text-secondary hover:text-authority mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>กลับไปยังรายชื่อผู้สมัคร</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">ลงทะเบียนผู้สมัครใหม่</h1>
            <p className="text-text-secondary mt-1">กรอกข้อมูลประวัติและสังกัดพรรคการเมืองเพื่อส่งข้อมูลผู้สมัครเข้าสู่ระบบ</p>
          </div>
        </div>

        {success && (
          <Alert 
            type="success" 
            message="ลงทะเบียนผู้สมัครสำเร็จ! ข้อมูลกำลังถูกบันทึกเข้าระบบ..." 
            className="mb-8 animate-in fade-in slide-in-from-top-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Card */}
          <div className="card p-8 bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3">
                <Input 
                  id="number"
                  name="number"
                  type="number"
                  label="หมายเลขผู้สมัคร"
                  placeholder="เช่น 1"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-9">
                <Input 
                  id="fullName"
                  name="fullName"
                  label="ชื่อ-นามสกุล (ไม่ต้องมีคำนำหน้า)"
                  placeholder="เช่น สมชาย ใจมั่นคง"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-6">
                <label className="text-sm font-medium text-text-secondary mb-2 block">พรรคการเมืองที่สังกัด</label>
                <select 
                  name="partyId"
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={formData.partyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">เลือกพรรคการเมือง</option>
                  <option value="1">พรรคก้าวไกลหน้า</option>
                  <option value="2">พรรครวมพลังรักษ์โลก</option>
                  <option value="3">พรรคพัฒนาชาติไทย</option>
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="text-sm font-medium text-text-secondary mb-2 block">เขตพื้นที่เลือกตั้ง</label>
                <select 
                  name="districtId"
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={formData.districtId}
                  onChange={handleChange}
                  required
                >
                  <option value="">เลือกเขตพื้นที่</option>
                  <option value="1">กรุงเทพมหานคร เขต 1</option>
                  <option value="2">กรุงเทพมหานคร เขต 2</option>
                  <option value="3">เชียงใหม่ เขต 1</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">แนวคิดและนโยบายหาเสียง (Statement/Platform)</label>
              <textarea 
                name="platform"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority transition-all resize-none"
                placeholder="ระบุแนวคิดสำคัญที่คุณต้องการสื่อสารกับผู้ลงคะแนน..."
                value={formData.platform}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mock Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">รูปถ่ายผู้สมัคร (Official Photo)</label>
              <div className="flex flex-col md:flex-row gap-6 items-center p-6 bg-surface-soft rounded-xl border-2 border-dashed border-surface-border group hover:border-authority transition-all cursor-pointer">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-card border border-surface-border group-hover:scale-110 transition-transform flex-shrink-0">
                  <UserPlus className="w-10 h-10 text-authority" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">คลิกหรือลากไฟล์รูปภาพมาวางที่นี่</p>
                  <p className="text-xs text-text-secondary mt-1">ไฟล์ PNG, JPG อัตราส่วน 1:1 ขนาดไม่เกิน 5MB</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-authority bg-white px-3 py-1.5 rounded-full border border-authority/20 shadow-sm">
                    <Upload className="w-3 h-3" />
                    อัปโหลดรูปภาพ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between p-6 bg-surface-soft rounded-xl border border-surface-border shadow-sm">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Info className="w-4 h-4 text-authority" />
              <span>ผู้สมัครต้องมีคุณสมบัติครบถ้วนตามเกณฑ์ของ กกต.</span>
            </div>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="px-6"
                onClick={() => navigate('/ec/candidates')}
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
                บันทึกข้อมูลผู้สมัคร
              </Button>
            </div>
          </div>
        </form>
      </div>
    </BaseLayout>
  );
};

export default ECAddCandidatePage;
