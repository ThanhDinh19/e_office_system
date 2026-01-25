import { useState, useEffect } from 'react';
import { useNotification } from '../../../../context/NotificationContext';
import { useParams } from 'react-router-dom';
import { EditableRow } from '../../../../components/widgets/EditableRow';
import { getEmployeeById, updateAccount } from '../../../../services/employee.service';
import { getRoles } from '../../../../services/role.service';
import './AccountSetting.css';
import {getUsers} from "../../../../services/adminUser.service";

export default function AccountSetting() {
    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});
    const { showNotification } = useNotification();
    const [roles, setRoles] = useState([]);
    const [users, setUser] = useState([]);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                const emp = await getEmployeeById(id);
                setFormData({
                    email: emp.User?.email || '',
                    password: '',
                    confirm_password: '',
                    role: emp.User?.Roles?.[0]?.id || '',
                    is_inactive: emp.User?.is_inactive,
                    is_login_disabled: emp.User?.is_login_disabled,
                });
            }
        };

        const fetchUsers = async () => {
            const userData = await getUsers();
            setUser(userData);  
        }

        const fetchRoles = async () => {
            const roleData = await getRoles();
            setRoles(roleData);
        }

        fetchUsers();
        fetchRoles();
        fetchEmployee();
    }, [id]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); // xóa error khi user nhập
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['email', 'role'];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = 'Required';
            }
        });

        if(formData.password !== formData.confirm_password){
            newErrors.confirm_password = 'Passwords do not match';
        }

        users.forEach(u => {
            console.log(u.Employee?.id)

            if(u.Employee?.id == id){
                return;
            }
            if(u.email === formData.email){ 
                newErrors.email = 'Email already exists';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            console.log(formData);
            // TODO: gọi API PUT /employees/:id
            await updateAccount(id, formData);
            
            showNotification('Account updated successfully', 'success');
        } catch (err) {
            alert('Faild to update account');
        }
    };

    return (
        <div className="account-setting-card">
            <h3>Account Settings</h3>

            <EditableRow
                label="Email"
                value={formData.email}
                onChange={v => updateField('email', v)}
                error={errors.email}
                placeholder='Email'
            />

            <EditableRow
                label="Password"
                value={formData.password}
                onChange={v => updateField('password', v)}
                error={errors.password}
                placeholder='Password'
            />

            <EditableRow
                label="Confirm Password"
                value={formData.confirm_password}
                onChange={v => updateField('confirm_password', v)}
                error={errors.confirm_password}
                placeholder='Confirm Password'
            />

            <EditableRow
                label="Role"
                type="select"
                value={formData.role}
                options={roles}
                onChange={v => updateField('role', v)}
                error={errors.role} 
            />

            <EditableRow
                label="Disable login"
                type="checkbox"
                value={formData.is_login_disabled}
                onChange={v => updateField('is_login_disabled', v)}
            />

            <EditableRow
                label="Mark as inactive"
                type="checkbox"
                value={formData.is_inactive}
                onChange={v => updateField('is_inactive', v)}
            />
            <div className="save-bar">
                <button className="btn primary" onClick={handleSave}>
                    Save
                </button>
            </div>

        </div>
    );
}