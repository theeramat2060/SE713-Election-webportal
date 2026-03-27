import React, { useState } from 'react';
import { BaseLayout } from '../components/BaseLayout';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, BarChart3, Clock } from 'lucide-react';
import { Alert } from '../components/Alert';
import { useVoting } from '../context/VotingContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isVotingClosed } = useVoting();
  const [showAlert, setShowAlert] = useState(false);

  const handleResultsClick = () => {
    if (!isVotingClosed) {
      setShowAlert(true);
    } else {
      navigate('/results');
    }
  };

  return (
    <BaseLayout role="public">
      <div className="flex flex-col gap-16 py-8">
        {/* Alert for closed voting */}
        {showAlert && (
          <Alert
            type="warning"
            title="ยังไม่สามารถดูผลได้"
            message="ผลการเลือกตั้งจะสามารถดูได้เมื่อ กกต. ประกาศปิดการลงคะแนนเสียงแล้วเท่านั้น"
            onClose={() => setShowAlert(false)}
          />
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-democracy-light to-white p-8 md:p-16 border border-democracy/10">
          <div className="relative z-10 max-w-2xl">
            <Badge variant="success" className="mb-4">เปิดลงทะเบียนแล้ว</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              ระบบเลือกตั้งออนไลน์ <span className="text-democracy">โปร่งใส ตรวจสอบได้</span> เพื่อประชาธิปไตย
            </h1>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              ขอเชิญผู้มีสิทธิ์เลือกตั้งเข้าร่วมการเลือกตั้งประจำปี 2569 มาร่วมสร้างความเปลี่ยนแปลงผ่านการลงคะแนนเสียงที่ปลอดภัยและน่าเชื่อถือ
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="px-8">เข้าสู่ระบบเพื่อลงคะแนน</Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8"
                onClick={handleResultsClick}
              >
                ดูผลการเลือกตั้ง
              </Button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden lg:block translate-y-1/4 translate-x-1/4">
            <span className="text-[300px]">🗳️</span>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-democracy" />}
            title="ปลอดภัยและเป็นส่วนตัว"
            description="ข้อมูลการลงคะแนนของคุณจะถูกเก็บเป็นความลับด้วยระบบการเข้ารหัสที่ทันสมัย"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6 text-authority" />}
            title="ตรวจสอบได้จริง"
            description="ทุกคะแนนเสียงสามารถตรวจสอบความถูกต้องได้ผ่านระบบ Blockchain (จำลอง)"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-navigation" />}
            title="ผลลัพธ์แบบ Real-time"
            description="ติดตามความเคลื่อนไหวและคะแนนปัจจุบันได้อย่างสะดวกรวดเร็ว"
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6 text-status-warning" />}
            title="สะดวกทุกที่ ทุกเวลา"
            description="ลงคะแนนได้จากทุกอุปกรณ์ ไม่ว่าจะเป็นมือถือ แท็บเล็ต หรือคอมพิวเตอร์"
          />
        </section>

        {/* Registration Steps */}
        <section className="bg-surface p-8 md:p-12 rounded-2xl border border-surface-border">
          <h2 className="text-2xl font-bold mb-10 text-center">ขั้นตอนการมีส่วนร่วม</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <Step
              number="01"
              title="ตรวจสอบสิทธิ"
              description="เข้าสู่ระบบด้วยรหัสประจำตัวประชาชน 13 หลักเพื่อตรวจสอบสิทธิในเขตพื้นที่ของคุณ"
            />
            <Step
              number="02"
              title="ศึกษาข้อมูลผู้สมัคร"
              description="ดูนโยบายและประวัติของผู้สมัครในเขตของคุณเพื่อประกอบการตัดสินใจ"
            />
            <Step
              number="03"
              title="ลงคะแนนเสียง"
              description="กดปุ่มลงมติเลือกผู้สมัครที่คุณไว้วางใจ และยืนยันการทำรายการ"
            />
          </div>
        </section>
      </div>
    </BaseLayout>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="card p-6 hover:shadow-elevation transition-all group">
    <div className="w-12 h-12 rounded-lg bg-surface-soft flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
  </div>
);

const Step: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
  <div className="relative z-10">
    <div className="text-4xl font-bold text-democracy/10 mb-2">{number}</div>
    <h3 className="text-lg font-bold mb-3">{title}</h3>
    <p className="text-sm text-text-secondary">{description}</p>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode, variant?: string, className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-democracy text-white ${className}`}>
    {children}
  </span>
);

export default LandingPage;
