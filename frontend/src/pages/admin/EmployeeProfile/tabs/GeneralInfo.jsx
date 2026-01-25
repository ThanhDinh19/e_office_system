import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEmployeeById, updateEmployee } from '../../../../services/employee.service';
import { EditableRow, EditablePhoneRow } from '../../../../components/widgets/EditableRow';
import { useNotification } from '../../../../context/NotificationContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 
import './GeneralInfo.css';


export default function GeneralInfo() {
    const { id } = useParams();
    const { showNotification } = useNotification();
    const [employee, setEmployee] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});


    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                const emp = await getEmployeeById(id);
                setEmployee(emp);
                setFormData({
                    id: id,
                    full_name: emp?.full_name || '',
                    cccd: emp?.cccd || '',
                    address: emp?.address || '',
                    email: emp?.email || '',
                    phone: emp?.phone || '',
                    dob: emp?.dob || '',
                    gender: emp?.gender || '',
                });
            }
        };
        fetchEmployee();
    }, [id]);


    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); // xóa error khi user nhập
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['full_name', 'phone', 'gender', 'cccd'];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = 'Required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            // TODO: gọi API PUT /employees/:id
            await updateEmployee(id, formData);
            showNotification('Employee updated successfully', 'success');
        } catch (err) {
            alert('Cập nhật thất bại');
        }
    };


    return (
        <div className="general-info-card">
            <h3>General Info</h3>

            <EditableRow
                label="Full name"
                value={formData.full_name}
                onChange={v => updateField('full_name', v)}
                error={errors.full_name}
                placeholder='Full name'
            />

            <EditableRow
                label="Mailing address"
                value={formData.address}
                onChange={v => updateField('address', v)}
                placeholder='Mailing address'
                error={errors.address}
            />

            <EditableRow
                label="Email"
                value={formData.email}
                onChange={v => updateField('email', v)}
                disabled
            />

            <EditablePhoneRow label="Phone">
                <PhoneInput
                    country="vn"
                    value={formData.phone}
                    onChange={(v) => updateField('phone', v)}
                    inputStyle={{
                        width: '100%',
                        height: '38px',
                        border: '1px solid transparent',
                        borderRadius: '4px',
                    }}
                />
            </EditablePhoneRow>



            <EditableRow
                label="Citizen identification number"
                value={formData.cccd}
                onChange={v => updateField('cccd', v)}
                placeholder='Citizen identification number'
                error={errors.cccd}
            />

            <EditableRow
                label="Date of birth"
                type="date"
                value={formData.dob}
                onChange={v => updateField('dob', v)}
                placeholder='Date of birth'
            />

            <EditableRow
                label="Gender"
                type="radio"
                value={formData.gender}
                onChange={v => updateField('gender', v)}
                options={['Male', 'Female', 'Other']}
                error={errors.gender}
            />

            <div className="save-bar">
                <button className="btn primary" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
}
