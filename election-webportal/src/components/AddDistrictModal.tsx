import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal, ModalFooter } from './Modal';
import { MapPin, Globe, Users, Home } from 'lucide-react';

interface District {
  code: string;
  name: string;
  province: string;
  voters: number;
  stations: number;
}

interface AddDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (district: Omit<District, 'code' | 'voters' | 'stations'>) => void;
}

export const AddDistrictModal: React.FC<AddDistrictModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    province: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const regions = ['Central', 'North', 'Northeast', 'South'];
  
  // Thailand provinces by region
  const provincesByRegion = {
    'Central': [
      'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร', 'สมุทรสงคราม',
      'นครปฐม', 'อยุธยา', 'ลพบุรี', 'สิงห์บุรี', 'อ่างทอง', 'ชัยนาท', 'สระบุรี', 'นครนายก',
      'ปราจีนบุรี', 'ฉะเชิงเทรา', 'จันทบุรี', 'ตราด', 'ราชบุรี', 'เพชรบุรี', 'ประจวบคีรีขันธ์'
    ],
    'North': [
      'เชียงใหม่', 'เชียงราย', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน', 'อุตรดิตถ์', 'แพร่', 'น่าน',
      'พิษณุโลก', 'สุโขทัย', 'ตาก', 'กำแพงเพชร', 'พิจิตร', 'เพชรบูรณ์'
    ],
    'Northeast': [
      'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'อุบลราชธานี', 'ยโสธร', 'ชัยภูมิ',
      'อำนาจเจริญ', 'หนองบัวลำภู', 'ขอนแก่น', 'อุดรธานี', 'เลย', 'หนองคาย', 'มหาสารคาม',
      'ร้อยเอ็ด', 'กาฬสินธุ์', 'สกลนคร', 'นครพนม', 'มุกดาหาร', 'บึงกาฬ'
    ],
    'South': [
      'นครศรีธรรมราช', 'กระบี่', 'พังงา', 'ภูเก็ต', 'สุราษฎร์ธานี', 'ระนอง', 'ชุมพร',
      'สงขลา', 'สตูล', 'ตรัง', 'พัทลุง', 'ปัตตานี', 'ยะลา', 'นราธิวาส'
    ]
  };

  // Electoral districts by province
  const districtsByProvince: Record<string, string[]> = {
    'กรุงเทพมหานคร': [
      'เขต 1 (ดุสิต, พระนคร)', 'เขต 2 (ห้วยขวาง, วัฒนา)', 'เขต 3 (ราชเทวี, ปทุมวัน)',
      'เขต 4 (บางรัก, สีลม)', 'เขต 5 (คลองเตย, วัฒนา)', 'เขต 6 (สาทร, ยานนาวา)',
      'เขต 7 (บางกะปิ)', 'เขต 8 (สวนหลวง)', 'เขต 9 (ประเวศ)', 'เขต 10 (ลาดกระบัง)',
      'เขต 11 (บางขุนเทียน)', 'เขต 12 (ธนบุรี)', 'เขต 13 (บางกอกใหญ่)', 'เขต 14 (ตลิ่งชัน)',
      'เขต 15 (บางพลัด)', 'เขต 16 (บางซื่อ)', 'เขต 17 (ดอนเมือง)', 'เขต 18 (ลาดพร้าว)',
      'เขต 19 (จตุจักร)', 'เขต 20 (บางเขน)', 'เขต 21 (คันนายาว)', 'เขต 22 (บึงกุ่ม)',
      'เขต 23 (หนองจอก)', 'เขต 24 (มีนบุรี)', 'เขต 25 (คลองสามวา)', 'เขต 26 (บางนา)',
      'เขต 27 (พระโขนง)', 'เขต 28 (บางคอแหลม)', 'เขต 29 (ราษฎร์บูรณะ)', 'เขต 30 (บางแค)'
    ],
    'เชียงใหม่': [
      'เขต 1 (เมืองเชียงใหม่)', 'เขต 2 (แม่ริม, สันทราย)', 'เขต 3 (หางดง, สารภี)',
      'เขต 4 (ดอยสะเก็ด, สันกำแพง)', 'เขต 5 (เชียงดาว, แม่แตง)', 'เขต 6 (แม่วาง, หอมยาน)',
      'เขต 7 (สันป่าตอง, แม่ออน)', 'เขต 8 (เวียงแหง, ชัยปราการ)', 'เขต 9 (ฝาง, แม่อาย)'
    ],
    'นครราชสีมา': [
      'เขต 1 (เมืองนครราชสีมา)', 'เขต 2 (โชคชัย, ครบุรี)', 'เขต 3 (ปักธงชัย, สีคิ้ว)',
      'เขต 4 (เสิงสาง, ห้วยแถลง)', 'เขต 5 (วังน้ำเขียว, เทพารักษ์)', 'เขต 6 (บัวลาย, ประทาย)'
    ],
    'ขอนแก่น': [
      'เขต 1 (เมืองขอนแก่น)', 'เขต 2 (น้ำพอง, อุบลรัตน์)', 'เขต 3 (กระนวน, บ้านฝาง)',
      'เขต 4 (เวียงเก่า, เวียงเก้า)', 'เขต 5 (หนองนาคำ, พระยืน)', 'เขต 6 (บ้านไผ่, มัญจาคีรี)'
    ],
    'สงขลา': [
      'เขต 1 (เมืองสงขลา)', 'เขต 2 (หาดใหญ่)', 'เขต 3 (นาทวี, เทพา)', 'เขต 4 (สะบ้าย้อย, จะนะ)',
      'เขต 5 (รัตภูมิ, สะเดา)', 'เขต 6 (ควนโดน, กระแสสินธุ์)', 'เขต 7 (สิงหนคร, คลองหอยโข่ง)'
    ]
  };

  // Update available districts when province changes
  React.useEffect(() => {
    if (formData.province && districtsByProvince[formData.province]) {
      setAvailableDistricts(districtsByProvince[formData.province]);
      // Reset district name when province changes
      setFormData(prev => ({ ...prev, name: '' }));
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.province]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณาระบุชื่อเขต';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'กรุณาระบุจังหวัด';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ code: '', name: '', province: '', region: 'Central' });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({ name: '', province: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="เพิ่มเขตเลือกตั้งใหม่" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Home size={16} className="inline mr-2" />
            จังหวัด *
          </label>
          <select
            value={formData.province}
            onChange={(e) => handleInputChange('province', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-authority focus:border-transparent ${
              errors.province ? 'border-red-500' : 'border-surface-border'
            }`}
          >
            <option value="">เลือกจังหวัด</option>
            {Object.entries(provincesByRegion).map(([region, provinces]) => (
              <optgroup key={region} label={`ภาค${region}`}>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.province && (
            <p className="mt-1 text-sm text-red-600">{errors.province}</p>
          )}
        </div>

        {/* District Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <MapPin size={16} className="inline mr-2" />
            ชื่อเขตเลือกตั้ง *
          </label>
          {availableDistricts.length > 0 ? (
            <select
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-authority focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-surface-border'
              }`}
              disabled={!formData.province}
            >
              <option value="">เลือกเขตเลือกตั้ง</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={formData.province ? "เลือกจังหวัดก่อน" : "กรุณาเลือกจังหวัดก่อน"}
              className={errors.name ? 'border-red-500' : ''}
              disabled={!formData.province}
            />
          )}
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <Users size={16} className="inline mr-2" />
            ข้อมูลผู้มีสิทธิเลือกตั้งและหน่วยเลือกตั้งจะถูกเพิ่มโดยอัตโนมัติเป็น 0 และสามารถแก้ไขได้ภายหลัง
            รหัสเขตจะถูกสร้างอัตโนมัติ
          </p>
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="authority">
            เพิ่มเขตเลือกตั้ง
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};