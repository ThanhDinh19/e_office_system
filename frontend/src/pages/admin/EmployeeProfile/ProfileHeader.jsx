import React from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeById } from '../../../services/employee.service';
import { useState, useEffect, useRef } from 'react';
import { uploadAvatar } from '../../../services/employee.service';
import './ProfileHeader.css';

export default function ProfileHeader() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {

        fetchEmployee();
        return () => {
            if (previewAvatar) {
                URL.revokeObjectURL(previewAvatar);
            }
        };
    }, [id, previewAvatar]);

    const fetchEmployee = async () => {
        if (id) {
            const emp = await getEmployeeById(id);
            setEmployee(emp);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
        fetchEmployee();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1 Preview ngay
        const previewUrl = URL.createObjectURL(file);
        setPreviewAvatar(previewUrl);

        // 2️ Upload backend
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const res = await uploadAvatar(id, formData);

            // 3️ Sau khi upload xong → dùng URL thật từ server
            setEmployee(prev => ({
                ...prev,
                avatar: res.avatar,
            }));

            setPreviewAvatar(null); // clear preview
        } catch (err) {
            console.error(err);
            alert('Upload avatar failed');

            setPreviewAvatar(null); // revert nếu lỗi
        }
    };



return (
    <div className="profile-header">
        <div className="profile-left">

            <div className="profile-background">
                <div className="profile-avatar" onClick={handleAvatarClick}>
                    {previewAvatar ? (
                        <img src={previewAvatar} alt="avatar-preview" />
                    ) : employee?.avatar ? (
                        <img
                            src={`http://localhost:5000${employee.avatar}`}
                            alt="avatar"
                        />
                    ) : (
                        <span>{employee?.full_name?.charAt(0)}</span>
                    )}

                    <div className="avatar-overlay">Change</div>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                <div className="name"><h2>{employee?.full_name}</h2></div>

            </div>

            <div className="profile-info">
                <span className="role-badge">{employee?.User?.Roles?.[0]?.name || 'N/A'}</span>
                <div>{employee?.email}</div>
                <div>{employee?.phone}</div>
            </div>
        </div>

        <div className="profile-stats">
            <Stat label="Open Projects" value="25" />
            <Stat label="Projects Completed" value="6" />
            <Stat label="Total Hours Worked" value="218.42" />
            <Stat label="Total Project Hours" value="242.33" />
        </div>
    </div>
);
}

const Stat = ({ label, value }) => (
    <div className="stat-box">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);
