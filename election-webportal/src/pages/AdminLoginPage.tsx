import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { ShieldCheck, ArrowLeft, Lock, UserCircle } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.adminLogin({ username, password });

      if (res.success && res.token && (res.user || res.admin)) {
        if (res.admin) {
          login(res.token, {
            id: res.admin.id.toString(),
            nationalId: '',
            fullName: `Admin: ${res.admin.username}`,
            role: 'admin',
          });
          navigate('/admin/districts');
        } else if (res.user) {
          login(res.token, {
            id: res.user.id,
            nationalId: res.user.nationalId,
            fullName: `${res.user.title}${res.user.firstName} ${res.user.lastName}`,
            role: 'ec',
            districtId: res.user.constituencyId?.toString(),
            title: res.user.title,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
          });
          navigate('/ec/parties');
        }
      } else {
        const errMsg = typeof res.error === 'object' ? res.error.message : (res.error ?? 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
        setError(errMsg);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.response?.data?.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl shadow-xl mb-4 border border-white/20">
            <ShieldCheck className="w-10 h-10 text-authority" />
          </div>
          <h1 className="text-2xl font-bold text-white">ระบบจัดการเจ้าหน้าที่</h1>
          <p className="text-slate-400 mt-1">EC & Administrator Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="mb-6 p-4 bg-authority/5 border border-authority/10 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-authority mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              พื้นที่นี้ใช้สำหรับการบริหารจัดการระดับเจ้าหน้าที่ กรุณาระบุรหัสผ่านที่ได้รับมอบหมายเพื่อเข้าใช้งาน
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input 
              id="username"
              label="ชื่อผู้ใช้งาน (Username)"
              placeholder="Ex: admin123"
              icon={<UserCircle className="w-5 h-5" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
            <Input 
              id="password"
              type="password"
              label="รหัสผ่าน (Password)"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <Alert type="error" message={error} />}

            <Button 
              type="submit" 
              variant="authority"
              className="mt-2 w-full h-12 text-lg shadow-lg shadow-authority/20" 
              isLoading={isLoading}
            >
              เข้าสู่ระบบบริหารจัดการ
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <Link 
               to="/login" 
               className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-democracy transition-colors"
             >
               <ArrowLeft className="w-4 h-4" />
               กลับสู่หน้าเข้าสู่ระบบสำหรับประชาชน
             </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs">
          © 2026 Election Commission of Thailand. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
