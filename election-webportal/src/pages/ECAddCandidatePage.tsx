import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { ArrowLeft, Upload, Save, UserPlus, Info } from 'lucide-react';
import { partiesApi, constituenciesApi } from '../api';
import { ecApi } from '../api/ec';
import type { Party, Constituency } from '../api';

const ECAddCandidatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [parties, setParties] = useState<Party[]>([]);
  const [districts, setDistricts] = useState<Constituency[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    first_name: '',
    last_name: '',
    number: '',
    party_id: '',
    constituency_id: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partiesRes, districtsRes] = await Promise.all([
          partiesApi.getAll(),
          constituenciesApi.getAll()
        ]);
        setParties(partiesRes);
        setDistricts(districtsRes);
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
        setError('ไม่สามารถโหลดข้อมูลพื้นฐานได้');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('กรุณาอัปโหลดรูปภาพผู้สมัคร');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = new FormData();
      data.append('title', formData.title);
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('number', formData.number);
      data.append('party_id', formData.party_id);
      data.append('constituency_id', formData.constituency_id);
      data.append('file', selectedFile);

      await ecApi.addCandidate(data);
      
      setSuccess(true);
      setTimeout(() => navigate('/ec/candidates'), 2000);
    } catch (err: any) {
      console.error('Error adding candidate:', err);
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-8 animate-in fade-in slide-in-from-top-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Card */}
          <div className="card p-8 bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-2">
                <Input 
                  id="title"
                  name="title"
                  label="คำนำหน้า"
                  placeholder="นาย/นาง/นส."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Input 
                  id="number"
                  name="number"
                  type="number"
                  label="หมายเลข"
                  placeholder="เช่น 1"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-4">
                <Input 
                  id="first_name"
                  name="first_name"
                  label="ชื่อ"
                  placeholder="เช่น สมชาย"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-4">
                <Input 
                  id="last_name"
                  name="last_name"
                  label="นามสกุล"
                  placeholder="เช่น ใจมั่นคง"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-6">
                <label className="text-sm font-medium text-text-secondary mb-2 block">พรรคการเมืองที่สังกัด</label>
                <select 
                  name="party_id"
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={formData.party_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">เลือกพรรคการเมือง</option>
                  {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="text-sm font-medium text-text-secondary mb-2 block">เขตพื้นที่เลือกตั้ง</label>
                <select 
                  name="constituency_id"
                  className="w-full h-12 px-4 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-authority/20 focus:border-authority text-sm"
                  value={formData.constituency_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">เลือกเขตพื้นที่</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.province} เขต {d.district_number}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">รูปถ่ายผู้สมัคร (Official Photo)</label>
              <div className="flex flex-col md:flex-row gap-6 items-center p-6 bg-surface-soft rounded-xl border-2 border-dashed border-surface-border group hover:border-authority transition-all cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-card border border-surface-border group-hover:scale-110 transition-transform flex-shrink-0 overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" />
                  ) : (
                    <UserPlus className="w-10 h-10 text-authority" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">คลิกหรือลากไฟล์รูปภาพมาวางที่นี่</p>
                  <p className="text-xs text-text-secondary mt-1">ไฟล์ PNG, JPG อัตราส่วน 1:1 ขนาดไม่เกิน 5MB</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-authority bg-white px-3 py-1.5 rounded-full border border-authority/20 shadow-sm">
                    <Upload className="w-3 h-3" />
                    {selectedFile ? selectedFile.name : "อัปโหลดรูปภาพ"}
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
