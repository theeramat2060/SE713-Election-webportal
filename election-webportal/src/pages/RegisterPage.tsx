import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, UserPlus } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    password: '',
    confirmPassword: '',
    address: '',
    constituency: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.nationalId.length !== 13) {
      setError('หมายเลขประจำตัวประชาชนต้องครบ 13 หลัก');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      login('mock-token', {
        id: '1',
        nationalId: formData.nationalId,
        fullName: formData.fullName,
        role: 'voter',
      });
      navigate('/');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface-soft py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link to="/login" className="inline-flex items-center gap-2 text-text-secondary hover:text-democracy mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้าเข้าสู่ระบบ</span>
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-democracy/10 rounded-xl flex items-center justify-center text-democracy">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ลงทะเบียนผู้มีสิทธิเลือกตั้ง</h1>
            <p className="text-text-secondary">กรอกข้อมูลให้ครบถ้วนเพื่อรักษาสิทธิของคุณ</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-8 bg-white">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                id="fullName"
                name="fullName"
                label="ชื่อ-นามสกุล (ไม่ต้องมีคำนำหน้า)"
                placeholder="สมชาย ใจดี"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <Input 
              id="nationalId"
              name="nationalId"
              label="หมายเลขประจำตัวประชาชน"
              placeholder="1 2345 67890 12 3"
              value={formData.nationalId}
              onChange={handleChange}
              maxLength={13}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">จังหวัด/เขตพื้นที่</label>
              <select 
                name="constituency"
                className="h-12 px-4 rounded border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-democracy/20 focus:border-democracy"
                value={formData.constituency}
                onChange={handleChange}
                required
              >
                <option value="">เลือกเขตพื้นที่</option>
                <option value="1">กรุงเทพมหานคร เขต 1</option>
                <option value="2">เชียงใหม่ เขต 1</option>
                <option value="3">ขอนแก่น เขต 1</option>
              </select>
            </div>

            <div className="md:col-span-2">
               <Input 
                id="address"
                name="address"
                label="ที่อยู่ตามทะเบียนบ้าน"
                placeholder="เลขที่บ้าน หมู่ที่..."
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <Input 
              id="password"
              name="password"
              type="password"
              label="ตั้งรหัสผ่าน"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input 
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="ยืนยันรหัสผ่าน"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && <div className="md:col-span-2"><Alert type="error" message={error} /></div>}

            <div className="md:col-span-2 mt-4">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isLoading}
              >
                ยืนยันลงทะเบียน
              </Button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-sm text-text-secondary">
          การกดลงทะเบียนถือว่าคุณยอมรับ <a href="#" className="underline">ข้อกำหนดและเงื่อนไข</a> ของระบบ
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
