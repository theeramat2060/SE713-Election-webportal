import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.login({ nationalId, password });

      if (res.success && res.token && res.user) {
        const fullName = res.user.firstName 
          ? `${res.user.title || ''}${res.user.firstName} ${res.user.lastName || ''}`.trim()
          : 'ผู้ใช้งานระบบ';

        login(res.token, {
          id: res.user.id,
          nationalId: res.user.nationalId,
          fullName: fullName,
          role: res.user.role === 'VOTER' ? 'voter' : 
                res.user.role === 'EC' ? 'ec' : 
                'voter', // Default to voter if role is missing
          districtId: res.user.constituencyId?.toString(),
          title: res.user.title,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
        });
        
        // Determine redirect based on role
        const userRole = res.user.role === 'VOTER' ? 'voter' : 
                        res.user.role === 'EC' ? 'ec' : 
                        'voter'; // Default to voter if role is missing
        
        navigate(userRole === 'voter' ? '/voter/vote' : '/ec/parties');
      } else {
        setError(res.error ?? 'รหัสประจำตัวหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      }
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-democracy-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-elevation mb-4">
            <span className="text-4xl text-democracy">🗳️</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">ยินดีต้อนรับเข้าส่วนระบบ</h1>
          <p className="text-text-secondary mt-1">SE713 Online Election System</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input 
              id="nationalId"
              label="หมายเลขประจำตัวประชาชน (13 หลัก)"
              placeholder="1 2345 67890 12 3"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              maxLength={13}
              required
            />
            
            <Input 
              id="password"
              type="password"
              label="รหัสผ่าน"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <Alert type="error" message={error} />}

            <Button 
              type="submit" 
              className="mt-2" 
              isLoading={isLoading}
            >
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-border text-center flex flex-col gap-3">
             <p className="text-sm text-text-secondary">
              ยังไม่มีสิทธิเลือกตั้ง?{' '}
              <Link to="/register" className="text-democracy font-semibold hover:underline">
                ลงทะเบียนตอนนี้
              </Link>
            </p>
            <Link to="/admin-login" className="text-sm text-authority font-medium hover:underline flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              สำหรับเจ้าหน้าที่ (Admin/EC)
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <Link 
          to="/" 
          className="mt-8 flex items-center justify-center gap-2 text-text-secondary hover:text-democracy transition-colors group"
        >
          <span className="text-sm font-medium">กลับสู่หน้าหลัก</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
