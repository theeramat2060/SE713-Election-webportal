import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { ArrowLeft, Upload, Save, X, Info } from 'lucide-react';
import { partiesApi } from '../api/parties';

const ECAddPartyPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    policy: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, JPEG)');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 2MB');
        return;
      }

      setLogoFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    // Reset file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('policy', formData.policy);
      
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      // Call backend API to create party with file upload
      await partiesApi.createWithFile(formDataToSend);
      
      setSuccess(true);
      console.log('✅ Party created successfully with logo');
      
      // Redirect to parties page after 2 seconds
      setTimeout(() => navigate('/ec/parties'), 2000);
      
    } catch (err: any) {
      console.error('❌ Error creating party:', err);
      const errorMessage = err.response?.data?.error?.message 
        || err.response?.data?.error 
        || 'เกิดข้อผิดพลาดในการสร้างพรรค กรุณาลองใหม่';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            <div className="grid grid-cols-1 gap-6">
              <Input 
                id="name"
                name="name"
                label="ชื่อพรรคการเมือง"
                placeholder="เช่น พรรคประชาธิปไตยใหม่"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-4">
              <label htmlFor="policy" className="block text-sm font-medium text-text-primary">
                นโยบายหลักของพรรค
              </label>
              <textarea
                id="policy"
                name="policy"
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-authority/20 focus:border-authority transition-colors resize-none"
                placeholder="อธิบายนโยบายหลักและทิศทางการพัฒนาประเทศของพรรค..."
                value={formData.policy}
                onChange={handleChange}
                required
              />
            </div>

            {/* File Upload for Logo */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-primary">
                โลโก้พรรคการเมือง (ไม่บังคับ)
              </label>
              
              {!logoPreview ? (
                <div className="border-2 border-dashed border-surface-border rounded-xl p-8 flex flex-col items-center justify-center bg-surface-soft hover:bg-white hover:border-authority transition-all">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-card hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-authority" />
                    </div>
                    <p className="text-sm font-medium text-text-primary">คลิกเพื่ออัปโหลดไฟล์</p>
                    <p className="text-xs text-text-secondary mt-1">PNG, JPG, JPEG ขนาดไม่เกิน 2MB (แนะนำขนาด 400x400px)</p>
                  </label>
                </div>
              ) : (
                <div className="border border-surface-border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border border-surface-border rounded-lg overflow-hidden bg-surface-soft">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{logoFile?.name}</p>
                      <p className="text-sm text-text-secondary">
                        {logoFile ? (logoFile.size / 1024).toFixed(1) : '0'} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      ลบ
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Logo URL Display removed since we now use file upload */}
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
                disabled={!formData.name.trim() || !formData.policy.trim()}
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
