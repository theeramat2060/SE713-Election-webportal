import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, constituenciesApi } from '../api';
import type { Constituency } from '../api';
import {
  ArrowLeft,
  CheckCircle,
  User,
  CreditCard,
  MapPin,
  Lock,
  ChevronDown,
  ShieldCheck,
  Vote,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const TITLES = ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'];

type FormState = {
  title: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  constituencyId: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<FormState>;

// ─── Styled Select ────────────────────────────────────────────────────────────

const StyledSelect: React.FC<{
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  label: string;
  error?: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ name, value, onChange, label, error, children, disabled }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium" style={{ color: '#6B6B6B', fontFamily: 'Manrope, sans-serif' }}>
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ fontFamily: 'Manrope, sans-serif' }}
        className={`
          w-full h-12 pl-4 pr-10 appearance-none rounded-lg border bg-white
          text-sm transition-all focus:outline-none focus:ring-2
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
            : 'border-gray-200 focus:ring-[#294056]/15 focus:border-[#294056]'
          }
        `}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({
  label,
  error,
  icon,
  children,
  id,
  ...inputProps
}) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label htmlFor={id} className="text-sm font-medium" style={{ color: '#6B6B6B', fontFamily: 'Manrope, sans-serif' }}>
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      {children ?? (
        <input
          id={id}
          style={{ fontFamily: 'Manrope, sans-serif' }}
          className={`
            w-full h-12 ${icon ? 'pl-10' : 'pl-4'} pr-4 rounded-lg border bg-white text-sm
            transition-all focus:outline-none focus:ring-2
            placeholder:text-gray-300
            ${error
              ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
              : 'border-gray-200 focus:ring-[#294056]/15 focus:border-[#294056]'
            }
          `}
          {...inputProps}
        />
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [loadingConstituencies, setLoadingConstituencies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: '',
    firstName: '',
    lastName: '',
    nationalId: '',
    constituencyId: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load constituencies from real backend
  useEffect(() => {
    constituenciesApi
      .getAll()
      .then(setConstituencies)
      .catch(() => {})
      .finally(() => setLoadingConstituencies(false));
  }, []);

  // Inject Manrope font
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title) e.title = 'กรุณาเลือกคำนำหน้า';
    if (!form.firstName.trim()) e.firstName = 'กรุณากรอกชื่อ';
    if (!form.lastName.trim()) e.lastName = 'กรุณากรอกนามสกุล';
    if (!/^\d{13}$/.test(form.nationalId)) e.nationalId = 'ต้องเป็นตัวเลข 13 หลักเท่านั้น';
    if (!form.constituencyId) e.constituencyId = 'กรุณาเลือกเขตเลือกตั้ง';
    if (!form.address.trim()) e.address = 'กรุณากรอกที่อยู่';
    if (form.password.length < 6) e.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await authApi.register({
        nationalId: form.nationalId,
        password: form.password,
        title: form.title,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        constituencyId: Number(form.constituencyId),
        role: 'VOTER',
      });

      if (!res.success || !res.token) {
        setServerError(res.error ?? 'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง');
        return;
      }

      setSuccess(true);
      
      const userRes = res.user;
      const fullName = userRes?.firstName 
        ? `${userRes.title || ''}${userRes.firstName} ${userRes.lastName || ''}`.trim()
        : `${form.title}${form.firstName} ${form.lastName}`;

      login(res.token, {
        id: userRes?.id ?? '',
        nationalId: form.nationalId,
        fullName: fullName,
        role: 'voter',
        districtId: form.constituencyId,
        title: userRes?.title || form.title,
        firstName: userRes?.firstName || form.firstName,
        lastName: userRes?.lastName || form.lastName,
      });

      setTimeout(() => navigate('/voter/vote'), 1800);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setServerError(axiosErr?.response?.data?.error ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'อ่อนแอ', 'พอใช้', 'ดี', 'แข็งแกร่ง'][passwordStrength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'][passwordStrength];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: 'Manrope, sans-serif', backgroundColor: '#FCFAFA', minHeight: '100vh' }}>
      <div className="flex min-h-screen">

        {/* ── Left panel ─────────────────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 relative overflow-hidden"
          style={{ backgroundColor: '#294056' }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
          <div className="absolute bottom-10 -right-16 w-56 h-56 rounded-full opacity-5" style={{ backgroundColor: '#fff' }} />
          <div className="absolute top-1/2 -right-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#10B981' }} />

          {/* Logo / brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold tracking-wide text-sm" style={{ letterSpacing: '0.06em' }}>
                ระบบเลือกตั้งออนไลน์
              </span>
            </div>

            <h2 className="text-white text-4xl font-bold leading-tight mb-4" style={{ letterSpacing: '-0.01em' }}>
              ลงทะเบียน<br />
              <span style={{ color: '#6ECFA0' }}>รักษาสิทธิ์</span><br />
              ของคุณ
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              ขั้นตอนง่ายๆ เพียงไม่กี่นาที เพื่อให้คุณมีส่วนร่วม
              ในการเลือกตั้งครั้งสำคัญ
            </p>

            {/* Steps */}
            {[
              { icon: <CreditCard className="w-4 h-4" />, text: 'กรอกข้อมูลส่วนตัว' },
              { icon: <MapPin className="w-4 h-4" />, text: 'เลือกเขตเลือกตั้ง' },
              { icon: <Lock className="w-4 h-4" />, text: 'ตั้งรหัสผ่าน' },
              { icon: <ShieldCheck className="w-4 h-4" />, text: 'ยืนยันการลงทะเบียน' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  {step.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัยสูงสุด
          </p>
        </div>

        {/* ── Right panel (form) ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-6 py-10">

            {/* Back link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm mb-8 w-fit transition-colors"
              style={{ color: '#6B6B6B', fontFamily: 'Manrope, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#294056')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#2C2C2C', letterSpacing: '-0.01em' }}>
                สร้างบัญชีผู้ใช้ใหม่
              </h1>
              <p className="text-sm" style={{ color: '#6B6B6B' }}>
                กรอกข้อมูลให้ครบถ้วนเพื่อรักษาสิทธิ์การเลือกตั้งของคุณ
              </p>
            </div>

            {/* Success state */}
            {success ? (
              <div
                className="flex flex-col items-center justify-center text-center py-16 rounded-2xl"
                style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#dcfce7' }}>
                  <CheckCircle className="w-8 h-8" style={{ color: '#10B981' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C2C2C' }}>ลงทะเบียนสำเร็จ!</h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>กำลังนำคุณเข้าสู่ระบบ...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Section: Personal Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4" style={{ color: '#294056' }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#294056' }}>
                      ข้อมูลส่วนตัว
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E0E0E0' }} />
                  </div>

                  {/* Title + First + Last */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <StyledSelect
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      label="คำนำหน้า"
                      error={errors.title}
                    >
                      <option value="">เลือก</option>
                      {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                    </StyledSelect>

                    <Field
                      id="firstName"
                      name="firstName"
                      label="ชื่อ"
                      placeholder="สมชาย"
                      value={form.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                    />

                    <Field
                      id="lastName"
                      name="lastName"
                      label="นามสกุล"
                      placeholder="ใจดี"
                      value={form.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                    />
                  </div>

                  {/* National ID */}
                  <Field
                    id="nationalId"
                    name="nationalId"
                    label="หมายเลขประจำตัวประชาชน"
                    placeholder="X XXXX XXXXX XX X (13 หลัก)"
                    value={form.nationalId}
                    onChange={handleChange}
                    maxLength={13}
                    inputMode="numeric"
                    icon={<CreditCard className="w-4 h-4" />}
                    error={errors.nationalId}
                  />
                  {form.nationalId && (
                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                      {form.nationalId.length}/13 หลัก
                    </p>
                  )}
                </div>

                {/* Section: Location */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4" style={{ color: '#294056' }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#294056' }}>
                      เขตที่อยู่
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E0E0E0' }} />
                  </div>

                  <div className="mb-4">
                    <StyledSelect
                      name="constituencyId"
                      value={form.constituencyId}
                      onChange={handleChange}
                      label="เขตเลือกตั้ง"
                      error={errors.constituencyId}
                      disabled={loadingConstituencies}
                    >
                      <option value="">
                        {loadingConstituencies ? 'กำลังโหลด...' : 'เลือกเขตเลือกตั้ง'}
                      </option>
                      {constituencies.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.province} เขต {c.district_number}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>

                  <Field
                    id="address"
                    name="address"
                    label="ที่อยู่ตามทะเบียนบ้าน"
                    placeholder="เลขที่บ้าน หมู่ที่ ซอย ถนน ตำบล อำเภอ จังหวัด"
                    value={form.address}
                    onChange={handleChange}
                    icon={<MapPin className="w-4 h-4" />}
                    error={errors.address}
                  />
                </div>

                {/* Section: Security */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4" style={{ color: '#294056' }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#294056' }}>
                      รหัสผ่าน
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E0E0E0' }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        label="ตั้งรหัสผ่าน"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        icon={<Lock className="w-4 h-4" />}
                        error={errors.password}
                      />
                      {form.password.length > 0 && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map(i => (
                              <div
                                key={i}
                                className="h-1 flex-1 rounded-full transition-colors duration-300"
                                style={{ backgroundColor: i <= passwordStrength ? strengthColor : '#E0E0E0' }}
                              />
                            ))}
                          </div>
                          <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                        </div>
                      )}
                    </div>

                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      label="ยืนยันรหัสผ่าน"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      icon={<Lock className="w-4 h-4" />}
                      error={errors.confirmPassword}
                    />
                  </div>
                </div>

                {/* Server error */}
                {serverError && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
                    style={{ backgroundColor: '#fff1f1', border: '1px solid #fecaca', color: '#b91c1c' }}
                  >
                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    height: '52px',
                    backgroundColor: isSubmitting ? '#4a6580' : '#294056',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.02em',
                    fontFamily: 'Manrope, sans-serif',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) (e.currentTarget.style.backgroundColor = '#1e3044'); }}
                  onMouseLeave={e => { if (!isSubmitting) (e.currentTarget.style.backgroundColor = '#294056'); }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      กำลังลงทะเบียน...
                    </>
                  ) : (
                    <>
                      ยืนยันลงทะเบียน
                      <span className="ml-1">→</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center mt-4" style={{ color: '#9CA3AF' }}>
                  การลงทะเบียนถือว่ายอมรับ{' '}
                  <a href="#" className="underline" style={{ color: '#294056' }}>ข้อกำหนดและเงื่อนไข</a>
                  {' '}ของระบบ
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

