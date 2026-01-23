import React from 'react';
import './JobInfo.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEmployeeById, updateJobInfo } from '../../../../services/employee.service';
import { EditableRow } from '../../../../components/widgets/EditableRow';
import { getDepartments } from '../../../../services/department.service';
import { getPositions } from '../../../../services/position.service';
import { useNotification } from '../../../../context/NotificationContext';

export default function JobInfo() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const { showNotification } = useNotification();

    useEffect(() => {

        const fetchEmployeeJobInfo = async () => {
            if (id) {
                const emp = await getEmployeeById(id);
                setEmployee(emp);
                setFormData({
                    employee_code: emp?.employee_code || '',
                    department: emp?.Department?.id || '',
                    position: emp?.Position?.id || '',
                    job_title: emp?.job_title || '',
                    contract: emp?.contract_type || '',
                })
            }
        }

        const fetchDepartments = async () => {
            const depts = await getDepartments();
            setDepartments(depts);
        }

        const fetchPositions = async () => {
            const pos = await getPositions();
            setPositions(pos);
        }

        fetchDepartments();
        fetchPositions();
        fetchEmployeeJobInfo();
    }, [id]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); // xóa error khi user nhập
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['employee_code', 'department', 'position', 'job_title', 'contract'];

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
            await updateJobInfo(id, formData);
            showNotification('Job information updated successfully', 'success');
        } catch (err) {
            alert('Error saving job info');
        }
    }

    return (
        <div>
            <div className="job-info-card">
                <h3>Job Info</h3>
                <EditableRow
                    label="Employee Code"
                    value={formData.employee_code}
                    onChange={v => updateField('employee_code', v)}
                    disabled={true}
                    error={errors.employee_code}
                    placeholder='Employee code'
                />
                <EditableRow
                    label="Department"
                    type="select"
                    value={formData.department}
                    options={departments}
                    onChange={v => updateField('department', v)}
                    error={errors.department}
                    placeholder='Department'
                />

                <EditableRow
                    label="Position"
                    type="select"
                    value={formData.position}
                    options={positions}
                    onChange={v => updateField('position', v)}
                    error={errors.position}
                    placeholder='Position'
                />
                <EditableRow
                    label="Job Title"
                    value={formData.job_title}
                    onChange={v => updateField('job_title', v)}
                    error={errors.job_title}
                    placeholder='Job title'
                />
                <EditableRow
                    label="Contract Type"
                    value={formData.contract}
                    onChange={v => updateField('contract', v)}
                    error={errors.contract}
                    placeholder='Contract type'
                />

                <div className="save-bar">
                    <button className="btn primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}